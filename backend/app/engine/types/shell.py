from datetime import datetime
from utils.logger import log
import subprocess

def execute_shell(task):
    try:
        if "command" not in task:
            raise ValueError("Missing 'command' in shell task")

        result_process = subprocess.run(
            task["command"],
            shell=True,
            capture_output=True,
            text=True
        )

        result = {
            "task_id": task.get("task_id"),
            "type": "shell",
            "command": task["command"],
            "status": "success",
            "error": None,
            "stdout": result_process.stdout.strip(),
            "stderr": result_process.stderr.strip(),
            "timestamp": str(datetime.now())
        }
    except Exception as e:
        result = {
            "task_id": task.get("task_id"),
            "type": "shell",
            "status": "error",
            "error": str(e),
            "timestamp": str(datetime.now())
        }

    return log(
        result.get("task_id"),
        result.get("type"),
        result.get("status"),
        f"Status: {result.get('status')}, Error: {result.get('error')}"
    )
