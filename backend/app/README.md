# Text-Analyzer-BackEnd API
## API для анализа текстовых документов с возможностью загрузки файлов, анализа текста и оценки читаемости.
## Содержание
1. О проекте
2. Технологии
3. Установка и запуск
4. API-эндпоинты

	4.1 Документы

	4.2 Анализ текста

	4.3 Оценка читаемости

    4.4 Краткая сводка
               
5. Типичные сценарии использования

      5.1 Загрузка файла и получение анализа

      5.2 Быстрый анализ текста без сохранения

      5.3 Оценка читаемости текста

      5.4 Извлечение ключевых слов из текста

      5.5 Просмотр истории анализа

# 1. О проекте
Text-Analyzer-BackEnd представляет собой API для анализа текстовых документов, извлечения ключевых слов и оценки читаемости текста. API предоставляет возможность загружать текстовые файлы, сохранять их в базе данных и выполнять различные виды анализа текста.

## Основные возможности:
- Загрузка и анализ текстовых файлов
- Извлечение ключевых слов из текста
- Оценка читаемости текста
- Хранение результатов анализа в базе данных
- Получение списка обработанных документов

# 2. Технологии
- Python 3.8+
- FastAPI
- SQLite
- SQLAlchemy
- Pydantic 
- Uvicorn

# 3. Установка и запуск
## Предварительные требования
- Python 3.9 или выше
- Виртуальное окружение Python (рекомендуется)

# Шаги по установке проекта
## 1 Шаг
- Клонировать репозиторий с помощью команды: git clone (ссылка на гит)
- Использовать команду: cd Test-Analyzer-BackEnd
## 2 Шаг
- Активировать вирт. окружение:
```
python -m venv env
env/Scripts/activate
```
## 3 Шаг
- Установка зависимостей: 
```
pip install -r requirements.txt
```
## 4 Шаг
- Запуск сервера: python run.py
- (По умолчанию порт запущен на 8080)

### После запуска API будет доступно по адресу: http://localhost:8080
- После всего проделанного рекомендую зайти на http://localhost:8080/docs, где можно увидеть все реализованные функции

# 3. Структура проекта
## Директория Test-Analyzer-BackEnd/
## .github/workflows/
        - python-ci.yml
## app/api
        - analysis.py
        - documents.py
        - readbilityAPI.py
        - __init__.py


## app/core
        - config.py
        - logging_config.py
        - __init__.py

## app/database
        - database.py
        - models.py
        - operrations_CRUD.py
        - schemas.py
        - __init__.py

## app/services
        - file_upload.py
        - keyword_extractor.py
        - readbility_calculator.py
        - text_analyzer.py
        - __init__.py

## app/
        - main.py
        - __init__.py

## tests/test_data/
        - example1.txt

## tests/
        - kw_extractor_test.py
        - test_example.py
        - tokenizer_test.py
        - __init__.py

## (Внешние файлы в Text-Analyzer-BackEnd)/
        - .gitignore
        - fix_enconding.py
        - README.md
        - requirements.txt
        - run.py
        - test_analyze.db
        - uploader.py

# 4. API-эндпоинты
API-документация доступна по адресу /docs после запуска сервера!!!

# 4.1 Документы
# Первый метод
## POST /api/documents/

Описание: Загружает текстовый файл, анализирует его содержимое и сохраняет результаты в базу данных.

### Запрос:
- Метод: POST
- Content-Type: multipart/form-data
### Параметры:
- file (обязательный): Текстовый файл с расширением .txt, содержащий текст для анализа. 
- Максимальный размер: 1 МБ.
### Ответ:
- Код: 200 OK
- Content-Type: application/json
### Тело:
```
{
  "word_count": 150,                // кол-во слов в тексте
  "sentence_count": 12,             // кол-во предложений
  "readability_score": 75.5,        // оценка читаемости текста (значения: 0-100)
  "keywords": [                     // ключевые слова из текста
    "ключевое", "слово", "текст", "анализ", "пример"
  ],
  "main_topic": "Текст о ключевое", // определенная основная тема текста
  "id": 1                           // ID документа в БД
}

```

### Ошибки:
- 400 Bad Request: Файл пуст или не выбран
- 413 Request Entity Too Large: Размер файла превышает 1 МБ
- 415 Unsupported Media Type: Неподдерживаемый тип файла (только .txt)
- 422 Unprocessable Entity: Некорректные данные запроса
- 500 Internal Server Error: Ошибка при обработке файла
---------------------------------------------------------------------------
# Второй метод
## GET /api/documents/{document_id}


Описание: Получает информацию о документе по его ID.

