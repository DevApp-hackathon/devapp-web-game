import Phaser from 'phaser'

const SLIDES = [
  { key: 'office',    title: 'ИНТЕРФЕЙС\nОФИСА',       bot: 'Это твой\nDevOps-офис.\nЗдесь всё начинается.', desc: 'Офис разделён на зоны.\nКаждая зона — тема DevOps.\nДвигайся по офису и взаимодействуй\nс объектами, чтобы проходить квесты.' },
  { key: 'controls',  title: 'УПРАВЛЕНИЕ',              bot: 'Ходи и\nвзаимодействуй\nс объектами.',          desc: 'WASD или стрелки — движение.\nПодойди к объекту — появится [E].\nНажми E для взаимодействия.\n\nИЛИ просто кликни мышью\nна любой объект в офисе!' },
  { key: 'hud',       title: 'ШКАЛЫ\nПРОГРЕССА',        bot: 'Три шкалы внизу —\nтвой главный\nориентир.',      desc: 'ПРОГРЕСС — расти, проходя квесты.\nИНВЕСТОРЫ — снижай их гнев.\nСТРЕСС — снижай через отдых:\nкофе, диван, цветок, пинг-понг.' },
  { key: 'quest',     title: 'КАК РАБОТАЕТ\nКВЕСТ',     bot: 'Каждый квест —\nвыбор с реальными\nпоследствиями.', desc: 'Шаг 1 — ВВОДНАЯ: DevBot вводит в тему.\nШаг 2 — ВЫБОР: один из трёх путей.\nШаг 3 — МИ НИ-ЗАДАНИЕ: практика.\nШаг 4 — ФИДБЭК: объяснение.' },
  { key: 'minigames', title: 'ТИПЫ\nМИ НИ-ЗАДАНИЙ',    bot: 'Мини-задания\nзакрепляют\nрешение практикой.', desc: 'КЛИКЕР — кликай шаги процесса.\nТАЙМЕР — наблюдай последствия.\nКОНФИГ — выбери верные параметры.\nПУЗЫРИ — кликай баги.\nОЧЕРЕДЬ — расставь по порядку.' },
  { key: 'feedback',  title: 'ОБРАТНАЯ\nСВЯЗЬ',         bot: 'После каждого\nдействия — чёткое\nобъяснение.',    desc: 'Зелёная рамка — верное решение.\nКрасная рамка — ошибка.\nDevBot объясняет ПОЧЕМУ.\nКнопка 📖 СПРАВОЧНИК — подробнее.' },
  { key: 'glossary',  title: 'ГЛОССАРИЙ',               bot: 'Любой термин\nможно открыть\nв любой момент.',   desc: 'В правом нижнем углу — кнопка 📖.\nОткрывает глоссарий по 8 темам DevOps.\nДоступен в ЛЮБОЙ момент во время игры.\nКнопка ? открывает эту справку.' },
]

// Правая панель: x от 590 до 1270, центр x=930
const RX = 930
const RY = 360

export default class TutorialScene extends Phaser.Scene {
  constructor() {
    super('TutorialScene')
    this.slideIndex = 0
  }

