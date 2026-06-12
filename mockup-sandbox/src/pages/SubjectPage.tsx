import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import {
  ChevronDown,
  ChevronUp,
  BookOpen,
  ArrowLeft,
} from "lucide-react";
import { Page } from "../App";

interface SubjectPageProps {
  subjectId: number;
  onNavigate: (page: Page) => void;
}

interface TopicRow {
  id: number;
  name: string;
  task_count: number;
}

interface TaskRow {
  id: number;
  task_number: number;
  difficulty: string;
  question: string;
  answer_type: string;
  year: number | null;
}

interface SubjectRow {
  id: number;
  name: string;
  exam_type: string;
  task_count: number;
  color: string;
  icon: string;
}

const EXAM_LABEL: Record<string, string> = { ege: "ЕГЭ", oge: "ОГЭ" };

const DIFFICULTY_CONFIG: Record<string, { label: string; color: string }> = {
  easy: { label: "Легко", color: "bg-green-100 text-green-800" },
  medium: { label: "Среднее", color: "bg-amber-100 text-amber-800" },
  hard: { label: "Сложно", color: "bg-red-100 text-red-800" },
};

export function SubjectPage({ subjectId, onNavigate }: SubjectPageProps) {
  const [subject, setSubject] = useState<SubjectRow | null>(null);
  const [topics, setTopics] = useState<TopicRow[]>([]);
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [expandedTopic, setExpandedTopic] = useState<number | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [subjectRes, topicsRes, tasksRes] = await Promise.all([
        supabase.from("subjects").select("*").eq("id", subjectId).maybeSingle(),
        supabase.from("topics").select("id, name, task_count").eq("subject_id", subjectId).order("id"),
        supabase.from("tasks").select("id, task_number, difficulty, question, answer_type, year, topic_id").eq("subject_id", subjectId).order("task_number"),
      ]);

      if (subjectRes.data) setSubject(subjectRes.data);
      if (topicsRes.data) setTopics(topicsRes.data);
      if (tasksRes.data) setTasks(tasksRes.data);
      setLoading(false);
    }
    loadData();
  }, [subjectId]);

  const filteredTasks = difficultyFilter === "all"
    ? tasks
    : tasks.filter((t) => t.difficulty === difficultyFilter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-gray-400 text-lg">Загрузка...</div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Предмет не найден</p>
        <Button variant="outline" className="mt-4" onClick={() => onNavigate({ type: "home" })}>
          На главную
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button variant="ghost" onClick={() => onNavigate({ type: "home" })} className="mb-2">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Назад
      </Button>

      {/* Subject Header */}
      <div className="flex items-center gap-4">
        <div
          className="w-14 h-14 rounded-lg flex items-center justify-center text-white"
          style={{ backgroundColor: subject.color }}
        >
          <BookOpen className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{subject.name}</h1>
          <div className="flex items-center gap-3 mt-1">
            <Badge variant="secondary">{EXAM_LABEL[subject.exam_type]}</Badge>
            <span className="text-sm text-gray-600">{subject.task_count} задач</span>
          </div>
        </div>
      </div>

      {/* Difficulty Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-gray-600 mr-1">Сложность:</span>
        {["all", "easy", "medium", "hard"].map((d) => (
          <Button
            key={d}
            variant={difficultyFilter === d ? "default" : "outline"}
            size="sm"
            onClick={() => setDifficultyFilter(d)}
          >
            {d === "all" ? "Все" : DIFFICULTY_CONFIG[d]?.label ?? d}
          </Button>
        ))}
      </div>

      {/* Topics */}
      <div className="space-y-3">
        {topics.map((topic) => {
          const isExpanded = expandedTopic === topic.id;
          const topicTasks = filteredTasks.filter((t) => t.topic_id === topic.id);

          return (
            <Card key={topic.id} className="border-0 shadow-sm overflow-hidden">
              <button
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedTopic(isExpanded ? null : topic.id)}
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  <span className="font-medium text-gray-900">{topic.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {topic.task_count} задач
                  </Badge>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {isExpanded && topicTasks.length > 0 && (
                <div className="border-t divide-y">
                  {topicTasks.map((task) => {
                    const diff = DIFFICULTY_CONFIG[task.difficulty] ?? DIFFICULTY_CONFIG.medium;
                    return (
                      <button
                        key={task.id}
                        className="w-full p-4 flex items-center justify-between hover:bg-blue-50 transition-colors text-left"
                        onClick={() =>
                          onNavigate({ type: "task", taskId: task.id, subjectId })
                        }
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900">
                              Задание #{task.task_number}
                            </span>
                            {task.year && (
                              <Badge variant="outline" className="text-xs">
                                {task.year}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {task.question}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn("text-xs border-0 ml-3 shrink-0", diff.color)}
                        >
                          {diff.label}
                        </Badge>
                      </button>
                    );
                  })}
                </div>
              )}

              {isExpanded && topicTasks.length === 0 && (
                <div className="p-4 text-center text-sm text-gray-400 border-t">
                  Нет задач с выбранным фильтром
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Задачи пока не добавлены</p>
        </div>
      )}
    </div>
  );
}
