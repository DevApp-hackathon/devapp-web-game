export const SANDBOX_THEMES = {
  manual_ops: {
    order: 1,
    color: '#ff8844',
    title: 'РУЧНЫЕ ПРОЦЕССЫ',
    summary: 'Ты несколько раз полагался на ручные действия и героизм вместо воспроизводимого процесса.',
    reproduceTitle: 'Сломай процесс вручную',
    reproduceText: 'Команда снова собирает и выкатывает продукт руками. Один забытый шаг ломает весь релиз.',
    wrongAction: 'СДЕЛАТЬ ВСЁ РУКАМИ',
    instantImpact: 'Пропущенный шаг. Старый .env. Даунтайм и хаос.',
    whyWrong: 'Ручные шаги не масштабируются, не документируются в коде и ломают повторяемость. Процесс остаётся в памяти людей, а не в системе.',
    fixTitle: 'Как исправить',
    fixText: 'Перенеси build, test и deploy в pipeline. Пусть релиз зависит от проверок и автоматических шагов, а не от внимательности человека.',
    quizQuestion: 'Что лучше всего убирает ручной хаос?',
    quizOptions: [
      { text: 'Pipeline с тестами и деплоем', correct: true },
      { text: 'Отдельный человек для ручных релизов', correct: false },
      { text: 'Чеклист в чате и надежда', correct: false },
    ],
    quizExplain: 'Даже хороший чеклист не делает процесс воспроизводимым. Это делает pipeline.'
  },
  skip_quality: {
    order: 2,
    color: '#ff5555',
    title: 'СКОРОСТЬ БЕЗ ПРОВЕРОК',
    summary: 'Ты жертвовал тестами и quality gate ради мнимого ускорения.',
    reproduceTitle: 'Убери проверки',
    reproduceText: 'Релиз хочется ускорить прямо сейчас. Самый соблазнительный путь — отключить то, что ловит ошибки заранее.',
    wrongAction: 'ВЫКАТИТЬ БЕЗ ПРОВЕРОК',
    instantImpact: 'Быстро выкатывается только проблема. Откат и инцидент обходятся дороже.',
    whyWrong: 'Тесты и минимальные quality gate экономят время не до релиза, а после него. Без них цена ошибки сдвигается в продакшн.',
    fixTitle: 'Как исправить',
    fixText: 'Оставляй хотя бы базовые проверки: unit-тесты, fail-fast на упавшем пайплайне и минимальный security scan. Скорость должна быть устойчивой.',
    quizQuestion: 'Что оставить даже под давлением сроков?',
    quizOptions: [
      { text: 'Минимальный набор автоматических проверок', correct: true },
      { text: 'Только ручную проверку перед демо', correct: false },
      { text: 'Вообще ничего, лишь бы быстрее', correct: false },
    ],
    quizExplain: 'Быстрый релиз без контроля обычно просто переносит боль на следующую минуту после выката.'
  },
  no_observability: {
    order: 3,
    color: '#aa44ff',
    title: 'СЛЕПАЯ ЭКСПЛУАТАЦИЯ',
    summary: 'Ты пытался реагировать на проблемы без логов, мониторинга и ясного сигнала о причине.',
    reproduceTitle: 'Чини вслепую',
    reproduceText: 'Продакшн уже дымится, но вместо сигналов у команды только догадки и ручные действия.',
    wrongAction: 'ГАДАТЬ И ПЕРЕЗАПУСКАТЬ',
    instantImpact: 'Причина всё ещё скрыта. Ошибка повторяется. Время восстановления растёт.',
    whyWrong: 'Без логов, метрик и алертов команда не видит корень проблемы. Любой фикс превращается в угадайку и затягивает инцидент.',
    fixTitle: 'Как исправить',
    fixText: 'Сначала дай системе говорить: логи, метрики, алерты, health-check. Потом уже принимай решение по фактам, а не по интуиции.',
    quizQuestion: 'С чего начинается нормальная реакция на инцидент?',
    quizOptions: [
      { text: 'С логов, метрик и алертов', correct: true },
      { text: 'С ручного рестарта всего подряд', correct: false },
      { text: 'С объяснения, что виноваты пользователи', correct: false },
    ],
    quizExplain: 'Если система не оставляет следов, команда тратит время на гипотезы вместо восстановления сервиса.'
  },
  avoidance: {
    order: 4,
    color: '#ffaa00',
    title: 'УХОД ОТ РЕШЕНИЯ',
    summary: 'Ты несколько раз откладывал проблему, прятал её или надеялся, что она рассосётся сама.',
    reproduceTitle: 'Избеги решения',
    reproduceText: 'Релиз, инцидент или давление инвесторов требуют выбора. Самый опасный соблазн — ничего не решать по сути.',
    wrongAction: 'ОТЛОЖИТЬ ИЛИ СПРЯТАТЬ',
    instantImpact: 'Время ушло. Долг вырос. Доверие инвесторов и команды стало ниже.',
    whyWrong: 'Ожидание идеального момента и заморозка решений не лечат процесс. Проблема копится, а цена следующего шага становится выше.',
    fixTitle: 'Как исправить',
    fixText: 'Двигайся маленькими управляемыми итерациями. Лучше частый контролируемый шаг с сигналами, чем большое откладывание без данных.',
    quizQuestion: 'Что полезнее, чем ждать идеального момента?',
    quizOptions: [
      { text: 'Выпускать малыми управляемыми шагами', correct: true },
      { text: 'Заморозить всё до лучших времён', correct: false },
      { text: 'Скрыть проблему до конца демо', correct: false },
    ],
    quizExplain: 'DevOps не любит идеального момента. Он любит наблюдаемую и контролируемую итерацию.'
  },
  security_blindness: {
    order: 5,
    color: '#ff4444',
    title: 'ИГНОР БЕЗОПАСНОСТИ',
    summary: 'Ты игнорировал последствия утечки секрета и надеялся обойтись без настоящего реагирования.',
    reproduceTitle: 'Сделай вид, что утечки нет',
    reproduceText: 'Ключ уже попал в репозиторий. Удалить коммит кажется быстрым, но секрет уже нельзя считать безопасным.',
    wrongAction: 'ПРОСТО УДАЛИТЬ КОММИТ',
    instantImpact: 'Ключ уже скомпрометирован. История git и клоны репозитория всё ещё его содержат.',
    whyWrong: 'Секрет после публикации нужно считать украденным. История git, форки и кэш успевают его распространить раньше любого удаления.',
    fixTitle: 'Как исправить',
    fixText: 'Сначала отзывай ключи, затем выноси их в secrets manager или GitHub Secrets, после чего закрывай дыру через .gitignore и новые значения.',
    quizQuestion: 'Что делать первым после утечки API-ключа?',
    quizOptions: [
      { text: 'Отозвать ключ и выпустить новый', correct: true },
      { text: 'Удалить коммит и забыть', correct: false },
      { text: 'Ничего не делать, если ключ короткоживущий', correct: false },
    ],
    quizExplain: 'Сам коммит можно очистить позже. Сначала нужно прекратить действие скомпрометированного секрета.'
  },
}

