import React from "react";

function LogStream({ logs }) {
  return (
    <div className="bg-black text-green-400 font-mono p-4 rounded-lg overflow-y-auto shadow-inner border border-gray-800 h-full">
      <p className="text-base font-semibold text-green-300 mb-2">
        Execution Logs
      </p>
      {logs.length === 0 ? (
        <p className="text-sm italic opacity-60">
          Logs will appear here after execution...
        </p>
      ) : (
        logs.map((line, idx) => <div key={idx}>{line}</div>)
      )}
    </div>
  );
}

export default LogStream;
