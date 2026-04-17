export const REFS = {
  0: {
    title: 'CI/CD ОСНОВЫ',
    color: '#ffaa00',
    items: [
      { term: 'CI/CD',          desc: 'Автозапуск тестов и деплоя при каждом коммите в репозиторий.' },
      { term: 'Pipeline',       desc: 'Цепочка шагов: build → test → deploy. Выполняется автоматически.' },
      { term: 'GitHub Actions', desc: 'Настраивается через .yml файл прямо в папке .github/workflows/.' },
      { term: 'Артефакт',       desc: 'Результат сборки (бинарник, Docker-образ), передаётся между шагами.' },
      { term: 'DRY принцип',    desc: 'Don\'t Repeat Yourself — автоматизируй всё что делаешь чаще 2 раз.' },
    ]
  },
  1: {
    title: 'ТЕСТИРОВАНИЕ',
    color: '#00aaff',
    items: [
      { term: 'Unit тесты',      desc: 'Тестируют одну функцию. Быстрые и дешёвые — их должно быть больше всего.' },
      { term: 'Integration',     desc: 'Проверяют взаимодействие нескольких модулей между собой.' },
      { term: 'E2E тесты',       desc: 'Полный сценарий пользователя. Медленные — их мало, но они важны.' },
      { term: 'Пирамида тестов', desc: 'Unit (много) → Integration → E2E (мало). Чем выше — тем дороже.' },
      { term: 'TDD',             desc: 'Test-Driven Development: сначала пишешь тест, потом код под него.' },
    ]
  },
  2: {
    title: 'АВТОМАТИЗАЦИЯ',
    color: '#ffaa00',
    items: [
      { term: 'CI/CD',          desc: 'Автозапуск тестов и деплоя при каждом коммите в репозиторий.' },
      { term: 'GitHub Actions', desc: 'Настраивается через .yml файл прямо в папке .github/workflows/.' },
      { term: 'Makefile',       desc: 'Стандартизирует команды: make build, make test, make deploy.' },
      { term: 'Docker',         desc: 'Контейнер = одинаковое окружение на всех машинах и в продакшене.' },
      { term: 'DRY принцип',    desc: 'Don\'t Repeat Yourself — автоматизируй всё что делаешь чаще 2 раз.' },
    ]
  },
  3: {
    title: 'ЛОГИРОВАНИЕ',
    color: '#aa44ff',
    items: [
      { term: 'Уровни логов',    desc: 'ERROR > WARN > INFO > DEBUG. ERROR — критично, DEBUG — подробности.' },
      { term: 'JSON-логи',       desc: 'Структурированный формат. Легко искать, фильтровать и строить графики.' },
      { term: 'ELK Stack',       desc: 'Elasticsearch + Logstash + Kibana — стандарт хранения и поиска логов.' },
      { term: 'Ключевые поля',   desc: 'timestamp, level, message, service, traceId — минимум для любого лога.' },
      { term: 'MTTR',            desc: 'Mean Time To Recovery — среднее время восстановления. Логи снижают его.' },
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
      { term: 'Quality Gate',      desc: 'Автопроверка перед мержем: тесты, security scan, линтер.' },
      { term: 'Технический долг',  desc: 'Цена отложенных решений. Со временем растёт и тормозит разработку.' },
      { term: 'Feature Flag',      desc: 'Выпускаешь код скрытым, включаешь по кнопке. Безопасный деплой.' },
      { term: 'DORA метрики',      desc: 'Deployment Frequency, Lead Time, MTTR, Change Failure Rate.' },
      { term: 'Hotfix',            desc: 'Срочный фикс в прод. Нужен автоматизированный CI/CD чтобы сделать быстро.' },
    ]
  },
  6: {
    title: 'ДЕПЛОЙ',
    color: '#ff8800',
    items: [
      { term: 'Blue/Green',      desc: 'Два одинаковых окружения. Переключаешь трафик мгновенно — ноль даунтайма.' },
      { term: 'Rolling deploy',  desc: 'Постепенная замена инстансов новой версией. Без остановки сервиса.' },
      { term: 'Health check',    desc: 'Проверка что сервис жив после деплоя. Обычно GET /health → 200 OK.' },
      { term: 'Rollback',        desc: 'Откат на предыдущую версию. Должен быть одной командой, в идеале — авто.' },
      { term: 'Smoke test',      desc: 'Быстрая проверка ключевых функций сразу после деплоя в прод.' },
    ]
  },
  7: {
    title: 'БЕЗОПАСНОСТЬ',
    color: '#ff4444',
    items: [
      { term: '.gitignore',      desc: 'Файл исключений Git. Секреты НИКОГДА не должны попадать в репозиторий.' },
      { term: 'Secrets Manager', desc: 'AWS Secrets Manager, HashiCorp Vault — безопасное хранилище ключей.' },
      { term: 'Git history',     desc: 'Удалённый коммит остаётся в истории. Нужно немедленно отозвать ключи.' },
      { term: '.env файл',       desc: '.env + .gitignore — стандарт локального хранения конфигов и секретов.' },
      { term: 'GitHub Secrets',  desc: 'CI/CD переменные репозитория — безопасный способ передачи ключей.' },
    ]
  },
}
