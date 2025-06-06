import logging
import logging.config
import uuid
from fastapi import FastAPI, HTTPException, Request
from fastapi.exception_handlers import http_exception_handler, request_validation_exception_handler
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.api import documents, analysis, readabilityAPI
from app.database.database import Base, engine
from app.core.config import settings
import os
from app.logging.config import LOGGING_CONFIG
from app.logging.context import set_log_context
from app.logging.context_filter import RequestContextFilter

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        Base.metadata.create_all(bind=engine)
        print("База данных инициализирована")
    except Exception as e:
        print(f"Ошибка при инициализации базы данных: {e}")
    
    yield
    
    print("Приложение завершает работу")

app = FastAPI(
    title=settings.APP_NAME,
    description="API для анализа текстовых документов",
    version="1.0.0",
    lifespan=lifespan
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOW_ORIGINS,
    allow_credentials=settings.ALLOW_CREDENTIALS,
    allow_methods=settings.ALLOW_METHODS,
    allow_headers=settings.ALLOW_HEADERS,
)

os.makedirs("temp", exist_ok=True)
os.makedirs("logs", exist_ok=True)
logging.config.dictConfig(LOGGING_CONFIG)
logger = logging.getLogger("app")
logger.addFilter(RequestContextFilter())

@app.middleware("http")
async def log_context_middleware(request: Request, call_next):
    trace_id = request.headers.get("X-Trace-ID") or str(uuid.uuid4())
    set_log_context(
        client_ip=request.client.host if request.client else "unknown",
        method=request.method,
        path=request.url.path,
        trace_id=trace_id
    )
    logger.debug("Начало обработки запроса")
    response = await call_next(request)
    response.headers["X-Trace-ID"] = trace_id
    logger.debug("Конец обработки запроса")
    return response

@app.exception_handler(HTTPException)
async def log_http_exception(request: Request, exc: HTTPException):
    logger.debug(f"({exc.status_code}) {exc.detail}")
    return await http_exception_handler(request, exc)

@app.exception_handler(RequestValidationError)
async def log_validation_error(request: Request, exc: RequestValidationError):
    logger.debug(f"{exc.errors()}")
    return await request_validation_exception_handler(request, exc)

app.include_router(documents.router, prefix=f"{settings.API_PREFIX}/documents", tags=["documents"])
app.include_router(analysis.router, prefix=f"{settings.API_PREFIX}/analysis", tags=["analysis"])
app.include_router(readabilityAPI.router, prefix=f"{settings.API_PREFIX}/readability", tags=["readability"])

@app.get("/", tags=["root"])
async def root():
    """Корневой эндпоинт"""
    return {
        "message": "Добро пожаловать в API Текстового Оценщика",
        "version": "1.0.0",
        "docs_url": "/docs"
    }

@app.get("/health", tags=["health"])
async def health_check():
    """Проверка работоспособности API"""
    return {"status": "healthy"}
