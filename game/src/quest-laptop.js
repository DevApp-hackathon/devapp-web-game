// Вступительные слайды
const INTRO_SLIDES = [
  {
    bot: 'Первый квест!\nВремя делать релиз.',
    text: 'Команда написала первую рабочую версию продукта.\nИнвесторы ждут демо через 2 дня.\nНадо принять решение — как выпускать.',
    color: '#00d4ff'
  },
  {
    bot: 'CI/CD — это твой\nавтопилот для кода.',
    text: 'Каждый раз когда пишется код — система сама\nзапускает тесты, собирает билд и деплоит.\nБез рук. Меньше ошибок. Быстрее.',
    color: '#00ff88'
  }
]

// Данные для трёх вариантов
const CHOICES = [
  { text: 'Выложить вручную\nна сервер', minigame: 'manual', choiceIndex: 0, correct: false },
  { text: 'Настроить CI/CD', minigame: 'cicd', choiceIndex: 1, correct: true },
  { text: 'Отложить до\n"идеального состояния"', minigame: 'delay', choiceIndex: 2, correct: false },
]

// Шаги ручного деплоя
const MANUAL_STEPS = [
  { cmd: 'ssh user@prod-server', time: '2 мин', note: '' },
  { cmd: 'git pull origin main', time: '1 мин', note: '' },
  { cmd: 'npm install', time: '4 мин', note: '⚠ зависимости конфликтуют...' },
  { cmd: 'npm run build', time: '6 мин', note: '' },
  { cmd: 'cp -r dist/ /var/www/', time: '1 мин', note: '' },
  { cmd: 'service nginx restart', time: '—', note: '🔴 ОШИБКА: старый .env! Сайт упал.' },
  { cmd: 'vim .env (правим вручную)', time: '8 мин', note: '😰 искали что не так...' },
  { cmd: 'service nginx restart', time: '1 мин', note: '✓ наконец работает' },
]

// Карточки пайплайна CI/CD
const PIPELINE_CARDS = [
  { id: 0, text: 'Написать\nкод' },
  { id: 1, text: 'Запустить\nтесты' },
  { id: 2, text: 'Сборка\n(build)' },
  { id: 3, text: 'Деплой\nна сервер' },
  { id: 4, text: 'Уведомить\nкоманду' },
]
// Правильный порядок: 0,1,2,3,4

