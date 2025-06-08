import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaskFiltersProps {
  onFiltersChange: (filters: TaskFilters) => void;
}

export interface TaskFilters {
  urgency: string | null;
  importance: string | null;
  length: string | null;
  dueDate: string | null;
}

export function TaskFilters({ onFiltersChange }: TaskFiltersProps) {
  const [filters, setFilters] = useState<TaskFilters>({
    urgency: null,
    importance: null,
    length: null,
    dueDate: null,
  });

  const handleFilterChange = (
    field: keyof TaskFilters,
    value: string | null
  ) => {
    console.log(`Filter changed - ${field}:`, value);
    // Convert "all" to null for filtering
    const newValue = value === "all" ? null : value;
    const newFilters = { ...filters, [field]: newValue };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  return (
    <div className="flex flex-wrap gap-2 p-4 border-b bg-muted/30">
      <Select
        value={filters.urgency || "all"}
        onValueChange={(value) => handleFilterChange("urgency", value)}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Urgency" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="urgent">Urgent</SelectItem>
          <SelectItem value="not_urgent">Not Urgent</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.importance || "all"}
        onValueChange={(value) => handleFilterChange("importance", value)}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Importance" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="important">Important</SelectItem>
          <SelectItem value="not_important">Not Important</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.length || "all"}
        onValueChange={(value) => handleFilterChange("length", value)}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Task Size" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="s">Small</SelectItem>
          <SelectItem value="m">Medium</SelectItem>
          <SelectItem value="l">Large</SelectItem>
          <SelectItem value="xl">X-Large</SelectItem>
        </SelectContent>
      </Select>

      <input
        type="date"
        value={filters.dueDate || ""}
        onChange={(e) => handleFilterChange("dueDate", e.target.value || null)}
        className="h-10 px-3 rounded-md border bg-background"
      />
    </div>
  );
}
