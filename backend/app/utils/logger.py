from datetime import datetime
from queue import Queue

log_queue = Queue()

def log(task_id: str,time, log_type: str, status: str, message: str):
    log_entry = {
        "timestamp": time,
        "task_id": task_id,
        "type": log_type,
        "status": status,
        "message": message
    }

    print(f"[{log_entry['timestamp']}] [{log_type}] [Task: {task_id}] {message}")

    try:
        print("Putting log in queue")  
        log_queue.put_nowait(log_entry)
        return log_entry
    except Exception as e:
        print("Log queue error:", str(e))
        raise RuntimeError("Log queue is full or failed.")
