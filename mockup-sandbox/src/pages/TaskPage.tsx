import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import {
  ArrowLeft,
  Check,
  X,
  Lightbulb,
  Zap,
  Coins,
} from "lucide-react";
import { Page } from "../App";

interface TaskPageProps {
  taskId: number;
  subjectId: number;
  onNavigate: (page: Page) => void;
}

interface TaskDetail {
  id: number;
  task_number: number;
  difficulty: string;
  question: string;
  answer_type: string;
  options: string[] | null;
  correct_answer: string;
  solution: string;
  lifehack: string | null;
  year: number | null;
  subject_id: number;
  topic_id: number;
}

interface SubjectRow {
  id: number;
  name: string;
  exam_type: string;
  color: string;
}

interface SiblingTask {
  id: number;
  task_number: number;
}

const DIFFICULTY_CONFIG: Record<string, { label: string; color: string }> = {
  easy: { label: "Легко", color: "bg-green-100 text-green-800" },
  medium: { label: "Среднее", color: "bg-amber-100 text-amber-800" },
  hard: { label: "Сложно", color: "bg-red-100 text-red-800" },
};

export function TaskPage({ taskId, subjectId, onNavigate }: TaskPageProps) {
  const [task, setTask] = useState<TaskDetail | null>(null);
  const [subject, setSubject] = useState<SubjectRow | null>(null);
  const [siblings, setSiblings] = useState<SiblingTask[]>([]);
  const [answer, setAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [taskRes, subjectRes, siblingsRes] = await Promise.all([
        supabase.from("tasks").select("*").eq("id", taskId).maybeSingle(),
        supabase.from("subjects").select("id, name, exam_type, color").eq("id", subjectId).maybeSingle(),
        supabase.from("tasks").select("id, task_number").eq("subject_id", subjectId).order("task_number"),
      ]);

      if (taskRes.data) setTask(taskRes.data as TaskDetail);
      if (subjectRes.data) setSubject(subjectRes.data);
      if (siblingsRes.data) setSiblings(siblingsRes.data);

      setAnswer("");
      setSelectedOption(null);
      setSubmitted(false);
      setCorrect(false);
      setLoading(false);
    }
    loadData();
  }, [taskId, subjectId]);

  function handleSubmit() {
    if (!task) return;

    let userAnswer = answer;
    if (task.answer_type === "choice" && task.options && selectedOption !== null) {
      userAnswer = String(selectedOption + 1);
    }

    const isCorrect = userAnswer.trim().toLowerCase() === task.correct_answer.trim().toLowerCase();
    setCorrect(isCorrect);
    setSubmitted(true);

    // Record attempt
    supabase.from("task_attempts").insert({
      user_id: 1,
      task_id: taskId,
      answer: userAnswer,
      correct: isCorrect,
      coins_earned: isCorrect ? (task.difficulty === "hard" ? 15 : task.difficulty === "medium" ? 10 : 5) : 0,
    }).then(() => {});

    if (isCorrect) {
      supabase.rpc("increment_user_stats", { user_id_param: 1, coins_param: isCorrect ? 5 : 0 }).catch(() => {});
    }
  }

  function goToTask(t: SiblingTask) {
    onNavigate({ type: "task", taskId: t.id, subjectId });
  }

  const currentIndex = siblings.findIndex((s) => s.id === taskId);
  const prevTask = currentIndex > 0 ? siblings[currentIndex - 1] : null;
  const nextTask = currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-gray-400 text-lg">Загрузка...</div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Задача не найдена</p>
        <Button variant="outline" className="mt-4" onClick={() => onNavigate({ type: "subject", subjectId })}>
          К предмету
        </Button>
      </div>
    );
  }

  const diff = DIFFICULTY_CONFIG[task.difficulty] ?? DIFFICULTY_CONFIG.medium;
  const isChoiceTask = task.answer_type === "choice" && task.options && task.options.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => onNavigate({ type: "subject", subjectId })}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {subject?.name ?? "Назад"}
        </Button>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Задание #{task.task_number}
          </Badge>
          <Badge variant="outline" className={cn("text-xs border-0", diff.color)}>
            {diff.label}
          </Badge>
          {task.year && <Badge variant="outline" className="text-xs">{task.year}</Badge>}
        </div>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center gap-1 flex-wrap">
        {siblings.map((s, i) => (
          <button
            key={s.id}
            className={cn(
              "w-7 h-7 rounded text-xs font-medium transition-colors",
              s.id === taskId
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            )}
            onClick={() => goToTask(s)}
          >
            {s.task_number}
          </button>
        ))}
      </div>

      {/* Question */}
      <Card className="p-6 border-0 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Вопрос</h2>
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{task.question}</p>
      </Card>

      {/* Answer Area */}
      {!submitted ? (
        <Card className="p-6 border-0 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ваш ответ</h2>

          {isChoiceTask ? (
            <div className="space-y-3">
              {task.options!.map((option, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-full p-4 rounded-lg border-2 text-left transition-all",
                    selectedOption === index
                      ? "border-blue-500 bg-blue-50 text-blue-900"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  )}
                  onClick={() => setSelectedOption(index)}
                >
                  <span className="font-medium">{index + 1}.</span> {option}
                </button>
              ))}
            </div>
          ) : (
            <Input
              placeholder="Введите ответ..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="text-lg"
              onKeyDown={(e) => e.key === "Enter" && (answer || selectedOption !== null) && handleSubmit()}
            />
          )}

          <Button
            className="mt-4 w-full"
            size="lg"
            disabled={isChoiceTask ? selectedOption === null : !answer.trim()}
            onClick={handleSubmit}
          >
            Проверить ответ
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Result */}
          <Card
            className={cn(
              "p-6 border-2",
              correct ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"
            )}
          >
            <div className="flex items-center gap-3 mb-3">
              {correct ? (
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="w-6 h-6 text-white" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                  <X className="w-6 h-6 text-white" />
                </div>
              )}
              <div>
                <h3 className={cn("text-lg font-bold", correct ? "text-green-900" : "text-red-900")}>
                  {correct ? "Правильно!" : "Неправильно"}
                </h3>
                {correct && (
                  <div className="flex items-center gap-1 text-green-700">
                    <Coins className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      +{task.difficulty === "hard" ? 15 : task.difficulty === "medium" ? 10 : 5} монет
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700">Правильный ответ:</p>
                <p className="text-lg font-bold text-gray-900">{task.correct_answer}</p>
              </div>
            </div>
          </Card>

          {/* Solution */}
          {task.solution && (
            <Card className="p-6 border-0 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <h3 className="font-semibold text-gray-900">Решение</h3>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{task.solution}</p>
            </Card>
          )}

          {/* Lifehack */}
          {task.lifehack && (
            <Card className="p-6 border-0 shadow-sm bg-amber-50">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-amber-500" />
                <h3 className="font-semibold text-amber-900">Лайфхак</h3>
              </div>
              <p className="text-amber-800 whitespace-pre-wrap leading-relaxed">{task.lifehack}</p>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-2">
            {prevTask ? (
              <Button variant="outline" onClick={() => goToTask(prevTask)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Задание #{prevTask.task_number}
              </Button>
            ) : (
              <div />
            )}
            {nextTask ? (
              <Button onClick={() => goToTask(nextTask)}>
                Задание #{nextTask.task_number}
                <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
              </Button>
            ) : (
              <Button onClick={() => onNavigate({ type: "subject", subjectId })}>
                К списку задач
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