  init(data) {
    this.fromGame = data?.fromGame || false
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
    const slide = SLIDES[this.slideIndex]
    const isLast = this.slideIndex === SLIDES.length - 1
    const col = this.slideColors[slide.key] || 0x00d4ff
    const hexCol = '#' + col.toString(16).padStart(6, '0')

    // ── Фон ───────────────────────────────────────────────────
    this.add.rectangle(640, 360, 1280, 720, 0x080814)

    // ── Левая панель ──────────────────────────────────────────
    this.add.rectangle(290, 360, 580, 720, 0x0d0d1f)
    this.add.rectangle(579, 360, 2, 720, 0x222244)

    // Заголовок
    this.add.text(290, 58, slide.title, {
      fontSize: '14px', color: hexCol, fontFamily: '"Press Start 2P"',
      align: 'center', lineSpacing: 8
    }).setOrigin(0.5)

    // DevBot
    const bx = 88, by = 168
    this.add.image(bx, by, 'devbot').setDisplaySize(96, 96)
    this.add.text(bx, by + 60, 'DevBot', { fontSize: '7px', color: '#666688', fontFamily: '"Press Start 2P"' }).setOrigin(0.5)

    // Речевой пузырь (правее бота, не перекрывает)
    this.add.rectangle(340, 168, 370, 96, 0x12122a).setStrokeStyle(1, col)
    this.add.triangle(156, 174, 0, 0, 18, 0, 0, 18, 0x12122a)
    this.add.text(340, 168, slide.bot, {
      fontSize: '11px', color: hexCol, fontFamily: '"Press Start 2P"',
      align: 'center', lineSpacing: 8
    }).setOrigin(0.5)

    // Описание
    this.add.rectangle(290, 430, 510, 210, 0x111130).setStrokeStyle(1, 0x222255)
    this.add.text(290, 430, slide.desc, {
      fontSize: '11px', color: '#ccccdd', fontFamily: '"Press Start 2P"',
      align: 'center', lineSpacing: 9, wordWrap: { width: 470 }
    }).setOrigin(0.5)

    // ── Правая панель (визуал) ─────────────────────────────────
    this[`draw_${slide.key}`]()

    // ── Нижняя панель навигации ────────────────────────────────
    this.add.rectangle(640, 692, 1280, 56, 0x0a0a18)
    this.add.rectangle(640, 664, 1280, 2, 0x1a1a2e)

    // Счётчик
    this.add.text(28, 692, `${this.slideIndex + 1}/${SLIDES.length}`, {
      fontSize: '8px', color: '#333355', fontFamily: '"Press Start 2P"'
    }).setOrigin(0, 0.5)

    // Прогресс-точки (центр правой половины: x≈930)
    const dotsStartX = 930 - (SLIDES.length - 1) * 14
    SLIDES.forEach((_, i) => {
      this.add.circle(dotsStartX + i * 28, 692, i === this.slideIndex ? 6 : 4,
        i === this.slideIndex ? col : 0x333355)
    })

    // Кнопка НАЗАД (левый нижний угол, скрыта на первом слайде)
    if (this.slideIndex > 0) {
      const backBtn = this.add.rectangle(80, 692, 120, 42, 0x1a1a2a)
        .setStrokeStyle(1, 0x333355)
        .setInteractive({ useHandCursor: true })
      this.add.text(80, 692, '← НАЗАД', {
        fontSize: '8px', color: '#555577', fontFamily: '"Press Start 2P"'
      }).setOrigin(0.5)
      backBtn.on('pointerover',  () => backBtn.setFillStyle(0x252535))
      backBtn.on('pointerout',   () => backBtn.setFillStyle(0x1a1a2a))
      backBtn.on('pointerdown',  () => { this.slideIndex--; this.renderSlide() })
    }

    // Пропустить / В игру
    const skipLabel = this.fromGame ? '← В ИГРУ' : 'ПРОПУСТИТЬ'
    const skipBtn = this.add.text(660, 692, skipLabel, {
      fontSize: '8px', color: '#333355', fontFamily: '"Press Start 2P"'
    }).setOrigin(0, 0.5).setInteractive({ useHandCursor: true })
    skipBtn.on('pointerover',  () => skipBtn.setColor('#7777aa'))
    skipBtn.on('pointerout',   () => skipBtn.setColor('#333355'))
    skipBtn.on('pointerdown',  () => this.goNext(true))

    // Кнопка ДАЛЕЕ / В ИГРУ
    const btnLabel = isLast ? (this.fromGame ? '← В ИГРУ' : 'В ИГРУ! →') : 'ДАЛЕЕ →'
    const btn = this.add.rectangle(1160, 692, 220, 42, 0x00ff88)
      .setInteractive({ useHandCursor: true })
    this.add.text(1160, 692, btnLabel, {
      fontSize: '10px', color: '#0d0d1f', fontFamily: '"Press Start 2P"'
    }).setOrigin(0.5)
    btn.on('pointerover',  () => btn.setFillStyle(0x00cc66))
    btn.on('pointerout',   () => btn.setFillStyle(0x00ff88))
    btn.on('pointerdown',  () => this.goNext(false))
  }

