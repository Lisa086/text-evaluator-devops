import logging
from .context import get_log_context

class RequestContextFilter(logging.Filter):
    def filter(self, record):
        context = get_log_context()
        record.client_ip = context.get("client_ip", "-")
        record.method = context.get("method", "-")
        record.path = context.get("path", "-")
        record.trace_id = context.get("trace_id", "-")
        return True
