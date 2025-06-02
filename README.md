# Text Evaluator — DevOps Setup

Краткий DevOps-скелет для сервиса Text Evaluator (backend + frontend) с контейнеризацией и CI/CD.
Функционал
Docker Compose для локального запуска:
backend (порт 8000, эндпоинт /health)
frontend (порт 3000)
Шаблон файла окружения — .env.example
GitHub Actions: сборка и публикация, деплой Docker-образов
Автодеплой по SSH на удалённый сервер


## Быстрый старт
1. git clone git@github.com:Lisa086/text-evaluator-devops.git
2. cd text-evaluator-devops
3. cp .env.example .env и заполнить .env (см. шаблон)
4. docker-compose up --build -d
backend: http://localhost:8000/health
frontend: http://localhost:3000
5. Настроить GitHub Secrets:
DOCKER_REGISTRY, REGISTRY_USER, REGISTRY_TOKEN
SSH_HOST, SSH_USER, SSH_KEY, DEPLOY_PATH
6. git add . && git commit -m "Add all config files"
7. git push

## для бека 
1. Поместите свой код в папку backend/app/ вместо текущей заглушки main.py.
2. Обновите список зависимостей в backend/requirements.txt.

## для фронта 
1. Разместите исходники вашего приложения в папке frontend
2. Обновите frontend/package.json и скрипт сборки