// Карточки технического долга
const DEBT_CARDS = [
  { time: 2000,  text: '🏃 Конкурент выпустил v1.0' },
  { time: 4500,  text: '🐛 Баг в коде размножился' },
  { time: 7000,  text: '📱 Инвестор пишет: "Где релиз?"' },
  { time: 9500,  text: '😩 Команда теряет фокус' },
  { time: 12000, text: '🔥 Инвестор звонит. Терпение кончилось.' },
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function scaleQuestLaptopFonts(content) {
  return content.replace(/font-size:\s*(\d+)px/gi, (_, size) => `font-size:${Number(size) + 4}px`)
}

function initLaptopQuest() {
  let slideIndex = 0
  let selectedChoiceIndex = null
  let delayTimers = []
  let delayStart = null
  let cicdSlots = new Array(5).fill(null)
  let draggedId = null
  let draggedFrom = null

  const overlay = document.getElementById('quest-overlay')

  function show(sectionId) {
    ['quest-intro', 'quest-choice', 'quest-mg', 'mg-manual', 'mg-cicd', 'mg-delay']
      .forEach(id => {
        const el = document.getElementById(id)
        if (el) el.style.display = id === sectionId ? 'block' : 'none'
      })
  }

  function done(choiceIndex) {
    overlay.style.display = 'none'
    clearDelayTimers()
    window.dispatchEvent(new CustomEvent('quest-laptop-done', { detail: { choiceIndex } }))
  }

  function getChoiceCornerPupsHTML() {
    return `<img src="./src/assets/pups.png" style="position:absolute;top:-10px;left:-18px;width:144px;height:144px;object-fit:contain;pointer-events:none;z-index:20;">`
  }

  function getResultPupsHTML(choiceIndex = selectedChoiceIndex) {
    const isCorrect = CHOICES[choiceIndex]?.correct
    const src = isCorrect ? './src/assets/pups_smile.png' : './src/assets/pups_no_smile.png'
    return `<div style="display:flex;justify-content:center;margin-bottom:18px;">
      <img src="${src}" style="width:264px;height:264px;object-fit:contain;display:block;">
    </div>`
  }

  function clearDelayTimers() {
    delayTimers.forEach(t => clearTimeout(t))
    delayTimers = []
  }

  // ─── INTRO ───────────────────────────────────────────
  function renderIntro() {
    show('quest-intro')
    const slide = INTRO_SLIDES[slideIndex]
    const isLast = slideIndex === INTRO_SLIDES.length - 1
    const container = document.getElementById('quest-intro')

    container.innerHTML = scaleQuestLaptopFonts(`
      <div style="display:flex;align-items:flex-start;gap:40px;margin-bottom:32px;">
        <div style="flex-shrink:0;text-align:center;">
          <img src="./src/assets/DevBot.png" style="width:208px;height:208px;object-fit:contain;display:block;">
          <div style="font-size:11px;color:#666;margin-top:10px;">DevBot</div>
        </div>
        <div style="background:#1e1e3e;border:1px solid ${slide.color};border-radius:8px;padding:24px;flex:1;margin-top:28px;">
          <div style="font-size:15px;color:${slide.color};line-height:2.25;white-space:pre-line;">${slide.bot}</div>
        </div>
      </div>
      <div style="background:#161628;border:1px solid #333355;border-radius:8px;padding:30px;margin-bottom:28px;font-size:15px;color:#fff;line-height:2.35;white-space:pre-line;">${slide.text}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div style="font-size:11px;color:#444466;">${slideIndex + 1} / ${INTRO_SLIDES.length}</div>
        <button id="intro-next" style="padding:16px 32px;background:${isLast ? '#00ff88' : '#00d4ff'};border:none;border-radius:6px;font-family:'Press Start 2P',monospace;font-size:14px;color:#0d0d1f;cursor:pointer;">
          ${isLast ? 'ВЫБРАТЬ →' : 'ДАЛЕЕ →'}
        </button>
      </div>
    `)
    document.getElementById('intro-next').onclick = () => {
      if (isLast) renderChoice()
      else { slideIndex++; renderIntro() }
    }
  }

  // ─── CHOICE ──────────────────────────────────────────
  function renderChoice() {
    show('quest-choice')
    const used = window._usedChoices?.[0] || new Set()
    const container = document.getElementById('quest-choice')
    container.innerHTML = scaleQuestLaptopFonts(`
      <div style="position:relative;overflow:visible;">
        ${getChoiceCornerPupsHTML()}
        <div style="margin-left:120px;margin-bottom:24px;">
          <div style="font-size:15px;color:#00d4ff;text-align:center;margin-bottom:14px;">КАК БУДЕМ ДЕПЛОИТЬ?</div>
          <div style="font-size:10px;color:#888;text-align:center;line-height:1.9;">
            У команды готов первый билд. Инвесторы ждут демо через 2 дня.
          </div>
        </div>
      </div>
      <div style="position:relative;background:#161628;border:1px solid #333355;border-radius:8px;padding:32px 22px 22px;overflow:visible;">
        <div id="choice-btns" style="display:flex;flex-direction:column;gap:20px;position:relative;z-index:2;">
          ${CHOICES.map((c, i) => {
            const isUsed = used.has(i)
            return `<button data-i="${i}" ${isUsed ? 'disabled' : ''} style="min-height:132px;padding:34px 24px;background:${isUsed ? '#161622' : '#2a2a4a'};border:1px solid ${isUsed ? '#2a2a3a' : '#444466'};border-radius:8px;font-family:'Press Start 2P',monospace;font-size:18px;color:${isUsed ? '#444455' : '#fff'};cursor:${isUsed ? 'not-allowed' : 'pointer'};text-align:center;line-height:2.05;transition:background 0.2s;">
              ${isUsed ? '✓ ' : ''}${c.text.replace('\n', '<br>')}
            </button>`
          }).join('')}
        </div>
      </div>
    `)
    container.querySelectorAll('[data-i]:not([disabled])').forEach(btn => {
      btn.onmouseenter = () => btn.style.background = '#3a3a6a'
      btn.onmouseleave = () => btn.style.background = '#2a2a4a'
      btn.onclick = () => {
        selectedChoiceIndex = parseInt(btn.dataset.i)
        const choice = CHOICES[selectedChoiceIndex]
        if (choice.minigame === 'manual') renderManual()
        else if (choice.minigame === 'cicd') renderCICD()
        else if (choice.minigame === 'delay') renderDelay()
      }
    })
  }

  // ─── MINIGAME 1: РУЧНОЙ ДЕПЛОЙ ───────────────────────
  function renderManual() {
    show('mg-manual')
    const container = document.getElementById('mg-manual')
    let stepIndex = 0
    let totalTime = 0

    function renderStep() {
      if (stepIndex >= MANUAL_STEPS.length) {
        container.innerHTML = scaleQuestLaptopFonts(`
          ${getResultPupsHTML(selectedChoiceIndex)}
          <div style="font-size:18px;color:#ff4444;text-align:center;margin-bottom:22px;">ДЕПЛОЙ ЗАВЕРШЁН</div>
          <div style="background:#1f0808;border:1px solid #ff4444;border-radius:8px;padding:30px;margin-bottom:22px;font-size:13px;color:#ff8888;line-height:2.45;">
            ⏱ Общее время: <span style="color:#fff">~${totalTime} минут</span><br>
            🔴 Даунтайм: <span style="color:#fff">8 минут</span><br>
            💀 Критических ошибок: <span style="color:#fff">1</span><br>
            😰 Причина: ручной деплой = человеческий фактор
          </div>
          <div style="font-size:12px;color:#666;margin-bottom:28px;line-height:2.15;">
            С CI/CD этот процесс занял бы 3 минуты. Полностью автоматически.
          </div>
          <button id="manual-done" style="width:100%;padding:18px;background:#ff4444;border:none;border-radius:6px;font-family:'Press Start 2P',monospace;font-size:14px;color:#fff;cursor:pointer;">
            ПОНЯЛ, УЧТУ →
          </button>
        `)
        document.getElementById('manual-done').onclick = () => done(selectedChoiceIndex)
        return
      }

      const step = MANUAL_STEPS[stepIndex]
      if (step.time !== '—') totalTime += parseInt(step.time) || 0

      container.innerHTML = scaleQuestLaptopFonts(`
        <div style="font-size:11px;color:#ff8866;text-align:center;margin-bottom:14px;">РУЧНОЙ ДЕПЛОЙ</div>
        <div style="font-size:8px;color:#666;margin-bottom:16px;">Шаг ${stepIndex + 1} из ${MANUAL_STEPS.length}</div>
        <div style="background:#0d0d20;border:1px solid #333;border-radius:6px;padding:16px;margin-bottom:12px;">
          <div style="font-size:10px;color:#00ff88;font-family:monospace;margin-bottom:8px;">$ ${step.cmd}</div>
          ${step.time !== '—' ? `<div style="font-size:8px;color:#888;">⏱ ${step.time}</div>` : ''}
          ${step.note ? `<div style="font-size:8px;color:#ff8866;margin-top:8px;">${step.note}</div>` : ''}
        </div>
        <div style="display:flex;gap:6px;margin-bottom:16px;">
          ${MANUAL_STEPS.map((_, i) => `
            <div style="flex:1;height:4px;border-radius:2px;background:${i < stepIndex ? '#00ff88' : i === stepIndex ? '#ff8866' : '#333'};"></div>
          `).join('')}
        </div>
        <button id="step-next" style="width:100%;padding:12px;background:#2a2a4a;border:1px solid #444;border-radius:6px;font-family:'Press Start 2P',monospace;font-size:10px;color:#fff;cursor:pointer;">
          ${stepIndex < MANUAL_STEPS.length - 1 ? 'ВЫПОЛНИТЬ ►' : 'ГОТОВО ►'}
        </button>
      `)
      document.getElementById('step-next').onclick = () => {
        stepIndex++
        renderStep()
      }
    }

    renderStep()
  }

  // ─── MINIGAME 2: CI/CD ПАЙПЛАЙН ──────────────────────
  function renderCICD() {
    show('mg-cicd')
    cicdSlots = new Array(5).fill(null)
    draggedId = null
    draggedFrom = null
    drawCICD()
  }

  function drawCICD() {
    const container = document.getElementById('mg-cicd')
    const shuffled = shuffle(PIPELINE_CARDS)

    container.innerHTML = scaleQuestLaptopFonts(`
      <div style="font-size:11px;color:#00ff88;text-align:center;margin-bottom:8px;">СОБЕРИ CI/CD ПАЙПЛАЙН</div>
      <div style="font-size:8px;color:#666;text-align:center;margin-bottom:18px;">Перетащи шаги в правильном порядке выполнения</div>

      <div style="display:flex;gap:16px;margin-bottom:16px;">
        <div style="flex:1;">
          <div style="font-size:8px;color:#888;text-align:center;margin-bottom:8px;">ШАГИ</div>
          <div id="cicd-cards" style="min-height:280px;border:1px dashed #333;border-radius:6px;padding:8px;">
            ${shuffled.filter(c => !cicdSlots.includes(c.id)).map(c => makePipelineCardHTML(c, 'cards')).join('')}
          </div>
        </div>
        <div style="flex:1;">
          <div style="font-size:8px;color:#888;text-align:center;margin-bottom:8px;">ПАЙПЛАЙН</div>
          <div id="cicd-slots">
            ${PIPELINE_CARDS.map((_, i) => {
              const taskId = cicdSlots[i]
              const task = taskId !== null ? PIPELINE_CARDS.find(c => c.id === taskId) : null
              return `
                <div class="cicd-slot" data-slot="${i}" style="min-height:48px;border:1px dashed #333355;border-radius:6px;margin-bottom:8px;display:flex;align-items:center;padding:4px 8px;background:#0d0d20;position:relative;">
                  <span style="font-size:8px;color:#333355;margin-right:8px;">${i+1}.</span>
                  ${task ? makePipelineCardHTML(task, i) : ''}
                </div>
              `
            }).join('')}
          </div>
        </div>
      </div>
      <div id="cicd-msg" style="font-size:8px;text-align:center;min-height:16px;margin-bottom:10px;"></div>
      <button id="cicd-check" style="width:100%;padding:12px;background:#00d4ff;border:none;border-radius:6px;font-family:'Press Start 2P',monospace;font-size:11px;color:#0d0d1f;cursor:pointer;">ПРОВЕРИТЬ</button>
    `)

    attachCICDEvents()
  }

  function makePipelineCardHTML(card, from) {
    return `<div class="pip-card" draggable="true" data-id="${card.id}" data-from="${from}"
      style="padding:8px;background:#1a7acc;border-radius:5px;font-size:8px;color:#fff;text-align:center;cursor:grab;line-height:1.7;margin-bottom:4px;">
      ${card.text.replace('\n','<br>')}
    </div>`
  }

  function attachCICDEvents() {
    const container = document.getElementById('mg-cicd')

    container.querySelectorAll('.pip-card').forEach(card => {
      card.addEventListener('dragstart', () => {
        draggedId = parseInt(card.dataset.id)
        draggedFrom = card.dataset.from === 'cards' ? 'cards' : parseInt(card.dataset.from)
        setTimeout(() => card.style.opacity = '0.4', 0)
      })
      card.addEventListener('dragend', () => card.style.opacity = '1')
    })

    container.querySelectorAll('.cicd-slot').forEach(slot => {
      slot.addEventListener('dragover', e => { e.preventDefault(); slot.style.borderColor = '#00d4ff' })
      slot.addEventListener('dragleave', () => slot.style.borderColor = '#333355')
      slot.addEventListener('drop', e => {
        e.preventDefault()
        slot.style.borderColor = '#333355'
        const i = parseInt(slot.dataset.slot)
        const existing = cicdSlots[i]
        if (existing !== null) {
          if (typeof draggedFrom === 'number') cicdSlots[draggedFrom] = existing
          else cicdSlots[draggedFrom] = null
        } else {
          if (typeof draggedFrom === 'number') cicdSlots[draggedFrom] = null
        }
        cicdSlots[i] = draggedId
        draggedId = null
        drawCICD()
      })
    })

    const cardsArea = document.getElementById('cicd-cards')
    cardsArea.addEventListener('dragover', e => e.preventDefault())
    cardsArea.addEventListener('drop', e => {
      e.preventDefault()
      if (typeof draggedFrom === 'number') cicdSlots[draggedFrom] = null
      draggedId = null
      drawCICD()
    })

    document.getElementById('cicd-check').onclick = () => {
      const filled = cicdSlots.filter(s => s !== null)
      if (filled.length < 5) {
        document.getElementById('cicd-msg').innerHTML = '<span style="color:#ffaa00">Расставь все шаги!</span>'
        return
      }
      const correct = cicdSlots.every((id, i) => id === i)
      if (correct) {
        showCICDSuccess()
      } else {
        const errors = cicdSlots.map((id, i) => id !== i ? i : -1).filter(i => i >= 0)
        errors.forEach(i => { cicdSlots[i] = null })
        document.getElementById('cicd-msg').innerHTML = '<span style="color:#ff4444">Не совсем — неверные шаги возвращены</span>'
        drawCICD()
      }
    }
  }

  function showCICDSuccess() {
    const container = document.getElementById('mg-cicd')
    container.innerHTML = scaleQuestLaptopFonts(`
      ${getResultPupsHTML(selectedChoiceIndex)}
      <div style="font-size:18px;color:#00ff88;text-align:center;margin-bottom:22px;">✓ ПАЙПЛАЙН СОБРАН!</div>
      <div style="display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:28px;flex-wrap:wrap;">
        ${PIPELINE_CARDS.map((c, i) => `
          <div style="display:flex;align-items:center;gap:6px;">
            <div style="padding:14px 18px;background:#1a7acc;border-radius:5px;font-size:12px;color:#fff;text-align:center;line-height:2.05;">${c.text.replace('\n','<br>')}</div>
            ${i < 4 ? '<div style="color:#00ff88;font-size:18px;">→</div>' : ''}
          </div>
        `).join('')}
      </div>
      <div style="background:#0a1a0a;border:1px solid #00aa44;border-radius:8px;padding:26px;margin-bottom:22px;font-size:12px;color:#aaffaa;line-height:2.35;">
        🚀 Теперь при каждом коммите система сама прогоняет все шаги.<br>
        ⏱ Время деплоя: <span style="color:#fff">~3 минуты</span> вместо 47.<br>
        ✅ Человеческий фактор исключён.
      </div>
      <button id="cicd-done" style="width:100%;padding:18px;background:#00ff88;border:none;border-radius:6px;font-family:'Press Start 2P',monospace;font-size:14px;color:#0d0d1f;cursor:pointer;">
        ОТЛИЧНО! →
      </button>
    `)
    document.getElementById('cicd-done').onclick = () => done(selectedChoiceIndex)
  }

  // ─── MINIGAME 3: ОТКЛАДЫВАЕМ ─────────────────────────
  function renderDelay() {
    show('mg-delay')
    clearDelayTimers()
    delayStart = Date.now()
    const container = document.getElementById('mg-delay')

    container.innerHTML = scaleQuestLaptopFonts(`
      <div style="font-size:11px;color:#ffaa00;text-align:center;margin-bottom:8px;">ЖДЁМ ИДЕАЛЬНОГО МОМЕНТА...</div>
      <div style="text-align:center;font-size:22px;color:#fff;margin-bottom:14px;" id="delay-timer">0 сек</div>
      <div id="debt-list" style="min-height:200px;margin-bottom:16px;display:flex;flex-direction:column;gap:8px;"></div>
      <button id="delay-release" style="width:100%;padding:12px;background:#ffaa00;border:none;border-radius:6px;font-family:'Press Start 2P',monospace;font-size:10px;color:#0d0d1f;cursor:pointer;">
        ВЫПУСТИТЬ СЕЙЧАС
      </button>
    `)

    // Таймер
    const timerEl = document.getElementById('delay-timer')
    const timerInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - delayStart) / 1000)
      timerEl.textContent = elapsed + ' сек'
    }, 500)
    delayTimers.push(timerInterval)

    // Карточки долга
    DEBT_CARDS.forEach(card => {
      const t = setTimeout(() => {
        const debtEl = document.createElement('div')
        debtEl.style.cssText = scaleQuestLaptopFonts('padding:10px 14px;background:#1f1000;border:1px solid #cc5500;border-radius:6px;font-size:9px;color:#ffaa66;animation:fadein 0.4s;')
        debtEl.textContent = card.text
        const list = document.getElementById('debt-list')
        if (list) list.appendChild(debtEl)
      }, card.time)
      delayTimers.push(t)
    })

    // Автоконец через 13 сек
    const autoEnd = setTimeout(() => finishDelay(), 13000)
    delayTimers.push(autoEnd)

    document.getElementById('delay-release').onclick = finishDelay

    function finishDelay() {
      clearInterval(timerInterval)
      clearDelayTimers()
      const elapsed = Math.floor((Date.now() - delayStart) / 1000)
      let verdict, color
      if (elapsed <= 3) {
        verdict = 'Выпустил быстро, но продукт\nне был готов к релизу.'
        color = '#ffaa00'
      } else if (elapsed <= 8) {
        verdict = 'Потерял время.\nКонкурент уже впереди.'
        color = '#ff8844'
      } else {
        verdict = 'Слишком долго. Инвесторы\nпотеряли терпение.'
        color = '#ff4444'
      }

      container.innerHTML = scaleQuestLaptopFonts(`
        ${getResultPupsHTML(selectedChoiceIndex)}
        <div style="font-size:18px;color:#ffaa00;text-align:center;margin-bottom:22px;">ВРЕМЯ ВЫШЛО</div>
        <div style="background:#1f0d00;border:1px solid #cc5500;border-radius:8px;padding:28px;margin-bottom:22px;font-size:13px;color:#ffaa66;line-height:2.35;text-align:center;white-space:pre-line;">
          <span style="color:${color}">${verdict}</span>
        </div>
        <div style="font-size:12px;color:#666;margin-bottom:28px;text-align:center;line-height:2.15;">
          Ожидание "идеального момента" — это антипаттерн.<br>
          Лучше выпускать часто и малыми итерациями.
        </div>
        <button id="delay-done" style="width:100%;padding:18px;background:#ff8844;border:none;border-radius:6px;font-family:'Press Start 2P',monospace;font-size:14px;color:#fff;cursor:pointer;">
          ПОНЯЛ →
        </button>
      `)
      document.getElementById('delay-done').onclick = () => done(selectedChoiceIndex)
    }
  }

  // ─── ЗАПУСК ───────────────────────────────────────────
  window.openLaptopQuest = () => {
    slideIndex = 0
    selectedChoiceIndex = null
    cicdSlots = new Array(5).fill(null)
    overlay.style.display = 'flex'
    renderIntro()
  }

  const laptopClose = () => {
    overlay.style.display = 'none'
    clearDelayTimers()
    window.dispatchEvent(new Event('quest-laptop-closed'))
  }
  document.getElementById('quest-close').onclick = laptopClose
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLaptopQuest)
} else {
  initLaptopQuest()
}
