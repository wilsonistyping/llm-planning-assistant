export interface Task {
  description: string;
  urgency: "urgent" | "not_urgent";
  importance: "important" | "not_important";
  suggested_time?: string;
}

export interface TaskMetadata {
  total_tasks: number;
}

export interface TaskParserResponse {
  tasks: Task[];
  metadata: TaskMetadata;
}