  goNext(skip) {
    if (skip || this.slideIndex >= SLIDES.length - 1) {
      this.fromGame ? this.scene.stop() : this.scene.start('GameScene')
    } else {
      this.slideIndex++
      this.renderSlide()
    }
  }

  get slideColors() {
    return { office: 0x00d4ff, controls: 0x00ff88, hud: 0x44ddff, quest: 0xffaa00, minigames: 0xaa44ff, feedback: 0x00ff88, glossary: 0x4499ff }
  }

  // ── Визуализации (все в правой панели: центр RX=930, RY=360) ──

  draw_office() {
    const W = 620, H = 460
    this.add.rectangle(RX, RY, W, H, 0x111122).setStrokeStyle(2, 0x222244)
    this.add.text(RX, RY - H / 2 - 16, 'КАРТА ОФИСА', { fontSize: '8px', color: '#334466', fontFamily: '"Press Start 2P"' }).setOrigin(0.5)

    const ox = RX - W / 2, oy = RY - H / 2
    const zones = [
      { col: 0, row: 0, w: 2, h: 2, color: 0x003366, label: 'Dev-зона',  sub: 'Ноутбук, Git' },
      { col: 2, row: 0, w: 2, h: 2, color: 0x330022, label: 'Ops-зона',  sub: 'Сервер, Мониторинг' },
      { col: 1, row: 1, w: 2, h: 2, color: 0x111133, label: 'Центр',     sub: 'Whiteboard, Телефон' },
      { col: 0, row: 2, w: 2, h: 2, color: 0x002200, label: 'Отдых',     sub: 'Кофе, Диван, Цветок' },
      { col: 2, row: 2, w: 2, h: 2, color: 0x331100, label: 'Деплой',    sub: 'Финальный квест' },
    ]
    const cw = W / 4, ch = H / 4
    zones.forEach(z => {
      const x = ox + z.col * cw + (z.w * cw) / 2
      const y = oy + z.row * ch + (z.h * ch) / 2
      const zw = z.w * cw - 8, zh = z.h * ch - 8
      this.add.rectangle(x, y, zw, zh, z.color).setStrokeStyle(1, 0x334455)
      this.add.text(x, y - 12, z.label, { fontSize: '8px', color: '#aabbcc', fontFamily: '"Press Start 2P"' }).setOrigin(0.5)
      this.add.text(x, y + 10, z.sub,   { fontSize: '6px', color: '#556677', fontFamily: '"Press Start 2P"', align: 'center', wordWrap: { width: zw - 10 } }).setOrigin(0.5)
    })
  }

