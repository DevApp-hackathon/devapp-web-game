const TASKS = [
  {
    id: 0, text: 'Настроить CI/CD', color: '#1a7acc',
    details: {
      what: 'CI/CD — Continuous Integration / Continuous Delivery. Это система которая автоматически запускает тесты, собирает и доставляет код на сервер при каждом коммите.',
      why: 'Без CI/CD каждый деплой — ручная работа с риском ошибки. Человек устаёт, забывает шаги, путает ветки. Автоматизация убирает человеческий фактор полностью.',
      how: 'GitHub Actions, GitLab CI, Jenkins, CircleCI. Создаёшь файл .yml с шагами: установить зависимости → запустить тесты → собрать → задеплоить. Pipeline запускается сам при git push.',
      fact: 'Компании с CI/CD выпускают обновления в 200 раз чаще и восстанавливаются после сбоев в 24 раза быстрее. (Отчёт DORA 2023)'
    }
  },
  {
    id: 1, text: 'Написать автотесты', color: '#1a8c55',
    details: {
      what: 'Автотесты — код который проверяет другой код. Unit-тесты проверяют одну функцию. Integration-тесты — взаимодействие модулей. E2E — полный сценарий пользователя.',
      why: 'Баг найденный в тестах стоит в 10 раз дешевле чем в продакшене. Без тестов команда боится менять код — любое изменение может сломать что-то незаметно.',
      how: 'Jest (JavaScript), Pytest (Python), JUnit (Java). Начни с критического пути: регистрация, оплата, основная фича. Даже 10 тестов лучше чем 0.',
      fact: 'Google требует 80% покрытия кода тестами перед мержем в основную ветку. Это стандарт для production-grade разработки.'
    }
  },
  {
    id: 2, text: 'Автоматизировать сборку', color: '#cc7700',
    details: {
      what: 'Автоматизация сборки — это замена ручных повторяющихся действий скриптами. Сборка, установка зависимостей, генерация конфигов, копирование файлов — всё по одной команде.',
      why: 'Ручная сборка каждую неделю — это 40+ часов в год впустую. Плюс каждый раз риск что кто-то сделает не так. Автоматизация даёт стабильность и освобождает время для реальной работы.',
      how: 'Makefile с командами make build, make deploy. Docker для воспроизводимого окружения. npm scripts, bash-скрипты. Главное — один запуск делает всё.',
      fact: 'По данным Stack Overflow Developer Survey 2023, 76% senior-разработчиков считают автоматизацию рутины главным фактором продуктивности команды.'
    }
  },
  {
    id: 3, text: 'Настроить логирование', color: '#7733cc',
    details: {
      what: 'Логирование — запись событий системы в структурированном виде. Каждый запрос, ошибка, важное действие оставляет след с временной меткой, уровнем (ERROR/WARN/INFO) и контекстом.',
      why: 'Без логов отладка — это угадывание. Среднее время поиска бага без логов — 4 часа. С хорошими логами — 5 минут. Это разница между спокойным фиксом и ночным дежурством.',
      how: 'Winston, Pino (Node.js), Loguru (Python). Формат: JSON с полями timestamp, level, message, userId, requestId. Агрегация: ELK Stack (Elasticsearch + Logstash + Kibana) или Grafana Loki.',
      fact: 'Netflix обрабатывает 2 петабайта логов в день. Каждый инцидент расследуется по логам за минуты, а не часы — это напрямую влияет на uptime 99.99%.'
    }
  },
  {
    id: 4, text: 'Подключить мониторинг', color: '#cc2266',
    details: {
      what: 'Мониторинг — постоянное наблюдение за метриками системы в реальном времени: CPU, память, время ответа, error rate, количество запросов. Алерты сообщают о проблемах раньше пользователей.',
      why: 'Без мониторинга о падении сервера ты узнаёшь от пользователей — когда уже поздно. С мониторингом — за 2 минуты до того как кто-то заметил. Разница в репутации и деньгах.',
      how: 'Prometheus + Grafana — стандарт для стартапов (бесплатно). Datadog, New Relic — enterprise. Настрой четыре золотых сигнала: Latency, Traffic, Errors, Saturation (метод Google SRE).',
      fact: 'Среднее время обнаружения инцидента без мониторинга — 4.2 часа. С правильно настроенными алертами — 8 минут. (PagerDuty State of Digital Operations 2023)'
    }
  },
  {
    id: 5, text: 'Выстроить процесс релиза', color: '#1a99aa',
    details: {
      what: 'Процесс релиза — это задокументированная последовательность шагов от "код написан" до "код в продакшене". Включает: code review, quality gates, staging-окружение, rollback-план, уведомления.',
      why: 'Без процесса каждый релиз — импровизация. Кто-то забыл проверить, кто-то задеплоил не ту ветку. Процесс убирает хаос и делает релиз предсказуемым событием, а не стрессом.',
      how: 'Опиши чеклист: PR review → тесты зелёные → деплой на staging → smoke-тест → деплой на prod → мониторинг 30 минут. Используй feature flags для безопасного включения фич.',
      fact: 'Amazon делает деплой каждые 11.6 секунд. Это возможно только потому что у них железный процесс с автоматическими проверками на каждом шаге.'
    }
  },
  {
    id: 6, text: 'Финальный деплой', color: '#cc5500',
    details: {
      what: 'Финальный деплой — это не кнопка "надеюсь пронесёт", а уверенное нажатие "Deploy" после того как все предыдущие шаги выстроены. CI/CD сам проходит все проверки и доставляет код.',
      why: 'Если все предыдущие шаги сделаны правильно — финальный деплой занимает 5 минут и не вызывает стресса. Если нет — это 2 часа паники и даунтайм на продакшене.',
      how: 'git push → pipeline запускается автоматически → тесты → сборка → деплой → health check → уведомление в Slack. Ты просто смотришь как всё работает само.',
      fact: 'По данным DORA (DevOps Research and Assessment), команды с зрелым DevOps восстанавливаются после инцидентов в 2604 раза быстрее, чем команды без него.'
    }
  },
]

