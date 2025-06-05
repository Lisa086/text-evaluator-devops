import logging


class ColorFormatter(logging.Formatter):
    COLORS = {
        "DEBUG": "\033[36m",  # Cyan
        "INFO": "\033[32m",  # Green
        "WARNING": "\033[33m",  # Yellow
        "ERROR": "\033[31m",  # Red
        "CRITICAL": "\033[41m",  # Red background
    }

    RESET = "\033[0m"

    def format(self, record):
        color = self.COLORS.get(record.levelname, "")
        reset = self.RESET

        record.asctime = f"\033[90m{self.formatTime(record)}{reset}"
        record.levelname = f"{color}{record.levelname}{reset}"
        record.message = record.getMessage()

        return f"[{record.asctime}] [{record.levelname}] [{f"\033[35m{getattr(record, 'trace_id', '-')}{reset}"}] [{f"\033[36m{getattr(record, 'client_ip', '-')}{reset}"}] {f"\033[34m{getattr(record, 'method', '-')}{reset}"} {f"\033[94m{getattr(record, 'path', '-')}{reset}"} > {record.message}"


LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "detailed": {
            "format": "[%(asctime)s] [%(levelname)s] [%(trace_id)s] [%(client_ip)s] %(method)s %(path)s > %(message)s",
        },
        "console": {
            "()": "app.logging.config.ColorFormatter",
        },
    },
    "handlers": {
        "file": {
            "class": "logging.FileHandler",
            "filename": "logs/app.log",
            "formatter": "detailed",
        },
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "console",
        },
    },
    "loggers": {
        "app": {
            "handlers": ["file", "console"],
            "level": "DEBUG",
            "propagate": False,
        },
    },
}
