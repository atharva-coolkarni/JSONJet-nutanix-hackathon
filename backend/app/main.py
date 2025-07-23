from flask import Flask, request, jsonify
import asyncio
import aiohttp
import subprocess
import nest_asyncio
import json
from datetime import datetime

# Allow nested event loops (important for Jupyter/IDE)
nest_asyncio.apply()

app = Flask(__name__)

# Global log storage
logs = []

# Async function to execute shell task
async def execute_shell(task):
    try:
        if "command" not in task:
            raise ValueError("Missing 'command' in shell task")
        
        process = await asyncio.create_subprocess_shell(
            task["command"],
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        stdout, stderr = await process.communicate()

        result = {
            "task_id": task.get("id", "unknown"),
            "type": "shell",
            "command": task["command"],
            "stdout": stdout.decode().strip(),
            "stderr": stderr.decode().strip(),
            "timestamp": str(datetime.now())
        }
    except Exception as e:
        result = {
            "task_id": task.get("id", "unknown"),
            "type": "shell",
            "error": str(e),
            "timestamp": str(datetime.now())
        }
    logs.append(result)

# Async function to execute API task
async def execute_api(task):
    try:
        method = task.get("method", "").upper()
        url = task.get("url")
        if not method or not url:
            raise ValueError("Missing 'method' or 'url' in API task")
        
        headers = task.get("headers", {})
        body = task.get("body", {})

        async with aiohttp.ClientSession() as session:
            if method == "GET":
                async with session.get(url, headers=headers) as resp:
                    response = await resp.text()
            elif method == "POST":
                async with session.post(url, headers=headers, json=body) as resp:
                    response = await resp.text()
            else:
                raise ValueError(f"Unsupported API method: {method}")
        
        result = {
            "task_id": task.get("id", "unknown"),
            "type": "api",
            "method": method,
            "url": url,
            "response": response,
            "timestamp": str(datetime.now())
        }
    except Exception as e:
        result = {
            "task_id": task.get("id", "unknown"),
            "type": "api",
            "error": str(e),
            "timestamp": str(datetime.now())
        }
    logs.append(result)

# Async main executor
async def run_workflow(workflow):
    tasks = []
    for task in workflow.get("tasks", []):
        if task.get("type") == "shell":
            tasks.append(execute_shell(task))
        elif task.get("type") == "api":
            tasks.append(execute_api(task))
        else:
            logs.append({
                "task_id": task.get("id", "unknown"),
                "type": task.get("type", "unknown"),
                "error": "Unsupported task type",
                "timestamp": str(datetime.now())
            })
    await asyncio.gather(*tasks)

# Flask route to accept workflow execution request
@app.route('/execute_workflow', methods=['POST'])
def execute_workflow():
    global logs
    logs = []  # reset logs per request

    try:
        workflow = request.get_json()
        if not workflow or "tasks" not in workflow:
            return jsonify({"error": "Invalid input. 'tasks' key missing."}), 400

        loop = asyncio.get_event_loop()
        if loop.is_running():
            loop.create_task(run_workflow(workflow))
        else:
            loop.run_until_complete(run_workflow(workflow))

        return jsonify({
            "message": "Workflow executed",
            "logs": logs
        })

    except Exception as e:
        return jsonify({"error": f"Exception occurred: {str(e)}"}), 500

# Run the server
if __name__ == "__main__":
    app.run(debug=True)
