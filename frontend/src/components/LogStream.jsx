import React, { useState, useMemo } from "react";

function LogStream({ logs, containerHeight = "100%" }) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtersApplied = statusFilter !== "all" || typeFilter !== "all";

  // Parse log entries to extract status and type information
  const parsedLogs = useMemo(() => {
    return logs.map((line, idx) => {
      const statusMatch = line.match(/\[([^\]]+)\]\s*\[Task:/);
      const typeMatch = line.match(/\]\s*\[([^\]]+)\]\s*\[/);

      let status = "unknown";
      let type = "unknown";

      if (statusMatch && statusMatch[1]) {
        status = statusMatch[1].toLowerCase();
      }

      if (typeMatch && typeMatch[1]) {
        type = typeMatch[1].toLowerCase();
      }

      return {
        id: idx,
        line,
        status,
        type,
      };
    });
  }, [logs]);

  // Filter logs based on selected filters
  const filteredLogs = useMemo(() => {
    return parsedLogs.filter((log) => {
      const statusMatch = statusFilter === "all" || log.status === statusFilter;
      const typeMatch = typeFilter === "all" || log.type === typeFilter;
      return statusMatch && typeMatch;
    });
  }, [parsedLogs, statusFilter, typeFilter]);

  return (
    <div className="bg-white border border-gray-300 shadow-lg rounded-lg p-6 flex flex-col h-full">
      {/* Header with title and filters */}
      <div className="flex justify-between items-center flex-shrink-0 mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Execution Logs</h3>

        {/* Filter Controls */}
        <div className="flex items-center space-x-4">
          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <label
              htmlFor="status-filter"
              className="text-sm font-medium text-gray-600"
            >
              Status:
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            >
              <option value="all">All</option>
              <option value="running">Running</option>
              <option value="success">Success</option>
              <option value="error">Error</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex items-center space-x-2">
            <label
              htmlFor="type-filter"
              className="text-sm font-medium text-gray-600"
            >
              Type:
            </label>
            <select
              id="type-filter"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            >
              <option value="all">All</option>
              <option value="shell">Shell</option>
              <option value="api">API</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          <button
            onClick={() => {
              setStatusFilter("all");
              setTypeFilter("all");
            }}
            className={`px-3 py-1 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 ${
              filtersApplied
                ? "bg-gray-700 text-white hover:bg-gray-800"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Logs Display Area */}
      <div
        className="flex-1 bg-gray-900 text-green-300 font-mono text-sm p-4 rounded border overflow-auto"
        style={{
          height: containerHeight === "100%" ? "auto" : containerHeight,
        }}
      >
        {filteredLogs.length === 0 ? (
          <div className="text-gray-500 italic">
            {logs.length === 0
              ? "Logs will appear here after execution..."
              : "No logs match the current filters..."}
          </div>
        ) : (
          filteredLogs.map((logEntry) => (
            <div
              key={logEntry.id}
              className="mb-1 whitespace-pre-wrap break-words"
            >
              {logEntry.line}
            </div>
          ))
        )}
      </div>

      {/* Filter Status Info */}
      {logs.length > 0 && (
        <div className="flex-shrink-0 mt-2 text-xs text-gray-500">
          Showing {filteredLogs.length} of {logs.length} logs
        </div>
      )}
    </div>
  );
}

export default LogStream;
