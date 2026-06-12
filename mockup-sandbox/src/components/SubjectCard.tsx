import { ArrowRight, BookMarked, Microscope, Users, Calculator, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SubjectCardProps {
  subject: {
    id: number;
    name: string;
    examType: string;
    taskCount: number;
    color: string;
    icon: string;
    description?: string | null;
  };
  progress?: number;
  onClick: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  math: <Calculator className="h-6 w-6" />,
  russian: <BookMarked className="h-6 w-6" />,
  physics: <Sparkles className="h-6 w-6" />,
  social: <Users className="h-6 w-6" />,
  chemistry: <Microscope className="h-6 w-6" />,
  history: <BookMarked className="h-6 w-6" />,
  english: <BookMarked className="h-6 w-6" />,
  literature: <BookMarked className="h-6 w-6" />,
  biology: <Microscope className="h-6 w-6" />,
  geography: <Sparkles className="h-6 w-6" />,
};

export function SubjectCard({
  subject,
  progress = 0,
  onClick,
}: SubjectCardProps) {
  const getIconColor = (color: string) => {
    const colorMap: Record<string, string> = {
      "bg-blue-500": "text-blue-600",
      "bg-red-500": "text-red-600",
      "bg-purple-500": "text-purple-600",
      "bg-green-500": "text-green-600",
      "bg-orange-500": "text-orange-600",
      "bg-emerald-500": "text-emerald-600",
    };
    return colorMap[color] || "text-blue-600";
  };

  const icon = ICON_MAP[subject.icon] || <BookMarked className="h-6 w-6" />;

  return (
    <Card
      onClick={onClick}
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
    >
      {/* Color accent bar */}
      <div className={cn("h-1 w-full", subject.color)} />

      <div className="p-6">
        {/* Header with icon and exam type */}
        <div className="flex items-start justify-between mb-4">
          <div
            className={cn(
              "p-3 rounded-lg bg-slate-50 group-hover:bg-slate-100 transition-colors",
              getIconColor(subject.color)
            )}
          >
            {icon}
          </div>
          <Badge variant="secondary" className="text-xs">
            {subject.examType}
          </Badge>
        </div>

        {/* Subject name and description */}
        <h3 className="font-semibold text-lg text-slate-900 mb-1">
          {subject.name}
        </h3>
        {subject.description && (
          <p className="text-sm text-slate-500 mb-4">{subject.description}</p>
        )}

        {/* Task count */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-slate-600">
            {subject.taskCount} заданий
          </span>
          <span className="text-xs font-medium text-slate-500">
            {Math.round(progress)}% готово
          </span>
        </div>

        {/* Progress bar */}
        <Progress value={progress} className="mb-4 h-2" />

        {/* Footer button */}
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          variant="outline"
          className="w-full justify-between group/btn"
        >
          <span>Начать учить</span>
          <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </div>
    </Card>
  );
}
