import './quest-laptop.js'
import './planning.js'
import './quest-engine.js'

import Phaser from 'phaser'
import { scenarios } from './scenarios.js'
// Делаем данные сценариев доступными глобально для GameScene
window._scenarioData = scenarios[0].choices
// Все сценарии по id для quest-engine
window._allScenarioData = {}
scenarios.forEach(s => { window._allScenarioData[s.id] = s.choices })
import GameScene from './scenes/GameScene.js'
import SituationScene from './scenes/SituationScene.js'
import FeedbackScene from './scenes/FeedbackScene.js'
import IntroScene from './scenes/IntroScene.js'
import TaskOrderScene from './scenes/TaskOrderScene.js'
import FinalScene from './scenes/FinalScene.js'

// ---- Стартовый экран ----
class StartScene extends Phaser.Scene {
  constructor() {
    super('StartScene')
  }

  preload() {
    this.load.image('start-bg', 'assets/bg-start.png')
    // this.load.image('start-bg', '/public/assets/bg-start.png')
  }

  create() {
    // Фон — растягиваем на весь канвас 1280x720
    const bg = this.add.image(640, 360, 'start-bg')
    bg.setScale(Math.max(1280 / bg.width, 720 / bg.height))

    // Заголовок
    this.add.text(330, 130, 'DevOps Startup', {
      fontSize: '28px',
      color: '#1a1a1a',
      fontFamily: '"Press Start 2P"'
    }).setOrigin(0.5)

    // Подзаголовок
    this.add.text(330, 178, 'Build · Test · Deploy', {
      fontSize: '11px',
      color: '#444444',
      fontFamily: '"Press Start 2P"'
    }).setOrigin(0.5)

    // Кнопка Start
    const btnBg = this.add.rectangle(330, 275, 235, 54, 0x1a1a1a).setInteractive({ useHandCursor: true })
    const btnText = this.add.text(330, 275, 'Start', {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: '"Press Start 2P"'
    }).setOrigin(0.5)

    btnBg.on('pointerover', () => { btnBg.setFillStyle(0x333333); btnText.setColor('#00d4ff') })
    btnBg.on('pointerout', () => { btnBg.setFillStyle(0x1a1a1a); btnText.setColor('#ffffff') })
    btnBg.on('pointerdown', () => this.scene.start('IntroScene'))
  }
}

// ---- Конфиг ----
const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 }, debug: false }
  },
  scene: [StartScene, IntroScene, TaskOrderScene, GameScene, SituationScene, FeedbackScene, FinalScene]
}

new Phaser.Game(config)
