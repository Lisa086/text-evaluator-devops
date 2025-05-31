# Text Evaluator — DevOps Setup

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

