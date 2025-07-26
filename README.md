# JSONJet

JSON Jet is a powerful, extensible Workflow Execution Engine designed to automate complex task orchestration from a simple JSON payload. Built for hackathons, developers, and enterprises alike, it enables users to capture, execute, and monitor robust multi-step workflows with ease from a user-friendly web application.

## 🚀 Features

- **JSON-Driven Workflows:** Upload or paste any well-structured JSON to define multistep workflows.
- **Dynamic Task Handling:** Seamless execution of shell scripts and REST API calls defined in your workflows.
- **Live Execution Logs:** Real-time, detailed logging for each workflow, including captured inputs, outputs, errors, and timestamps.
- **Smart Log Filtering:** Instantly filter log entries by task or status for deep debugging or high-level summaries.
- **Easy-to-Use Frontend:** Intuitive web UI for workflow submission, with instant visual feedback.
- **Backend Orchestration:** Reliable backend that parses, validates, and executes every workflow step by step.
- **Extensible Design:** Easily add support for new task types or integrations as your needs grow.

### 📄 Example Workflow JSON

```json
{
  "workflow_name": "Sample Data Processing Workflow",
  "tasks": [
    {
      "task_id": "task1",
      "type": "shell",
      "command": "echo 'Hello from Shell Task 1'"
    },
    {
      "task_id": "task2",
      "type": "api",
      "method": "GET",
      "url": "https://jsonplaceholder.typicode.com/posts/1"
    },
    {
      "task_id": "task3",
      "type": "shell",
      "command": "ls -l"
    },
    {
      "task_id": "task4",
      "type": "api",
      "method": "POST",
      "url": "https://jsonplaceholder.typicode.com/posts",
      "headers": {
        "Content-type": "application/json; charset=UTF-8"
      },
      "body": {
        "title": "foo",
        "body": "bar",
        "userId": 1
      }
    }
  ]
}
```

## 🛠 How It Works

1. **Upload or Paste JSON:** Submit your workflow in the specified JSON format.
2. **Workflow Parsing & Validation:** The backend checks the structure and contents for step-by-step clarity.
3. **Task Execution:** Each `shell` command or `api` call is executed behind the scenes, in the exact order defined.
4. **Live Logging:** Every action, its output, and errors are streamed to the front end, with options to filter and inspect.
5. **Extensible Engine:** Developers can plug in more task types, notifications, persistent storage, or advanced triggers.

## 🎯 Why JSON Jet?

- **No More Manual Orchestration:** Automate and chain shell scripts, API calls, and (soon) other task types from a single payload.
- **Full Transparency:** Instantly view logs and debug issues from the browser.
- **Built for Growth:** Quickly add new connectors, task types, or notification plugins.
- **Modern UI:** Clean, appealing, and easy-to-navigate frontend experience.

## ✨ Extensibility Ideas

- **More Task Types:** Add database queries, file uploads, or custom plugins.
- **Conditional Execution:** Branching based on output or status of previous tasks.
- **Authentication:** Integrate OAuth, secrets managers, or environment variables for secure API calls.
- **Persistent Workflows:** Save and manage frequently-used workflows.
- **Collaboration:** Share logs and workflows with teammates.

## 🖥️ Getting Started

1. **Clone the repo**
2. **Install dependencies:**

    ```
    npm install
    ```

3. **Run the development server:**

    ```
    npm start
    ```

4. **Open JSON Jet in your browser**
5. **Paste your workflow JSON and fly!**
