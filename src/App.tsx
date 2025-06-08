import { useState } from "react";
import "./App.css";
import type { Task } from "./types/task";
import {
  generateReply as generateReply,
  generateBackendResponse,
} from "./services/openai";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TaskBoard } from "./components/TaskBoard";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

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
      setTasks(backendData.tasks);

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

  const handleTasksUpdate = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
    console.log("Updated Tasks:", updatedTasks);
  };

  return (
    <div className="flex h-screen">
      {/* Chat Section */}
      <div className="w-1/2 flex flex-col border-r">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
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

        <div className="p-4 border-t">
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
      </div>

      {/* Task Board Section */}
      <div className="w-1/2 flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Task Board</h2>
        </div>
        <TaskBoard tasks={tasks} onTasksUpdate={handleTasksUpdate} />
      </div>
    </div>
  );
}

export default App;
