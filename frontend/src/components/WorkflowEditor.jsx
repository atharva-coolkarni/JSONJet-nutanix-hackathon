import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import LogStream from "./LogStream";

const streamLogUrl = import.meta.env.VITE_STREAM_LOG_ENDPOINT;
const executeWorkflowEndpointUrl = import.meta.env.VITE_EXECUTE_WORKFLOW_ENDPOINT;

function WorkflowEditor() {
  const [jsonText, setJsonText] = useState("");
  const [isValidJson, setIsValidJson] = useState(false);
  const [logs, setLogs] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [validationError, setValidationError] = useState("");
  const fileInputRef = useRef(null);
  const eventSourceRef = useRef(null);

  const handleTextChange = (e) => {
    const text = e.target.value;
    setJsonText(text);
    setValidationError(""); // Clear validation error when user types
    try {
      JSON.parse(text);
      setIsValidJson(true);
    } catch {
      setIsValidJson(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/json") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        setJsonText(text);
        try {
          JSON.parse(text);
          setIsValidJson(true);
        } catch {
          setIsValidJson(false);
        }
      };
      reader.readAsText(file);
    } else {
      alert("Please upload a valid .json file.");
    }
  };

  const handleRefresh = () => {
    setJsonText("");
    setIsValidJson(false);
    setLogs([]);
    setValidationError(""); // Clear validation error on refresh
  };

  const handleExecute = async () => {
    // First validate the JSON
    try {
      JSON.parse(jsonText);
    } catch (error) {
      setValidationError("The JSON is not valid");
      return; // Stop execution if JSON is invalid
    }

    try {
      const parsed = JSON.parse(jsonText);
      setLogs([]);
      setIsExecuting(true);
      setValidationError(""); // Clear any previous validation errors

      // Start log streaming
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      eventSourceRef.current = new EventSource(
        streamLogUrl
      );
      eventSourceRef.current.onmessage = (event) => {
        const log = JSON.parse(event.data);
        const formatted = `[${log.timestamp}] [${log.type}] [${log.status}] [Task: ${log.task_id}] ${log.message}`;
        setLogs((prev) => [...prev, formatted]);
      };

      eventSourceRef.current.onerror = (err) => {
        console.error("Log stream error", err);
        eventSourceRef.current.close();
      };

    await axios.post(executeWorkflowEndpointUrl, parsed, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Optional: Give time for final logs to stream in
      setTimeout(() => setIsExecuting(false), 2000);
    } catch (error) {
      console.error("Execution failed:", error);
      alert("Failed to execute workflow: " + error.message);
      setIsExecuting(false);
    }
  };

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-7xl h-[95vh] flex flex-col space-y-4">
        {/* Editor Card - Takes up 60% of screen height */}
        <div className="bg-white border border-gray-300 shadow-lg rounded-lg p-6 flex flex-col space-y-4 h-3/5">
          <div className="flex justify-between items-center flex-shrink-0">
            {/* Logo + Title */}
            <div className="flex items-center space-x-3">
              <img src="/json_jet_logo.png" alt="Logo" className="w-8 h-8" />
              <h2 className="text-xl font-semibold text-gray-800">
                Workflow JSON Editor
              </h2>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                disabled={isExecuting}
                title="Clear editor & logs"
                className={`p-2 rounded-full border ${
                  isExecuting
                    ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                    : "hover:bg-gray-100 border-gray-300 text-white"
                }`}
              >
                ⟳ Refresh
              </button>

              <button
                className={`px-4 py-2 rounded font-medium ${
                  isExecuting
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                }`}
                onClick={() => fileInputRef.current.click()}
                disabled={isExecuting}
              >
                Upload JSON
              </button>

              <input
                type="file"
                accept="application/json"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* JSON Textarea - Flexible height within the card */}
          <textarea
            value={jsonText}
            onChange={handleTextChange}
            placeholder="Paste or upload your workflow JSON here..."
            className="font-mono p-4 border border-gray-300 rounded bg-gray-900 text-green-300 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 flex-1 overflow-auto"
          />

          <div className="flex justify-between items-center flex-shrink-0">
            <span className="text-sm italic">
              {validationError ? (
                <span className="text-red-600">{validationError}</span>
              ) : isExecuting ? (
                <span className="text-gray-600">⏳ Executing workflow...</span>
              ) : (
                <span className="text-gray-600">Ready to execute</span>
              )}
            </span>

            <button
              disabled={!jsonText.trim() || isExecuting}
              className={`px-6 py-2 rounded font-semibold transition ${
                !jsonText.trim() || isExecuting
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-400"
              }`}
              onClick={handleExecute}
            >
              Execute Workflow
            </button>
          </div>
        </div>

        {/* Logs Card - Takes up 40% of screen height */}
        <div className="h-2/5 flex-shrink-0">
          <LogStream logs={logs} containerHeight="100%" />
        </div>
      </div>
    </div>
  );
}

export default WorkflowEditor;
