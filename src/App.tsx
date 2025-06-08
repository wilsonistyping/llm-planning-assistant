import { useState } from "react";
import "./App.css";
import type { TaskParserResponse } from "./types/task";
import {
  generateReply as generateReply,
  generateBackendResponse,
} from "./services/openai";
import Input from "./components/Input";
import Message from "./components/Message";

interface ChatMessage {
  content: string;
  isUser: boolean;
}

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [backendResponse, setBackendResponse] = useState<TaskParserResponse>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (message: string) => {
    setLoading(true);
    try {
      // Add user message
      setMessages((prev) => [...prev, { content: message, isUser: true }]);

      // Get AI response
      const reply = await generateReply(message);
      setMessages((prev) => [...prev, { content: reply, isUser: false }]);

      // Get backend response
      const backendData = await generateBackendResponse(message);
      setBackendResponse(backendData);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          content: `An error occurred: ${(error as Error).message}`,
          isUser: false,
        },
      ]);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Chat Section */}
      <div className="flex-1 flex flex-col border-r">
        <div className="flex-1 overflow-y-auto">
          {messages.map((message, index) => (
            <Message
              key={index}
              content={message.content}
              isUser={message.isUser}
            />
          ))}
          {loading && (
            <div className="p-4 text-muted-foreground">Thinking...</div>
          )}
        </div>
        <Input onSubmit={handleSubmit} />
      </div>

      {/* JSON Response Section */}
      <div className="w-1/2 p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Structured Response</h2>
        {backendResponse && (
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            {JSON.stringify(backendResponse, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}

export default App;
