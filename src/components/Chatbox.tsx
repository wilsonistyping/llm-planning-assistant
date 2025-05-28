import React, { useState } from "react";
import { fetchChatCompletion } from "../services/openai";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await fetchChatCompletion(newMessages);
      setMessages([...newMessages, response.choices[0].message]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <ul>
        {messages.map((msg, i) => (
          <li key={i}>{msg.content}</li>
        ))}
      </ul>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default ChatBox;
