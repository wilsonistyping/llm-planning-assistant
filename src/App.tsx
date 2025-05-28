import { useState } from "react";
import "./App.css";
import OpenAI from "openai";

function App() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  const SYSTEM_PROMPT = `
  You are a helpful assistant that can answer questions and help with tasks.`;

  const client = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true, // This is only to force the browser to read my API key and bypass safeguards since I'm using a personal janky prototype. Don't do this in production since it risks exposing the API key.
  });

  const generateStory = async () => {
    try {
      const response = await client.responses.create({
        model: "o4-mini",
        input: message,
        instructions: SYSTEM_PROMPT,
      });
      setResponse(response.output_text);
    } catch (error) {
      setResponse("An error occurred: " + (error as Error).message);
      console.error(error);
    }
  };

  return (
    <div>
      <div>
        <textarea
          onChange={(e) => setMessage(e.target.value)}
          cols={50}
          rows={10}
          placeholder="Enter your message"
        ></textarea>
      </div>
      <div>
        <button onClick={generateStory}>Send</button>
      </div>
      {response && (
        <div style={{ marginTop: "20px" }}>
          <h3>Generated Response:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}

export default App;
