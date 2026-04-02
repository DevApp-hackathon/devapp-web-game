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

    // --- DevBot аватар ---
    const botX = 200
    const botY = 150

    // Тело робота
    this.add.rectangle(botX, botY, 64, 64, 0x1a1a3e).setStrokeStyle(2, isCorrect ? 0x00ff88 : 0xff4444)
    // Глаза
    this.add.rectangle(botX - 14, botY - 8, 12, 10, isCorrect ? 0x00ff88 : 0xff4444)
    this.add.rectangle(botX + 14, botY - 8, 12, 10, isCorrect ? 0x00ff88 : 0xff4444)
    // Рот
    this.add.rectangle(botX, botY + 14, 28, 6, isCorrect ? 0x00ff88 : 0xff6644)
    // Антенна
    this.add.rectangle(botX, botY - 42, 4, 16, 0x888888)
    this.add.circle(botX, botY - 52, 6, isCorrect ? 0x00ff88 : 0xff4444)
    // Имя
    this.add.text(botX, botY + 46, 'DevBot', {
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

    // --- Кнопка ---
    const isLast = gameState.step >= 7
    const btnLabel = isLast ? 'РЕЗУЛЬТАТ' : 'ДАЛЕЕ →'
    const btn = this.add.rectangle(640, 590, 260, 48, 0x00d4ff).setInteractive()
    this.add.text(640, 590, btnLabel, {
      fontSize: '12px', color: '#1a1a2e', fontFamily: '"Press Start 2P"'
    }).setOrigin(0.5)

    btn.on('pointerover', () => btn.setFillStyle(0x0099bb))
    btn.on('pointerout',  () => btn.setFillStyle(0x00d4ff))
    btn.on('pointerdown', () => {
      if (isLast) {
        this.scene.stop('GameScene')
        this.scene.start('FinalScene', { gameState })
      } else {
        this.scene.stop()
        this.scene.resume('GameScene')
      }
    })
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
