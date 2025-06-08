export interface Task {
  title: string;
  description: string;
  urgency: "urgent" | "not_urgent";
  importance: "important" | "not_important";
  length: "s" | "m" | "l" | "xl";
  due_date?: string;
}

export interface TaskMetadata {
  total_tasks: number;
}

export interface TaskParserResponse {
  tasks: Task[];
  metadata: TaskMetadata;
}