const CHOICE_THEME_MAP = {
  '0:0': 'manual_ops',
  '0:2': 'avoidance',
  '1:0': 'skip_quality',
  '1:2': 'manual_ops',
  '2:0': 'manual_ops',
  '2:2': 'manual_ops',
  '3:0': 'no_observability',
  '3:2': 'avoidance',
  '4:0': 'no_observability',
  '4:2': 'avoidance',
  '5:0': 'skip_quality',
  '5:2': 'avoidance',
  '6:0': 'manual_ops',
  '6:2': 'avoidance',
  '7:0': 'security_blindness',
  '7:2': 'security_blindness',
}

export function registerMistake(gameState, questId, choiceIndex) {
  const themeId = CHOICE_THEME_MAP[`${questId}:${choiceIndex}`]
  if (!themeId) return null

  if (!gameState.mistakeStats) gameState.mistakeStats = {}
  if (!gameState.mistakeStats[themeId]) {
    gameState.mistakeStats[themeId] = { count: 0, choices: [] }
  }

  const stat = gameState.mistakeStats[themeId]
  stat.count += 1

  const key = `${questId}:${choiceIndex}`
  if (!stat.choices.includes(key)) stat.choices.push(key)

  return { themeId, count: stat.count, ...SANDBOX_THEMES[themeId] }
}

export function getTotalMistakes(gameState) {
  if (!gameState?.mistakeStats) return 0
  return Object.values(gameState.mistakeStats).reduce((sum, stat) => sum + stat.count, 0)
}

export function getSandboxTopics(gameState, limit = 3) {
  if (!gameState?.mistakeStats) return []

  return Object.entries(gameState.mistakeStats)
    .filter(([, stat]) => stat.count > 0)
    .map(([themeId, stat]) => ({
      id: themeId,
      count: stat.count,
      choices: stat.choices,
      ...SANDBOX_THEMES[themeId],
    }))
    .sort((a, b) => (b.count - a.count) || (a.order - b.order))
    .slice(0, limit)
}
