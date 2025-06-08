import { useState } from "react";
import "./App.css";
import type { TaskParserResponse } from "./types/task";
import {
  generateReply as generateReply,
  generateBackendResponse,
} from "./services/openai";
import Input from "./components/Input";

function App() {
  const [reply, setReply] = useState("");
  const [backendResponse, setBackendResponse] = useState<TaskParserResponse>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (message: string) => {
    setLoading(true);
    try {
      setReply(await generateReply(message));
      const backendData = await generateBackendResponse(message);
      setBackendResponse(backendData);
    } catch (error) {
      setReply(`An error occurred: ${(error as Error).message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Input onSubmit={handleSubmit} />
      <div>{loading && <p>Loading...</p>}</div>
      {reply && (
        <div style={{ marginTop: "20px" }}>
          <h3>Generated Response:</h3>
          <div dangerouslySetInnerHTML={{ __html: reply }} />
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
