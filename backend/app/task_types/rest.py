from datetime import datetime
import requests
from utils.logger import log


def execute_api(task):
    try:
        method = task.get("method", "").upper()
        url = task.get("url")
        log(task.get("task_id"),datetime.now().strftime('%Y-%m-%d %H:%M:%S'),"api", "running", f"Executing API: {method} {url}")
        if not method or not url:
            raise ValueError("Missing 'method' or 'url' in API task")

        headers = task.get("headers", {})
        body = task.get("body", {})

        if method == "GET":
            response = requests.get(url, headers=headers)
        elif method == "POST":
            response = requests.post(url, headers=headers, json=body)
        else:
            raise ValueError(f"Unsupported API method: {method}")

        result = {
            "task_id": task.get("task_id"),
            "type": "api",
            "method": method,
            "url": url,
            "status": "success",
            "error": None,
            "status_code": response.status_code,
            "response": response.text,
            "timestamp": str(datetime.now())
        }
        log(
            result.get("task_id"),
            result.get("timestamp"),
            result.get("type"),
            result.get("status"),
            f"URL: {result.get('url')}"
        )

    except Exception as e:
        result = {
            "task_id": task.get("task_id"),
            "type": "api",
            "status": "error",
            "url":"url",
            "error": str(e),
            "timestamp": str(datetime.now())
        }
        log(
            result.get("task_id"),
            result.get("timestamp"),
            result.get("type"),
            result.get("status"),
            f"URL: {result.get('url')}, Error: {result.get('error')}"
        )