  draw_controls() {
    const ks = 60  // key size
    this.add.rectangle(RX, RY - 30, 2, 560, 0x1a1a2e)

    // ── Блок клавиатуры (верхняя часть) ──────────────────────
    const kTop = RY - 160

    // WASD — центр (RX - 160)
    const wc = RX - 160
    const wasd = [
      { dx: 0,   dy: -ks, label: 'W' },
      { dx: -ks, dy: 0,   label: 'A' },
      { dx: 0,   dy: 0,   label: 'S' },
      { dx: ks,  dy: 0,   label: 'D' },
    ]
    wasd.forEach(k => {
      this.add.rectangle(wc + k.dx, kTop + k.dy, ks - 4, ks - 4, 0x1a1a3a).setStrokeStyle(2, 0x4499ff)
      this.add.text(wc + k.dx, kTop + k.dy, k.label, { fontSize: '18px', color: '#00d4ff', fontFamily: '"Press Start 2P"' }).setOrigin(0.5)
    })
    this.add.text(wc, kTop + ks + 16, 'WASD — движение', {
      fontSize: '9px', color: '#445577', fontFamily: '"Press Start 2P"'
    }).setOrigin(0.5)

    // Стрелки — центр (RX + 160), нарисованы вручную для единообразия
    const ac = RX + 160
    const arrowDirs = [
      { dx: 0,   dy: -ks, dir: 'up' },
      { dx: -ks, dy: 0,   dir: 'left' },
      { dx: 0,   dy: 0,   dir: 'down' },
      { dx: ks,  dy: 0,   dir: 'right' },
    ]
    const s = 12
    arrowDirs.forEach(a => {
      const ax = ac + a.dx, ay = kTop + a.dy
      this.add.rectangle(ax, ay, ks - 4, ks - 4, 0x161626).setStrokeStyle(1, 0x334466)
      // Вершины с bbox от (0,0) до (2s,2s), setOrigin(0.5) центрирует по (ax,ay)
      if (a.dir === 'up')    this.add.triangle(ax, ay,  s,0,   0,2*s, 2*s,2*s, 0x445577).setOrigin(0.5)
      if (a.dir === 'down')  this.add.triangle(ax, ay,  s,2*s, 0,0,   2*s,0,   0x445577).setOrigin(0.5)
      if (a.dir === 'left')  this.add.triangle(ax, ay,  0,s,   2*s,0, 2*s,2*s, 0x445577).setOrigin(0.5)
      if (a.dir === 'right') this.add.triangle(ax, ay,  2*s,s, 0,0,   0,2*s,   0x445577).setOrigin(0.5)
    })
    this.add.text(ac, kTop + ks + 16, 'стрелки — тоже', {
      fontSize: '9px', color: '#445577', fontFamily: '"Press Start 2P"'
    }).setOrigin(0.5)

    // ── Разделитель ────────────────────────────────────────────
    const divY = kTop + ks + 54
    this.add.rectangle(RX, divY, 560, 1, 0x222233)
    this.add.text(RX, divY, ' ИЛИ ', {
      fontSize: '9px', color: '#333355', fontFamily: '"Press Start 2P"', backgroundColor: '#080814'
    }).setOrigin(0.5)

    // ── Блок взаимодействия (нижняя часть) ────────────────────
    const iY = divY + 90

    // E клавиша
    const ex = RX - 160
    this.add.rectangle(ex, iY, 80, 80, 0x0d1f0d).setStrokeStyle(3, 0x00ff88)
    this.add.text(ex, iY, 'E', { fontSize: '30px', color: '#00ff88', fontFamily: '"Press Start 2P"' }).setOrigin(0.5)
    this.add.text(ex, iY + 82, 'подойди к объекту\nи нажми E', {
      fontSize: '9px', color: '#44aa66', fontFamily: '"Press Start 2P"',
      align: 'center', lineSpacing: 6
    }).setOrigin(0.5)

    // Мышь
    const mx = RX + 160
    const mw = 56, mh = 80
    this.add.rectangle(mx, iY, mw, mh, 0x0d0d1f).setStrokeStyle(3, 0xffaa00)
    this.add.rectangle(mx, iY - mh / 2 + 24, mw - 4, 1, 0xffaa00)
    this.add.circle(mx - 13, iY - mh / 2 + 13, 10, 0x111122)
    this.add.circle(mx + 13, iY - mh / 2 + 13, 10, 0xffaa00)
    this.add.text(mx, iY + 82, 'просто кликни\nна объект!', {
      fontSize: '9px', color: '#aa7722', fontFamily: '"Press Start 2P"',
      align: 'center', lineSpacing: 6
    }).setOrigin(0.5)
  }

