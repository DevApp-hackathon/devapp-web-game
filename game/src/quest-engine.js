// Quest Engine — обрабатывает квесты 1-6 (квест 0 = ноутбук, отдельный файл)

const REFERENCES = {
  1: {
    title: 'ТЕСТИРОВАНИЕ',
    color: '#00aaff',
    items: [
      { term: 'Unit тесты',       desc: 'Тестируют одну функцию. Быстрые и дешёвые — их должно быть больше всего.' },
      { term: 'Integration',      desc: 'Проверяют взаимодействие нескольких модулей между собой.' },
      { term: 'E2E тесты',        desc: 'Полный сценарий пользователя. Медленные — их мало, но они важны.' },
      { term: 'Пирамида тестов',  desc: 'Unit (много) → Integration → E2E (мало). Чем выше — тем дороже.' },
      { term: 'TDD',              desc: 'Test-Driven Development: сначала пишешь тест, потом код под него.' },
    ]
  },
  2: {
    title: 'АВТОМАТИЗАЦИЯ',
    color: '#ffaa00',
    items: [
      { term: 'CI/CD',            desc: 'Автозапуск тестов и деплоя при каждом коммите в репозиторий.' },
      { term: 'GitHub Actions',   desc: 'Настраивается через .yml файл прямо в папке .github/workflows/.' },
      { term: 'Makefile',         desc: 'Стандартизирует команды: make build, make test, make deploy.' },
      { term: 'Docker',           desc: 'Контейнер = одинаковое окружение на всех машинах и в продакшене.' },
      { term: 'DRY принцип',      desc: 'Don\'t Repeat Yourself — автоматизируй всё что делаешь чаще 2 раз.' },
    ]
  },
  3: {
    title: 'ЛОГИРОВАНИЕ',
    color: '#aa44ff',
    items: [
      { term: 'Уровни логов',     desc: 'ERROR > WARN > INFO > DEBUG. ERROR — критично, DEBUG — подробности.' },
      { term: 'JSON-логи',        desc: 'Структурированный формат. Легко искать, фильтровать и строить графики.' },
      { term: 'ELK Stack',        desc: 'Elasticsearch + Logstash + Kibana — стандарт хранения и поиска логов.' },
      { term: 'Ключевые поля',    desc: 'timestamp, level, message, service, traceId — минимум для любого лога.' },
      { term: 'MTTR',             desc: 'Mean Time To Recovery — среднее время восстановления. Логи снижают его.' },
    ]
  },
  4: {
    title: 'МОНИТОРИНГ',
    color: '#ff4488',
    items: [
      { term: '4 Golden Signals', desc: 'Latency, Traffic, Errors, Saturation — стандарт Google SRE для алертов.' },
      { term: 'Prometheus',       desc: 'Система сбора метрик в формате time series. Pull-модель опроса сервисов.' },
      { term: 'Grafana',          desc: 'Визуализация метрик. Строит дашборды и отправляет алерты по порогам.' },
      { term: 'SLO / SLA',        desc: 'SLO — внутренняя цель доступности. SLA — договорённость с клиентом.' },
      { term: 'Алерт',            desc: 'Автоуведомление при превышении порога. Должен будить до пользователей.' },
    ]
  },
  5: {
    title: 'КАЧЕСТВО И СКОРОСТЬ',
    color: '#44ddff',
    items: [
      { term: 'Quality Gate',     desc: 'Автопроверка перед мержем: тесты, security scan, линтер.' },
      { term: 'Технический долг', desc: 'Цена отложенных решений. Со временем растёт и тормозит разработку.' },
      { term: 'Feature Flag',     desc: 'Выпускаешь код скрытым, включаешь по кнопке. Безопасный деплой.' },
      { term: 'DORA метрики',     desc: 'Deployment Frequency, Lead Time, MTTR, Change Failure Rate.' },
      { term: 'Hotfix',           desc: 'Срочный фикс в прод. Нужен автоматизированный CI/CD чтобы сделать быстро.' },
    ]
  },
  6: {
    title: 'ДЕПЛОЙ',
    color: '#ff8800',
    items: [
      { term: 'Blue/Green',       desc: 'Два одинаковых окружения. Переключаешь трафик мгновенно — ноль даунтайма.' },
      { term: 'Rolling deploy',   desc: 'Постепенная замена инстансов новой версией. Без остановки сервиса.' },
      { term: 'Health check',     desc: 'Проверка что сервис жив после деплоя. Обычно GET /health → 200 OK.' },
      { term: 'Rollback',         desc: 'Откат на предыдущую версию. Должен быть одной командой, в идеале — авто.' },
      { term: 'Smoke test',       desc: 'Быстрая проверка ключевых функций сразу после деплоя в прод.' },
    ]
  },
}

