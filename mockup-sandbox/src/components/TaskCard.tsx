import { Check, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DifficultyBadge } from "./DifficultyBadge";

interface TaskCardProps {
  task: {
    id: number;
    taskNumber: number;
    difficulty: string;
    question: string;
    answerType: string;
    year?: number | null;
  };
  solved?: boolean;
  onClick: () => void;
}

export function TaskCard({ task, solved = false, onClick }: TaskCardProps) {
  // Truncate question to reasonable length
  const truncatedQuestion =
    task.question.length > 120
      ? task.question.substring(0, 120) + "..."
      : task.question;

  return (
    <Card
      onClick={onClick}
      className={cn(
        "overflow-hidden hover:shadow-md transition-all cursor-pointer group border-l-4",
        solved ? "border-l-green-500 bg-slate-50" : "border-l-slate-200"
      )}
    >
      <div className="p-4">
        {/* Header: Task number and status */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="font-bold text-sm bg-blue-100 text-blue-700 border-blue-200"
            >
              № {task.taskNumber}
            </Badge>
            {solved && (
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100">
                <Check className="h-4 w-4 text-green-600" />
              </div>
            )}
          </div>
          <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
        </div>

        {/* Difficulty badge and year */}
        <div className="flex items-center gap-2 mb-3">
          <DifficultyBadge
            difficulty={task.difficulty as "easy" | "medium" | "hard"}
          />
          {task.year && (
            <Badge variant="outline" className="text-xs text-slate-600">
              {task.year}
            </Badge>
          )}
        </div>

        {/* Question preview */}
        <p className="text-sm text-slate-700 mb-3 line-clamp-2">
          {truncatedQuestion}
        </p>

        {/* Answer type info */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {task.answerType === "multiple_choice" && "Выбор ответа"}
            {task.answerType === "short_answer" && "Краткий ответ"}
            {task.answerType === "written_answer" && "Развернутый ответ"}
            {task.answerType === "matching" && "Соответствие"}
          </span>
          <span
            className={cn(
              "text-xs font-medium",
              solved ? "text-green-600" : "text-slate-500"
            )}
          >
            {solved ? "Решено" : "Не решено"}
          </span>
        </div>
      </div>
    </Card>
  );
}
