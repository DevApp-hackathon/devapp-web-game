import Phaser from 'phaser'
import { getTotalMistakes, registerMistake } from '../sandbox-data.js'

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene')
  }

  preload() {
    this.load.image('bg-room', './src/assets/room-game.png')
    this.load.image('glossary-icon', './src/assets/glossarii.png')
    this.load.image('pups', './src/assets/pups.png')
    this.load.image('pups-smile', './src/assets/pups_smile.png')
    this.load.image('pups-no-smile', './src/assets/pups_no_smile.png')
  }

  create() {
    this.gameState = {
      progress: 0,
      anger: 0,
      stress: 0,
      step: 0,
      completedQuests: new Set(),
      usedChoices: {},
      usedFun: new Set(),
      mistakeStats: {},
      sandboxReviewedThemes: new Set(),
    }
    window._usedChoices = this.gameState.usedChoices
    this.burnoutPending = false
    this.burnoutActive  = false
    this.hudHintPending = false
    this.hintsShown     = { controls: false, hud: false }
    this.autoFinalQuestPending = false
    this.questOpen      = false
    this.finalQuestId   = 6
    this.requiredQuestIds = [0, 1, 2, 3, 4, 5]

    this.events.on('resume', () => {
      this.questOpen = false
      if (this.burnoutPending) {
        this.time.delayedCall(80, () => {
          if (!this.scene.isPaused('GameScene')) {
            this.burnoutPending = false
            this.hudHintPending = false
            this.triggerBurnout()
          }
        })
        return
      }
      if (this.shouldAutoLaunchFinalQuest()) {
        this.autoFinalQuestPending = true
        this.time.delayedCall(180, () => {
          this.autoFinalQuestPending = false
          if (!this.scene.isPaused('GameScene') && this.shouldAutoLaunchFinalQuest()) {
            this.launchQuestById(this.finalQuestId)
          }
        })
        return
      }
      if (this.hudHintPending) {
        this.time.delayedCall(400, () => {
          if (!this.scene.isPaused('GameScene')) {
            this.hudHintPending = false
            this.showContextHint('hud')
          }
        })
      }
    })

    this.cameras.main.roundPixels = true

    // ── Фон: подготовленный кадр в игровом размере ────────────────────
    this.add.image(640, 360, 'bg-room').setDepth(0)

    // ── Зоны взаимодействия ───────────────────────────────────────────
    // Каждый объект: { x, y, w, h, label, type, id/effect }
    // x/y — центр зоны, w/h — размер зоны
    // Позиции пока заглушки — ты укажешь точные координаты
    this.objects = [
      // --- квесты (trigger) ---
      { x: 65,   y: 310, w: 120, h: 200, label: 'Сервер',        type: 'trigger', id: 1, marker: { text: 'СЕРВЕР',         x: 78,   y: 180 } },
      { x: 322,  y: 150, w: 320, h: 130, label: 'Доска задач',   type: 'board',   id: 2, marker: { hidden: true } },
      { x: 674,  y: 100, w: 280, h: 90,  label: 'Мониторинг',    type: 'trigger', id: 4, marker: { text: 'МОНИТОРИНГ',     x: 674,  y: 100 } },
      { x: 1006, y: 100, w: 320, h: 90,  label: 'Git репо',      type: 'trigger', id: 5, marker: { text: 'GIT РЕПО',       x: 1046, y: 100 } },
      { x: 310,  y: 290, w: 280, h: 140, label: 'Ноутбук',       type: 'trigger', id: 0, marker: { text: 'НОУТБУК',        x: 330,  y: 315 } },
      { x: 916,  y: 290, w: 200, h: 180, label: 'Анализ логов',  type: 'trigger', id: 3, marker: { text: 'АНАЛИЗ\nЛОГОВ',  x: 916,  y: 340 } },
      { x: 140,  y: 480, w: 220, h: 220, label: 'Whiteboard',    type: 'trigger', id: 2, marker: { text: 'МАРКЕРНАЯ\nДОСКА',x: 160,  y: 610 } },
      // --- отдых (fun) ---
      { x: 661,  y: 260, w: 230, h: 160, label: 'Кофе ☕',      type: 'fun', effect: () => this.applyFun(-15, 'Выпил кофе. -15 стресс!'), marker: { text: 'КОФЕ',          x: 691,  y: 315 } },
      { x: 574,  y: 530, w: 320, h: 200, label: 'Диван 💤',     type: 'fun', effect: () => this.applyFun(-20, 'Отдохнул. -20 стресс!'), marker: { text: 'ДИВАН',         x: 594,  y: 450 } },
      { x: 1062, y: 420, w: 360, h: 180, label: 'Пинг-понг 🏓', type: 'fun', effect: () => this.applyFun(-25, 'Сыграл в пинг-понг. -25 стресс!'), marker: { text: 'ПИНГ-ПОНГ', x: 1062, y: 510, fontSize: '14px', lineSpacing: 8, padding: { x: 8, y: 6 } } },
      { x: 1196, y: 530, w: 150, h: 160, label: 'Цветок 🌿',   type: 'fun', effect: () => this.applyFun(-10, 'Полил цветок. -10 стресс!'), marker: { text: 'ЦВЕТОК',        x: 1216, y: 670, fontSize: '14px' } },
    ]

    // Создаём невидимые интерактивные зоны
    this.objectSprites = []
    this.objects.forEach(obj => {
      const hitZone = this.add.rectangle(obj.x, obj.y, obj.w, obj.h, 0xffffff, 0)
        .setInteractive({ useHandCursor: true })
        .setDepth(5)

      const marker = obj.marker ?? {}
      const text = this.add.text(marker.x ?? obj.x, marker.y ?? (obj.y + obj.h / 2 + 6), marker.text ?? obj.label, {
        fontSize: marker.fontSize ?? '14px',
        color: marker.color ?? '#ffff66',
        fontFamily: '"Press Start 2P"',
        backgroundColor: marker.backgroundColor ?? '#000000cc',
        padding: marker.padding ?? { x: 6, y: 4 },
        align: 'center',
        lineSpacing: marker.lineSpacing ?? 4
      }).setOrigin(0.5).setDepth(18).setVisible(!marker.hidden)

      hitZone.on('pointerdown', () => this.interactWithObject(obj))

      this.objectSprites.push({ hitZone, text, data: obj })
    })

    // Мигающая подсказка на Доске задач
    this.planningDone = false
    const boardObj = this.objects.find(o => o.label === 'Доска задач')
    if (boardObj) {
      this.planningHint = this.add.text(boardObj.x - 40, boardObj.y - 12,
        'НАЧНИ ЗДЕСЬ!', {
          fontSize: '14px',
          color: '#ffff00',
          fontFamily: '"Press Start 2P"',
          backgroundColor: 'rgba(0, 0, 0, 0.94)',
          padding: { x: 8, y: 5 }
        }).setOrigin(0.5).setDepth(20)

      this.boardLabel = this.add.text(boardObj.x - 33, boardObj.y + 12,
        'ДОСКА ЗАДАЧ', {
          fontSize: '14px',
          color: '#ffff66',
          fontFamily: '"Press Start 2P"',
          backgroundColor: 'rgba(0, 0, 0, 0.88)',
          padding: { x: 8, y: 5 }
        }).setOrigin(0.5).setDepth(20)

      this.planningHint.setPosition(
        this.planningHint.x + this.planningHint.width / 2,
        this.planningHint.y - this.planningHint.height
      )
      this.boardLabel.setPosition(
        this.boardLabel.x + this.boardLabel.width / 2,
        this.boardLabel.y - this.boardLabel.height
      )

      this.tweens.add({ targets: this.planningHint, alpha: 0.72, duration: 800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' })
    }

    window.addEventListener('planning-closed', (e) => {
      if (e.detail?.completed) {
        this.planningDone = true
        if (this.planningHint) this.planningHint.setVisible(false)
      }
    }, { once: false })

    this.popupText = this.add.text(640, 300, '', {
      fontSize: '11px', color: '#00ff88', fontFamily: '"Press Start 2P"',
      backgroundColor: '#000000', padding: { x: 10, y: 6 }
    }).setOrigin(0.5).setDepth(30).setVisible(false)

    this.createHUD()
    this.createGlossaryButton()
    this.createSandboxButton()
    this.interactCooldown = false

    this.time.delayedCall(700, () => this.showContextHint('controls'))
  }

  createHUD() {
    const px = 10
    const py = 0
    const panelW = 820
    const panelH = 28
    const segmentW = 268
    const barW = 120
    const barH = 7
    const labelFontSize = '10px'
    const valueFontSize = '9px'
    const barY = py + 5 + barH / 2

    this.add.rectangle(px + panelW / 2, py + panelH / 2, panelW, panelH, 0x0a0a18, 0.97)
      .setStrokeStyle(1, 0x222244).setDepth(10)

    const rows = [
      { label: 'Прогресс:',  color: '#00ff88', barColor: 0x00ff88, ref: 'progress' },
      { label: 'Инвесторы:', color: '#ff4444', barColor: 0xff4444, ref: 'anger'    },
      { label: 'Стресс:',    color: '#ffaa00', barColor: 0xffaa00, ref: 'stress'   },
    ]
    rows.forEach((r, index) => {
      const segmentX = px + 12 + index * segmentW
      const barX = segmentX + 112

      this.add.text(barX - 2, barY, r.label, {
        fontSize: labelFontSize,
        color: r.color,
        fontFamily: '"Press Start 2P"'
      }).setOrigin(1, 0.5).setDepth(11)

      const bg = this.add.rectangle(barX, barY, barW, barH, 0x333333)
        .setOrigin(0, 0.5)
        .setDepth(11)

      const fill = this.add.rectangle(barX, barY, 0, barH, r.barColor)
        .setOrigin(0, 0.5)
        .setDepth(11)

      const lbl = this.add.text(barX + barW + 6, barY, '0%', {
        fontSize: valueFontSize,
        color: r.color,
        fontFamily: '"Press Start 2P"'
      }).setOrigin(0, 0.5).setDepth(11)

      if (r.ref === 'progress') { this.progressBar = fill; this.progressLabel = lbl }
      if (r.ref === 'anger')    { this.angerBar    = fill; this.angerLabel    = lbl }
      if (r.ref === 'stress')   { this.stressBar   = fill; this.stressLabel   = lbl }
    })
  }

  createGlossaryButton() {
    const x = 32, y = 690
    const iconSize = 100
    const sq = this.add.rectangle(x, y, 64, 60, 0x000000, 0)
      .setStrokeStyle(0, 0x4499ff, 0).setInteractive({ useHandCursor: true }).setDepth(50)
    const icon = this.add.image(x, y, 'glossary-icon').setDisplaySize(iconSize, iconSize).setDepth(51)
    this.add.text(x + 110, y - 6, 'ГЛОССАРИЙ', {
      fontSize: '14px',
      color: '#ffff66',
      fontFamily: '"Press Start 2P"',
      backgroundColor: '#000000cc',
      padding: { x: 8, y: 6 }
    }).setOrigin(0.5).setDepth(51)
    sq.on('pointerover', () => icon.setDisplaySize(iconSize + 4, iconSize + 4))
    sq.on('pointerout',  () => icon.setDisplaySize(iconSize, iconSize))
    sq.on('pointerdown', () => this.scene.launch('ReferenceScene', { fromGame: true }))
  }

  createSandboxButton() {
    const x = 1048
    const y = 14
    this.sandboxButton = this.add.rectangle(x, y, 430, 28, 0x181824)
      .setStrokeStyle(1, 0x333355)
      .setInteractive({ useHandCursor: true })
      .setDepth(12)

    this.sandboxIcon = this.add.image(866, y, 'pups-no-smile')
      .setDisplaySize(26, 26)
      .setDepth(13)

    this.sandboxLabel = this.add.text(890, y, 'РАЗОБРАТЬ ОШИБКИ', {
      fontSize: '9px',
      color: '#666688',
      fontFamily: '"Press Start 2P"'
    }).setOrigin(0, 0.5).setDepth(13)

    this.sandboxCount = this.add.text(1244, y, '0', {
      fontSize: '9px',
      color: '#666688',
      fontFamily: '"Press Start 2P"'
    }).setOrigin(1, 0.5).setDepth(13)

    this.sandboxButton.on('pointerover', () => {
      if (getTotalMistakes(this.gameState) > 0) this.sandboxButton.setFillStyle(0x241b34)
    })
    this.sandboxButton.on('pointerout', () => this.updateSandboxButton())
    this.sandboxButton.on('pointerdown', () => this.openSandbox())

    this.updateSandboxButton()
  }

  updateHUD() {
    const { progress, anger, stress } = this.gameState
    this.progressBar.width = Math.min(progress, 100) * 1.3; this.progressLabel.setText(progress + '%')
    this.angerBar.width    = Math.min(anger,    100) * 1.3; this.angerLabel.setText(anger    + '%')
    this.stressBar.width   = Math.min(stress,   100) * 1.3; this.stressLabel.setText(stress  + '%')
    this.updateSandboxButton()
    this.updateObjectStates()
  }

  updateSandboxButton() {
    if (!this.sandboxButton) return

    const count = getTotalMistakes(this.gameState)
    const active = count > 0

    this.sandboxButton.setFillStyle(active ? 0x241b34 : 0x181824)
    this.sandboxButton.setStrokeStyle(1, active ? 0xff8844 : 0x333355)
    this.sandboxLabel.setColor(active ? '#ffcc88' : '#666688')
    this.sandboxCount.setColor(active ? '#ff8844' : '#666688')
    this.sandboxCount.setText(String(count))
    this.sandboxIcon.setTexture(active ? 'pups-no-smile' : 'pups')
    this.sandboxIcon.setAlpha(active ? 1 : 0.75)
  }

  openSandbox() {
    const count = getTotalMistakes(this.gameState)
    if (count <= 0) {
      this.popupText.setText('Сначала накопи ошибки для разбора.').setVisible(true)
      this.interactCooldown = true
      this.time.delayedCall(1600, () => {
        this.popupText.setVisible(false)
        this.interactCooldown = false
      })
      return
    }

    if (this.scene.isActive('SandboxScene')) return

    this.scene.launch('SandboxScene', { gameState: this.gameState })
    this.scene.pause()
    window.addEventListener('sandbox-closed', () => { this.scene.resume('GameScene') }, { once: true })
  }

  updateObjectStates() {
    const stressLocked = this.gameState.stress >= 100
    this.objectSprites.forEach(({ hitZone, text, data }) => {
      if (data.type === 'fun') return
      const exhausted = (this.gameState.usedChoices[data.id]?.size || 0) >= 3
      if (stressLocked || exhausted) {
        hitZone.disableInteractive()
        text.setColor('#444444')
      } else {
        hitZone.setInteractive({ useHandCursor: true })
        text.setColor('#ffffff')
      }
    })
  }

  hasCompletedRequiredQuests() {
    return this.requiredQuestIds.every((questId) => this.gameState.completedQuests.has(questId))
  }

  shouldAutoLaunchFinalQuest() {
    return this.hasCompletedRequiredQuests()
      && !this.gameState.completedQuests.has(this.finalQuestId)
      && !this.questOpen
      && this.gameState.anger < 100
  }

  launchQuestById(questId) {
    if ((this.gameState.usedChoices[questId]?.size || 0) >= 3) {
      this.popupText.setText('Все варианты исчерпаны!').setVisible(true)
      this.interactCooldown = true
      this.time.delayedCall(1500, () => { this.popupText.setVisible(false); this.interactCooldown = false })
      return
    }

    window._usedChoices = this.gameState.usedChoices
    this.questOpen = true
    if (window.openQuest) window.openQuest(questId)
    this.scene.pause()
    window.addEventListener('quest-engine-done', (e) => {
      const s = window._allScenarioData
      if (s && s[e.detail.questId]) { this._applyQuestResult(s[e.detail.questId][e.detail.choiceIndex], e.detail.questId, e.detail.choiceIndex) }
      else                          { this.questOpen = false; this.scene.resume('GameScene') }
    }, { once: true })
    window.addEventListener('quest-engine-closed', () => { this.questOpen = false; this.scene.resume('GameScene') }, { once: true })
  }

  applyFun(stressDelta, message) {
    if (this.interactCooldown) return
    this.gameState.stress = Math.max(0, Math.min(100, this.gameState.stress + stressDelta))
    this.updateHUD()
    this.popupText.setText(message).setVisible(true)
    this.interactCooldown = true
    this.time.delayedCall(1800, () => { this.popupText.setVisible(false); this.interactCooldown = false })
  }

  interactWithObject(obj) {
    if (this.interactCooldown || this.questOpen || this.autoFinalQuestPending) return

    if (obj.type === 'fun') {
      if (this.gameState.usedFun.has(obj.label)) {
        this.popupText.setText('Уже использовано!').setVisible(true)
        this.interactCooldown = true
        this.time.delayedCall(1500, () => { this.popupText.setVisible(false); this.interactCooldown = false })
        return
      }
      this.gameState.usedFun.add(obj.label)
      obj.effect()

    } else if (obj.type === 'board') {
      if (!this.planningDone) {
        if (window.openPlanning) window.openPlanning()
        this.scene.pause()
        window.addEventListener('planning-closed', () => { this.scene.resume('GameScene') }, { once: true })
      } else {
        document.getElementById('cheatsheet-overlay').style.display = 'flex'
        this.scene.pause()
        window.addEventListener('cheatsheet-closed', () => { this.scene.resume('GameScene') }, { once: true })
      }

    } else if (obj.type === 'trigger') {
      if (obj.id === 0) {
        if ((this.gameState.usedChoices[0]?.size || 0) >= 3) {
          this.popupText.setText('Все варианты исчерпаны!').setVisible(true)
          this.interactCooldown = true
          this.time.delayedCall(1500, () => { this.popupText.setVisible(false); this.interactCooldown = false })
          return
        }
        window._usedChoices = this.gameState.usedChoices
        this.questOpen = true
        if (window.openLaptopQuest) window.openLaptopQuest()
        this.scene.pause()
        window.addEventListener('quest-laptop-done', (e) => {
          const s = window._scenarioData
          if (s) { this._applyQuestResult(s[e.detail.choiceIndex], 0, e.detail.choiceIndex) }
          else    { this.questOpen = false; this.scene.resume('GameScene') }
        }, { once: true })
        window.addEventListener('quest-laptop-closed', () => { this.questOpen = false; this.scene.resume('GameScene') }, { once: true })

      } else {
        this.launchQuestById(obj.id)
      }
    }
  }

  _applyQuestResult(choice, questId, choiceIndex) {
    if (!choice.correct) registerMistake(this.gameState, questId, choiceIndex)

    this.gameState.progress = Math.max(0, Math.min(100, this.gameState.progress + choice.progressDelta))
    this.gameState.anger    = Math.max(0, Math.min(100, this.gameState.anger    + choice.angerDelta))
    const p = this.gameState.stress
    this.gameState.stress   = Math.max(0, Math.min(100, p + choice.stressDelta))
    if (p < 100 && this.gameState.stress >= 100) this.burnoutPending = true

    this.gameState.step++
    this.gameState.completedQuests.add(questId)
    if (!this.gameState.usedChoices[questId]) this.gameState.usedChoices[questId] = new Set()
    this.gameState.usedChoices[questId].add(choiceIndex)
    window._usedChoices = this.gameState.usedChoices

    if (this.gameState.completedQuests.size === 1 && !this.hintsShown.hud) this.hudHintPending = true
    this.updateHUD()
    this.scene.resume('GameScene')

    if (!this.burnoutPending && (questId === this.finalQuestId || this.gameState.anger >= 100)) {
      this.time.delayedCall(120, () => {
        this.scene.stop()
        this.scene.start('FinalScene', { gameState: this.gameState })
      })
    }
  }

  triggerBurnout() {
    if (this.burnoutActive) return
    this.burnoutActive = true
    this.gameState.anger    = Math.min(100, this.gameState.anger    + 10)
    this.gameState.progress = Math.max(0,   this.gameState.progress - 10)
    this.updateHUD()

    const phase1 = [
      this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.65).setDepth(900),
      this.add.rectangle(640, 310, 740, 220, 0x1a0000).setStrokeStyle(3, 0xff2222).setDepth(901),
      this.add.text(640, 230, '⚠  ВЫГОРАНИЕ!', { fontSize: '18px', color: '#ff3333', fontFamily: '"Press Start 2P"' }).setOrigin(0.5).setDepth(902),
      this.add.text(640, 320, 'Команда перегружена — ошибки участились.\nРешения принимаются хаотично.\n\n−10% прогресс    +10% гнев инвесторов', {
        fontSize: '9px', color: '#ffaaaa', fontFamily: '"Press Start 2P"', align: 'center', lineSpacing: 9, wordWrap: { width: 660 }
      }).setOrigin(0.5).setDepth(902),
    ]
    this.time.delayedCall(2000, () => {
      phase1.forEach(o => o.destroy())
      this.cameras.main.shake(3000, 0.009)
      this.time.delayedCall(3000, () => this.showBurnoutAdvice())
    })
  }

  showBurnoutAdvice() {
    const ui = [
      this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.72).setDepth(900),
      this.add.rectangle(640, 350, 800, 340, 0x0d0d1f).setStrokeStyle(3, 0xffaa00).setDepth(901),
      this.add.text(640, 230, '💡 БАЛАНС — ЧАСТЬ DEVOPS-КУЛЬТУРЫ', { fontSize: '10px', color: '#ffaa00', fontFamily: '"Press Start 2P"', align: 'center', wordWrap: { width: 720 } }).setOrigin(0.5).setDepth(902),
      this.add.text(640, 355, 'Выгоревшая команда допускает больше инцидентов\nв продакшне и реагирует медленнее.\nВ здоровых DevOps-командах отдых — это процесс,\nа не роскошь.\n\nСнизь стресс в зоне отдыха:\n☕ Кофе  💤 Диван  🌿 Цветок  🏓 Пинг-понг', {
        fontSize: '9px', color: '#ccccdd', fontFamily: '"Press Start 2P"', align: 'center', lineSpacing: 9, wordWrap: { width: 720 }
      }).setOrigin(0.5).setDepth(902),
    ]
    const btn = this.add.rectangle(640, 490, 360, 46, 0xffaa00).setInteractive({ useHandCursor: true }).setDepth(903)
    const btnTxt = this.add.text(640, 490, 'ПОНЯЛ, ИДУ ОТДЫХАТЬ →', { fontSize: '8px', color: '#0d0d1f', fontFamily: '"Press Start 2P"' }).setOrigin(0.5).setDepth(903)
    ui.push(btn, btnTxt)
    btn.on('pointerover', () => btn.setFillStyle(0xdd8800))
    btn.on('pointerout',  () => btn.setFillStyle(0xffaa00))
    btn.on('pointerdown', () => {
      ui.forEach(o => o.destroy())
      this.burnoutActive = false
      if (this.gameState.anger >= 100) this.time.delayedCall(300, () => { this.scene.stop(); this.scene.start('FinalScene', { gameState: this.gameState }) })
    })
  }

  showContextHint(type) {
    if (this.hintsShown[type]) return
    this.hintsShown[type] = true
    const title = type === 'controls' ? 'УПРАВЛЕНИЕ' : 'ШКАЛЫ'
    const body  = type === 'controls'
      ? 'Кликай мышью по объектам на сцене,\nчтобы запускать квесты и действия.\n\nНачни с доски задач — там можно спланировать работу и получить первые плюшки.'
      : 'ПРОГРЕСС — доведи до 70%+ для успешного релиза\n\nИНВЕСТОРЫ — держи недовольство ниже 50%\n\nСТРЕСС — при 100% выгорание:\n−10% прогресс, +10% гнев инвесторов'

    const ui = [
      this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.6).setDepth(800),
      this.add.rectangle(640, 355, 840, 300, 0x0d0d1f).setStrokeStyle(2, 0x00d4ff).setDepth(801),
      this.add.text(640, 235, title, { fontSize: '12px', color: '#00d4ff', fontFamily: '"Press Start 2P"' }).setOrigin(0.5).setDepth(802),
      this.add.text(640, 355, body,  { fontSize: '9px',  color: '#ccccdd', fontFamily: '"Press Start 2P"', align: 'center', lineSpacing: 11, wordWrap: { width: 760 } }).setOrigin(0.5).setDepth(802),
    ]
    const btn = this.add.rectangle(640, 470, 240, 44, 0x00d4ff).setInteractive({ useHandCursor: true }).setDepth(803)
    const btnTxt = this.add.text(640, 470, 'ПОНЯТНО →', { fontSize: '9px', color: '#0d0d1f', fontFamily: '"Press Start 2P"' }).setOrigin(0.5).setDepth(804)
    ui.push(btn, btnTxt)

    const kb = this.input.keyboard
    const close = () => { ui.forEach(o => o.destroy()); kb.off('keydown', onKey) }
    const onKey = (e) => { if ([13, 27].includes(e.keyCode)) close() }
    kb.on('keydown', onKey)

    const closeBtn = this.add.text(640 + 420 - 16, 355 - 150 + 16, '✕', { fontSize: '12px', color: '#555577', fontFamily: '"Press Start 2P"' })
      .setOrigin(0.5).setDepth(805).setInteractive({ useHandCursor: true })
    closeBtn.on('pointerover', () => closeBtn.setColor('#ffffff'))
    closeBtn.on('pointerout',  () => closeBtn.setColor('#555577'))
    closeBtn.on('pointerdown', close)
    ui.push(closeBtn)

    btn.on('pointerover', () => btn.setFillStyle(0x00aacc))
    btn.on('pointerout',  () => btn.setFillStyle(0x00d4ff))
    btn.on('pointerdown', close)
  }
}