const PREFILLED_PLAN_SLOTS = new Map([
  [0, 0],
  [2, 2],
  [6, 6],
])

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function scalePlanningFonts(content) {
  return content.replace(/font-size:\s*(\d+)px/gi, (_, size) => `font-size:${Number(size) + 4}px`)
}

function createInitialPlanSlots() {
  const slots = new Array(TASKS.length).fill(null)
  PREFILLED_PLAN_SLOTS.forEach((taskId, slotIndex) => {
    slots[slotIndex] = taskId
  })
  return slots
}

function initPlanning() {
  const overlay    = document.getElementById('planning-overlay')
  const colTasks   = document.getElementById('col-tasks')
  const colPlan    = document.getElementById('col-plan')
  const checkBtn   = document.getElementById('planning-check')
  const closeBtn   = document.getElementById('planning-close')
  const message    = document.getElementById('planning-message')
  const mainView   = document.getElementById('planning-main')
  const resultView = document.getElementById('planning-result')
  const retryBtn   = document.getElementById('planning-retry')
  const goBtn      = document.getElementById('planning-go')

  let draggedId = null
  let draggedFrom = null // 'tasks' | slot index number

  function render() {
    // Очищаем кроме заголовков
    const taskTitle = colTasks.querySelector('.col-title')
    const planTitle = colPlan.querySelector('.col-title')
    colTasks.innerHTML = ''
    colPlan.innerHTML = ''
    colTasks.appendChild(taskTitle)
    colPlan.appendChild(planTitle)

    mainView.style.display = 'block'
    resultView.classList.remove('active')
    message.textContent = ''

    // Перемешанные карточки (только те что не в плане)
    const slotTaskIds = window._planSlots ? window._planSlots.map(s => s) : createInitialPlanSlots()
    window._planSlots = slotTaskIds

    const shuffled = shuffle(TASKS)
    shuffled.forEach(task => {
      if (slotTaskIds.includes(task.id)) return
      const card = makeCard(task, 'tasks')
      colTasks.appendChild(card)
    })

    // Слоты
    TASKS.forEach((_, i) => {
      const slot = document.createElement('div')
      slot.className = 'slot'
      slot.dataset.slotIndex = i

      const num = document.createElement('span')
      num.className = 'slot-num'
      num.textContent = i + 1 + '.'
      slot.appendChild(num)

      const taskId = slotTaskIds[i]
      if (taskId !== null && taskId !== undefined) {
        const task = TASKS.find(t => t.id === taskId)
        const card = makeCard(task, i, PREFILLED_PLAN_SLOTS.has(i))
        slot.appendChild(card)
      }

      if (PREFILLED_PLAN_SLOTS.has(i)) {
        slot.style.borderColor = '#00aa44'
        slot.style.background = '#102318'
      } else {
        slot.addEventListener('dragover', e => {
          e.preventDefault()
          slot.classList.add('drag-over')
        })
        slot.addEventListener('dragleave', () => slot.classList.remove('drag-over'))
        slot.addEventListener('drop', e => {
          e.preventDefault()
          slot.classList.remove('drag-over')
          if (draggedId === null) return

          const existingTaskId = slotTaskIds[i]

          // Если в слоте уже есть карточка — свапаем или возвращаем
          if (existingTaskId !== null && existingTaskId !== undefined) {
            if (typeof draggedFrom === 'number') {
              slotTaskIds[draggedFrom] = existingTaskId
            } else {
              slotTaskIds[draggedFrom] = null // вернём в tasks
            }
          } else if (typeof draggedFrom === 'number') {
            slotTaskIds[draggedFrom] = null
          }

          slotTaskIds[i] = draggedId
          draggedId = null
          draggedFrom = null
          render()
        })
      }

      colPlan.appendChild(slot)
    })

    // Дроп зона для возврата в левый столбец
    colTasks.addEventListener('dragover', e => e.preventDefault())
    colTasks.addEventListener('drop', e => {
      e.preventDefault()
      if (draggedId === null) return
      if (typeof draggedFrom === 'number') {
        slotTaskIds[draggedFrom] = null
      }
      draggedId = null
      draggedFrom = null
      render()
    })
  }

  function makeCard(task, from, locked = false) {
    const card = document.createElement('div')
    card.className = 'task-card'
    card.style.background = task.color
    card.style.position = 'relative'
    card.style.paddingRight = '32px'
    card.draggable = !locked
    if (locked) {
      card.style.cursor = 'default'
      card.style.boxShadow = 'inset 0 0 0 2px rgba(255,255,255,0.28)'
    }

    const label = document.createElement('span')
    label.textContent = task.text
    card.appendChild(label)

    // Кнопка ?
    const qBtn = document.createElement('button')
    qBtn.textContent = '?'
    qBtn.style.cssText = scalePlanningFonts(`position:absolute;right:6px;top:50%;transform:translateY(-50%);
      width:20px;height:20px;border-radius:50%;border:none;
      background:rgba(255,255,255,0.25);color:#fff;font-family:'Press Start 2P',monospace;
      font-size:8px;cursor:pointer;line-height:1;padding:0;transition:background 0.15s;`)
    qBtn.onmouseenter = () => qBtn.style.background = 'rgba(255,255,255,0.5)'
    qBtn.onmouseleave = () => qBtn.style.background = 'rgba(255,255,255,0.25)'
    qBtn.onclick = (e) => {
      e.stopPropagation()
      e.preventDefault()
      showTaskInfo(task)
    }
    card.appendChild(qBtn)

    if (!locked) {
      card.addEventListener('dragstart', (e) => {
        if (e.target === qBtn) { e.preventDefault(); return }
        draggedId = task.id
        draggedFrom = from
        setTimeout(() => card.classList.add('dragging'), 0)
      })
      card.addEventListener('dragend', () => {
        card.classList.remove('dragging')
      })
    }
    return card
  }

  function showTaskInfo(task) {
    const d = task.details
    let modal = document.getElementById('task-info-modal')
    if (!modal) {
      modal = document.createElement('div')
      modal.id = 'task-info-modal'
      modal.style.cssText = `position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:500;
        display:flex;justify-content:center;align-items:center;font-family:'Press Start 2P',monospace;`
      document.body.appendChild(modal)
    }

    modal.innerHTML = scalePlanningFonts(`
      <div style="background:#12122a;border:2px solid ${task.color};border-radius:8px;padding:28px;width:620px;max-height:88vh;overflow-y:auto;position:relative;">
        <button id="task-info-close" style="position:absolute;top:12px;right:16px;background:none;border:none;color:#666;font-size:18px;cursor:pointer;font-family:inherit;">✕</button>

        <div style="font-size:14px;color:${task.color};margin-bottom:20px;padding-bottom:12px;border-bottom:1px solid #222244;">${task.text}</div>

        <div style="display:flex;flex-direction:column;gap:16px;">

          <div style="background:#0d0d20;border-left:3px solid ${task.color};border-radius:0 6px 6px 0;padding:14px 16px;">
            <div style="font-size:8px;color:${task.color};margin-bottom:8px;">ЧТО ЭТО?</div>
            <div style="font-size:8px;color:#ddddee;line-height:2;">${d.what}</div>
          </div>

          <div style="background:#0d0d20;border-left:3px solid #ffaa00;border-radius:0 6px 6px 0;padding:14px 16px;">
            <div style="font-size:8px;color:#ffaa00;margin-bottom:8px;">ЗАЧЕМ?</div>
            <div style="font-size:8px;color:#ddddee;line-height:2;">${d.why}</div>
          </div>

          <div style="background:#0d0d20;border-left:3px solid #00ff88;border-radius:0 6px 6px 0;padding:14px 16px;">
            <div style="font-size:8px;color:#00ff88;margin-bottom:8px;">КАК?</div>
            <div style="font-size:8px;color:#ddddee;line-height:2;">${d.how}</div>
          </div>

          <div style="background:#1a1400;border:1px solid #665500;border-radius:6px;padding:14px 16px;">
            <div style="font-size:7px;color:#aa8800;margin-bottom:8px;">💡 ФАКТ</div>
            <div style="font-size:8px;color:#ccbb88;line-height:2;font-style:italic;">${d.fact}</div>
          </div>

        </div>

        <button id="task-info-ok" style="width:100%;margin-top:20px;padding:12px;background:${task.color};border:none;border-radius:6px;font-family:'Press Start 2P',monospace;font-size:11px;color:#fff;cursor:pointer;">ПОНЯТНО →</button>
      </div>
    `)

    modal.style.display = 'flex'
    document.getElementById('task-info-close').onclick = () => modal.style.display = 'none'
    document.getElementById('task-info-ok').onclick    = () => modal.style.display = 'none'
  }

  function check() {
    const filled = window._planSlots.filter(s => s !== null && s !== undefined)
    if (filled.length < TASKS.length) {
      message.style.color = '#ffaa00'
      message.textContent = 'Расставь все задачи в правый столбец!'
      return
    }

    const errors = []
    window._planSlots.forEach((taskId, i) => {
      if (taskId !== TASKS[i].id) errors.push(i)
    })

    mainView.style.display = 'none'
    resultView.classList.add('active')

    const titleEl = document.getElementById('result-title')
    const listEl  = document.getElementById('result-list')
    listEl.innerHTML = ''

    if (errors.length === 0) {
      titleEl.style.color = '#00ff88'
      titleEl.textContent = '✓ ВЕРНО!'
      goBtn.style.display = 'inline-block'
      retryBtn.style.display = 'none'

      // Объяснение порядка
      const explanation = document.createElement('div')
      explanation.style.cssText = scalePlanningFonts('margin: 12px 0; padding: 14px; background: #0a1a0a; border: 1px solid #00aa44; border-radius: 6px; font-size: 8px; color: #aaffaa; line-height: 2; text-align: left;')
      explanation.innerHTML = `
        <div style="color:#00ff88; margin-bottom:10px;">Почему именно такой порядок?</div>
        <b>1. CI/CD</b> — сначала выстраиваем pipeline доставки кода, иначе всё остальное не доедет до пользователя.<br>
        <b>2. Автотесты</b> — пишем до активной разработки, чтобы каждый коммит проверялся автоматически.<br>
        <b>3. Автоматизация сборки</b> — убираем ручной труд из рутины, освобождаем команду для фич.<br>
        <b>4. Логирование</b> — до релиза система должна уметь объяснять что происходит внутри.<br>
        <b>5. Мониторинг</b> — настраиваем алерты и дашборды, чтобы знать о проблемах раньше пользователей.<br>
        <b>6. Процесс релиза</b> — фиксируем как именно выпускаем: чеклисты, approvals, rollback-план.<br>
        <b>7. Финальный деплой</b> — только когда всё выше готово, жмём кнопку уверенно.
      `
      listEl.appendChild(explanation)
    } else {
      titleEl.style.color = '#ff4444'
      titleEl.textContent = 'НЕ СОВСЕМ...'
      goBtn.style.display = 'inline-block'
      retryBtn.style.display = 'inline-block'
      // Убираем из слотов только неверные карточки
      window._errorsToFix = errors
    }

    TASKS.forEach((task, i) => {
      const row = document.createElement('div')
      row.className = 'result-row ' + (errors.includes(i) ? 'error' : 'ok')
      row.innerHTML = `
        <span class="row-num">${i + 1}.</span>
        <span>${task.text}</span>
        ${errors.includes(i) ? '<span class="row-err">← ошибка</span>' : ''}
      `
      listEl.appendChild(row)
    })
  }

  checkBtn.addEventListener('click', check)

  closeBtn.addEventListener('click', () => {
    overlay.classList.remove('active')
    window.dispatchEvent(new Event('planning-closed'))
  })

  retryBtn.addEventListener('click', () => {
    // Очищаем только неверные слоты
    if (window._errorsToFix) {
      window._errorsToFix.forEach(i => {
        if (!PREFILLED_PLAN_SLOTS.has(i)) window._planSlots[i] = null
      })
      window._errorsToFix = null
    }
    render()
  })

  goBtn.addEventListener('click', () => {
    overlay.classList.remove('active')
    window.dispatchEvent(new CustomEvent('planning-closed', { detail: { completed: true } }))
  })

  // Открытие извне (из Phaser)
  window.openPlanning = () => {
    window._planSlots = createInitialPlanSlots()
    render()
    overlay.classList.add('active')
  }
}

// Ждём загрузки DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPlanning)
} else {
  initPlanning()
}
