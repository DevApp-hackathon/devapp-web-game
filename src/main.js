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
    this.load.image('start-bg', './src/assets/Late-night laptop session with snacks.png')
  }

  create() {
    // Фон
    const bg = this.add.image(640, 360, 'start-bg')
    bg.setScale(Math.max(1280 / bg.width, 720 / bg.height))

    // Тёмный оверлей слева для читаемости текста
    const grad = this.add.graphics()
    grad.fillStyle(0x0d0d1a, 0.75)
    grad.fillRect(0, 0, 520, 720)

    // Заголовок — крупный, с жирным контуром как на картинке
    this.add.text(60, 100, 'DevOps\nStartup', {
      fontSize: '64px',
      color: '#f0e6c8',
      fontFamily: '"Press Start 2P"',
      stroke: '#000000',
      strokeThickness: 8,
      lineSpacing: 12
    }).setOrigin(0, 0)

    // Подзаголовок
    this.add.text(64, 295, 'Build · Test · Deploy', {
      fontSize: '13px',
      color: '#aaaacc',
      fontFamily: '"Press Start 2P"',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0, 0)

    // Кнопка — скруглённая, как в референсе
    const makeBtn = (y, label, color, hoverColor, action) => {
      const g = this.add.graphics()
      const btnX = 60, btnW = 360, btnH = 54

      const drawBtn = (fill) => {
        g.clear()
        g.fillStyle(fill, 1)
        g.fillRoundedRect(btnX, y - btnH / 2, btnW, btnH, 10)
        g.lineStyle(2, 0x555577, 1)
        g.strokeRoundedRect(btnX, y - btnH / 2, btnW, btnH, 10)
      }
      drawBtn(color)

      const zone = this.add.zone(btnX + btnW / 2, y, btnW, btnH).setInteractive({ useHandCursor: true })
      const txt = this.add.text(btnX + 22, y, label, {
        fontSize: '14px', color: '#ffffff', fontFamily: '"Press Start 2P"'
      }).setOrigin(0, 0.5)

      zone.on('pointerover', () => { drawBtn(hoverColor); txt.setColor('#00d4ff') })
      zone.on('pointerout',  () => { drawBtn(color);      txt.setColor('#ffffff') })
      zone.on('pointerdown', action)
    }

    makeBtn(390, 'НОВАЯ ИГРА', 0x2a2a4a, 0x3a3a6a, () => this.scene.start('IntroScene'))
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