  draw_hud() {
    const bw = 580
    this.add.text(RX, RY - 200, 'HUD — ШКАЛЫ ВНИЗУ ЭКРАНА', { fontSize: '8px', color: '#334466', fontFamily: '"Press Start 2P"' }).setOrigin(0.5)

    const bars = [
      { label: 'Прогресс:',  val: 65, color: 0x00ff88, textCol: '#00ff88', hint: '↑ Расти — проходи квесты', at100: '100% → все квесты пройдены. Релиз! Победа!' },
      { label: 'Инвесторы:', val: 30, color: 0xff4444, textCol: '#ff4444', hint: '↓ Снижай — принимай верные решения', at100: '100% → инвесторы уходят. Игра окончена.' },
      { label: 'Стресс:',    val: 50, color: 0xffaa00, textCol: '#ffaa00', hint: '↓ Снижай — ходи отдыхать', at100: '100% → выгорание: экран трясётся, −10% прогресс, +10% гнев.' },
    ]
    bars.forEach((b, i) => {
      const y = RY - 120 + i * 100
      this.add.text(RX - bw / 2, y, b.label, { fontSize: '9px', color: b.textCol, fontFamily: '"Press Start 2P"' })
      this.add.rectangle(RX - bw / 2 + 118, y + 8, bw - 140, 14, 0x333333).setOrigin(0, 0.5)
      this.add.rectangle(RX - bw / 2 + 118, y + 8, (bw - 140) * b.val / 100, 14, b.color).setOrigin(0, 0.5)
      this.add.text(RX + bw / 2 - 44, y - 14, b.val + '%', { fontSize: '9px', color: b.textCol, fontFamily: '"Press Start 2P"' })
      this.add.text(RX, y + 28, b.hint, { fontSize: '9px', color: '#445566', fontFamily: '"Press Start 2P"' }).setOrigin(0.5)
      this.add.text(RX, y + 52, b.at100, { fontSize: '7px', color: '#333355', fontFamily: '"Press Start 2P"', align: 'center', wordWrap: { width: bw - 20 } }).setOrigin(0.5)
    })
  }

  draw_quest() {
    const bw = 255, bh = 150
    const col1 = RX - 155
    const col2 = RX + 155
    const row1 = RY - 145
    const row2 = RY + 125
    const lc   = 0x3a3a5a

    const steps = [
      { x: col1, y: row1, num: 1, label: 'ВВОДНАЯ',       desc: 'DevBot рассказывает\nтему квеста',    color: 0x00aaff },
      { x: col2, y: row1, num: 2, label: 'ВЫБОР',         desc: 'Один из трёх\nвариантов решения',     color: 0xffaa00 },
      { x: col1, y: row2, num: 3, label: 'МИ НИ-ЗАДАНИЕ', desc: 'Практика и\nзакрепление решения',     color: 0xaa44ff },
      { x: col2, y: row2, num: 4, label: 'ФИДБЭК',        desc: 'Объяснение DevBot\nи совет',          color: 0x00ff88 },
    ]

    steps.forEach(s => {
      const hexC = '#' + s.color.toString(16).padStart(6, '0')
      this.add.rectangle(s.x, s.y, bw, bh, 0x0e0e22).setStrokeStyle(2, s.color)
      // Номер — значок внутри верхнего правого угла блока
      this.add.circle(s.x + bw / 2 - 18, s.y - bh / 2 + 18, 13, s.color)
      this.add.text(s.x + bw / 2 - 18, s.y - bh / 2 + 18, `${s.num}`, {
        fontSize: '9px', color: '#0d0d1f', fontFamily: '"Press Start 2P"'
      }).setOrigin(0.5)
      this.add.text(s.x - 10, s.y - bh / 2 + 32, s.label, {
        fontSize: '11px', color: hexC, fontFamily: '"Press Start 2P"',
        align: 'center', wordWrap: { width: bw - 52 }, lineSpacing: 4
      }).setOrigin(0.5)
      this.add.text(s.x, s.y + 22, s.desc, {
        fontSize: '9px', color: '#9999bb', fontFamily: '"Press Start 2P"',
        align: 'center', lineSpacing: 7, wordWrap: { width: bw - 30 }
      }).setOrigin(0.5)
    })

    const midX = (col1 + col2) / 2
    const gapW = col2 - col1 - bw   // ширина зазора между блоками

    // ── Стрелка 1→2: вправо ──
    this.add.rectangle(midX, row1, gapW - 14, 2, lc)
    // наконечник вправо: вершины (0,0)(0,16)(10,8) — tip справа
    this.add.triangle(col2 - bw / 2 - 1, row1, 0, 0, 0, 16, 10, 8, lc).setOrigin(0.5)

    // ── Г-образный коннектор 2→3 ──
    const bot2  = row1 + bh / 2
    const top3  = row2 - bh / 2
    const turnY = (bot2 + top3) / 2
    this.add.rectangle(col2, (bot2 + turnY) / 2, 2, turnY - bot2, lc)   // вниз от box2
    this.add.rectangle(midX, turnY, col2 - col1, 2, lc)                  // влево
    this.add.rectangle(col1, (turnY + top3) / 2, 2, top3 - turnY, lc)   // вниз к box3
    // наконечник вниз: вершины (0,0)(16,0)(8,10) — tip снизу
    this.add.triangle(col1, top3 - 1, 0, 0, 16, 0, 8, 10, lc).setOrigin(0.5)

    // ── Стрелка 3→4: вправо ──
    this.add.rectangle(midX, row2, gapW - 14, 2, lc)
    this.add.triangle(col2 - bw / 2 - 1, row2, 0, 0, 0, 16, 10, 8, lc).setOrigin(0.5)
  }

