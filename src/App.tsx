import { useState } from "react";
import "./App.css";
import type { Task } from "./types/task";
import {
  generateReply as generateReply,
  generateBackendResponse,
  generateTaskChatResponse,
} from "./services/openai";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TaskBoard } from "./components/TaskBoard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [taskMessages, setTaskMessages] = useState<Message[]>([]);
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

  const handleTaskChatSubmit = async () => {
    if (!input.trim() || tasks.length === 0) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setTaskMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      console.log("Sending task context to LLM:", tasks);
      const reply = await generateTaskChatResponse(input, tasks);

      const assistantMessage: Message = {
        role: "assistant",
        content: reply,
      };

      setTaskMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content: `An error occurred: ${(error as Error).message}`,
      };
      setTaskMessages((prev) => [...prev, errorMessage]);
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
        <Tabs defaultValue="chat" className="flex-1 flex flex-col">
          <TabsList className="w-full justify-start border-b rounded-none">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="tasks" disabled={tasks.length === 0}>
              Task Chat
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="flex-1 flex flex-col">
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
                    <div
                      dangerouslySetInnerHTML={{ __html: message.content }}
                    />
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
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="border border-input"
                >
                  Send
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {taskMessages.map((message, index) => (
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
                    <div
                      className="prose prose-sm dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: message.content }}
                    />
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
                  placeholder="Ask about your tasks..."
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleTaskChatSubmit();
                    }
                  }}
                />
                <Button
                  onClick={handleTaskChatSubmit}
                  disabled={loading || tasks.length === 0}
                  className="border border-input"
                >
                  Send
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
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
