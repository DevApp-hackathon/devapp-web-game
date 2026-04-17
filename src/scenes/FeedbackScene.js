import Phaser from 'phaser'

export default class FeedbackScene extends Phaser.Scene {
  constructor() {
    super('FeedbackScene')
  }

  init(data) {
    this.choice = data.choice
    this.gameState = data.gameState
  }

  create() {
    const { choice, gameState } = this
    const isCorrect = choice.correct

    // Затемнение
    this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.8)

    // Панель
    const panel = this.add.rectangle(640, 370, 900, 620, 0x12122a)
    panel.setStrokeStyle(2, isCorrect ? 0x00ff88 : 0xff4444)

    // --- Pups аватар ---
    const botX = 200
    const botY = 150
    const companionKey = isCorrect ? 'pups-smile' : 'pups-no-smile'

    this.add.image(botX, botY, companionKey).setDisplaySize(124, 124)
    this.add.text(botX, botY + 74, 'Pups', {
      fontSize: '8px',
      color: '#888888',
      fontFamily: '"Press Start 2P"'
    }).setOrigin(0.5)

    // --- Речевой пузырь ---
    const bubbleX = 660
    const bubbleY = 140

    this.add.triangle(255, bubbleY + 5, 0, 0, 20, 0, 0, 25, 0x1e1e3e)
    this.add.rectangle(bubbleX, bubbleY, 620, 70, 0x1e1e3e).setStrokeStyle(1, 0x444466)

    const phrase = isCorrect ? this.getBotPhraseCorrect() : this.getBotPhraseWrong()
    this.add.text(bubbleX, bubbleY, phrase, {
      fontSize: '10px',
      color: isCorrect ? '#00ff88' : '#ff8866',
      fontFamily: '"Press Start 2P"',
      align: 'center',
      lineSpacing: 6
    }).setOrigin(0.5)

    // --- Верно / Неверно ---
    this.add.text(640, 230, isCorrect ? '✓ ВЕРНО' : '✗ ОШИБКА', {
      fontSize: '18px',
      color: isCorrect ? '#00ff88' : '#ff4444',
      fontFamily: '"Press Start 2P"'
    }).setOrigin(0.5)

    // --- Объяснение ---
    this.add.text(640, 310, choice.explanation, {
      fontSize: '10px',
      color: '#ffffff',
      fontFamily: '"Press Start 2P"',
      align: 'center',
      lineSpacing: 8,
      wordWrap: { width: 780 }
    }).setOrigin(0.5)

    // --- Совет DevBot ---
    this.add.rectangle(640, 430, 800, 72, 0x0a1a2a).setStrokeStyle(1, 0x0066aa)
    this.add.text(260, 412, '💡 СОВЕТ:', { fontSize: '8px', color: '#4499ff', fontFamily: '"Press Start 2P"' })
    this.add.text(640, 438, choice.tip, {
      fontSize: '9px',
      color: '#99ccff',
      fontFamily: '"Press Start 2P"',
      align: 'center',
      lineSpacing: 6,
      wordWrap: { width: 760 }
    }).setOrigin(0.5)

    // --- Изменения шкал ---
    const pd = choice.progressDelta
    const ad = choice.angerDelta
    const sd = choice.stressDelta
    this.add.text(640, 520,
      `Прогресс ${pd >= 0 ? '+' : ''}${pd}%   Инвесторы ${ad >= 0 ? '+' : ''}${ad}%   Стресс ${sd >= 0 ? '+' : ''}${sd}%`, {
      fontSize: '8px', color: '#888888', fontFamily: '"Press Start 2P"'
    }).setOrigin(0.5)

    // --- Кнопки ---
    const isLast    = gameState.step >= 7
    const isGameOver = gameState.anger >= 100
    const btnLabel  = (isLast || isGameOver) ? (isGameOver ? 'ИГРА ОКОНЧЕНА' : 'РЕЗУЛЬТАТ') : 'ДАЛЕЕ →'
    const btnColor  = isGameOver ? 0xff4444 : 0x00d4ff

    const btn = this.add.rectangle(490, 590, 260, 48, btnColor).setInteractive({ useHandCursor: true })
    this.add.text(490, 590, btnLabel, {
      fontSize: '10px', color: '#1a1a2e', fontFamily: '"Press Start 2P"'
    }).setOrigin(0.5)

    btn.on('pointerover', () => btn.setFillStyle(isGameOver ? 0xcc2222 : 0x0099bb))
    btn.on('pointerout',  () => btn.setFillStyle(btnColor))
    btn.on('pointerdown', () => {
      if (isLast || isGameOver) {
        this.scene.stop('GameScene')
        this.scene.start('FinalScene', { gameState })
      } else {
        this.scene.stop()
        this.scene.resume('GameScene')
      }
    })

    if (choice.reference) {
      const refBtn = this.add.rectangle(800, 590, 240, 48, 0x1a1a3a).setInteractive({ useHandCursor: true })
      refBtn.setStrokeStyle(2, 0x4499ff)
      this.add.text(800, 590, '📖 СПРАВОЧНИК', {
        fontSize: '9px', color: '#4499ff', fontFamily: '"Press Start 2P"'
      }).setOrigin(0.5)

      refBtn.on('pointerover', () => refBtn.setFillStyle(0x2a2a5a))
      refBtn.on('pointerout',  () => refBtn.setFillStyle(0x1a1a3a))
      refBtn.on('pointerdown', () => {
        this.scene.launch('ReferenceScene', { reference: choice.reference })
      })
    }
  }

  getBotPhraseCorrect() {
    const phrases = [
      'Отличное решение!\nТак и работает DevOps.',
      'Именно! Ты мыслишь\nкак настоящий DevOps-инженер.',
      'Верно. Автоматизация\nрешает эту задачу.',
      'Правильно! Процесс\nважнее героизма.'
    ]
    return phrases[Math.floor(Math.random() * phrases.length)]
  }

  getBotPhraseWrong() {
    const phrases = [
      'Не совсем. Давай\nразберём почему.',
      'Это частая ошибка.\nЗапомни на будущее.',
      'Так делают многие.\nНо есть лучший путь.',
      'Ручные процессы —\nисточник проблем.'
    ]
    return phrases[Math.floor(Math.random() * phrases.length)]
  }
}