  draw_minigames() {
    const items = [
      { icon: '▶', name: 'КЛИКЕР',  desc: 'Шаги\nпроцесса', color: '#ff8866' },
      { icon: '⏱', name: 'ТАЙМЕР',  desc: 'События\nвремени',  color: '#ffaa00' },
      { icon: '☑', name: 'КОНФИГ',  desc: 'Параметры\nсистемы', color: '#44ddff' },
      { icon: '●', name: 'ПУЗЫРИ',  desc: 'Клик\nпо багам',    color: '#ff4444' },
      { icon: '↕', name: 'ОЧЕРЕДЬ', desc: 'Порядок\nэлементов', color: '#aa44ff' },
    ]
    const bw = 108, bh = 130, gap = 14
    const totalW = items.length * bw + (items.length - 1) * gap
    const startX = RX - totalW / 2 + bw / 2
    this.add.text(RX, RY - 210, '5 ТИПОВ МИ НИ-ЗАДАНИЙ', { fontSize: '9px', color: '#334466', fontFamily: '"Press Start 2P"' }).setOrigin(0.5)

    items.forEach((it, i) => {
      const x = startX + i * (bw + gap)
      this.add.rectangle(x, RY - 40, bw, bh, 0x12122a).setStrokeStyle(1, 0x333355)
      this.add.text(x, RY - 40 - bh / 2 + 22, it.icon, { fontSize: '16px', color: it.color, fontFamily: '"Press Start 2P"' }).setOrigin(0.5)
      this.add.text(x, RY - 40, it.name, { fontSize: '6px', color: it.color, fontFamily: '"Press Start 2P"', align: 'center', wordWrap: { width: bw - 8 } }).setOrigin(0.5)
      this.add.text(x, RY - 40 + 30, it.desc, { fontSize: '6px', color: '#666677', fontFamily: '"Press Start 2P"', align: 'center', lineSpacing: 4 }).setOrigin(0.5)
    })
  }

