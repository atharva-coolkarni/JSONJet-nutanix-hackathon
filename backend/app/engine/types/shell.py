from datetime import datetime
from utils.logger import log
import subprocess

def execute_shell(task):
    try:
        log(task.get("task_id"),datetime.now().strftime('%Y-%m-%d %H:%M:%S'), "shell", "running", f"Executing shell: {task.get("command")}")
        if "command" not in task:
            raise ValueError("Missing 'command' in shell task")

        result_process = subprocess.run(
            task["command"],
            shell=True,
            capture_output=True,
            text=True
        )
        
        stdout = result_process.stdout.strip()
        stderr = result_process.stderr.strip()
        if stdout:
            log(task.get("task_id"),datetime.now().strftime('%Y-%m-%d %H:%M:%S'), "shell", "success", f"Stdout: {stdout}")
        elif stderr:
            log(task.get("task_id"),datetime.now().strftime('%Y-%m-%d %H:%M:%S'),"shell", "success", f"Stderr: {stderr}")
        else:
            log(task.get("task_id"), datetime.now().strftime('%Y-%m-%d %H:%M:%S'), "success", "No output or error")
    except Exception as e:
        log(task.get("task_id"), datetime.now().strftime('%Y-%m-%d %H:%M:%S'),"shell", "error", f"Error: {str(e)}")

