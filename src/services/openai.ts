import OpenAI from "openai";
import type { TaskParserResponse, Task } from "../types/task";
import {
  BACKEND_SYSTEM_PROMPT,
  FRONTEND_SYSTEM_PROMPT,
  PRIORITIZATION_SYSTEM_PROMPT,
} from "../prompts/prompts";

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

export const generateBackendResponse = async (
  message: string
): Promise<TaskParserResponse> => {
  try {
    const response = await client.responses.create({
      model: "o4-mini",
      input: message,
      instructions: BACKEND_SYSTEM_PROMPT,
    });
    return JSON.parse(response.output_text);
  } catch (error) {
    throw new Error(
      `Failed to generate backend response: ${(error as Error).message}`
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
