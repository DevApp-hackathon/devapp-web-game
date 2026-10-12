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
import ReferenceScene from './scenes/ReferenceScene.js'
import TutorialScene from './scenes/TutorialScene.js'
import TaskOrderScene from './scenes/TaskOrderScene.js'
import FinalScene from './scenes/FinalScene.js'
import SandboxScene from './scenes/SandboxScene.js'

const GAME_WIDTH = 1280
const GAME_HEIGHT = 720

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
    const bg = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'start-bg')
    bg.setScale(Math.max(GAME_WIDTH / bg.width, GAME_HEIGHT / bg.height))

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

    makeBtn(390, 'ИГРАТЬ', 0x2a2a4a, 0x3a3a6a, () => this.scene.start('GameScene'))

    this.add.text(64, 450, 'Ты — основатель стартапа.\nНаписал первую версию продукта.\nИнвесторы вложили деньги и ждут результата.\nУ тебя есть офис и 7 шагов до релиза.', {
      fontSize: '13px',
      color: '#888899',
      fontFamily: '"Press Start 2P"',
      lineSpacing: 10,
      wordWrap: { width: 400 }
    }).setOrigin(0, 0)
  }
}

// ---- Конфиг   ----
const config = {
  type: Phaser.AUTO,
  parent: 'game-root',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  pixelArt: true,
  antialias: false,
  roundPixels: true,
  autoRound: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT
  },
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 }, debug: false }
  },
  scene: [StartScene, TutorialScene, TaskOrderScene, GameScene, SituationScene, FeedbackScene, ReferenceScene, SandboxScene, FinalScene]
}

new Phaser.Game(config)

// Закрытие квест-оверлея по Escape
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return
  const overlay = document.getElementById('quest-overlay')
  if (overlay && overlay.style.display !== 'none') {
    document.getElementById('quest-close').click()
  }
})
