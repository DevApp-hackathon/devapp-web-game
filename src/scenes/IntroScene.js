import Phaser from 'phaser'

const slides = [
  {
    bot: 'Каждое решение имеет\nпоследствия.',
    text: 'Следи за двумя шкалами:\n🟢 Прогресс проекта — расти его\n🔴 Недовольство инвесторов — снижай',
    color: '#ffdd00'
  },
  {
    bot: 'Как играть?',
    text: 'Ходи по офису: WASD или стрелки.\nПодходи к объектам — появится\nподсказка [E]. Нажми E для действия.',
    color: '#00ff88'
  },
  {
    bot: 'Свобода выбора —\nно есть логика.',
    text: 'Квесты можно проходить в любом порядке.\nНо если хочешь понять DevOps как систему —\nначни с Доски задач и двигайся\nпо пути настоящего продуктового релиза.',
    color: '#00d4ff'
  },
  {
    bot: 'И последнее...',
    text: 'Не забывай о себе:\nкофе, цветы и диван снижают стресс.\nВысокий стресс мешает думать чётко.',
    color: '#ff8866'
  }
]

export default class IntroScene extends Phaser.Scene {
  constructor() {
    super('IntroScene')
    this.slideIndex = 0
  }

  preload() {
    this.load.image('devbot', './src/assets/DevBot.png')
  }

  create() {
    this.slideIndex = 0
    this.renderSlide()
  }

  renderSlide() {
    this.children.removeAll(true)

    const slide = slides[this.slideIndex]
    const isLast = this.slideIndex === slides.length - 1

    // Фон
    this.add.rectangle(640, 360, 1280, 720, 0x0d0d1f)

    // Точки прогресса
    slides.forEach((_, i) => {
      this.add.circle(600 + i * 22, 675, 5, i === this.slideIndex ? 0x00d4ff : 0x333355)
    })

    // DevBot аватар
    const botX = 130
    const botY = 270

    this.add.image(botX, botY, 'devbot').setDisplaySize(108, 108)
    this.add.text(botX, botY + 70, 'DevBot', {
      fontSize: '8px',
      color: '#888888',
      fontFamily: '"Press Start 2P"'
    }).setOrigin(0.5)

    // Речевой пузырь DevBot
    this.add.rectangle(700, 220, 560, 72, 0x1e1e3e).setStrokeStyle(1, slide.color)
    this.add.triangle(202, 235, 0, 0, 22, 0, 0, 22, 0x1e1e3e)
    this.add.text(700, 220, slide.bot, {
      fontSize: '11px',
      color: slide.color,
      fontFamily: '"Press Start 2P"',
      align: 'center',
      lineSpacing: 8
    }).setOrigin(0.5)

    // Основной текст
    this.add.rectangle(640, 430, 900, 130, 0x161628).setStrokeStyle(1, 0x333355)
    this.add.text(640, 430, slide.text, {
      fontSize: '12px',
      color: '#ffffff',
      fontFamily: '"Press Start 2P"',
      align: 'center',
      lineSpacing: 10,
      wordWrap: { width: 840 }
    }).setOrigin(0.5)

    // Кнопка
    const btnLabel = isLast ? 'В ОФИС! →' : 'ДАЛЕЕ →'
    const btnColor = isLast ? 0x00ff88 : 0x00d4ff
    const btn = this.add.rectangle(640, 570, 280, 52, btnColor).setInteractive()
    this.add.text(640, 570, btnLabel, {
      fontSize: '13px',
      color: '#0d0d1f',
      fontFamily: '"Press Start 2P"'
    }).setOrigin(0.5)

    btn.on('pointerover', () => btn.setFillStyle(isLast ? 0x00cc66 : 0x0099bb))
    btn.on('pointerout', () => btn.setFillStyle(btnColor))
    btn.on('pointerdown', () => {
      if (isLast) {
        this.scene.start('TutorialScene')
      } else {
        this.slideIndex++
        this.renderSlide()
      }
    })

    // Номер слайда
    this.add.text(1150, 675, `${this.slideIndex + 1}/${slides.length}`, {
      fontSize: '8px',
      color: '#444466',
      fontFamily: '"Press Start 2P"'
    }).setOrigin(0.5)
  }
}
