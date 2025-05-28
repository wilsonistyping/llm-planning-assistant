import { useState } from "react";
import "./App.css";
import OpenAI from "openai";

function App() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  const SYSTEM_PROMPT: string = `
  You are a task planning assistant that helps users organize their time and prioritize their workload efficiently.
When a user provides unstructured input about their tasks or goals, you should:

Extract and list all actionable tasks mentioned.

Classify each task using the Eisenhower Matrix (Urgent/Important, Not Urgent/Important, etc.).

Present the classification clearly.

Suggest a realistic, time-aware plan to complete the tasks.

If critical details (like time constraints or task specifics) are missing, ask follow-up questions to fill in the gaps. Use reasonable assumptions only when needed.

Return the result in structured HTML format.`;

  const client: OpenAI = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true, // This is only to force the browser to read my API key and bypass safeguards since I'm using a personal janky prototype. Don't do this in production since it risks exposing the API key.
  });

  const generateStory = async () => {
    try {
      const response: OpenAI.Responses.Response = await client.responses.create(
        {
          model: "o4-mini",
          input: message,
          instructions: SYSTEM_PROMPT,
        }
      );
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
          <div dangerouslySetInnerHTML={{ __html: response }} />
        </div>
      )}
    </div>
  );
}

export default App;