const QUEST_DATA = {

  // ── СЕРВЕР: Автотесты ──────────────────────────────────────────
  1: {
    title: 'СЕРВЕР: ТЕСТИРОВАНИЕ',
    intro: [
      {
        bot: 'Тесты — это страховка\nдля твоего кода.',
        text: 'Каждый раз когда меняется код — что-то может сломаться.\nТесты проверяют это автоматически,\nдо того как пользователь увидит баг.',
        color: '#00aaff'
      },
      {
        bot: 'Есть три уровня:\nUnit, Integration, E2E.',
        text: 'Unit — тестируют одну функцию (быстро, много).\nIntegration — проверяют взаимодействие модулей.\nE2E — полный сценарий пользователя (медленно, мало).',
        color: '#00aaff'
      }
    ],
    choices: [
      {
        text: 'Выпустить\nбез тестов',
        progressDelta: 10, angerDelta: 20, stressDelta: 20, correct: false,
        explanation: 'Ошибка. Без тестов команда\nузнает о проблемах слишком поздно.',
        tip: 'Автоматизируй то, что повторяется чаще всего.',
        reference: REFERENCES[1],
        minigame: {
          type: 'bubbles',
          title: '🐛 БАГИ В ПРОДАКШЕНЕ!',
          subtitle: 'Кликай по багам чтобы фиксить. Но без тестов они появляются быстрее...',
          label: '🐛 БАГ',
          color: '#ff4444',
          spawnMs: 1000,
          total: 10,
          maxActive: 5,
          endTitle: 'ПРОДАКШЕН В ОГНЕ',
          endText: 'Без автотестов баги находят\nсебя в продакшене. Фикс в проде\nстоит в 10x дороже чем до релиза.',
          btnLabel: 'ПОНЯЛ →'
        }
      },
      {
        text: 'Добавить базовые\nавтотесты',
        progressDelta: 15, angerDelta: -5, stressDelta: -10, correct: true,
        explanation: 'Верно! Автотесты помогают быстро\nпроверять критичные части.',
        tip: 'Автоматизируй то, что повторяется чаще всего.',
        reference: REFERENCES[1],
        minigame: {
          type: 'queue',
          title: '🧪 СОБЕРИ ПИРАМИДУ ТЕСТОВ',
          subtitle: 'Кликай по уровням в правильном порядке — от основы к вершине',
          items: [
            { id: 2, text: 'E2E тесты\n(полный сценарий)' },
            { id: 0, text: 'Unit тесты\n(одна функция)' },
            { id: 1, text: 'Integration тесты\n(взаимодействие)' },
          ],
          correctOrder: [0, 1, 2],
          successTitle: '✓ ПИРАМИДА СОБРАНА!',
          successText: 'Unit тестов много — они быстрые и дешёвые.\nIntegration проверяют модули вместе.\nE2E мало — они медленные но важные.',
          btnLabel: 'ОТЛИЧНО! →'
        }
      },
      {
        text: 'Проверить всё\nвручную',
        progressDelta: 8, angerDelta: 8, stressDelta: 15, correct: false,
        explanation: 'Частично верно. Ручная проверка\nплохо масштабируется.',
        tip: 'Автоматизируй то, что повторяется чаще всего.',
        reference: REFERENCES[1],
        minigame: {
          type: 'clicker',
          title: 'РУЧНОЕ ТЕСТИРОВАНИЕ',
          steps: [
            { cmd: 'Открыть браузер', time: '2 мин', note: '' },
            { cmd: 'Войти в систему', time: '1 мин', note: '' },
            { cmd: 'Проверить регистрацию', time: '5 мин', note: '' },
            { cmd: 'Проверить оплату', time: '8 мин', note: '⚠ нашёл баг, записал' },
            { cmd: 'Проверить уведомления', time: '4 мин', note: '' },
            { cmd: 'Проверить мобильную версию', time: '6 мин', note: '' },
            { cmd: 'Написать отчёт', time: '10 мин', note: '' },
            { cmd: 'Следующий релиз: всё заново', time: '36 мин', note: '😩 каждый раз так...' },
          ],
          endTitle: 'ТЕСТИРОВАНИЕ ЗАВЕРШЕНО',
          endStats: [
            { label: 'Время на тест', value: '36 минут' },
            { label: 'Автоматизировано', value: '0%' },
            { label: 'Следующий релиз', value: 'снова 36 мин' },
          ],
          endText: 'Ручное тестирование не масштабируется.\nC автотестами это заняло бы 3 минуты.',
          btnLabel: 'УЧТУ →'
        }
      }
    ]
  },

  // ── WHITEBOARD: Автоматизация сборки ──────────────────────────
  2: {
    title: 'WHITEBOARD: АВТОМАТИЗАЦИЯ',
    intro: [
      {
        bot: 'Ручная рутина\nубивает команду.',
        text: 'Если каждую неделю команда вручную копирует файлы,\nзапускает скрипты и деплоит — это потеря времени.\nВремя = деньги инвесторов.',
        color: '#ffaa00'
      },
      {
        bot: 'Автоматизация = больше\nвремени на фичи.',
        text: 'Make, Docker, bash-скрипты, GitHub Actions —\nлюбой инструмент который убирает ручной труд.\nОднажды настроил — работает всегда.',
        color: '#ffaa00'
      }
    ],
    choices: [
      {
        text: 'Оставить ручной\nпроцесс',
        progressDelta: 5, angerDelta: 15, stressDelta: 20, correct: false,
        explanation: 'Ошибка. Маленькая команда особенно\nстрадает от ручной рутины.',
        tip: 'DevOps начинается там, где повторяемые действия автоматизируются.',
        reference: REFERENCES[2],
        minigame: {
          type: 'clicker',
          title: 'РУЧНАЯ СБОРКА — КАЖДУЮ НЕДЕЛЮ',
          steps: [
            { cmd: 'git pull && git merge', time: '3 мин', note: '' },
            { cmd: 'npm install', time: '5 мин', note: '⚠ конфликт версий...' },
            { cmd: 'npm run build', time: '8 мин', note: '' },
            { cmd: 'Копировать файлы на сервер', time: '4 мин', note: '' },
            { cmd: 'Перезапустить приложение', time: '2 мин', note: '' },
            { cmd: 'Проверить что работает', time: '10 мин', note: '🔴 упала страница оплаты!' },
            { cmd: 'Откатить изменения', time: '15 мин', note: '😰 снова вручную...' },
            { cmd: 'И так КАЖДУЮ неделю', time: '47 мин', note: '🔁 повтор × 52 раза в год' },
          ],
          endTitle: 'РУТИНА ЗАСАСЫВАЕТ',
          endStats: [
            { label: 'Время в неделю', value: '47 минут' },
            { label: 'Время в год', value: '40+ часов' },
            { label: 'С автоматизацией', value: '5 минут/нед' },
          ],
          endText: '40 часов в год на ручную сборку —\nэто целая рабочая неделя впустую.',
          btnLabel: 'ПОНЯЛ →'
        }
      },
      {
        text: 'Автоматизировать\nсборку и деплой',
        progressDelta: 18, angerDelta: -5, stressDelta: -15, correct: true,
        explanation: 'Верно! Автоматизация освобождает\nвремя команды.',
        tip: 'DevOps начинается там, где повторяемые действия автоматизируются.',
        reference: REFERENCES[2],
        minigame: {
          type: 'configure',
          title: '🔧 ВЫБЕРИ ИНСТРУМЕНТЫ АВТОМАТИЗАЦИИ',
          subtitle: 'Отметь всё что поможет автоматизировать сборку и деплой',
          options: [
            { id: 0, text: 'GitHub Actions / GitLab CI', correct: true },
            { id: 1, text: 'Excel с шагами деплоя', correct: false },
            { id: 2, text: 'Makefile с командами', correct: true },
            { id: 3, text: 'WhatsApp чат команды', correct: false },
            { id: 4, text: 'Docker для окружения', correct: true },
            { id: 5, text: 'Стикеры на мониторе', correct: false },
          ],
          multi: true,
          successTitle: '✓ СТЕК ВЫБРАН!',
          successText: 'GitHub Actions запускает pipeline при каждом коммите.\nMakefile стандартизирует команды.\nDocker гарантирует одинаковое окружение везде.',
          failText: 'Не все инструменты выбраны верно. Попробуй ещё раз.',
          btnLabel: 'НАСТРОИТЬ →'
        }
      },
      {
        text: 'Нанять человека\nдля этого',
        progressDelta: 7, angerDelta: 12, stressDelta: 10, correct: false,
        explanation: 'Ошибка. Наем не решает\nпроблему неэффективного процесса.',
        tip: 'DevOps начинается там, где повторяемые действия автоматизируются.',
        reference: REFERENCES[2],
        minigame: {
          type: 'timer',
          title: 'НОВЫЙ СОТРУДНИК УЧИТСЯ...',
          events: [
            { ms: 2000,  text: '👤 Сотрудник оформлен. Начинает онбординг.' },
            { ms: 4500,  text: '📚 Изучает документацию... (её почти нет)' },
            { ms: 7000,  text: '🔴 Первая ошибка: задеплоил не ту ветку' },
            { ms: 9500,  text: '💸 Ещё одна зарплата. Проблема не решена.' },
            { ms: 12000, text: '😩 Сотрудник уволился. Ищем нового...' },
          ],
          autoEndMs: 14000,
          earlyLabel: 'УВОЛИТЬ',
          endTitle: 'ПРОБЛЕМА НЕ РЕШЕНА',
          endText: 'Новый человек на старый процесс\nне делает процесс лучше.\nАвтоматизация решает причину,\nа не симптом.',
          btnLabel: 'ПОНЯЛ →'
        }
      }
    ]
  },

  // ── АНАЛИЗ ЛОГОВ: Логирование ─────────────────────────────────
  3: {
    title: 'АНАЛИЗ ЛОГОВ: ЛОГИРОВАНИЕ',
    intro: [
      {
        bot: 'Без логов — ты слепой\nв тёмной комнате.',
        text: 'Логи — это журнал событий системы.\nКаждая ошибка, каждый запрос, каждое действие\nоставляет след. Без них — только догадки.',
        color: '#aa44ff'
      },
      {
        bot: 'Structured logging\n— стандарт индустрии.',
        text: 'JSON-логи с уровнями ERROR/WARN/INFO/DEBUG\nпозволяют искать, фильтровать и строить дашборды.\nELK Stack, Grafana Loki — популярные решения.',
        color: '#aa44ff'
      }
    ],
    choices: [
      {
        text: 'Чинить вслепую',
        progressDelta: 5, angerDelta: 20, stressDelta: 25, correct: false,
        explanation: 'Ошибка. Без данных команда\nтратит время на догадки.',
        tip: 'Если система не оставляет следов, чинить придётся наугад.',
        reference: REFERENCES[3],
        minigame: {
          type: 'configure',
          title: '🔍 ГДЕ БАГ? (БЕЗ ЛОГОВ)',
          subtitle: 'Пользователи жалуются что приложение падает. Логов нет. Угадай где проблема.',
          options: [
            { id: 0, text: '🗄 База данных', correct: false },
            { id: 1, text: '🔐 Авторизация', correct: true },
            { id: 2, text: '💳 Платёжный модуль', correct: false },
            { id: 3, text: '📧 Email сервис', correct: false },
          ],
          multi: false,
          tricky: true,
          successTitle: 'ПОВЕЗЛО!',
          successText: 'Ты угадал — но это была удача.\nБез логов каждый раз придётся угадывать.\nСреднее время поиска бага без логов: 4+ часа.',
          failTitle: 'НЕ УГАДАЛ',
          failText: 'Проблема была в авторизации.\nНо ты потратил часы на другое.\nС логами: ошибка найдена за 5 минут.',
          btnLabel: 'ПОНЯЛ →'
        }
      },
      {
        text: 'Посмотреть логи',
        progressDelta: 15, angerDelta: -5, stressDelta: -10, correct: true,
        explanation: 'Верно! Логи помогают быстро\nнаходить причины проблем.',
        tip: 'Если система не оставляет следов, чинить придётся наугад.',
        reference: REFERENCES[3],
        minigame: {
          type: 'configure',
          title: '📋 НАЙДИ ОШИБКУ В ЛОГАХ',
          subtitle: 'Кликни на строку которая указывает на реальную проблему',
          options: [
            { id: 0, text: '[INFO]  2024-01-15 10:23:01 User logged in: id=1042', correct: false },
            { id: 1, text: '[DEBUG] 2024-01-15 10:23:02 Query executed in 12ms', correct: false },
            { id: 2, text: '[ERROR] 2024-01-15 10:23:03 NullPointerException in AuthService.validate()', correct: true },
            { id: 3, text: '[INFO]  2024-01-15 10:23:04 Request completed: GET /api/users 200', correct: false },
            { id: 4, text: '[WARN]  2024-01-15 10:23:05 Cache miss for key: session_1042', correct: false },
          ],
          multi: false,
          successTitle: '✓ ОШИБКА НАЙДЕНА!',
          successText: 'NullPointerException в AuthService.validate()\n— именно здесь падает авторизация.\nС логами: 30 секунд вместо 4 часов.',
          failTitle: 'НЕ ТА СТРОКА',
          failText: 'Ищи строку с уровнем ERROR —\nименно она указывает на проблему.',
          btnLabel: 'ЗАФИКСИРОВАТЬ →'
        }
      },
      {
        text: 'Сказать что проблема\n"у пользователей"',
        progressDelta: 0, angerDelta: 25, stressDelta: 15, correct: false,
        explanation: 'Ошибка. Игнорирование проблемы\nразрушает доверие к продукту.',
        tip: 'Если система не оставляет следов, чинить придётся наугад.',
        reference: REFERENCES[3],
        minigame: {
          type: 'timer',
          title: 'ИГНОРИРУЕМ ПРОБЛЕМУ...',
          events: [
            { ms: 2000,  text: '😤 "У вас всё работает? Странно, у нас норм."' },
            { ms: 4000,  text: '📱 5 новых жалоб в поддержку' },
            { ms: 6500,  text: '⭐ Оценка в сторе упала с 4.8 до 3.2' },
            { ms: 9000,  text: '📰 Пост в Twitter: "Ваш сервис сломан"' },
            { ms: 11000, text: '📞 Инвестор звонит. Он видел твит.' },
          ],
          autoEndMs: 13000,
          earlyLabel: 'ПРИЗНАТЬ ПРОБЛЕМУ',
          endTitle: 'РЕПУТАЦИЯ РАЗРУШЕНА',
          endText: 'Игнорирование проблем\nне делает их меньше.\nТолько больше и дороже.',
          btnLabel: 'ПОНЯЛ →'
        }
      }
    ]
  },

  // ── МОНИТОР: Мониторинг ───────────────────────────────────────
  4: {
    title: 'МОНИТОР: МОНИТОРИНГ',
    intro: [
      {
        bot: 'Мониторинг = видеть\nсистему изнутри.',
        text: 'Метрики CPU, памяти, времени ответа, ошибок.\nАлерты которые будят тебя раньше чем\nэто увидят пользователи.',
        color: '#ff4488'
      },
      {
        bot: 'Узнать о проблеме\nот пользователя — поздно.',
        text: 'Среднее время обнаружения инцидента без мониторинга:\n4 часа. С мониторингом: 2 минуты.\nРазница — это репутация и деньги.',
        color: '#ff4488'
      }
    ],
    choices: [
      {
        text: 'Перезапускать\nсервер вручную',
        progressDelta: 5, angerDelta: 15, stressDelta: 25, correct: false,
        explanation: 'Частично верно. Это временная\nмера, а не решение.',
        tip: 'Мониторинг нужен не после катастрофы, а до неё.',
        reference: REFERENCES[4],
        minigame: {
          type: 'bubbles',
          title: '🔴 СЕРВЕР ПАДАЕТ!',
          subtitle: 'Кликай RESTART когда видишь падение. Но причина не устранена...',
          label: '🔴 УПАЛ',
          color: '#ff4444',
          spawnMs: 1500,
          total: 8,
          maxActive: 3,
          endTitle: 'БЕСКОНЕЧНЫЙ ЦИКЛ',
          endText: 'Ты перезапускал сервер 8 раз.\nНо не знаешь ПОЧЕМУ он падает.\nБез мониторинга — это костыль, не фикс.',
          btnLabel: 'ПОНЯЛ →'
        }
      },
      {
        text: 'Подключить\nмониторинг и алерты',
        progressDelta: 15, angerDelta: -5, stressDelta: -15, correct: true,
        explanation: 'Верно! Мониторинг позволяет\nзамечать проблемы раньше.',
        tip: 'Мониторинг нужен не после катастрофы, а до неё.',
        reference: REFERENCES[4],
        minigame: {
          type: 'configure',
          title: '📊 НАСТРОЙ АЛЕРТЫ',
          subtitle: 'Выбери метрики которые важно отслеживать на продакшене',
          options: [
            { id: 0, text: '🔥 CPU > 90% более 5 минут', correct: true },
            { id: 1, text: '🌈 Цвет интерфейса', correct: false },
            { id: 2, text: '💾 Память > 85%', correct: true },
            { id: 3, text: '👤 Имя разработчика', correct: false },
            { id: 4, text: '⏱ Время ответа API > 2 сек', correct: true },
            { id: 5, text: '☕ Сколько кофе выпито', correct: false },
            { id: 6, text: '🔴 Error rate > 1%', correct: true },
          ],
          multi: true,
          successTitle: '✓ МОНИТОРИНГ НАСТРОЕН!',
          successText: 'CPU, память, время ответа и error rate —\nэто четыре главных сигнала здоровья системы.\nTeorema четырёх золотых сигналов (Google SRE).',
          failText: 'Выбери реальные технические метрики,\nне лирические показатели.',
          btnLabel: 'ЗАПУСТИТЬ →'
        }
      },
      {
        text: 'Скрыть проблему\nдо конца демо',
        progressDelta: 0, angerDelta: 20, stressDelta: 20, correct: false,
        explanation: 'Ошибка. Игнорирование инцидента\nтолько ухудшит последствия.',
        tip: 'Мониторинг нужен не после катастрофы, а до неё.',
        reference: REFERENCES[4],
        minigame: {
          type: 'timer',
          title: 'СКРЫВАЕМ ПРОБЛЕМУ...',
          events: [
            { ms: 2000,  text: '🤫 "Всё в порядке, небольшой технический момент"' },
            { ms: 4000,  text: '📉 Сервер упал прямо во время демо' },
            { ms: 6500,  text: '😰 Инвестор видит 502 Bad Gateway на экране' },
            { ms: 9000,  text: '📵 "Нам нужно обсудить ваш технический долг..."' },
            { ms: 11000, text: '💔 Инвестор выходит из встречи раньше времени' },
          ],
          autoEndMs: 13000,
          earlyLabel: 'ПРИЗНАТЬ ПРОБЛЕМУ',
          endTitle: 'ДЕМО ПРОВАЛЕНО',
          endText: 'Скрывать технические проблемы\nот инвесторов — потеря доверия.\nЧестность + план решения ценнее.',
          btnLabel: 'ПОНЯЛ →'
        }
      }
    ]
  },

  // ── GIT РЕПО: Давление инвесторов ─────────────────────────────
  5: {
    title: 'GIT РЕПО: ДАВЛЕНИЕ',
    intro: [
      {
        bot: 'DevOps — это баланс\nскорости и надёжности.',
        text: 'Инвесторы всегда хотят быстрее.\nНо "быстрее без процессов" = технический долг.\nДолг накапливается и тормозит ещё сильнее.',
        color: '#44ddff'
      },
      {
        bot: 'Quality gates —\nне тормоз, а руль.',
        text: 'Автоматические проверки перед мержем:\nтесты, линтер, security scan.\nОни занимают 5 минут. Баг в проде — 5 часов.',
        color: '#44ddff'
      }
    ],
    choices: [
      {
        text: 'Отключить проверки,\nрелизить быстрее',
        progressDelta: 12, angerDelta: 20, stressDelta: 20, correct: false,
        explanation: 'Ошибка. Быстрый релиз без контроля\nприводит к дорогим сбоям.',
        tip: 'Скорость без устойчивости быстро превращается в новые задержки.',
        reference: REFERENCES[5],
        minigame: {
          type: 'clicker',
          title: 'ДЕПЛОИМ БЕЗ ПРОВЕРОК!',
          steps: [
            { cmd: 'git push --force (без review)', time: '1 мин', note: '' },
            { cmd: 'Деплой без тестов', time: '2 мин', note: '✓ быстро!' },
            { cmd: 'Пользователи сообщают об ошибках', time: '15 мин', note: '🔴 что-то сломалось' },
            { cmd: 'Поиск причины без логов', time: '2 часа', note: '😰 не понятно что не так' },
            { cmd: 'Откат на предыдущую версию', time: '30 мин', note: '⚠ данные частично потеряны' },
            { cmd: 'Объяснение инвесторам', time: '1 час', note: '📉 доверие упало' },
          ],
          endTitle: 'СЭКОНОМИЛИ 5 МИНУТ, ПОТЕРЯЛИ 4 ЧАСА',
          endStats: [
            { label: 'Сэкономлено на проверках', value: '5 минут' },
            { label: 'Потрачено на инцидент', value: '4 часа' },
            { label: 'Итог', value: '-3ч 55мин' },
          ],
          endText: 'Quality gates экономят время.\nОни занимают минуты, а инциденты — часы.',
          btnLabel: 'ПОНЯЛ →'
        }
      },
      {
        text: 'Сохранить минимальный\nCI/CD и проверки',
        progressDelta: 15, angerDelta: 0, stressDelta: -5, correct: true,
        explanation: 'Верно! DevOps — баланс скорости\nи надёжности.',
        tip: 'Скорость без устойчивости быстро превращается в новые задержки.',
        reference: REFERENCES[5],
        minigame: {
          type: 'configure',
          title: '⚖ ЧТО ОСТАВИТЬ В PIPELINE?',
          subtitle: 'Инвесторы просят ускориться. Выбери что можно оставить как минимум',
          options: [
            { id: 0, text: '✅ Запуск unit тестов', correct: true },
            { id: 1, text: '🎨 Проверка отступов в коде', correct: false },
            { id: 2, text: '🔐 Security scan зависимостей', correct: true },
            { id: 3, text: '📖 Автогенерация документации', correct: false },
            { id: 4, text: '🚫 Запрет мержа при упавших тестах', correct: true },
            { id: 5, text: '📊 100% coverage enforcement', correct: false },
          ],
          multi: true,
          successTitle: '✓ РАЗУМНЫЙ КОМПРОМИСС!',
          successText: 'Unit тесты + security scan + блок при ошибках.\nЭто минимум который защищает от катастроф.\nЛинтер и 100% coverage можно отключить временно.',
          failText: 'Подумай: что защищает от реальных катастроф?\nА что просто nice-to-have?',
          btnLabel: 'ПРИНЯТЬ →'
        }
      },
      {
        text: 'Заморозить выпуск\nдо лучших времён',
        progressDelta: 3, angerDelta: 10, stressDelta: 10, correct: false,
        explanation: 'Не лучший выбор. Остановка\nне решает управленческую проблему.',
        tip: 'Скорость без устойчивости быстро превращается в новые задержки.',
        reference: REFERENCES[5],
        minigame: {
          type: 'timer',
          title: 'ЖДЁМ ЛУЧШИХ ВРЕМЁН...',
          events: [
            { ms: 2000,  text: '📅 "Выпустим когда всё будет идеально"' },
            { ms: 4000,  text: '🏃 Конкурент выпустил v2.0' },
            { ms: 6500,  text: '😩 Команда теряет мотивацию без релизов' },
            { ms: 9000,  text: '💼 Инвестор: "Когда будет результат?"' },
            { ms: 11500, text: '🔥 "Лучшие времена" не наступают сами.' },
          ],
          autoEndMs: 13500,
          earlyLabel: 'РАЗМОРОЗИТЬ',
          endTitle: 'ИДЕАЛЬНОГО МОМЕНТА НЕТ',
          endText: 'Ожидание идеального момента\n— это антипаттерн в разработке.\nЛучше часто и малыми шагами.',
          btnLabel: 'ПОНЯЛ →'
        }
      }
    ]
  },

  // ── ВЫХОД: Финальный деплой ────────────────────────────────────
  6: {
    title: 'ФИНАЛЬНЫЙ ДЕПЛОЙ!',
    intro: [
      {
        bot: 'Финальный релиз.\nВсё ради этого момента.',
        text: 'Ты прошёл весь путь: CI/CD, тесты, автоматизация,\nлогирование, мониторинг.\nОстался последний шаг — выпустить продукт.',
        color: '#ff8800'
      },
      {
        bot: 'Хороший релиз —\nэто не удача.',
        text: 'Хороший релиз — это выстроенный процесс.\nКогда всё автоматизировано, кнопка "Деплой"\nперестаёт быть страшной.',
        color: '#ff8800'
      }
    ],
    choices: [
      {
        text: 'Релизить вручную\n"как получится"',
        progressDelta: 10, angerDelta: 20, stressDelta: 20, correct: false,
        explanation: 'Ошибка. Ручной выпуск\nповышает вероятность сбоев.',
        tip: 'Хороший релиз — это не удача, а выстроенный процесс.',
        reference: REFERENCES[6],
        minigame: {
          type: 'clicker',
          title: 'ФИНАЛЬНЫЙ РУЧНОЙ ДЕПЛОЙ',
          steps: [
            { cmd: 'Подключиться к серверу', time: '3 мин', note: '' },
            { cmd: 'git pull origin main', time: '2 мин', note: '' },
            { cmd: 'npm install --production', time: '7 мин', note: '⚠ новая зависимость конфликтует' },
            { cmd: 'npm run build', time: '10 мин', note: '' },
            { cmd: 'Скопировать .env вручную', time: '5 мин', note: '🔴 забыл один ключ!' },
            { cmd: 'Искать потерянный ключ', time: '25 мин', note: '😱 это финальный деплой!!!' },
            { cmd: 'Наконец запустить', time: '2 мин', note: '💀 45 минут вместо 5' },
          ],
          endTitle: 'РЕЛИЗ СОСТОЯЛСЯ... ПОЧТИ',
          endStats: [
            { label: 'Время деплоя', value: '54 минуты' },
            { label: 'Инциденты', value: '2' },
            { label: 'С автоматизацией', value: '5 минут' },
          ],
          endText: 'Именно в момент стресса\nнужна автоматизация больше всего.',
          btnLabel: 'ПОНЯЛ →'
        }
      },
      {
        text: 'Автоматизированный\nпайплайн с проверками',
        progressDelta: 20, angerDelta: -10, stressDelta: -20, correct: true,
        explanation: 'Идеально! CI/CD + проверки =\nуверенный релиз.',
        tip: 'Хороший релиз — это не удача, а выстроенный процесс.',
        reference: REFERENCES[6],
        minigame: {
          type: 'clicker',
          title: '🚀 АВТОМАТИЗИРОВАННЫЙ РЕЛИЗ',
          steps: [
            { cmd: 'git push origin main', time: '30 сек', note: '✅ pipeline запустился' },
            { cmd: '▶ Unit тесты: 247 passed', time: '1 мин', note: '✅ все тесты зелёные' },
            { cmd: '▶ Security scan: no vulnerabilities', time: '1 мин', note: '✅ безопасно' },
            { cmd: '▶ Docker build', time: '2 мин', note: '✅ образ собран' },
            { cmd: '▶ Deploy to production', time: '1 мин', note: '✅ задеплоено' },
            { cmd: '▶ Health check: 200 OK', time: '30 сек', note: '✅ всё работает' },
            { cmd: '📢 Команда получила уведомление', time: '—', note: '🎉 РЕЛИЗ УСПЕШЕН!' },
          ],
          endTitle: '🎉 РЕЛИЗ УСПЕШЕН!',
          endStats: [
            { label: 'Время деплоя', value: '6 минут' },
            { label: 'Инциденты', value: '0' },
            { label: 'Ручных действий', value: '1 (git push)' },
          ],
          endText: 'Вот как должен выглядеть\nхороший релиз. Предсказуемо.\nАвтоматически. Уверенно.',
          btnLabel: 'ВЫПУСТИТЬ! 🚀'
        }
      },
      {
        text: 'Отменить запуск,\nждать идеального момента',
        progressDelta: 5, angerDelta: 10, stressDelta: 10, correct: false,
        explanation: 'Не лучший выбор. DevOps помогает\nвыпускать чаще и безопаснее.',
        tip: 'Хороший релиз — это не удача, а выстроенный процесс.',
        reference: REFERENCES[6],
        minigame: {
          type: 'timer',
          title: 'ПЕРЕНОСИМ ФИНАЛЬНЫЙ РЕЛИЗ...',
          events: [
            { ms: 2000,  text: '📅 "Нужно ещё немного доработать..."' },
            { ms: 4000,  text: '💸 Инвестор: "Мы вложили деньги месяц назад"' },
            { ms: 6500,  text: '🏃 Конкурент выпустил похожий продукт' },
            { ms: 9000,  text: '😤 Команда: "Когда мы наконец выпустимся?"' },
            { ms: 11500, text: '📉 Инвестор выходит из проекта.' },
          ],
          autoEndMs: 13500,
          earlyLabel: 'ВЫПУСТИТЬ СЕЙЧАС',
          endTitle: 'МОМЕНТ УПУЩЕН',
          endText: 'Идеального момента не существует.\nDevOps создаёт уверенность\nчтобы выпускать часто и без страха.',
          btnLabel: 'ПОНЯЛ →'
        }
      }
    ]
  }
}

