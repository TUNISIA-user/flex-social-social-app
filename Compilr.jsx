import React, { useState } from "react";
import Editor from "@monaco-editor/react";

const CodeEditor = () => {
  const [code, setCode] = useState("// Write your JS code here...");
  const [output, setOutput] = useState("");

  const runCode = () => {
    let capturedOutput = "";

    // Override console.log to capture output
    const originalConsoleLog = console.log;
    console.log = (...args) => {
      capturedOutput += args.map((arg) => String(arg)).join(" ") + "\n";
      originalConsoleLog(...args);
    };

    try {
      const result = new Function(code)(); // Execute user code
      if (result !== undefined) {
        capturedOutput += `Result: ${result}`;
      }
    } catch (err) {
      capturedOutput = `Error: ${err.toString()}`;
    }

    // Restore original console.log
    console.log = originalConsoleLog;

    setOutput(capturedOutput || "No output...");
  };

  return (
    <div className="flex flex-col gap-4 p-4 w-full max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-center">Online JS Editor</h1>

      {/* Monaco Editor */}
      <Editor
        height="300px"
        defaultLanguage="javascript"
        value={code}
        onChange={(value) => setCode(value)}
        theme="vs-dark"
      />

      {/* Run Button */}
      <button
        onClick={runCode}
        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Run Code
      </button>

      {/* Output Section */}
      <div className="p-2 bg-gray-200 min-h-[50px] rounded">
        <strong>Output:</strong>
        <pre className="whitespace-pre-wrap">
          {output || "No output yet..."}
        </pre>
      </div>
    </div>
  );
};

export default CodeEditor;
