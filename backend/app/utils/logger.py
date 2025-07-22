import asyncio
from datetime import datetime

# Async queue for log streaming
log_queue = asyncio.Queue() 

def log(message: str):
    timestamped_message = f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {message}"
    print(timestamped_message)

    try:
        log_queue.put_nowait(timestamped_message)
    except asyncio.QueueFull:
        raise RuntimeError("Log queue is full. Failed to enqueue log message.")
