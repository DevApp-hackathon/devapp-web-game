import Phaser from 'phaser'

const scenarios = window.QUEST_DATA

export default class SituationScene extends Phaser.Scene {
  constructor() {
    super('SituationScene')
  }

  init(data) {
    this.scenarioId = data.id
    this.gameState = data.gameState
  }

  create() {
    const scenario = scenarios[this.scenarioId]
    if (!scenario) {
      this.closeScene()
      return
    }

    // Затемнение фона
    this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.75)

    // Панель
    const panel = this.add.rectangle(640, 360, 860, 560, 0x1a1a2e)
    panel.setStrokeStyle(2, 0x00d4ff)

    // Крестик закрытия
    const closeBtn = this.add.text(1050, 90, '✕', {
      fontSize: '18px',
      color: '#888888',
      fontFamily: '"Press Start 2P"'
    }).setOrigin(0.5).setInteractive()
    closeBtn.on('pointerover', () => closeBtn.setColor('#ff4444'))
    closeBtn.on('pointerout', () => closeBtn.setColor('#888888'))
    closeBtn.on('pointerdown', () => this.closeScene())

    // Заголовок
    this.add.text(640, 100, scenario.title, {
      fontSize: '16px',
      color: '#00d4ff',
      fontFamily: '"Press Start 2P"'
    }).setOrigin(0.5)

    // Ситуация
    this.add.text(640, 185, scenario.situation, {
      fontSize: '11px',
      color: '#ffffff',
      fontFamily: '"Press Start 2P"',
      align: 'center',
      lineSpacing: 8
    }).setOrigin(0.5)

    // Варианты
    scenario.choices.forEach((choice, i) => {
      const btnY = 310 + i * 90
      const btn = this.add.rectangle(640, btnY, 720, 70, 0x2a2a4a).setInteractive()
      btn.setStrokeStyle(1, 0x444466)

      this.add.text(640, btnY, choice.text, {
        fontSize: '10px',
        color: '#ffffff',
        fontFamily: '"Press Start 2P"',
        align: 'center',
        lineSpacing: 6
      }).setOrigin(0.5)

      btn.on('pointerover', () => btn.setFillStyle(0x3a3a6a))
      btn.on('pointerout', () => btn.setFillStyle(0x2a2a4a))
      btn.on('pointerdown', () => this.onChoice(choice))
    })
  }

  onChoice(choice) {
    // Применяем эффекты
    this.gameState.progress = Math.max(0, Math.min(100, this.gameState.progress + choice.progressDelta))
    this.gameState.anger = Math.max(0, Math.min(100, this.gameState.anger + choice.angerDelta))
    this.gameState.stress = Math.max(0, Math.min(100, this.gameState.stress + choice.stressDelta))
    this.gameState.step++

    // Показываем обратную связь
    this.scene.start('FeedbackScene', {
      choice,
      gameState: this.gameState
    })
  }

  closeScene() {
    this.scene.stop()
    this.scene.resume('GameScene')
  }
}
