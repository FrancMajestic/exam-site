import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DifficultyBadgeProps {
  difficulty: "easy" | "medium" | "hard";
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const difficultyConfig = {
    easy: {
      label: "Легко",
      className: "bg-green-100 text-green-800 border-green-300",
    },
    medium: {
      label: "Среднее",
      className: "bg-amber-100 text-amber-800 border-amber-300",
    },
    hard: {
      label: "Сложно",
      className: "bg-red-100 text-red-800 border-red-300",
    },
  };

  const config = difficultyConfig[difficulty];

  return (
    <Badge
      variant="outline"
      className={cn("text-xs font-semibold", config.className)}
    >
      {config.label}
    </Badge>
  );
}
