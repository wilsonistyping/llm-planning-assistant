import { useState } from "react";
import "./App.css";
import type { TaskParserResponse } from "./types/task";
import {
  generateReply as generateReply,
  generateBackendResponse,
} from "./services/openai";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [parsedTasks, setParsedTasks] = useState<TaskParserResponse | null>(
    null
  );

  const handleSubmit = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const reply = await generateReply(input);
      const backendData = await generateBackendResponse(input);

      const assistantMessage: Message = {
        role: "assistant",
        content: reply,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setParsedTasks(backendData);

      // Log the parsed tasks to the console
      console.log("Parsed Tasks:", backendData);
    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content: `An error occurred: ${(error as Error).message}`,
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              <div dangerouslySetInnerHTML={{ __html: message.content }} />
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg p-4">
              <p>Thinking...</p>
            </div>
          </div>
        )}
      </div>

      {parsedTasks && (
        <div className="mb-4 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">
            Identified Tasks ({parsedTasks.metadata.total_tasks})
          </h3>
          <div className="space-y-2">
            {parsedTasks.tasks.map((task, index) => (
              <div key={index} className="bg-background p-3 rounded">
                <h4 className="font-medium">{task.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {task.description}
                </p>
                <div className="flex gap-2 mt-1 text-xs">
                  <span
                    className={`px-2 py-1 rounded ${
                      task.urgency === "urgent"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {task.urgency}
                  </span>
                  <span
                    className={`px-2 py-1 rounded ${
                      task.importance === "important"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {task.importance}
                  </span>
                  <span className="px-2 py-1 rounded bg-gray-100 text-gray-800">
                    {task.length}
                  </span>
                  {task.due_date && (
                    <span className="px-2 py-1 rounded bg-purple-100 text-purple-800">
                      Due: {task.due_date}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <Button onClick={handleSubmit} disabled={loading}>
          Send
        </Button>
      </div>
    </div>
  );
}

export default App;
