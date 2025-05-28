import { useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");

  const callOpenAIAPI = () => {
    console.log("Calling OpenAI API");
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
        <button onClick={callOpenAIAPI}>Send</button>
      </div>
    </div>
  );
}

export default App;
