import Phaser from 'phaser'

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene')
  }

  preload() {
    this.load.spritesheet('player', '/src/assets/player.png', { frameWidth: 64, frameHeight: 64 })
    this.load.image('spr-desk',     '/src/assets/Desk-2.png')
    this.load.image('spr-server',   '/src/assets/server-rack.png')
    this.load.image('spr-board',    '/src/assets/Board.png')
    this.load.image('spr-monitor',  '/src/assets/Wall-Graph.png')
    this.load.image('spr-bookshelf','/src/assets/Tall-Bookshelf.png')
    this.load.image('spr-coffee',   '/src/assets/Coffee-Machine.png')
    this.load.image('spr-plant',    '/src/assets/Big-Plant.png')
    this.load.image('spr-sofa',     '/src/assets/Big-Sofa.png')
    this.load.image('spr-vending',  '/src/assets/Vending-Machine.png')
    this.load.image('spr-printer',  '/src/assets/Printer.png')
    this.load.image('spr-pingpong', '/src/assets/pingpong-paddle.png')
  }

  create() {
    this.gameState = { progress: 0, anger: 0, stress: 0, step: 0 }

    this.drawOfficeBackground()

    // Объекты офиса: { x, y, w, h, label, type, id/effect, sprite, scale }
    this.objects = [
      // ── На стене между окнами (x ≠ 220, 640, 1060) ──────────
      { x: 430,  y: 155, w: 64, h: 64,  label: 'Whiteboard',  type: 'trigger', id: 2, sprite: 'spr-board',     scale: 4 },
      { x: 850,  y: 155, w: 64, h: 64,  label: 'Доска задач', type: 'board',   id: 2, sprite: 'spr-board',     scale: 4 },

      // ── У задней стены (на полу) ─────────────────────────────
      { x: 160,  y: 340, w: 96, h: 96,  label: 'Ноутбук',    type: 'trigger', id: 0, sprite: 'spr-desk',      scale: 3 },
      { x: 550,  y: 330, w: 96, h: 96,  label: 'Git репо',   type: 'trigger', id: 5, sprite: 'spr-bookshelf', scale: 3 },
      { x: 1120, y: 330, w: 96, h: 96,  label: 'Сервер',     type: 'trigger', id: 1, sprite: 'spr-server',    scale: 0.22 },

      // ── Середина офиса ───────────────────────────────────────
      { x: 120,  y: 440, w: 64, h: 64,  label: 'Кофе ☕',   type: 'fun', effect: () => this.applyFun(-15, 'Выпил кофе. -15 стресс!'),     sprite: 'spr-coffee', scale: 4 },
      { x: 400,  y: 430, w: 64, h: 64,  label: 'Мониторинг',type: 'trigger', id: 3, sprite: 'spr-monitor',   scale: 4 },
      { x: 730,  y: 440, w: 96, h: 96,  label: 'Диван 💤',  type: 'fun', effect: () => this.applyFun(-20, 'Отдохнул. -20 стресс!'),        sprite: 'spr-sofa',   scale: 3 },
      { x: 1000, y: 430, w: 96, h: 96,  label: 'Телефон',   type: 'trigger', id: 4, sprite: 'spr-vending',   scale: 3 },
      { x: 1220, y: 420, w: 55, h: 55,  label: 'Выход',     type: 'trigger', id: 6, sprite: null,            scale: 1 },

      // ── Ближний план ─────────────────────────────────────────
      { x: 270,  y: 570, w: 96, h: 96,  label: 'Цветок 🌿', type: 'fun', effect: () => this.applyFun(-10, 'Полил цветок. -10 стресс!'),   sprite: 'spr-plant',  scale: 3 },
      { x: 640,  y: 560, w: 80, h: 80,  label: 'Пинг-понг 🏓',type:'fun', effect: () => this.applyFun(-25, 'Сыграл в пинг-понг. -25 стресс!'), sprite: 'spr-pingpong', scale: 0.07 },
    ]

    // Рисуем объекты спрайтами (или прямоугольником для выхода)
    this.objectSprites = []
    this.objects.forEach(obj => {
      let visual
      if (obj.sprite) {
        visual = this.add.image(obj.x, obj.y, obj.sprite).setScale(obj.scale)
      } else {
        visual = this.add.rectangle(obj.x, obj.y, obj.w, obj.h, 0x888888)
      }
      const text = this.add.text(obj.x, obj.y + obj.h / 2 + 8, obj.label, {
        fontSize: '8px',
        color: '#ffffff',
        fontFamily: '"Press Start 2P"'
      }).setOrigin(0.5, 0)
      this.objectSprites.push({ rect: visual, text, data: obj })
    })

    // Мигающая Доска задач
    this.planningDone = false
    const boardSprite = this.objectSprites.find(s => s.data.label === 'Доска задач')
    if (boardSprite) {
      this.tweens.add({ targets: boardSprite.rect, alpha: 0.2, duration: 600, yoyo: true, repeat: -1 })
      this.planningHint = this.add.text(boardSprite.data.x, boardSprite.data.y - 60,
        '← НАЧНИ ЗДЕСЬ!', {
        fontSize: '8px', color: '#ffff00', fontFamily: '"Press Start 2P"',
        backgroundColor: '#000000', padding: { x: 6, y: 4 }
      }).setOrigin(0.5).setDepth(20)
      this.tweens.add({ targets: this.planningHint, y: boardSprite.data.y - 70, duration: 800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' })
    }

    window.addEventListener('planning-closed', () => {
      this.planningDone = true
      if (this.planningHint) this.planningHint.setVisible(false)
      if (boardSprite) {
        this.tweens.killTweensOf(boardSprite.rect)
        boardSprite.rect.setAlpha(1)
      }
    }, { once: false })

    // Персонаж
    this.player = this.physics.add.sprite(640, 360, 'player')
    this.player.setScale(2)
    this.player.setCollideWorldBounds(true)
    this.player.setDepth(10)

    this.anims.create({ key: 'walk-up',    frames: this.anims.generateFrameNumbers('player', { start: 8*13,  end: 8*13+8  }), frameRate: 10, repeat: -1 })
    this.anims.create({ key: 'walk-left',  frames: this.anims.generateFrameNumbers('player', { start: 9*13,  end: 9*13+8  }), frameRate: 10, repeat: -1 })
    this.anims.create({ key: 'walk-down',  frames: this.anims.generateFrameNumbers('player', { start: 10*13, end: 10*13+8 }), frameRate: 10, repeat: -1 })
    this.anims.create({ key: 'walk-right', frames: this.anims.generateFrameNumbers('player', { start: 11*13, end: 11*13+8 }), frameRate: 10, repeat: -1 })

    this.cursors = this.input.keyboard.createCursorKeys()
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      interact: Phaser.Input.Keyboard.KeyCodes.E
    })

    this.hintText = this.add.text(640, 670, '', {
      fontSize: '10px', color: '#ffff00', fontFamily: '"Press Start 2P"'
    }).setOrigin(0.5).setDepth(20)

    this.popupText = this.add.text(640, 300, '', {
      fontSize: '11px', color: '#00ff88', fontFamily: '"Press Start 2P"',
      backgroundColor: '#000000', padding: { x: 10, y: 6 }
    }).setOrigin(0.5).setDepth(30).setVisible(false)

    this.createHUD()
    this.nearObject = null
    this.interactCooldown = false
  }

  drawOfficeBackground() {
    const W = 1280, H = 720

    // ── Потолок ──────────────────────────────────────────────
    this.add.rectangle(W/2, 20, W, 40, 0x2a2a3a)
    // Плитки потолка
    for (let x = 0; x < W; x += 80) {
      this.add.rectangle(x + 40, 20, 78, 36, 0x303040)
    }
    // Светильники
    ;[160, 480, 800, 1120].forEach(lx => {
      this.add.rectangle(lx, 18, 120, 10, 0xffffcc)
      this.add.rectangle(lx, 20, 100, 6,  0xfffde8)
    })

    // ── Задняя стена ─────────────────────────────────────────
    this.add.rectangle(W/2, 140, W, 200, 0xede5d4)

    // Молдинг под потолком
    this.add.rectangle(W/2, 42, W, 8, 0xd4c8b0)

    // Окна (3 шт)
    ;[220, 640, 1060].forEach(wx => {
      const wy = 125, ww = 130, wh = 130
      // Рама снаружи
      this.add.rectangle(wx, wy, ww + 14, wh + 14, 0xc8b898)
      // Стекло — небо
      this.add.rectangle(wx, wy - 14, ww, wh / 2 - 2, 0x87ceeb)
      // Стекло — нижняя часть (отражение)
      this.add.rectangle(wx, wy + 18, ww, wh / 2 - 2, 0xb8d8ee)
      // Переплёт вертикальный
      this.add.rectangle(wx, wy, 5, wh, 0xd4c4a0)
      // Переплёт горизонтальный
      this.add.rectangle(wx, wy, ww, 5, 0xd4c4a0)
      // Подоконник
      this.add.rectangle(wx, wy + wh / 2 + 9, ww + 22, 10, 0xb8aa8a)
    })

    // Плинтус (стена → пол)
    this.add.rectangle(W/2, 238, W, 18, 0x7a5c3e)
    this.add.rectangle(W/2, 230, W,  4, 0x9a7c5e)

    // Боковые стены
    this.add.rectangle(12, 360, 24, H, 0xddd5c4)
    this.add.rectangle(W - 12, 360, 24, H, 0xddd5c4)
    // Плинтусы боковых стен
    this.add.rectangle(12, 238, 24, 18, 0x7a5c3e)
    this.add.rectangle(W - 12, 238, 24, 18, 0x7a5c3e)

    // ── Пол (дощатый паркет) ─────────────────────────────────
    const floorY = 247
    const plankH = 32
    const lightPlank = 0xc8945a
    const darkPlank  = 0xb88248
    const lineColor  = 0x9a6838

    for (let y = floorY; y < 682; y += plankH) {
      const even = Math.floor((y - floorY) / plankH) % 2 === 0
      this.add.rectangle(W/2, y + plankH / 2, W, plankH, even ? lightPlank : darkPlank)
      // Линия между досками
      this.add.rectangle(W/2, y, W, 2, lineColor)
      // Вертикальные стыки (шахматный сдвиг)
      const offset = even ? 0 : 160
      for (let x = offset; x < W; x += 320) {
        this.add.rectangle(x, y + plankH / 2, 2, plankH, lineColor)
      }
    }

    // Тень от задней стены на пол
    this.add.rectangle(W/2, 260, W, 28, 0x000000, 0.08)

    // ── HUD полоса снизу ─────────────────────────────────────
    this.add.rectangle(W/2, 704, W, 40, 0x1a1a2e)
    this.add.rectangle(W/2, 684, W, 2, 0x2a2a4a)
  }

  createHUD() {
    const hudY = 695
    // Прогресс
    this.add.text(30,  hudY, 'Прогресс:', { fontSize: '8px', color: '#aaffaa', fontFamily: '"Press Start 2P"' })
    this.progressBg    = this.add.rectangle(200, hudY + 5, 160, 12, 0x333333).setOrigin(0, 0.5)
    this.progressBar   = this.add.rectangle(200, hudY + 5, 0,   12, 0x00ff88).setOrigin(0, 0.5)
    this.progressLabel = this.add.text(368, hudY, '0%', { fontSize: '8px', color: '#00ff88', fontFamily: '"Press Start 2P"' })

    // Инвесторы
    this.add.text(460, hudY, 'Инвесторы:', { fontSize: '8px', color: '#ffaaaa', fontFamily: '"Press Start 2P"' })
    this.angerBg    = this.add.rectangle(640, hudY + 5, 160, 12, 0x333333).setOrigin(0, 0.5)
    this.angerBar   = this.add.rectangle(640, hudY + 5, 0,   12, 0xff4444).setOrigin(0, 0.5)
    this.angerLabel = this.add.text(808, hudY, '0%', { fontSize: '8px', color: '#ff4444', fontFamily: '"Press Start 2P"' })

    // Стресс
    this.add.text(880, hudY, 'Стресс:', { fontSize: '8px', color: '#ffddaa', fontFamily: '"Press Start 2P"' })
    this.stressBg    = this.add.rectangle(1010, hudY + 5, 160, 12, 0x333333).setOrigin(0, 0.5)
    this.stressBar   = this.add.rectangle(1010, hudY + 5, 0,   12, 0xffaa00).setOrigin(0, 0.5)
    this.stressLabel = this.add.text(1178, hudY, '0%', { fontSize: '8px', color: '#ffaa00', fontFamily: '"Press Start 2P"' })
  }

  updateHUD() {
    const { progress, anger, stress } = this.gameState
    this.progressBar.width = Math.min(progress, 100) * 1.6
    this.progressLabel.setText(progress + '%')
    this.angerBar.width = Math.min(anger, 100) * 1.6
    this.angerLabel.setText(anger + '%')
    this.stressBar.width = Math.min(stress, 100) * 1.6
    this.stressLabel.setText(stress + '%')
  }

  applyFun(stressDelta, message) {
    if (this.interactCooldown) return
    this.gameState.stress = Math.max(0, Math.min(100, this.gameState.stress + stressDelta))
    this.updateHUD()
    this.popupText.setText(message).setVisible(true)
    this.interactCooldown = true
    this.time.delayedCall(1800, () => {
      this.popupText.setVisible(false)
      this.interactCooldown = false
    })
  }

  getNearObject() {
    const px = this.player.x
    const py = this.player.y
    for (const obj of this.objects) {
      const dx = Math.abs(px - obj.x)
      const dy = Math.abs(py - obj.y)
      if (dx < obj.w / 2 + 40 && dy < obj.h / 2 + 40) return obj
    }
    return null
  }

  update() {
    const speed = 160
    const { cursors, wasd, player } = this
    player.setVelocity(0)

    if (cursors.left.isDown  || wasd.left.isDown)  { player.setVelocityX(-speed); player.anims.play('walk-left',  true) }
    else if (cursors.right.isDown || wasd.right.isDown) { player.setVelocityX(speed);  player.anims.play('walk-right', true) }
    else if (cursors.up.isDown    || wasd.up.isDown)    { player.setVelocityY(-speed); player.anims.play('walk-up',    true) }
    else if (cursors.down.isDown  || wasd.down.isDown)  { player.setVelocityY(speed);  player.anims.play('walk-down',  true) }
    else { player.anims.stop() }

    const near = this.getNearObject()
    if (near) { this.hintText.setText('[E] ' + near.label); this.nearObject = near }
    else       { this.hintText.setText('');                  this.nearObject = null }

    if (Phaser.Input.Keyboard.JustDown(wasd.interact) && this.nearObject && !this.interactCooldown) {
      const obj = this.nearObject
      if (obj.type === 'fun') {
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
          if (window.openLaptopQuest) window.openLaptopQuest()
          this.scene.pause()
          window.addEventListener('quest-laptop-done', (e) => {
            const s = window._scenarioData
            if (s) {
              const choice = s[e.detail.choiceIndex]
              this.gameState.progress = Math.max(0, Math.min(100, this.gameState.progress + choice.progressDelta))
              this.gameState.anger   = Math.max(0, Math.min(100, this.gameState.anger   + choice.angerDelta))
              this.gameState.stress  = Math.max(0, Math.min(100, this.gameState.stress  + choice.stressDelta))
              this.gameState.step++
              this.updateHUD()
              this.scene.resume('GameScene')
              this.scene.launch('FeedbackScene', { choice, gameState: this.gameState })
              this.scene.pause()
            } else { this.scene.resume('GameScene') }
          }, { once: true })
          window.addEventListener('quest-laptop-closed', () => { this.scene.resume('GameScene') }, { once: true })
        } else {
          if (window.openQuest) window.openQuest(obj.id)
          this.scene.pause()
          window.addEventListener('quest-engine-done', (e) => {
            const s = window._allScenarioData
            if (s && s[e.detail.questId]) {
              const choice = s[e.detail.questId][e.detail.choiceIndex]
              this.gameState.progress = Math.max(0, Math.min(100, this.gameState.progress + choice.progressDelta))
              this.gameState.anger    = Math.max(0, Math.min(100, this.gameState.anger    + choice.angerDelta))
              this.gameState.stress   = Math.max(0, Math.min(100, this.gameState.stress   + choice.stressDelta))
              this.gameState.step++
              this.updateHUD()
              this.scene.resume('GameScene')
              this.scene.launch('FeedbackScene', { choice, gameState: this.gameState })
              this.scene.pause()
            } else { this.scene.resume('GameScene') }
          }, { once: true })
          window.addEventListener('quest-engine-closed', () => { this.scene.resume('GameScene') }, { once: true })
        }
      }
    }
  }
}
