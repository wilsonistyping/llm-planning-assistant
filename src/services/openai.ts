import OpenAI from "openai";
import type { TaskParserResponse, Task } from "../types/task";
import {
  BACKEND_SYSTEM_PROMPT,
  FRONTEND_SYSTEM_PROMPT,
  PRIORITIZATION_SYSTEM_PROMPT,
  TASK_CHAT_SYSTEM_PROMPT,
} from "../prompts/prompts";
import { marked } from "marked";

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const generateReply = async (message: string) => {
  try {
    const response = await client.responses.create({
      model: "o4-mini",
      input: message,
      instructions: FRONTEND_SYSTEM_PROMPT,
    });
    return response.output_text;
  } catch (error) {
    throw new Error(
      `Failed to generate task response: ${(error as Error).message}`
    );
  }
};

// export const generateBackendResponse = async (
//   message: string
// ): Promise<TaskParserResponse> => {
//   try {
//     const response = await client.responses.create({
//       model: "o4-mini",
//       input: message,
//       instructions: BACKEND_SYSTEM_PROMPT,
//     });
//     return JSON.parse(response.output_text);
//   } catch (error) {
//     throw new Error(
//       `Failed to generate backend response: ${(error as Error).message}`
//     );
//   }
// };

export const generateBackendResponse = async (
  message: string
): Promise<TaskParserResponse> => {
  try {
    const response = await client.responses.create({
      model: "o4-mini",
      input: message,
      instructions: BACKEND_SYSTEM_PROMPT,
      text: {
        format: {
          type: "json_schema",
          name: "task_response",
          schema: {
            type: "object",
            properties: {
              tasks: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                    urgency: { type: "string", enum: ["urgent", "not_urgent"] },
                    importance: {
                      type: "string",
                      enum: ["important", "not_important"],
                    },
                    length: { type: "string", enum: ["s", "m", "l", "xl"] },
                    due_date: { type: "string", nullable: true },
                  },
                  required: [
                    "title",
                    "description",
                    "urgency",
                    "importance",
                    "length",
                    "due_date",
                  ],
                  additionalProperties: false,
                },
              },
              metadata: {
                type: "object",
                properties: {
                  total_tasks: { type: "number" },
                },
                required: ["total_tasks"],
                additionalProperties: false,
              },
            },
            required: ["tasks", "metadata"],
            additionalProperties: false,
          },
          strict: true,
        },
      },
    });
    return JSON.parse(response.output_text);
  } catch (error) {
    throw new Error(
      `Failed to generate structured response: ${(error as Error).message}`
    );
  }
};

export const prioritizeTasks = async (tasks: Task[]): Promise<string[]> => {
  try {
    const response = await client.responses.create({
      model: "o4-mini",
      input: JSON.stringify({ tasks }),
      instructions: PRIORITIZATION_SYSTEM_PROMPT,
    });
    return JSON.parse(response.output_text);
  } catch (error) {
    throw new Error(`Failed to prioritize tasks: ${(error as Error).message}`);
  }
};

export async function generateTaskChatResponse(
  userInput: string,
  tasks: Task[]
): Promise<string> {
  console.log("Generating task chat response with context:", {
    userInput,
    taskCount: tasks.length,
    systemPrompt: TASK_CHAT_SYSTEM_PROMPT,
  });

  const response = await client.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: TASK_CHAT_SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: `Current task list: ${JSON.stringify(
          tasks,
          null,
          2
        )}\n\nUser question: ${userInput}`,
      },
    ],
    temperature: 0.7,
  });

  const reply = response.choices[0]?.message?.content;
  if (!reply) {
    throw new Error("Failed to generate task chat response");
  }

  console.log("Generated task chat response:", reply);

  // Convert markdown to HTML
  const htmlContent = marked(reply);
  console.log("Converted markdown to HTML:", htmlContent);

  return htmlContent;
}
