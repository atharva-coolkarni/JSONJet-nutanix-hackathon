from flask import Flask, request, jsonify
from datetime import datetime

from engine.types.rest import execute_api
from engine.types.shell import execute_shell

app = Flask(__name__)

logs = []

def run_workflow(workflow):
    for task in workflow.get("tasks", []):
        task_type = task.get("type")
        if task_type == "shell":
            shell_logs = execute_shell(task)
            logs.append(shell_logs)
        elif task_type == "api":
            api_logs = execute_api(task)
            logs.append(api_logs)   
        else:
            logs.append({
                "task_id": task.get("id", "unknown"),
                "type": task_type,
                "error": "Unsupported task type",
                "timestamp": str(datetime.now())
            })

# Flask route
@app.route('/execute_workflow', methods=['POST'])
def execute_workflow():
    global logs
    logs = []  # Clear previous logs

    try:
        workflow = request.get_json()
        if not workflow or "tasks" not in workflow:
            return jsonify({"error": "Invalid input. 'tasks' key missing."}), 400

        run_workflow(workflow)

        return jsonify({
            "message": "Workflow executed",
            "logs": logs
        })

    except Exception as e:
        return jsonify({"error": f"Exception occurred: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(debug=True)