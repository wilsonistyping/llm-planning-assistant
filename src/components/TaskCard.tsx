import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "@/types/task";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaskCardProps {
  task: Task;
  index: number;
  onUpdate: (updatedTask: Task) => void;
}

export function TaskCard({ task, index, onUpdate }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.title + index });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleLabelChange = (field: keyof Task, value: string) => {
    const updatedTask = { ...task, [field]: value };
    onUpdate(updatedTask);
    console.log("Updated task:", updatedTask);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-background p-4 rounded-lg shadow-sm mb-2 cursor-move"
    >
      <h4 className="font-medium mb-2">{task.title}</h4>
      <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
      <div className="flex flex-wrap gap-2">
        <Select
          value={task.urgency}
          onValueChange={(value) => handleLabelChange("urgency", value)}
        >
          <SelectTrigger className="w-[120px] h-7 text-xs">
            <SelectValue placeholder="Urgency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="not_urgent">Not Urgent</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={task.importance}
          onValueChange={(value) => handleLabelChange("importance", value)}
        >
          <SelectTrigger className="w-[120px] h-7 text-xs">
            <SelectValue placeholder="Importance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="important">Important</SelectItem>
            <SelectItem value="not_important">Not Important</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={task.length}
          onValueChange={(value) => handleLabelChange("length", value)}
        >
          <SelectTrigger className="w-[80px] h-7 text-xs">
            <SelectValue placeholder="Length" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="s">Small</SelectItem>
            <SelectItem value="m">Medium</SelectItem>
            <SelectItem value="l">Large</SelectItem>
            <SelectItem value="xl">X-Large</SelectItem>
          </SelectContent>
        </Select>

        {task.due_date && (
          <input
            type="date"
            value={task.due_date}
            onChange={(e) => handleLabelChange("due_date", e.target.value)}
            className="h-7 text-xs px-2 rounded-md border"
          />
        )}
      </div>
    </div>
  );
}
