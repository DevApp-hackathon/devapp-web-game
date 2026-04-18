import Phaser from 'phaser'
import { REFS } from '../references.js'

export default class ReferenceScene extends Phaser.Scene {
  constructor() {
    super('ReferenceScene')
  }

  init(data) {
    this.reference = data.reference || null
    this.fromGame  = data.fromGame  || false
  }

  glossaryFont(fontSize) {
    const baseSize = Number.parseInt(fontSize, 10)
    return Number.isFinite(baseSize) ? `${baseSize + 4}px` : fontSize
  }

  create() {
    if (this.reference) {
      this.showReference(this.reference)
    } else {
      this.showPicker()
    }
  }

  // ── Экран выбора темы ──────────────────────────────────────────
  showPicker() {
    this.children.removeAll(true)

    const panelX = 640
    const panelY = 360
    const panelW = 900
    const panelH = 640
    const innerW = 840

    this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.88)
    const panel = this.add.rectangle(panelX, panelY, panelW, panelH, 0x0d0d1f)
    panel.setStrokeStyle(2, 0x4499ff)

    this.add.text(640, 78, '📖 ГЛОССАРИЙ', {
      fontSize: this.glossaryFont('14px'), color: '#4499ff', fontFamily: '"Press Start 2P"'
    }).setOrigin(0.5)

    this.add.text(640, 112, 'Выбери тему', {
      fontSize: this.glossaryFont('9px'), color: '#666688', fontFamily: '"Press Start 2P"'
    }).setOrigin(0.5)

    this.add.rectangle(640, 134, innerW, 1, 0x333366)

    const topics = Object.values(REFS)
    const cols = 2
    const gapX = 20
    const btnW = (innerW - gapX) / cols
    const btnH = 66
    const gridLeft = panelX - innerW / 2
    const startY = 152

    topics.forEach((ref, i) => {
      const col = i % cols
      const row = Math.floor(i / cols)
      const x = gridLeft + btnW / 2 + col * (btnW + gapX)
      const y = startY + row * (btnH + 10) + btnH / 2

      const bg = this.add.rectangle(x, y, btnW, btnH, 0x12122a)
        .setStrokeStyle(2, Phaser.Display.Color.HexStringToColor(ref.color).color)
        .setInteractive({ useHandCursor: true })

      this.add.text(x, y - 10, ref.title, {
        fontSize: this.glossaryFont('9px'), color: ref.color, fontFamily: '"Press Start 2P"',
        wordWrap: { width: btnW - 20 }, align: 'center'
      }).setOrigin(0.5)

      this.add.text(x, y + 16, `${ref.items.length} терминов`, {
        fontSize: this.glossaryFont('7px'), color: '#555577', fontFamily: '"Press Start 2P"'
      }).setOrigin(0.5)

      bg.on('pointerover',  () => bg.setFillStyle(0x1e1e40))
      bg.on('pointerout',   () => bg.setFillStyle(0x12122a))
      bg.on('pointerdown',  () => { this.reference = ref; this.showReference(ref) })
    })

    const closeBtn = this.add.rectangle(640, 668, 260, 44, 0x1a1a3a)
      .setStrokeStyle(2, 0x4499ff)
      .setInteractive({ useHandCursor: true })
    this.add.text(640, 668, '✕ ЗАКРЫТЬ', {
      fontSize: this.glossaryFont('11px'), color: '#4499ff', fontFamily: '"Press Start 2P"'
    }).setOrigin(0.5)

    closeBtn.on('pointerover',  () => closeBtn.setFillStyle(0x2a2a5a))
    closeBtn.on('pointerout',   () => closeBtn.setFillStyle(0x1a1a3a))
    closeBtn.on('pointerdown',  () => this.scene.stop())
  }

  // ── Экран чтения справочника ───────────────────────────────────
  showReference(reference) {
    this.children.removeAll(true)

    this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.88)
    const panel = this.add.rectangle(640, 360, 900, 640, 0x0d0d1f)
    panel.setStrokeStyle(2, 0x4499ff)

    this.add.text(640, 78, '📖 МИНИ-СПРАВОЧНИК', {
      fontSize: this.glossaryFont('12px'), color: '#4499ff', fontFamily: '"Press Start 2P"'
    }).setOrigin(0.5)

    this.add.text(640, 114, reference.title, {
      fontSize: this.glossaryFont('16px'), color: reference.color || '#ffffff', fontFamily: '"Press Start 2P"'
    }).setOrigin(0.5)

    this.add.rectangle(640, 142, 840, 1, 0x333366)

    const startY = 156
    const itemH = 94

    reference.items.forEach((item, i) => {
      const cy = startY + i * itemH + itemH / 2
      this.add.rectangle(640, cy, 840, itemH - 8, 0x12122a).setStrokeStyle(1, 0x222255)
      this.add.text(258, cy - 18, item.term, {
        fontSize: this.glossaryFont('10px'), color: '#00d4ff', fontFamily: '"Press Start 2P"'
      })
      this.add.text(640, cy + 12, item.desc, {
        fontSize: this.glossaryFont('9px'), color: '#aaaacc', fontFamily: '"Press Start 2P"',
        align: 'center', wordWrap: { width: 780 }, lineSpacing: 5
      }).setOrigin(0.5)
    })

    // Кнопки снизу
    if (this.fromGame) {
      // Открыто из глоссария — кнопка «← ТЕМЫ»
      const backBtn = this.add.rectangle(510, 646, 240, 44, 0x1a1a3a)
        .setStrokeStyle(2, 0x555577)
        .setInteractive({ useHandCursor: true })
      this.add.text(510, 646, '← ТЕМЫ', {
        fontSize: this.glossaryFont('11px'), color: '#888899', fontFamily: '"Press Start 2P"'
      }).setOrigin(0.5)
      backBtn.on('pointerover',  () => backBtn.setFillStyle(0x2a2a4a))
      backBtn.on('pointerout',   () => backBtn.setFillStyle(0x1a1a3a))
      backBtn.on('pointerdown',  () => { this.reference = null; this.showPicker() })

      const closeBtn = this.add.rectangle(790, 646, 240, 44, 0x1a1a3a)
        .setStrokeStyle(2, 0x4499ff)
        .setInteractive({ useHandCursor: true })
      this.add.text(790, 646, '✕ ЗАКРЫТЬ', {
        fontSize: this.glossaryFont('11px'), color: '#4499ff', fontFamily: '"Press Start 2P"'
      }).setOrigin(0.5)
      closeBtn.on('pointerover',  () => closeBtn.setFillStyle(0x2a2a5a))
      closeBtn.on('pointerout',   () => closeBtn.setFillStyle(0x1a1a3a))
      closeBtn.on('pointerdown',  () => this.scene.stop())
    } else {
      // Открыто из FeedbackScene — только закрыть
      const closeBtn = this.add.rectangle(640, 646, 260, 44, 0x1a1a3a)
        .setStrokeStyle(2, 0x4499ff)
        .setInteractive({ useHandCursor: true })
      this.add.text(640, 646, '✕ ЗАКРЫТЬ', {
        fontSize: this.glossaryFont('11px'), color: '#4499ff', fontFamily: '"Press Start 2P"'
      }).setOrigin(0.5)
      closeBtn.on('pointerover',  () => closeBtn.setFillStyle(0x2a2a5a))
      closeBtn.on('pointerout',   () => closeBtn.setFillStyle(0x1a1a3a))
      closeBtn.on('pointerdown',  () => this.scene.stop())
    }
  }
}
