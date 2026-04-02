import Phaser from 'phaser'

export default class FinalScene extends Phaser.Scene {
  constructor() {
    super('FinalScene')
  }

  init(data) {
    this.gameState = data.gameState
  }

  create() {
    const { progress, anger } = this.gameState
    const cx = 640

    // Определяем результат
    let title, desc, color, botMsg
    if (progress >= 70 && anger < 50) {
      title = 'РЕЛИЗ УСПЕШЕН! 🚀'
      desc = 'Ты выстроил базовые DevOps-практики.\nПроект вышел стабильно, инвесторы\nвидят управляемый рост.'
      color = 0x00ff88
      botMsg = 'Так и работает DevOps!\nПроцессы — это основа\nуверенного роста.'
    } else if (anger >= 70) {
      title = 'ИНВЕСТОРЫ ВЫШЛИ'
      desc = 'Слишком много ошибок в процессах.\nРучные деплои, отсутствие мониторинга\nи игнорирование проблем стоили доверия.'
      color = 0xff4444
      botMsg = 'Не расстраивайся.\nТеперь ты знаешь что\nнадо было делать.'
    } else {
      title = 'ПРОЕКТ НА ГРАНИ'
      desc = 'Ты довёл проект до релиза,\nно процессы нестабильны.\nЕсть потенциал — нужен зрелый DevOps.'
      color = 0xffaa00
      botMsg = 'Неплохо! Но есть\nчто улучшить.\nDevOps — это путь.'
    }

    const colorHex = '#' + color.toString(16).padStart(6, '0')

    // Фон
    this.add.rectangle(cx, 360, 1280, 720, 0x0d0d1f)

    // DevBot
    const botX = 140
    const botY = 140
    this.add.rectangle(botX, botY, 72, 72, 0x1a1a3e).setStrokeStyle(2, color)
    this.add.rectangle(botX - 14, botY - 10, 12, 10, color)
    this.add.rectangle(botX + 14, botY - 10, 12, 10, color)
    this.add.rectangle(botX, botY + 14, 30, 7, color)
    this.add.rectangle(botX, botY - 48, 4, 16, 0x888888)
    this.add.circle(botX, botY - 58, 6, color)
    this.add.text(botX, botY + 46, 'DevBot', {
      fontSize: '8px', color: '#888', fontFamily: '"Press Start 2P"'
    }).setOrigin(0.5)

    // Речевой пузырь
    this.add.rectangle(700, 130, 580, 68, 0x1e1e3e).setStrokeStyle(1, color)
    this.add.triangle(222, 148, 0, 0, 20, 0, 0, 22, 0x1e1e3e)
    this.add.text(700, 130, botMsg, {
      fontSize: '10px', color: colorHex, fontFamily: '"Press Start 2P"',
      align: 'center', lineSpacing: 8
    }).setOrigin(0.5)

    // Заголовок
    this.add.text(cx, 230, title, {
      fontSize: '20px', color: colorHex, fontFamily: '"Press Start 2P"'
    }).setOrigin(0.5)

    // Описание
    this.add.text(cx, 320, desc, {
      fontSize: '10px', color: '#ffffff', fontFamily: '"Press Start 2P"',
      align: 'center', lineSpacing: 8, wordWrap: { width: 800 }
    }).setOrigin(0.5)

    // Шкалы итог
    const barY = 430
    this.add.text(cx, barY, 'ИТОГОВЫЙ РЕЗУЛЬТАТ', {
      fontSize: '9px', color: '#888888', fontFamily: '"Press Start 2P"'
    }).setOrigin(0.5)

    const barStartX = 380
    const barWidth  = 280

    // Прогресс
    this.add.text(barStartX - 200, barY + 35, 'Прогресс:', {
      fontSize: '8px', color: '#ffffff', fontFamily: '"Press Start 2P"'
    }).setOrigin(0, 0.5)
    this.add.rectangle(barStartX, barY + 35, barWidth, 14, 0x333333).setOrigin(0, 0.5)
    this.add.rectangle(barStartX, barY + 35, progress * barWidth / 100, 14, 0x00ff88).setOrigin(0, 0.5)
    this.add.text(barStartX + barWidth + 10, barY + 35, progress + '%', {
      fontSize: '8px', color: '#00ff88', fontFamily: '"Press Start 2P"'
    }).setOrigin(0, 0.5)

    // Недовольство
    this.add.text(barStartX - 200, barY + 65, 'Инвесторы:', {
      fontSize: '8px', color: '#ffffff', fontFamily: '"Press Start 2P"'
    }).setOrigin(0, 0.5)
    this.add.rectangle(barStartX, barY + 65, barWidth, 14, 0x333333).setOrigin(0, 0.5)
    this.add.rectangle(barStartX, barY + 65, anger * barWidth / 100, 14, 0xff4444).setOrigin(0, 0.5)
    this.add.text(barStartX + barWidth + 10, barY + 65, anger + '%', {
      fontSize: '8px', color: '#ff4444', fontFamily: '"Press Start 2P"'
    }).setOrigin(0, 0.5)

    // Кнопка играть снова
    const btn = this.add.rectangle(cx, 590, 280, 50, color).setInteractive()
    this.add.text(cx, 590, 'ИГРАТЬ СНОВА', {
      fontSize: '12px', color: '#0d0d1f', fontFamily: '"Press Start 2P"'
    }).setOrigin(0.5)
    btn.on('pointerover', () => btn.setAlpha(0.8))
    btn.on('pointerout', () => btn.setAlpha(1))
    btn.on('pointerdown', () => this.scene.start('StartScene'))
  }
}
