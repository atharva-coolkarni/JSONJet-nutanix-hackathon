import React, { useState, useRef } from "react";
import LogStream from "./LogStream";

function WorkflowEditor() {
  const [jsonText, setJsonText] = useState("");
  const [isValidJson, setIsValidJson] = useState(false);
  const [logs, setLogs] = useState([]);
  const fileInputRef = useRef(null);

  const handleTextChange = (e) => {
    const text = e.target.value;
    setJsonText(text);
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

  const handleExecute = () => {
    setLogs([]);
    const simulatedLogs = [
      "Connecting to workflow engine...",
      "Parsing JSON...",
      "Step 1: Executing shell command...",
      "Shell output: Hello from shell",
      "Step 2: Sending REST API request...",
      "Response received: 200 OK",
      "Workflow execution completed ✅",
    ];
    simulatedLogs.forEach((line, i) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, line]);
      }, i * 800);
    });
  };

  return (
    <div className="flex flex-col items-center w-full max-w-3xl h-[90vh] space-y-8">
      {/* Editor Card */}
      <div className="w-full bg-white border border-gray-300 shadow-lg rounded-lg p-6 flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Workflow JSON Editor
          </h2>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => fileInputRef.current.click()}
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

        <textarea
          value={jsonText}
          onChange={handleTextChange}
          placeholder="Paste or upload your workflow JSON here..."
          className="font-mono p-4 border border-gray-300 rounded bg-gray-900 text-green-300 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 h-[40vh] overflow-auto"
        />

        <div className="flex justify-end">
          <button
            disabled={!isValidJson}
            className={`px-6 py-2 text-white rounded ${
              isValidJson
                ? "bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-400"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            onClick={handleExecute}
          >
            Execute Workflow
          </button>
        </div>
      </div>

      {/* Logs Card */}
      <div className="w-full">
        <LogStream logs={logs} containerHeight="40vh" />
      </div>
    </div>
  );
}

export default WorkflowEditor;
