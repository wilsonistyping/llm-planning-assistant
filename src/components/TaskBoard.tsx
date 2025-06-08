import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Task } from "@/types/task";
import { TaskCard } from "./TaskCard";
import { Button } from "@/components/ui/button";
import { prioritizeTasks } from "@/services/openai";
import { useState } from "react";

interface TaskBoardProps {
  tasks: Task[];
  onTasksUpdate: (updatedTasks: Task[]) => void;
}

export function TaskBoard({ tasks, onTasksUpdate }: TaskBoardProps) {
  const [isPrioritizing, setIsPrioritizing] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex(
        (task) => task.title + tasks.indexOf(task) === active.id
      );
      const newIndex = tasks.findIndex(
        (task) => task.title + tasks.indexOf(task) === over.id
      );

      const newTasks = arrayMove(tasks, oldIndex, newIndex);
      onTasksUpdate(newTasks);
    }
  };

  const handleTaskUpdate = (updatedTask: Task, index: number) => {
    const newTasks = [...tasks];
    newTasks[index] = updatedTask;
    onTasksUpdate(newTasks);
  };

  const handlePrioritize = async () => {
    if (tasks.length === 0) return;

    setIsPrioritizing(true);
    try {
      const prioritizedTitles = await prioritizeTasks(tasks);

      // Create a map of task titles to their full task objects
      const taskMap = new Map(tasks.map((task) => [task.title, task]));

      // Reorder tasks based on the prioritized titles
      const reorderedTasks = prioritizedTitles
        .map((title) => taskMap.get(title))
        .filter((task): task is Task => task !== undefined);

      onTasksUpdate(reorderedTasks);
      console.log("Tasks reordered by priority:", reorderedTasks);
    } catch (error) {
      console.error("Failed to prioritize tasks:", error);
    } finally {
      setIsPrioritizing(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={tasks.map((task, index) => task.title + index)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {tasks.map((task, index) => (
                <TaskCard
                  key={task.title + index}
                  task={task}
                  index={index}
                  onUpdate={(updatedTask) =>
                    handleTaskUpdate(updatedTask, index)
                  }
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Button Bar */}
      <div className="p-4 border-t bg-muted/50">
        <div className="flex gap-2">
          <Button
            onClick={handlePrioritize}
            disabled={isPrioritizing || tasks.length === 0}
            className="flex-1"
          >
            {isPrioritizing ? "Prioritizing..." : "Prioritize Tasks"}
          </Button>
          {/* Placeholder for future buttons */}
          <div className="w-2" />
        </div>
      </div>
    </div>
  );
}
