import Phaser from 'phaser'

// Правильный порядок задач
const TASKS = [
  { id: 0, text: 'Настроить\nCI/CD', color: 0x00aaff },
  { id: 1, text: 'Написать\nавтотесты', color: 0x00cc77 },
  { id: 2, text: 'Автоматизировать\nсборку', color: 0xffaa00 },
  { id: 3, text: 'Настроить\nлогирование', color: 0xaa44ff },
  { id: 4, text: 'Подключить\nмониторинг', color: 0xff4488 },
  { id: 5, text: 'Выстроить\nprocess релиза', color: 0x44ddff },
  { id: 6, text: 'Финальный\nдеплой', color: 0xff8800 },
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default class TaskOrderScene extends Phaser.Scene {
  constructor() {
    super('TaskOrderScene')
  }

  minigameFont(fontSize) {
    const baseSize = Number.parseInt(fontSize, 10)
    return Number.isFinite(baseSize) ? `${baseSize + 4}px` : fontSize
  }

  create() {
    this.slots = []       // правый столбец: { x, y, task: null, graphics }
    this.cards = []       // карточки
    this.dragCard = null

    // Фон
    this.add.rectangle(640, 360, 1280, 720, 0x0d0d1f)

    // Заголовок
    this.add.text(640, 35, 'ПЛАН НА ДЕНЬ', {
      fontSize: this.minigameFont('16px'),
      color: '#00d4ff',
      fontFamily: '"Press Start 2P"'
    }).setOrigin(0.5)

    this.add.text(640, 72, 'Расставь задачи в правильном порядке', {
      fontSize: this.minigameFont('8px'),
      color: '#888888',
      fontFamily: '"Press Start 2P"'
    }).setOrigin(0.5)

    // Заголовки столбцов
    this.add.rectangle(300, 105, 240, 34, 0x1a1a3e).setStrokeStyle(1, 0x333366)
    this.add.text(300, 105, 'ЗАДАЧИ', {
      fontSize: this.minigameFont('10px'),
      color: '#aaaaaa',
      fontFamily: '"Press Start 2P"'
    }).setOrigin(0.5)

    this.add.rectangle(900, 105, 240, 34, 0x1a2e1a).setStrokeStyle(1, 0x336633)
    this.add.text(900, 105, 'МОЙ ПЛАН', {
      fontSize: this.minigameFont('10px'),
      color: '#aaaaaa',
      fontFamily: '"Press Start 2P"'
    }).setOrigin(0.5)

    // Создаём слоты (правый столбец)
    const slotX = 900
    TASKS.forEach((_, i) => {
      const y = 140 + i * 70
      const bg = this.add.rectangle(slotX, y, 240, 56, 0x111122)
        .setStrokeStyle(1, 0x333355)
      this.add.text(slotX - 100, y, `${i + 1}.`, {
        fontSize: this.minigameFont('9px'),
        color: '#444466',
        fontFamily: '"Press Start 2P"'
      }).setOrigin(0, 0.5)
      this.slots.push({ x: slotX, y, task: null, bg })
    })

    // Создаём карточки (левый столбец, перемешанные)
    const shuffled = shuffle(TASKS)
    const cardX = 300
    shuffled.forEach((task, i) => {
      const y = 140 + i * 70
      this.createCard(task, cardX, y)
    })

    // Кнопка проверить
    const checkBtn = this.add.rectangle(640, 660, 240, 46, 0x00d4ff).setInteractive()
    this.add.text(640, 660, 'ПРОВЕРИТЬ', {
      fontSize: this.minigameFont('12px'),
      color: '#0d0d1f',
      fontFamily: '"Press Start 2P"'
    }).setOrigin(0.5)
    checkBtn.on('pointerover', () => checkBtn.setFillStyle(0x0099bb))
    checkBtn.on('pointerout', () => checkBtn.setFillStyle(0x00d4ff))
    checkBtn.on('pointerdown', () => this.checkOrder())

    // Подсказка
    this.add.text(640, 625, 'Перетащи карточки в правый столбец', {
      fontSize: this.minigameFont('7px'),
      color: '#444466',
      fontFamily: '"Press Start 2P"'
    }).setOrigin(0.5)
  }

  createCard(task, x, y) {
    const container = this.add.container(x, y)

    const bg = this.add.rectangle(0, 0, 220, 50, task.color, 0.85)
      .setStrokeStyle(2, 0xffffff)
      .setInteractive()

    const label = this.add.text(0, 0, task.text, {
      fontSize: this.minigameFont('9px'),
      color: '#ffffff',
      fontFamily: '"Press Start 2P"',
      align: 'center',
      lineSpacing: 4
    }).setOrigin(0.5)

    container.add([bg, label])
    container.setSize(220, 50)
    container.setInteractive()
    this.input.setDraggable(container)

    container.taskData = task
    container.homeX = x
    container.homeY = y
    container.slotIndex = null

    container.on('dragstart', () => {
      container.setDepth(100)
      // Освобождаем слот если была карточка
      if (container.slotIndex !== null) {
        this.slots[container.slotIndex].task = null
        this.slots[container.slotIndex].bg.setStrokeStyle(1, 0x333355)
        container.slotIndex = null
      }
    })

    container.on('drag', (pointer, dragX, dragY) => {
      container.x = dragX
      container.y = dragY
    })

    container.on('dragend', () => {
      container.setDepth(1)
      const slot = this.getNearestFreeSlot(container.x, container.y)
      if (slot) {
        container.x = slot.x
        container.y = slot.y
        slot.task = container.taskData
        slot.bg.setStrokeStyle(2, container.taskData.color)
        container.slotIndex = this.slots.indexOf(slot)
      } else {
        // Вернуть домой
        container.x = container.homeX
        container.y = container.homeY
      }
    })

    this.cards.push(container)
  }

  getNearestFreeSlot(x, y) {
    let best = null
    let bestDist = 80 // порог притяжения
    this.slots.forEach(slot => {
      if (slot.task !== null) return
      const dist = Phaser.Math.Distance.Between(x, y, slot.x, slot.y)
      if (dist < bestDist) {
        bestDist = dist
        best = slot
      }
    })
    return best
  }

  checkOrder() {
    // Проверяем заполнены ли все слоты
    const filled = this.slots.filter(s => s.task !== null)
    if (filled.length < TASKS.length) {
      this.showMessage('Расставь все задачи\nв правый столбец!', '#ffaa00')
      return
    }

    // Проверяем порядок
    let errors = []
    this.slots.forEach((slot, i) => {
      if (slot.task.id !== TASKS[i].id) {
        errors.push(i)
      }
    })

    if (errors.length === 0) {
      this.showSuccess()
    } else {
      this.showErrors(errors)
    }
  }

  showMessage(text, color) {
    const existing = this.children.getByName('msg')
    if (existing) existing.destroy()
    const msg = this.add.text(640, 600, text, {
      fontSize: this.minigameFont('10px'),
      color,
      fontFamily: '"Press Start 2P"',
      align: 'center',
      lineSpacing: 6,
      backgroundColor: '#000000',
      padding: { x: 10, y: 6 }
    }).setOrigin(0.5).setName('msg').setDepth(50)
    this.time.delayedCall(2000, () => msg.destroy())
  }

  showSuccess() {
    this.children.removeAll(true)
    this.add.rectangle(640, 360, 1280, 720, 0x0d1f0d)
    this.add.text(640, 240, '✓ ВЕРНО!', {
      fontSize: this.minigameFont('28px'), color: '#00ff88', fontFamily: '"Press Start 2P"'
    }).setOrigin(0.5)
    this.add.text(640, 340, 'Ты знаешь правильный\nпорядок DevOps-задач.\nВперёд — применяй это в офисе!', {
      fontSize: this.minigameFont('11px'), color: '#ffffff', fontFamily: '"Press Start 2P"',
      align: 'center', lineSpacing: 10
    }).setOrigin(0.5)

    const btn = this.add.rectangle(640, 470, 260, 52, 0x00ff88).setInteractive()
    this.add.text(640, 470, 'В ОФИС! →', {
      fontSize: this.minigameFont('13px'), color: '#0d1f0d', fontFamily: '"Press Start 2P"'
    }).setOrigin(0.5)
    btn.on('pointerdown', () => this.scene.start('GameScene'))
  }

  showErrors(errorIndices) {
    this.children.removeAll(true)
    this.add.rectangle(640, 360, 1280, 720, 0x1f0d0d)

    this.add.text(640, 35, 'НЕ СОВСЕМ...', {
      fontSize: this.minigameFont('16px'), color: '#ff4444', fontFamily: '"Press Start 2P"'
    }).setOrigin(0.5)

    this.add.text(640, 75, 'Правильный порядок DevOps-задач:', {
      fontSize: this.minigameFont('8px'), color: '#aaaaaa', fontFamily: '"Press Start 2P"'
    }).setOrigin(0.5)

    TASKS.forEach((task, i) => {
      const isError = errorIndices.includes(i)
      const y = 120 + i * 62
      this.add.rectangle(640, y, 660, 48, isError ? 0x3a0a0a : 0x0a1a0a)
        .setStrokeStyle(1, isError ? 0xff4444 : 0x00aa44)
      this.add.text(320, y, `${i + 1}.`, {
        fontSize: this.minigameFont('9px'), color: isError ? '#ff4444' : '#00aa44', fontFamily: '"Press Start 2P"'
      }).setOrigin(0, 0.5)
      this.add.text(660, y, task.text.replace('\n', ' '), {
        fontSize: this.minigameFont('9px'), color: isError ? '#ff8888' : '#88ff88', fontFamily: '"Press Start 2P"', lineSpacing: 4
      }).setOrigin(0.5)
      if (isError) {
        this.add.text(940, y, '← ошибка', {
          fontSize: this.minigameFont('7px'), color: '#ff4444', fontFamily: '"Press Start 2P"'
        }).setOrigin(0, 0.5)
      }
    })

    const btn = this.add.rectangle(640, 660, 260, 46, 0xff4444).setInteractive()
    this.add.text(640, 660, 'ПОПРОБОВАТЬ', {
      fontSize: this.minigameFont('10px'), color: '#ffffff', fontFamily: '"Press Start 2P"'
    }).setOrigin(0.5)
    btn.on('pointerover', () => btn.setFillStyle(0xcc2222))
    btn.on('pointerout', () => btn.setFillStyle(0xff4444))
    btn.on('pointerdown', () => this.scene.restart())
  }
}
