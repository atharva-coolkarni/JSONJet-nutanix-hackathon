from flask import Flask, request, jsonify, Response, stream_with_context
from flask_cors import CORS
import time
import json
from datetime import datetime
from utils.logger import log_queue, log
from task_types.rest import execute_api
from task_types.shell import execute_shell

app = Flask(__name__)
CORS(app)  # enable CORS for all routes

def run_workflow(workflow):
    for task in workflow.get("tasks", []):
        task_type = task.get("type")
        if task_type == "shell":
            execute_shell(task)
        elif task_type == "api":
            execute_api(task)
        else:
            log_queue.put({
                "timestamp": str(datetime.now()),
                "task_id": task.get("id", "unknown"),
                "type": task_type,
                "status": "error",
                "message": "Unsupported task type"
            })

@app.route('/execute_workflow', methods=['POST'])
def execute_workflow():
    try:
        workflow = request.get_json()
        if not workflow or "tasks" not in workflow:
            return jsonify({"error": "Invalid input. 'tasks' key missing."}), 400

        run_workflow(workflow)

        return jsonify({"message": "Workflow executed"})

    except Exception as e:
        return jsonify({"error": f"Exception occurred: {str(e)}"}), 500

@app.route('/stream-logs')
def stream_logs():
    def generate():
        while True:
            if not log_queue.empty():
                log_entry = log_queue.get()
                yield f"data: {json.dumps(log_entry)}\n\n"
    return Response(stream_with_context(generate()), mimetype='text/event-stream')

if __name__ == "__main__":
    app.run(debug=True)