  draw_feedback() {
    const W = 550, H = 370
    this.add.rectangle(RX, RY, W, H, 0x12122a).setStrokeStyle(2, 0x00ff88)
    this.add.text(RX, RY - H / 2 + 22, '✓ ВЕРНО', { fontSize: '16px', color: '#00ff88', fontFamily: '"Press Start 2P"' }).setOrigin(0.5)

    // Объяснение
    this.add.rectangle(RX, RY - 80, W - 60, 56, 0x0a1a0a).setStrokeStyle(1, 0x224422)
    this.add.text(RX, RY - 80, 'Объяснение почему это правильно', { fontSize: '8px', color: '#aaffaa', fontFamily: '"Press Start 2P"', align: 'center', wordWrap: { width: W - 80 } }).setOrigin(0.5)

    // Совет
    this.add.rectangle(RX, RY + 10, W - 60, 56, 0x0a1020).setStrokeStyle(1, 0x003366)
    this.add.text(RX - W / 2 + 50, RY - 4, '💡 СОВЕТ:', { fontSize: '7px', color: '#4499ff', fontFamily: '"Press Start 2P"' })
    this.add.text(RX, RY + 18, 'Практический совет по теме', { fontSize: '8px', color: '#99ccff', fontFamily: '"Press Start 2P"', align: 'center' }).setOrigin(0.5)

    // Шкалы
    this.add.text(RX, RY + 90, '+15% Прогресс   -5% Инвесторы   -10% Стресс', { fontSize: '7px', color: '#444455', fontFamily: '"Press Start 2P"' }).setOrigin(0.5)

    // Кнопки
    this.add.rectangle(RX - 120, RY + H / 2 - 28, 180, 36, 0x00d4ff)
    this.add.text(RX - 120, RY + H / 2 - 28, 'ДАЛЕЕ →', { fontSize: '9px', color: '#0d0d1f', fontFamily: '"Press Start 2P"' }).setOrigin(0.5)
    this.add.rectangle(RX + 120, RY + H / 2 - 28, 200, 36, 0x1a1a3a).setStrokeStyle(2, 0x4499ff)
    this.add.text(RX + 120, RY + H / 2 - 28, '📖 СПРАВОЧНИК', { fontSize: '7px', color: '#4499ff', fontFamily: '"Press Start 2P"' }).setOrigin(0.5)
  }

  draw_glossary() {
    const W = 580
    // Заголовок
    this.add.text(RX, RY - 220, 'ПРАВЫЙ НИЖНИЙ УГОЛ', { fontSize: '8px', color: '#334455', fontFamily: '"Press Start 2P"' }).setOrigin(0.5)

    // Два блока рядом
    // Глоссарий
    this.add.rectangle(RX - 100, RY - 80, 110, 110, 0x000000).setStrokeStyle(2, 0x4499ff)
    this.add.text(RX - 100, RY - 88, '📖', { fontSize: '26px' }).setOrigin(0.5)
    this.add.text(RX - 100, RY - 42, 'ГЛОССАРИЙ', { fontSize: '6px', color: '#4499ff', fontFamily: '"Press Start 2P"' }).setOrigin(0.5)

    // Справка
    this.add.rectangle(RX + 30, RY - 80, 110, 110, 0x000000).setStrokeStyle(2, 0x336633)
    this.add.text(RX + 30, RY - 90, '?', { fontSize: '28px', color: '#00cc44', fontFamily: '"Press Start 2P"' }).setOrigin(0.5)
    this.add.text(RX + 30, RY - 42, 'СПРАВКА', { fontSize: '6px', color: '#00cc44', fontFamily: '"Press Start 2P"' }).setOrigin(0.5)

    this.add.text(RX - 34, RY + 10, '← всегда в углу', { fontSize: '8px', color: '#ffaa00', fontFamily: '"Press Start 2P"' }).setOrigin(0.5)

    // Список тем
    this.add.rectangle(RX, RY + 110, W, 100, 0x0d0d1f).setStrokeStyle(1, 0x333366)
    this.add.text(RX, RY + 82, '8 ТЕМ ГЛОССАРИЯ:', { fontSize: '8px', color: '#4499ff', fontFamily: '"Press Start 2P"' }).setOrigin(0.5)
    const themes = ['CI/CD · Тестирование · Автоматизация · Логирование', 'Мониторинг · Качество · Деплой · Безопасность']
    themes.forEach((t, i) => {
      this.add.text(RX, RY + 110 + i * 22, t, { fontSize: '7px', color: '#556677', fontFamily: '"Press Start 2P"', align: 'center' }).setOrigin(0.5)
    })
  }
}
