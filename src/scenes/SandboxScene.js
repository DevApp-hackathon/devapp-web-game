import Phaser from 'phaser'
import { getSandboxTopics } from '../sandbox-data.js'

export default class SandboxScene extends Phaser.Scene {
  constructor() {
    super('SandboxScene')
  }

  init(data) {
    this.gameState = data.gameState
    this.topics = getSandboxTopics(this.gameState, 3)
    this.reviewedThemes = new Set()
    this.quizIndex = 0
    this.quizCorrect = 0
    this.quizResults = []
    this.quizLocked = false
  }

  create() {
    this.input.keyboard.on('keydown-ESC', this.closeSandbox, this)
    this.events.once('shutdown', () => {
      this.input.keyboard.off('keydown-ESC', this.closeSandbox, this)
    })

    this.showHub()
  }

  clearScreen() {
    this.children.removeAll(true)
  }

  drawFrame(title, subtitle, color = 0x4499ff) {
    this.clearScreen()
    const colorHex = `#${color.toString(16).padStart(6, '0')}`

    this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.9)
    const panel = this.add.rectangle(640, 360, 980, 650, 0x0d0d1f)
    panel.setStrokeStyle(2, color)

    this.add.text(640, 72, title, {
      fontSize: '28px',
      color: colorHex,
      fontFamily: '"Press Start 2P"'
    }).setOrigin(0.5)

    if (subtitle) {
      this.add.text(640, 108, subtitle, {
        fontSize: '12px',
        color: '#666688',
        fontFamily: '"Press Start 2P"',
        align: 'center',
        lineSpacing: 6
      }).setOrigin(0.5)
    }

    this.add.rectangle(640, 136, 900, 1, 0x333366)

    const close = this.add.text(1088, 74, '✕', {
      fontSize: '16px',
      color: '#666688',
      fontFamily: '"Press Start 2P"'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true })

