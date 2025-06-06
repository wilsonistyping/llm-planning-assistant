import { useState } from "react";
import "./App.css";
import type { TaskParserResponse } from "./types/task";
import {
  generateTaskResponse,
  generateBackendResponse,
} from "./services/openai";
import Input from "./components/Input";

function App() {
  const [response, setResponse] = useState("");
  const [backendResponse, setBackendResponse] = useState<TaskParserResponse>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (message: string) => {
    setLoading(true);
    try {
      const taskResponse = await generateTaskResponse(message);
      setResponse(taskResponse);

      const backendData = await generateBackendResponse(message);
      setBackendResponse(backendData);
    } catch (error) {
      setResponse(`An error occurred: ${(error as Error).message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Input onSubmit={handleSubmit} />
      <div>{loading && <p>Loading...</p>}</div>
      {response && (
        <div style={{ marginTop: "20px" }}>
          <h3>Generated Response:</h3>
          <div dangerouslySetInnerHTML={{ __html: response }} />
        </div>
      )}
      {backendResponse && (
        <div style={{ marginTop: "20px" }}>
          <h3>Generated Backend Response:</h3>
          <pre>{JSON.stringify(backendResponse, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