### Запрос:
- Метод: GET
### Параметры пути:
- document_id (обязательный): ID документа (целое число)
### Ответ:
- Код: 200 OK
- Content-Type: application/json
### Тело:
```
{
  "id": 1,                                          // ID документа
  "title": "Название документа",                    // имя файла
  "content": "Начало текста...",                    // первые 1000 символов текста
  "word_count": 150,                                // кол-во слов
  "sentence_count": 12,                             // кол-во предложений
  "readability_score": 75.5,                        // оценка читаемости (0-100)
  "keywords": [                                     // ключевые слова из текста
    "ключевое", "слово", "текст", "анализ", "пример"
  ],
  "created_at": "2025-06-02T13:14:15.123Z"          // дата создания документа
}

```

### Ошибки:
- 404 Not Found: Документ с указанным ID не найден
- 422 Unprocessable Entity: Некорректный формат ID
- 500 Internal Server Error: Ошибка при получении документа
---------------------------------------------------------------------------
# Третий метод
## GET /api/documents/

Описание: Получает список всех обработанных документов с пагинацией.

### Запрос:
- Метод: GET
### Параметры запроса:
- skip (необязательный): Сколько документов пропустить (по умолчанию: 0)
- limit (необязательный): Максимальное количество документов в ответе (по умолчанию: 100)
### Ответ:
- Код: 200 OK
- Content-Type: application/json
### Тело: Массив документов
```
[
  {
    "id": 1,
    "title": "Документ 1",                                          // имя файла
    "content": "Начало текста...",                                  // первые 1000 символов текста
    "word_count": 150,                                              // кол-во слов
    "sentence_count": 12,                                           // кол-во предложений
    "readability_score": 75.5,                                      // оценка читаемости (0-100)
    "keywords": ["ключевое", "слово", "текст", "анализ", "пример"], // ключевые слова
    "created_at": "2025-06-02T13:14:15.123Z"                        // дата создания документа
  },
  {
    "id": 2,
    "title": "Документ 2",                          // имя файла
    "content": "Другой текст...",                   // первые 1000 символов текста
    "word_count": 200,                              // кол-во слов
    "sentence_count": 15,                           // кол-во предложений
    "readability_score": 82.3,                      // оценка читаемости (0-100)
    "keywords": ["другие", "ключевые", "слова"],    // ключевые слова
    "created_at": "2025-06-02T14:20:30.456Z"        // дата создания документа
  }
]

```
### Ошибки:
500 Internal Server Error: Ошибка при получении списка документов

