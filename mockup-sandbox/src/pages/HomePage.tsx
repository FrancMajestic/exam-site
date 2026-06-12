import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import {
  BookOpen,
  Flame,
  Target,
  Coins,
  ArrowRight,
  Clock,
  TrendingUp,
} from "lucide-react";
import { Page } from "../App";

interface SubjectRow {
  id: number;
  name: string;
  exam_type: string;
  task_count: number;
  color: string;
  icon: string;
  description: string | null;
}

interface TaskRow {
  id: number;
  subject_id: number;
  topic_id: number;
  task_number: number;
  difficulty: string;
  question: string;
  answer_type: string;
  year: number | null;
}

interface UserRow {
  total_tasks_solved: number;
  correct_answers: number;
  current_streak: number;
  max_streak: number;
  coin_balance: number;
  level: number;
}

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

const ACTIVITY_FEED = [
  { id: 1, action: "Решена задача", task: "ЕГЭ Математика #15", time: "5 минут назад" },
  { id: 2, action: "Пройден тест", task: "Русский язык: Орфография", time: "30 минут назад" },
  { id: 3, action: "Достигнута серия", task: "7 дней подряд", time: "2 часа назад" },
  { id: 4, action: "Разблокирован уровень", task: "Уровень 5", time: "вчера" },
  { id: 5, action: "Прочитана подсказка", task: "Физика: Волны", time: "2 дня назад" },
];

const EXAM_LABEL: Record<string, string> = { ege: "ЕГЭ", oge: "ОГЭ" };

export function HomePage({ onNavigate }: HomePageProps) {
  const [subjects, setSubjects] = useState<SubjectRow[]>([]);
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [user, setUser] = useState<UserRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [subjectsRes, tasksRes, userRes] = await Promise.all([
        supabase.from("subjects").select("*").order("id"),
        supabase.from("tasks").select("id, subject_id, topic_id, task_number, difficulty, question, answer_type, year").limit(6),
        supabase.from("users").select("total_tasks_solved, correct_answers, current_streak, max_streak, coin_balance, level").eq("id", 1).maybeSingle(),
      ]);

      if (subjectsRes.data) setSubjects(subjectsRes.data);
      if (tasksRes.data) setTasks(tasksRes.data);
      if (userRes.data) setUser(userRes.data);
      setLoading(false);
    }
    loadData();
  }, []);

  const accuracy = user
    ? user.total_tasks_solved > 0
      ? Math.round((user.correct_answers / user.total_tasks_solved) * 100)
      : 0
    : 78;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-gray-400 text-lg">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg p-8 md:p-12 text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">Добро пожаловать!</h1>
        <p className="text-lg md:text-xl text-blue-100 mb-6">
          Подготовьтесь к ЕГЭ и ОГЭ с нашей интерактивной платформой
        </p>
        <Button
          size="lg"
          className="bg-white text-blue-600 hover:bg-blue-50 font-semibold"
          onClick={() => onNavigate({ type: "tests" })}
        >
          Начать решать задачи
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Решено задач</p>
              <p className="text-3xl font-bold text-gray-900">{user?.total_tasks_solved ?? 0}</p>
            </div>
            <Target className="w-10 h-10 text-blue-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Точность</p>
              <p className="text-3xl font-bold text-gray-900">{accuracy}%</p>
            </div>
            <TrendingUp className="w-10 h-10 text-green-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Серия</p>
              <p className="text-3xl font-bold text-gray-900">{user?.current_streak ?? 0}</p>
            </div>
            <Flame className="w-10 h-10 text-orange-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Монеты</p>
              <p className="text-3xl font-bold text-gray-900">{user?.coin_balance?.toLocaleString() ?? 0}</p>
            </div>
            <Coins className="w-10 h-10 text-amber-500 opacity-20" />
          </div>
        </Card>
      </div>

      {/* Subjects Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Предметы</h2>
            <p className="text-gray-600 text-sm mt-1">Выберите предмет для подготовки</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((subject) => (
            <Card
              key={subject.id}
              className="p-6 cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] border-0"
              onClick={() => onNavigate({ type: "subject", subjectId: subject.id })}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: subject.color }}
                >
                  <BookOpen className="w-6 h-6" />
                </div>
                <Badge variant="secondary" className="text-xs">
                  {EXAM_LABEL[subject.exam_type] ?? subject.exam_type}
                </Badge>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {subject.name} ({EXAM_LABEL[subject.exam_type] ?? subject.exam_type})
              </h3>
              <p className="text-sm text-gray-600">{subject.task_count} задач</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Recommended Tasks Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Рекомендуемые задания</h2>
            <p className="text-gray-600 text-sm mt-1">На основе вашего прогресса</p>
          </div>
          <Button variant="ghost" onClick={() => onNavigate({ type: "tests" })}>
            Смотреть все
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasks.map((task) => {
            const subject = subjects.find((s) => s.id === task.subject_id);
            const difficultyConfig: Record<string, { label: string; color: string }> = {
              easy: { label: "Легко", color: "bg-green-100 text-green-800" },
              medium: { label: "Среднее", color: "bg-amber-100 text-amber-800" },
              hard: { label: "Сложно", color: "bg-red-100 text-red-800" },
            };
            const difficulty = difficultyConfig[task.difficulty] ?? difficultyConfig.medium;

            return (
              <Card
                key={task.id}
                className="p-5 cursor-pointer hover:shadow-md transition-all hover:border-blue-200 border border-transparent"
                onClick={() =>
                  onNavigate({
                    type: "task",
                    taskId: task.id,
                    subjectId: task.subject_id,
                  })
                }
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {subject?.name} #{task.task_number}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {task.question}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn("text-xs font-semibold border-0 shrink-0 ml-2", difficulty.color)}
                  >
                    {difficulty.label}
                  </Badge>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Activity Feed Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Последняя активность</h2>
            <p className="text-gray-600 text-sm mt-1">Ваш прогресс на платформе</p>
          </div>
        </div>

        <Card className="border-0 divide-y">
          {ACTIVITY_FEED.map((item) => (
            <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: item.id % 2 === 0 ? "#FED7AA" : "#DBEAFE",
                  }}
                >
                  {item.id % 2 === 0 ? (
                    <Flame className="w-5 h-5 text-orange-600" />
                  ) : (
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{item.action}</p>
                  <p className="text-sm text-gray-600">{item.task}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{item.time}</span>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
