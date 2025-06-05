from contextvars import ContextVar

log_context = ContextVar("log_context", default={})

def set_log_context(client_ip: str, method: str, path: str, trace_id: str):
    log_context.set({
        "client_ip": client_ip,
        "method": method,
        "path": path,
        "trace_id": trace_id,
    })

def get_log_context():
    return log_context.get()