----------------------------------------------------------------------
# 4.2 Анализ текста
# Первый метод
## POST /api/analysis/
Описание: Анализирует предоставленный текст и возвращает результаты анализа (без сохранения в базу данных).
### Запрос:
- Метод: POST
- Content-Type: application/json
### Тело:
```
{
  "text": "Текст для анализа. После text: писать дальше текст"
}
```
--------------------------------------------------------------------
### Ответ:
- Код: 200 OK
- Content-Type: application/json
### Тело:
```
{
  "word_count": 11,             // кол-во слов
  "sentence_count": 2,          // кол-во предложений
  "readability_score": 82.4,    // оценка читаемости (0-100)
  "keywords": [                 // ключевые слова
    "текст", "анализа", "предложений", "размера", "структуры"
  ],
  "main_topic": "Текст о текст" // определенная основная тема текста
}
```
### Ошибки:
- 400 Bad Request: Пустой текст
- 422 Unprocessable Entity: Некорректные данные запроса
- 500 Internal Server Error: Ошибка при анализе текста
-----------------------------------------------------------------------------------
# Второй метод
# POST /api/analysis/check-keywords
Описание: Извлекает только ключевые слова из предоставленного текста.
### Запрос:
- Метод: POST
- Content-Type: application/json
### Тело:
```
{
  "text": "Текст для извлечения ключевых слов, должен содержать достаточно информации для анализа"
}
```
------------------------------------------------
### Ответ:
- Код: 200 OK
- Content-Type: application/json
### Тело:
```
{
  "keywords": [
    "извлечения", "ключевых", "слов", "должен", "содержать"
  ]
}
```
### Ошибки:
- 400 Bad Request: Пустой текст
- 422 Unprocessable Entity: Некорректные данные запроса
- 500 Internal Server Error: Ошибка при извлечении ключевых слов
--------------------------------------
# 4.3 Оценка читаемости
# Первый метод
## POST /api/readability/
Описание: Оценивает читаемость предоставленного текста.
### Запрос:
- Метод: POST
- Content-Type: application/json
### Тело:
```
{
  "text": "Текст для оценки читаемости, должен содержать предложения разной сложности"
}
```
---------------------------
### Ответ:
- Код: 200 OK
- Content-Type: application/json
### Тело:
```
{
  "readability_score": 78.5,                    // оценка читаемости (0-100)
  "interpretation": "Легкий текст (5-6 класс)", // словесная интерпретация оценки
  "stats": {                                    // статистика текста
    "word_count": 12,                           // кол-во слов
    "sentence_count": 2,                        // кол-во предложений
    "syllables_count": 24,                      // кол-во слогов
    "avg_words_per_sentence": 6.0,              // среднее кол-во слов в предложении
    "avg_syllables_per_word": 2.0               // среднее кол-во слогов на слово
  }
}
```
### Ошибки:
- 400 Bad Request: Пустой текст
- 422 Unprocessable Entity: Некорректные данные запроса
- 500 Internal Server Error: Ошибка при оценке читаемости
------------------------
# Второй метод
# POST /api/readability/detailed
Описание: Предоставляет подробный анализ читаемости текста.
### Запрос:
- Метод: POST
- Content-Type: application/json
### Тело:
```
{
  "text": "Текст для детального анализа читаемости, требуется несколько предложений для получения точных результатов"
}
```
### Ответ:
- Код: 200 OK
- Content-Type: application/json
### Тело:
```
{
  "readability_score": 75.2,                    // оценка читаемости (0-100)
  "interpretation": "Легкий текст (5-6 класс)", // словесная интерпретация
  "basic_stats": {                              // базовая статистика текста
    "word_count": 16,                           // кол-во слов
    "sentence_count": 2,                        // кол-во предложений
    "syllables_count": 35,                      // кол-во слогов
    "avg_words_per_sentence": 8.0,              // среднее число слов в предложении
    "avg_syllables_per_word": 2.2               // среднее число слогов на слово
  },
  "additional_metrics": {                       // дополнительные метрики
    "unique_words_count": 15,                   // кол-во уникальных слов
    "unique_words_percentage": 93.8,            // процент уникальных слов
    "complex_words_count": 3,                   // кол-во сложных слов (4+ слогов)
    "complex_words_percentage": 18.8,           // процент сложных слов
    "average_word_length": 6.2                  // средняя длина слова в символах
  }
}
```
### Ошибки:
- 400 Bad Request: Пустой текст
- 422 Unprocessable Entity: Некорректные данные запроса
- 500 Internal Server Error: Ошибка при получении детальных метрик

# 4.4 Краткая сводка
## Документы:
- POST /api/documents/ - Загрузить и проанализировать текстовый файл
- GET /api/documents/{document_id} - Получить информацию о документе по ID
- GET /api/documents/ - Получить список всех документов с пагинацией

## Анализ текста:
- POST /api/analysis/ - Проанализировать текст
- POST /api/analysis/check-keywords - Извлечь ключевые слова из текста

## Оценка читаемости:
- POST /api/readability/ - Оценить читаемость текста
- POST /api/readability/detailed - Получить детальный анализ читаемости

# 5. Сценарии использования
## 5.1 Загрузка файла и получение анализа
Это основной сценарий для работы с документами. Пользователь загружает текстовый файл и получает результаты анализа. Документ сохраняется в базе данных для дальнейшего использования.
### Шаги:
- Отправьте POST запрос на /api/documents/ с файлом в формате .txt
- Получите результаты анализа с ID документа
- При необходимости, получите дополнительную информацию о документе через GET /api/documents/{id}
## 5.2 Быстрый анализ текста без сохранения
Для быстрой проверки текста без необходимости сохранять его в базе данных, используйте эндпоинт анализа текста.
### Шаги:
- Отправьте POST запрос на /api/analysis/ с текстом для анализа в JSON
- Получите результаты анализа (без сохранения в базе данных)
## 5.3 Оценка читаемости текста
Для оценки сложности текста и его соответствия разным уровням понимания.
### Шаги:
- Отправьте POST запрос на /api/readability/ с текстом для анализа в JSON
- Получите оценку читаемости и базовую статистику
- Для более подробного анализа, используйте /api/readability/detailed
## 5.4 Извлечение ключевых слов из текста
Если нужны только ключевые слова без полного анализа.
### Шаги:
- Отправьте POST запрос на /api/analysis/check-keywords с текстом в JSON
- Получите список ключевых слов из текста
## 5.5 Просмотр истории анализа
Для просмотра всех ранее проанализированных документов.
### Шаги:
- Отправьте GET запрос на /api/documents/
- Получите список документов с базовой информацией
- Для получения подробной информации о конкретном документе, используйте /api/documents/{id}