    close.on('pointerover', () => close.setColor('#ffffff'))
    close.on('pointerout', () => close.setColor('#666688'))
    close.on('pointerdown', () => this.closeSandbox())
  }

  drawButton(x, y, w, h, label, fill, textColor, onClick, border = null, fontSize = '10px') {
    const btn = this.add.rectangle(x, y, w, h, fill).setInteractive({ useHandCursor: true })
    if (border !== null) btn.setStrokeStyle(2, border)

    const txt = this.add.text(x, y, label, {
      fontSize,
      color: textColor,
      fontFamily: '"Press Start 2P"',
      align: 'center',
      lineSpacing: 5
    }).setOrigin(0.5)

    btn.on('pointerover', () => btn.setAlpha(0.88))
    btn.on('pointerout', () => btn.setAlpha(1))
    btn.on('pointerdown', onClick)

    return { btn, txt }
  }

  showHub() {
    this.drawFrame('ПЕСОЧНИЦА ОШИБОК', 'Разбери самые частые ошибки этой сессии и закрепи исправления без штрафов.')

    if (!this.topics.length) {
      this.add.image(230, 218, 'pups-smile').setDisplaySize(130, 130)

      this.add.text(640, 280, 'ОШИБОК ДЛЯ РАЗБОРА ПОКА НЕТ', {
        fontSize: '14px',
        color: '#00ff88',
        fontFamily: '"Press Start 2P"'
      }).setOrigin(0.5)

      this.add.text(640, 360, 'Ты пока не накопил повторяющихся ошибок.\nСделай пару выборов в офисе — и песочница\nсоберёт паттерны для разбора.', {
        fontSize: '14px',
        color: '#aaaacc',
        fontFamily: '"Press Start 2P"',
        align: 'center',
        lineSpacing: 10,
        wordWrap: { width: 720 }
      }).setOrigin(0.5)

      this.drawButton(640, 570, 280, 46, 'ВЕРНУТЬСЯ', 0x4499ff, '#0d0d1f', () => this.closeSandbox(), 0x4499ff)
      return
    }

    this.add.image(176, 204, 'pups-no-smile').setDisplaySize(132, 132).setDepth(3)

    this.topics.forEach((topic, index) => {
      const y = 224 + index * 152
      const accent = Phaser.Display.Color.HexStringToColor(topic.color).color
      const card = this.add.rectangle(640, y, 860, 128, 0x12122a)
      card.setStrokeStyle(2, accent)

      this.add.text(292, y - 30, topic.title, {
        fontSize: '12px',
        color: topic.color,
        fontFamily: '"Press Start 2P"'
      }).setOrigin(0, 0.5)

      this.add.text(292, y + 14, topic.summary, {
        fontSize: '10px',
        color: '#aab0dd',
        fontFamily: '"Press Start 2P"',
        align: 'left',
        lineSpacing: 7,
        wordWrap: { width: 450 }
      }).setOrigin(0, 0.5)

      this.add.rectangle(930, y - 22, 120, 30, accent, 0.18).setStrokeStyle(1, accent)
      this.add.text(930, y - 22, `${topic.count} раз`, {
        fontSize: '9px',
        color: topic.color,
        fontFamily: '"Press Start 2P"'
      }).setOrigin(0.5)

      if (this.reviewedThemes.has(topic.id)) {
        this.add.rectangle(930, y + 24, 180, 38, 0x0f2c17).setStrokeStyle(2, 0x00aa44)
        this.add.text(930, y + 24, '✓ РАЗОБРАНО', {
          fontSize: '9px',
          color: '#88ff88',
          fontFamily: '"Press Start 2P"'
        }).setOrigin(0.5)
      } else {
        this.drawButton(930, y + 24, 180, 38, 'РАЗОБРАТЬ', 0x2a2a4a, '#ffffff', () => this.showReplay(topic.id), accent, '9px')
      }
    })

    this.drawButton(360, 648, 240, 44, 'В ОФИС', 0x1a1a3a, '#888899', () => this.closeSandbox(), 0x555577, '9px')

    const readyForQuiz = this.reviewedThemes.size === this.topics.length
    if (readyForQuiz) {
      this.drawButton(840, 648, 280, 44, 'МИНИ-ТЕСТ →', 0x00ff88, '#0d0d1f', () => {
        this.quizIndex = 0
        this.quizCorrect = 0
        this.quizResults = []
        this.showQuizQuestion()
      }, 0x00ff88, '9px')
    } else {
      this.add.rectangle(840, 648, 280, 44, 0x1a1a26).setStrokeStyle(2, 0x333344)
      this.add.text(840, 648, 'СНАЧАЛА РАЗБЕРИ\nВСЕ ОШИБКИ', {
        fontSize: '10px',
        color: '#555577',
        fontFamily: '"Press Start 2P"',
        align: 'center',
        lineSpacing: 6
      }).setOrigin(0.5)
    }
  }

  showReplay(themeId) {
    const topic = this.topics.find((item) => item.id === themeId)
    if (!topic) {
      this.showHub()
      return
    }

    const accent = Phaser.Display.Color.HexStringToColor(topic.color).color
    this.drawFrame(topic.title, 'Сначала сознательно воспроизведи ошибку, потом разберём правильный путь.', accent)

    this.add.image(182, 214, 'pups-no-smile').setDisplaySize(136, 136).setDepth(3)

    this.add.text(640, 190, topic.reproduceTitle, {
      fontSize: '13px',
      color: topic.color,
      fontFamily: '"Press Start 2P"'
    }).setOrigin(0.5)

    const prompt = this.add.rectangle(640, 290, 780, 120, 0x15152d)
    prompt.setStrokeStyle(2, accent)
    this.add.text(640, 290, topic.reproduceText, {
      fontSize: '10px',
      color: '#d7dbff',
      fontFamily: '"Press Start 2P"',
      align: 'center',
      lineSpacing: 9,
      wordWrap: { width: 700 }
    }).setOrigin(0.5)

    this.drawButton(640, 432, 460, 60, topic.wrongAction, 0x4a1616, '#ffffff', () => {
      this.playFeedbackTone(false)
      this.cameras.main.flash(180, 255, 80, 80)
      this.cameras.main.shake(180, 0.004)
      this.showReplayImpact(topic)
    }, 0xff6666, '9px')

    this.drawButton(388, 648, 220, 44, '← К СПИСКУ', 0x1a1a3a, '#888899', () => this.showHub(), 0x555577, '9px')
  }

  showReplayImpact(topic) {
    const accent = Phaser.Display.Color.HexStringToColor(topic.color).color
    this.drawFrame(topic.title, 'Ошибка воспроизведена. Смотри, что она ломает сразу же.', accent)

    this.add.image(182, 214, 'pups-no-smile').setDisplaySize(136, 136).setDepth(3)

    const impactBox = this.add.rectangle(640, 218, 780, 90, 0x2a0d0d)
    impactBox.setStrokeStyle(2, 0xff6666)
    this.add.text(640, 218, topic.instantImpact, {
      fontSize: '12px',
      color: '#ffaaaa',
      fontFamily: '"Press Start 2P"',
      align: 'center',
      lineSpacing: 9,
      wordWrap: { width: 700 }
    }).setOrigin(0.5)

    const whyBox = this.add.rectangle(640, 360, 820, 170, 0x12122a)
    whyBox.setStrokeStyle(2, accent)
    this.add.text(640, 314, 'ПОЧЕМУ ЭТО НЕПРАВИЛЬНО', {
      fontSize: '10px',
      color: topic.color,
      fontFamily: '"Press Start 2P"'
    }).setOrigin(0.5)
    this.add.text(640, 384, topic.whyWrong, {
      fontSize: '9px',
      color: '#d7dbff',
      fontFamily: '"Press Start 2P"',
      align: 'center',
      lineSpacing: 9,
      wordWrap: { width: 740 }
    }).setOrigin(0.5)

    this.drawButton(640, 536, 380, 50, 'ПОКАЗАТЬ ИСПРАВЛЕНИЕ', 0x00aa44, '#0d0d1f', () => {
      this.playFeedbackTone(true)
      this.cameras.main.flash(180, 80, 255, 120)
      this.showReplayFix(topic)
    }, 0x00ff88, '9px')

    this.drawButton(388, 648, 220, 44, '← К СПИСКУ', 0x1a1a3a, '#888899', () => this.showHub(), 0x555577, '9px')
  }

  showReplayFix(topic) {
    const accent = Phaser.Display.Color.HexStringToColor(topic.color).color
    this.drawFrame(topic.title, 'Теперь закрепи правильный способ, чтобы ошибка не повторялась.', accent)

    this.add.image(182, 214, 'pups-smile').setDisplaySize(136, 136).setDepth(3)

    this.add.text(640, 196, topic.fixTitle, {
      fontSize: '13px',
      color: '#00ff88',
      fontFamily: '"Press Start 2P"'
    }).setOrigin(0.5)

    const fixBox = this.add.rectangle(640, 328, 820, 220, 0x0d2116)
    fixBox.setStrokeStyle(2, 0x00aa44)
    this.add.text(640, 328, topic.fixText, {
      fontSize: '10px',
      color: '#baffca',
      fontFamily: '"Press Start 2P"',
      align: 'center',
      lineSpacing: 9,
      wordWrap: { width: 740 }
    }).setOrigin(0.5)

    this.reviewedThemes.add(topic.id)

    this.drawButton(640, 536, 300, 50, 'ГОТОВО →', 0x00ff88, '#0d0d1f', () => this.showHub(), 0x00ff88, '10px')
    this.drawButton(388, 648, 220, 44, '← К СПИСКУ', 0x1a1a3a, '#888899', () => this.showHub(), 0x555577, '9px')
  }

  showQuizQuestion() {
    const topic = this.topics[this.quizIndex]
    if (!topic) {
      this.showQuizSummary()
      return
    }

    const accent = Phaser.Display.Color.HexStringToColor(topic.color).color
    this.quizLocked = false
    this.drawFrame('МИНИ-ТЕСТ', `Вопрос ${this.quizIndex + 1} из ${this.topics.length}. Без штрафов: можно спокойно разобраться.`, accent)

    this.add.image(182, 208, 'pups-smile').setDisplaySize(132, 132).setDepth(3)

    const questionBox = this.add.rectangle(640, 224, 790, 120, 0x12122a)
    questionBox.setStrokeStyle(2, accent)
    this.add.text(640, 188, topic.title, {
      fontSize: '10px',
      color: topic.color,
      fontFamily: '"Press Start 2P"'
    }).setOrigin(0.5)
    this.add.text(640, 244, topic.quizQuestion, {
      fontSize: '11px',
      color: '#ffffff',
      fontFamily: '"Press Start 2P"',
      align: 'center',
      lineSpacing: 9,
      wordWrap: { width: 720 }
    }).setOrigin(0.5)

    const optionViews = []
    topic.quizOptions.forEach((option, index) => {
      const y = 360 + index * 96
      const bg = this.add.rectangle(640, y, 760, 78, 0x1a1a3a)
        .setStrokeStyle(2, 0x333355)
        .setInteractive({ useHandCursor: true })
      const txt = this.add.text(640, y, option.text, {
        fontSize: '10px',
        color: '#ffffff',
        fontFamily: '"Press Start 2P"',
        align: 'center',
        lineSpacing: 7,
        wordWrap: { width: 680 }
      }).setOrigin(0.5)

      bg.on('pointerover', () => { if (!this.quizLocked) bg.setFillStyle(0x25254a) })
      bg.on('pointerout',  () => { if (!this.quizLocked) bg.setFillStyle(0x1a1a3a) })
      bg.on('pointerdown', () => this.handleQuizAnswer(topic, option, optionViews))

      optionViews.push({ bg, txt, option })
    })

    this.drawButton(388, 648, 220, 44, '← К СПИСКУ', 0x1a1a3a, '#888899', () => this.showHub(), 0x555577, '9px')
  }

  handleQuizAnswer(topic, selectedOption, optionViews) {
    if (this.quizLocked) return
    this.quizLocked = true

    const isCorrect = !!selectedOption.correct
    if (isCorrect) this.quizCorrect += 1
    this.quizResults[this.quizIndex] = isCorrect

    this.playFeedbackTone(isCorrect)
    if (isCorrect) this.cameras.main.flash(180, 80, 255, 120)
    else this.cameras.main.flash(180, 255, 90, 90)

    optionViews.forEach(({ bg, txt, option }) => {
      bg.disableInteractive()
      if (option.correct) {
        bg.setFillStyle(0x0f2c17).setStrokeStyle(2, 0x00ff88)
        txt.setColor('#baffca')
      } else if (option === selectedOption) {
        bg.setFillStyle(0x341111).setStrokeStyle(2, 0xff6666)
        txt.setColor('#ffb3b3')
      } else {
        bg.setFillStyle(0x1a1a3a).setStrokeStyle(2, 0x333355)
      }
    })

    const modalDim = this.add.rectangle(640, 360, 980, 650, 0x000000, 0.42)
      .setDepth(40)
      .setInteractive()

    const modal = this.add.rectangle(640, 438, 760, 222, isCorrect ? 0x0d2116 : 0x2a0d0d)
      .setDepth(41)
    modal.setStrokeStyle(2, isCorrect ? 0x00aa44 : 0xff6666)

    this.add.text(640, 374, isCorrect ? 'ВЕРНО' : 'НЕ СОВСЕМ', {
      fontSize: '12px',
      color: isCorrect ? '#00ff88' : '#ff6666',
      fontFamily: '"Press Start 2P"'
    }).setOrigin(0.5).setDepth(42)

    this.add.text(640, 438, topic.quizExplain, {
      fontSize: '9px',
      color: isCorrect ? '#baffca' : '#ffd0d0',
      fontFamily: '"Press Start 2P"',
      align: 'center',
      lineSpacing: 8,
      wordWrap: { width: 660 }
    }).setOrigin(0.5).setDepth(42)

    const label = this.quizIndex < this.topics.length - 1 ? 'ДАЛЕЕ →' : 'ЗАВЕРШИТЬ →'
    const next = this.drawButton(640, 506, 260, 46, label, 0x00d4ff, '#0d0d1f', () => {
      this.quizIndex += 1
      this.showQuizQuestion()
    }, 0x00d4ff, '9px')
    next.btn.setDepth(43)
    next.txt.setDepth(44)
  }

  showQuizSummary() {
    this.drawFrame('РАЗБОР ЗАВЕРШЁН', 'Песочница не штрафует. Её задача — дать безопасно повторить ошибку и сразу закрепить исправление.')

    this.add.image(182, 220, this.quizCorrect === this.topics.length ? 'pups-smile' : 'pups').setDisplaySize(150, 150).setDepth(3)

    this.add.text(640, 226, `Исправлено: ${this.quizCorrect} из ${this.topics.length}`, {
      fontSize: '16px',
      color: '#00ff88',
      fontFamily: '"Press Start 2P"'
    }).setOrigin(0.5)

    this.add.text(640, 332, 'Теперь можно вернуться в офис и проверить,\nкак меняются решения, когда видно свои\nповторяющиеся ошибки по паттернам.', {
      fontSize: '10px',
      color: '#d7dbff',
      fontFamily: '"Press Start 2P"',
      align: 'center',
      lineSpacing: 10,
      wordWrap: { width: 720 }
    }).setOrigin(0.5)

    this.topics.forEach((topic, index) => {
      const lineY = 440 + index * 54
      const ok = !!this.quizResults[index]
      const color = ok ? '#88ff88' : '#ffaa66'
      this.add.rectangle(640, lineY, 760, 42, ok ? 0x0d2116 : 0x2a2010).setStrokeStyle(1, ok ? 0x00aa44 : 0xaa6600)
      this.add.text(240, lineY, topic.title, {
        fontSize: '9px',
        color: '#ffffff',
        fontFamily: '"Press Start 2P"'
      }).setOrigin(0, 0.5)
      this.add.text(980, lineY, ok ? 'закреплено' : 'нужно ещё повторить', {
        fontSize: '8px',
        color,
        fontFamily: '"Press Start 2P"'
      }).setOrigin(1, 0.5)
    })

    this.drawButton(640, 648, 300, 46, 'ВЕРНУТЬСЯ В ОФИС', 0x00ff88, '#0d0d1f', () => this.closeSandbox(), 0x00ff88, '9px')
  }

  playFeedbackTone(success) {
    const ctx = this.sound?.context
    if (!ctx || typeof ctx.createOscillator !== 'function') return

    if (ctx.state === 'suspended' && typeof ctx.resume === 'function') ctx.resume()

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = success ? 'triangle' : 'square'
    osc.frequency.setValueAtTime(success ? 660 : 220, now)
    if (success) {
      osc.frequency.linearRampToValueAtTime(880, now + 0.12)
    } else {
      osc.frequency.linearRampToValueAtTime(140, now + 0.16)
    }

    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.028, now + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + (success ? 0.18 : 0.22))

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + (success ? 0.2 : 0.24))
  }

  closeSandbox() {
    this.scene.stop()
    window.dispatchEvent(new CustomEvent('sandbox-closed', {
      detail: {
        reviewed: Array.from(this.reviewedThemes),
        quizCorrect: this.quizCorrect,
        quizTotal: this.topics.length,
      }
    }))
  }
}
