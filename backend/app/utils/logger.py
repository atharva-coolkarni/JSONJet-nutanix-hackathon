import asyncio
from datetime import datetime

# Async queue for log streaming
log_queue = asyncio.Queue()

def log(task_id: str, log_type: str,status:str, message: str):
    log_entry = {
        "timestamp": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        "task_id": task_id,
        "type": log_type,  # e.g., "INFO", "ERROR", "DEBUG"
        "status": status,
        "message": message
    }

    # # Print formatted log (optional)
    print(f"[{log_entry['timestamp']}] [{log_type}] [Task: {task_id}] {message}")

    try:
        log_queue.put_nowait(log_entry)
        return log_entry
    except asyncio.QueueFull:
        raise RuntimeError("Log queue is full. Failed to enqueue log message.")