function scaleQuestEngineFonts(content) {
  return content.replace(/font-size:\s*(\d+)px/gi, (_, size) => `font-size:${Number(size) + 4}px`)
}

// ─── ENGINE ────────────────────────────────────────────────────────
function initQuestEngine() {
  let currentQuestId = null
  let slideIndex = 0
  let selectedChoice = null
  let timers = []
  let dragState = { id: null, from: null }
  let sortSlots = []
  let configSelected = new Set()

  const overlay = document.getElementById('quest-overlay')

  function clearTimers() {
    timers.forEach(t => clearTimeout(t))
    timers = []
  }

  function showSection(id) {
    ['quest-intro', 'quest-choice', 'quest-mg',
     'mg-manual', 'mg-cicd', 'mg-delay'].forEach(sid => {
      const el = document.getElementById(sid)
      if (el) el.style.display = sid === id ? 'block' : 'none'
    })
  }

  function done(choiceIndex) {
    overlay.style.display = 'none'
    clearTimers()
    window.dispatchEvent(new CustomEvent('quest-engine-done', {
      detail: { questId: currentQuestId, choiceIndex }
    }))
  }

  function getChoiceCornerPupsHTML() {
    return `<img src="./src/assets/pups.png" style="position:absolute;top:-10px;left:-18px;width:144px;height:144px;object-fit:contain;pointer-events:none;z-index:20;">`
  }

  function getResultPupsHTML(choiceIndex = selectedChoice) {
    const isCorrect = QUEST_DATA[currentQuestId]?.choices?.[choiceIndex]?.correct
    const src = isCorrect ? './src/assets/pups_smile.png' : './src/assets/pups_no_smile.png'
    return `<div style="display:flex;justify-content:center;margin-bottom:18px;">
      <img src="${src}" style="width:264px;height:264px;object-fit:contain;display:block;">
    </div>`
  }

  // ─── INTRO ─────────────────────────────────────────────────────
  function renderIntro() {
    showSection('quest-intro')
    const quest = QUEST_DATA[currentQuestId]
    const slide = quest.intro[slideIndex]
    const isLast = slideIndex === quest.intro.length - 1
    const el = document.getElementById('quest-intro')

    el.innerHTML = scaleQuestEngineFonts(`
      <div style="font-size:17px;color:${slide.color};text-align:center;margin-bottom:22px;">${quest.title}</div>
      <div style="display:flex;align-items:flex-start;gap:40px;margin-bottom:32px;">
        <div style="flex-shrink:0;text-align:center;">
          <img src="./src/assets/DevBot.png" style="width:200px;height:200px;object-fit:contain;display:block;">
          <div style="font-size:11px;color:#555;margin-top:10px;">DevBot</div>
        </div>
        <div style="background:#1e1e3e;border:1px solid ${slide.color};border-radius:8px;padding:22px;flex:1;font-size:14px;color:${slide.color};line-height:2.2;white-space:pre-line;margin-top:28px;">${slide.bot}</div>
      </div>
      <div style="background:#161628;border:1px solid #333355;border-radius:8px;padding:28px;margin-bottom:26px;font-size:15px;color:#fff;line-height:2.25;white-space:pre-line;">${slide.text}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div style="font-size:11px;color:#444;">${slideIndex + 1} / ${quest.intro.length}</div>
        <button id="eq-intro-next" style="padding:16px 28px;background:${isLast ? '#00ff88' : '#00d4ff'};border:none;border-radius:6px;font-family:'Press Start 2P',monospace;font-size:14px;color:#0d0d1f;cursor:pointer;">
          ${isLast ? 'ВЫБРАТЬ →' : 'ДАЛЕЕ →'}
        </button>
      </div>
    `)
    document.getElementById('eq-intro-next').onclick = () => {
      if (isLast) renderChoice()
      else { slideIndex++; renderIntro() }
    }
  }

  // ─── CHOICE ────────────────────────────────────────────────────
  function renderChoice() {
    showSection('quest-choice')
    const quest = QUEST_DATA[currentQuestId]
    const used = window._usedChoices?.[currentQuestId] || new Set()
    const el = document.getElementById('quest-choice')
    el.innerHTML = scaleQuestEngineFonts(`
      <div style="position:relative;overflow:visible;">
        ${getChoiceCornerPupsHTML()}
        <div style="margin-left:120px;margin-bottom:22px;">
          <div style="font-size:15px;color:#00d4ff;text-align:center;margin-bottom:14px;">${quest.title}</div>
          <div style="font-size:10px;color:#666;text-align:center;line-height:1.8;">Выбери вариант — и пройди мини-задание</div>
        </div>
      </div>
      <div style="position:relative;background:#161628;border:1px solid #333355;border-radius:8px;padding:32px 22px 22px;overflow:visible;">
        <div style="display:flex;flex-direction:column;gap:18px;position:relative;z-index:2;">
          ${quest.choices.map((c, i) => {
            const isUsed = used.has(i)
            return `<button data-ci="${i}" ${isUsed ? 'disabled' : ''} style="min-height:120px;padding:30px 22px;background:${isUsed ? '#161622' : '#2a2a4a'};border:1px solid ${isUsed ? '#2a2a3a' : '#444466'};border-radius:8px;font-family:'Press Start 2P',monospace;font-size:17px;color:${isUsed ? '#444455' : '#fff'};cursor:${isUsed ? 'not-allowed' : 'pointer'};text-align:center;line-height:2.05;transition:background 0.2s;">
              ${isUsed ? '✓ ' : ''}${c.text.replace('\n', '<br>')}
            </button>`
          }).join('')}
        </div>
      </div>
    `)
    el.querySelectorAll('[data-ci]:not([disabled])').forEach(btn => {
      btn.onmouseenter = () => btn.style.background = '#3a3a6a'
      btn.onmouseleave = () => btn.style.background = '#2a2a4a'
      btn.onclick = () => {
        selectedChoice = parseInt(btn.dataset.ci)
        renderMinigame(QUEST_DATA[currentQuestId].choices[selectedChoice].minigame)
      }
    })
  }

  // ─── MINIGAME ROUTER ───────────────────────────────────────────
  function renderMinigame(cfg) {
    showSection('quest-mg')
    configSelected = new Set()
    sortSlots = []
    switch (cfg.type) {
      case 'clicker':   renderClicker(cfg); break
      case 'timer':     renderTimer(cfg); break
      case 'configure': renderConfigure(cfg); break
      case 'bubbles':   renderBubbles(cfg); break
      case 'queue':     renderQueue(cfg); break
    }
  }

  // ─── CLICKER ───────────────────────────────────────────────────
  function renderClicker(cfg) {
    const el = document.getElementById('quest-mg')
    let step = 0
    let totalTime = 0

    function draw() {
      if (step >= cfg.steps.length) {
        el.innerHTML = scaleQuestEngineFonts(`
          ${getResultPupsHTML()}
          <div style="font-size:18px;color:#ff8866;text-align:center;margin-bottom:20px;">${cfg.endTitle}</div>
          <div style="background:#1a0a0a;border:1px solid #cc4400;border-radius:8px;padding:26px;margin-bottom:18px;">
            ${cfg.endStats.map(s => `
              <div style="display:flex;justify-content:space-between;font-size:12px;padding:10px 0;border-bottom:1px solid #2a1a1a;color:#ffaa88;">
                <span>${s.label}</span><span style="color:#fff;">${s.value}</span>
              </div>
            `).join('')}
          </div>
          <div style="font-size:12px;color:#888;margin-bottom:26px;line-height:2.25;text-align:center;white-space:pre-line;">${cfg.endText}</div>
          <button id="cl-done" style="width:100%;padding:18px;background:#ff8844;border:none;border-radius:6px;font-family:'Press Start 2P',monospace;font-size:14px;color:#fff;cursor:pointer;">${cfg.btnLabel}</button>
        `)
        document.getElementById('cl-done').onclick = () => done(selectedChoice)
        return
      }

      const s = cfg.steps[step]
      const isLast = cfg.steps[step].time === '—' || step === cfg.steps.length - 1
      el.innerHTML = scaleQuestEngineFonts(`
        <div style="font-size:10px;color:#ff8866;text-align:center;margin-bottom:10px;">${cfg.title}</div>
        <div style="font-size:7px;color:#555;margin-bottom:12px;">Шаг ${step + 1} из ${cfg.steps.length}</div>
        <div style="background:#0d0d1a;border:1px solid #333;border-radius:6px;padding:14px;margin-bottom:10px;">
          <div style="font-size:10px;color:#00ff88;font-family:monospace;margin-bottom:6px;">$ ${s.cmd}</div>
          ${s.time !== '—' ? `<div style="font-size:7px;color:#666;">⏱ ${s.time}</div>` : ''}
          ${s.note ? `<div style="font-size:8px;color:#ff8866;margin-top:6px;">${s.note}</div>` : ''}
        </div>
        <div style="display:flex;gap:4px;margin-bottom:14px;">
          ${cfg.steps.map((_, i) => `<div style="flex:1;height:3px;border-radius:2px;background:${i < step ? '#00ff88' : i === step ? '#ff8866' : '#333'};"></div>`).join('')}
        </div>
        <button id="cl-next" style="width:100%;padding:12px;background:#2a2a4a;border:1px solid #444;border-radius:6px;font-family:'Press Start 2P',monospace;font-size:9px;color:#fff;cursor:pointer;">
          ${step < cfg.steps.length - 1 ? 'ВЫПОЛНИТЬ ►' : 'ЗАВЕРШИТЬ ►'}
        </button>
      `)
      document.getElementById('cl-next').onclick = () => { step++; draw() }
    }
    draw()
  }

  // ─── TIMER ─────────────────────────────────────────────────────
  function renderTimer(cfg) {
    clearTimers()
    const el = document.getElementById('quest-mg')
    const start = Date.now()

    el.innerHTML = scaleQuestEngineFonts(`
      <div style="font-size:10px;color:#ffaa00;text-align:center;margin-bottom:8px;">${cfg.title}</div>
      <div style="text-align:center;font-size:20px;color:#fff;margin-bottom:12px;" id="eq-timer">0 сек</div>
      <div id="eq-events" style="min-height:180px;display:flex;flex-direction:column;gap:8px;margin-bottom:14px;"></div>
      <button id="eq-early" style="width:100%;padding:11px;background:#ffaa00;border:none;border-radius:6px;font-family:'Press Start 2P',monospace;font-size:9px;color:#0d0d1f;cursor:pointer;">${cfg.earlyLabel}</button>
    `)

    const timerEl = document.getElementById('eq-timer')
    const t = setInterval(() => {
      const s = Math.floor((Date.now() - start) / 1000)
      if (timerEl) timerEl.textContent = s + ' сек'
    }, 500)
    timers.push(t)

    cfg.events.forEach(ev => {
      const tid = setTimeout(() => {
        const div = document.createElement('div')
        div.style.cssText = scaleQuestEngineFonts('padding:9px 12px;background:#1f1000;border:1px solid #cc5500;border-radius:6px;font-size:8px;color:#ffaa66;line-height:1.7;')
        div.textContent = ev.text
        const list = document.getElementById('eq-events')
        if (list) list.appendChild(div)
      }, ev.ms)
      timers.push(tid)
    })

    const autoEnd = setTimeout(() => finish(), cfg.autoEndMs)
    timers.push(autoEnd)

    document.getElementById('eq-early').onclick = finish

    function finish() {
      clearTimers()
      const elapsed = Math.floor((Date.now() - start) / 1000)
      el.innerHTML = scaleQuestEngineFonts(`
        ${getResultPupsHTML()}
        <div style="font-size:18px;color:#ff4444;text-align:center;margin-bottom:20px;">${cfg.endTitle}</div>
        <div style="background:#1a0808;border:1px solid #cc4444;border-radius:8px;padding:26px;margin-bottom:20px;font-size:13px;color:#ffaaaa;line-height:2.25;text-align:center;white-space:pre-line;">${cfg.endText}</div>
        <button id="eq-timer-done" style="width:100%;padding:18px;background:#ff4444;border:none;border-radius:6px;font-family:'Press Start 2P',monospace;font-size:14px;color:#fff;cursor:pointer;">${cfg.btnLabel}</button>
      `)
      document.getElementById('eq-timer-done').onclick = () => done(selectedChoice)
    }
  }

  // ─── CONFIGURE ─────────────────────────────────────────────────
  function renderConfigure(cfg) {
    const el = document.getElementById('quest-mg')
    configSelected = new Set()

    function draw() {
      el.innerHTML = scaleQuestEngineFonts(`
        <div style="font-size:10px;color:#00ff88;text-align:center;margin-bottom:8px;">${cfg.title}</div>
        <div style="font-size:8px;color:#666;text-align:center;margin-bottom:14px;line-height:1.7;">${cfg.subtitle}</div>
        <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px;">
          ${cfg.options.map(opt => `
            <button data-oid="${opt.id}" style="padding:10px 14px;background:${configSelected.has(opt.id) ? '#1a3a2a' : '#1a1a3a'};border:1px solid ${configSelected.has(opt.id) ? '#00aa44' : '#333355'};border-radius:6px;font-family:'Press Start 2P',monospace;font-size:8px;color:${configSelected.has(opt.id) ? '#00ff88' : '#fff'};cursor:pointer;text-align:left;line-height:1.7;transition:all 0.15s;">
              ${configSelected.has(opt.id) ? '☑ ' : '☐ '}${opt.text}
            </button>
          `).join('')}
        </div>
        <div id="cfg-msg" style="font-size:8px;text-align:center;min-height:14px;margin-bottom:10px;"></div>
        <button id="cfg-check" style="width:100%;padding:11px;background:#00d4ff;border:none;border-radius:6px;font-family:'Press Start 2P',monospace;font-size:10px;color:#0d0d1f;cursor:pointer;">ПРОВЕРИТЬ</button>
      `)
      el.querySelectorAll('[data-oid]').forEach(btn => {
        btn.onclick = () => {
          const id = parseInt(btn.dataset.oid)
          if (!cfg.multi) { configSelected.clear(); configSelected.add(id) }
          else { if (configSelected.has(id)) configSelected.delete(id); else configSelected.add(id) }
          draw()
        }
      })
      document.getElementById('cfg-check').onclick = () => check()
    }

    function check() {
      if (configSelected.size === 0) {
        document.getElementById('cfg-msg').innerHTML = '<span style="color:#ffaa00">Выбери хотя бы один вариант!</span>'
        return
      }
      const correctIds = new Set(cfg.options.filter(o => o.correct).map(o => o.id))
      const isCorrect = cfg.multi
        ? [...correctIds].every(id => configSelected.has(id)) && [...configSelected].every(id => correctIds.has(id))
        : configSelected.size === 1 && correctIds.has([...configSelected][0])

      if (isCorrect || (cfg.tricky && !isCorrect)) {
        const title = isCorrect ? (cfg.successTitle || '✓ ВЕРНО!') : (cfg.failTitle || 'НЕ УГАДАЛ')
        const text  = isCorrect ? cfg.successText : (cfg.failText || cfg.successText)
        const color = isCorrect ? '#00ff88' : '#ff4444'
        el.innerHTML = scaleQuestEngineFonts(`
          ${getResultPupsHTML()}
          <div style="font-size:18px;color:${color};text-align:center;margin-bottom:20px;">${title}</div>
          <div style="background:${isCorrect ? '#0a1a0a' : '#1a0a0a'};border:1px solid ${isCorrect ? '#00aa44' : '#cc4444'};border-radius:8px;padding:26px;margin-bottom:20px;font-size:12px;color:${isCorrect ? '#aaffaa' : '#ffaaaa'};line-height:2.2;white-space:pre-line;">${text}</div>
          <button id="cfg-done" style="width:100%;padding:18px;background:${color};border:none;border-radius:6px;font-family:'Press Start 2P',monospace;font-size:14px;color:#0d0d1f;cursor:pointer;">${cfg.btnLabel}</button>
        `)
        document.getElementById('cfg-done').onclick = () => done(selectedChoice)
      } else {
        document.getElementById('cfg-msg').innerHTML = `<span style="color:#ffaa00">${cfg.failText || 'Не совсем. Попробуй ещё раз.'}</span>`
      }
    }

    draw()
  }

  // ─── BUBBLES ───────────────────────────────────────────────────
  function renderBubbles(cfg) {
    clearTimers()
    const el = document.getElementById('quest-mg')
    let clicked = 0
    let active = 0
    let spawned = 0

    el.innerHTML = scaleQuestEngineFonts(`
      <div style="font-size:10px;color:${cfg.color};text-align:center;margin-bottom:6px;">${cfg.title}</div>
      <div style="font-size:8px;color:#666;text-align:center;margin-bottom:10px;">${cfg.subtitle}</div>
      <div id="bub-field" style="position:relative;height:220px;background:#0d0d1a;border:1px solid #333;border-radius:8px;overflow:hidden;margin-bottom:10px;"></div>
      <div style="display:flex;justify-content:space-between;font-size:8px;color:#666;">
        <span>Зафиксировано: <span id="bub-score" style="color:#00ff88;">0</span></span>
        <span>Активных: <span id="bub-active" style="color:#ff4444;">0</span></span>
      </div>
    `)

    function spawn() {
      if (spawned >= cfg.total) return
      if (active >= cfg.maxActive) {
        const t = setTimeout(spawn, cfg.spawnMs)
        timers.push(t)
        return
      }

      spawned++
      active++

      const field = document.getElementById('bub-field')
      if (!field) return

      const bub = document.createElement('div')
      const x = 10 + Math.random() * 80
      const y = 10 + Math.random() * 70
      bub.style.cssText = scaleQuestEngineFonts(`position:absolute;left:${x}%;top:${y}%;transform:translate(-50%,-50%);
        padding:6px 10px;background:${cfg.color};border-radius:20px;font-family:'Press Start 2P',monospace;
        font-size:8px;color:#fff;cursor:pointer;white-space:nowrap;animation:pulse 0.5s infinite alternate;`)
      bub.textContent = cfg.label
      bub.onclick = () => {
        bub.remove()
        active--
        clicked++
        const scoreEl = document.getElementById('bub-score')
        const activeEl = document.getElementById('bub-active')
        if (scoreEl) scoreEl.textContent = clicked
        if (activeEl) activeEl.textContent = active
        if (clicked + active >= cfg.total) finish()
      }
      field.appendChild(bub)
      document.getElementById('bub-active').textContent = active

      const t = setTimeout(spawn, cfg.spawnMs)
      timers.push(t)
    }

    function finish() {
      clearTimers()
      el.innerHTML = scaleQuestEngineFonts(`
        ${getResultPupsHTML()}
        <div style="font-size:18px;color:${cfg.color};text-align:center;margin-bottom:20px;">${cfg.endTitle}</div>
        <div style="background:#1a0808;border:1px solid ${cfg.color};border-radius:8px;padding:26px;margin-bottom:20px;font-size:13px;color:#ffaaaa;line-height:2.25;text-align:center;white-space:pre-line;">${cfg.endText}</div>
        <button id="bub-done" style="width:100%;padding:18px;background:${cfg.color};border:none;border-radius:6px;font-family:'Press Start 2P',monospace;font-size:14px;color:#fff;cursor:pointer;">${cfg.btnLabel}</button>
      `)
      document.getElementById('bub-done').onclick = () => done(selectedChoice)
    }

    const t = setTimeout(spawn, 500)
    timers.push(t)

    const autoEnd = setTimeout(finish, cfg.spawnMs * cfg.total + 5000)
    timers.push(autoEnd)
  }

  // ─── QUEUE (click-to-order) ────────────────────────────────────
  function renderQueue(cfg) {
    const el = document.getElementById('quest-mg')
    let queue = []

    function draw() {
      el.innerHTML = scaleQuestEngineFonts(`
        <div style="font-size:10px;color:#00ff88;text-align:center;margin-bottom:8px;">${cfg.title}</div>
        <div style="font-size:8px;color:#666;text-align:center;margin-bottom:14px;line-height:1.7;">${cfg.subtitle}</div>
        <div style="display:flex;gap:12px;margin-bottom:12px;">
          <div style="flex:1;">
            <div style="font-size:7px;color:#666;margin-bottom:8px;text-align:center;">ДОСТУПНО</div>
            ${cfg.items.filter(it => !queue.includes(it.id)).map(it => `
              <button data-qid="${it.id}" style="width:100%;padding:10px;background:#1a1a3a;border:1px solid #333366;border-radius:6px;margin-bottom:6px;font-family:'Press Start 2P',monospace;font-size:8px;color:#fff;cursor:pointer;line-height:1.7;white-space:pre-line;">${it.text}</button>
            `).join('')}
          </div>
          <div style="flex:1;">
            <div style="font-size:7px;color:#666;margin-bottom:8px;text-align:center;">МОЙ ПОРЯДОК</div>
            ${queue.map((id, i) => {
              const item = cfg.items.find(it => it.id === id)
              return `<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
                <span style="font-size:8px;color:#444;min-width:16px;">${i+1}.</span>
                <button data-rid="${id}" style="flex:1;padding:10px;background:#1a3a2a;border:1px solid #00aa44;border-radius:6px;font-family:'Press Start 2P',monospace;font-size:8px;color:#00ff88;cursor:pointer;line-height:1.7;white-space:pre-line;">${item.text}</button>
              </div>`
            }).join('')}
            ${queue.length < cfg.items.length ? `<div style="height:48px;border:1px dashed #333;border-radius:6px;margin-bottom:6px;display:flex;align-items:center;justify-content:center;font-size:7px;color:#333;">← добавь элемент</div>` : ''}
          </div>
        </div>
        <div id="queue-msg" style="font-size:8px;text-align:center;min-height:14px;margin-bottom:8px;"></div>
        <div style="display:flex;gap:8px;">
          <button id="q-reset" style="flex:1;padding:10px;background:#333;border:none;border-radius:6px;font-family:'Press Start 2P',monospace;font-size:8px;color:#aaa;cursor:pointer;">СБРОСИТЬ</button>
          <button id="q-check" style="flex:2;padding:10px;background:#00d4ff;border:none;border-radius:6px;font-family:'Press Start 2P',monospace;font-size:9px;color:#0d0d1f;cursor:pointer;">ПРОВЕРИТЬ</button>
        </div>
      `)
      el.querySelectorAll('[data-qid]').forEach(btn => {
        btn.onclick = () => { queue.push(parseInt(btn.dataset.qid)); draw() }
      })
      el.querySelectorAll('[data-rid]').forEach(btn => {
        btn.onclick = () => { queue = queue.filter(id => id !== parseInt(btn.dataset.rid)); draw() }
      })
      document.getElementById('q-reset').onclick = () => { queue = []; draw() }
      document.getElementById('q-check').onclick = () => {
        if (queue.length < cfg.items.length) {
          document.getElementById('queue-msg').innerHTML = '<span style="color:#ffaa00">Добавь все элементы!</span>'
          return
        }
        const isCorrect = queue.every((id, i) => id === cfg.correctOrder[i])
        if (isCorrect) {
          el.innerHTML = scaleQuestEngineFonts(`
            ${getResultPupsHTML()}
            <div style="font-size:18px;color:#00ff88;text-align:center;margin-bottom:20px;">${cfg.successTitle}</div>
            <div style="background:#0a1a0a;border:1px solid #00aa44;border-radius:8px;padding:26px;margin-bottom:20px;font-size:12px;color:#aaffaa;line-height:2.2;white-space:pre-line;">${cfg.successText}</div>
            <button id="q-done" style="width:100%;padding:18px;background:#00ff88;border:none;border-radius:6px;font-family:'Press Start 2P',monospace;font-size:14px;color:#0d0d1f;cursor:pointer;">${cfg.btnLabel}</button>
          `)
          document.getElementById('q-done').onclick = () => done(selectedChoice)
        } else {
          const errors = queue.map((id, i) => id !== cfg.correctOrder[i] ? i : -1).filter(i => i >= 0)
          errors.forEach(i => { queue.splice(i, 1) })
          document.getElementById('queue-msg').innerHTML = '<span style="color:#ff4444">Неверные позиции убраны — попробуй ещё</span>'
          draw()
        }
      }
    }
    draw()
  }

  // ─── OPEN ──────────────────────────────────────────────────────
  window.openQuest = (id) => {
    if (!QUEST_DATA[id]) return
    currentQuestId = id
    slideIndex = 0
    selectedChoice = null
    clearTimers()
    overlay.style.display = 'flex'
    renderIntro()
  }

  const questClose = () => {
    overlay.style.display = 'none'
    clearTimers()
    window.dispatchEvent(new Event('quest-engine-closed'))
  }
  document.getElementById('quest-close').addEventListener('click', questClose)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initQuestEngine)
} else {
  initQuestEngine()
}

window.QUEST_DATA = QUEST_DATA
