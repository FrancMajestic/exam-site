import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabase";
import {
  Target,
  TrendingUp,
  Flame,
  Award,
} from "lucide-react";

interface UserRow {
  total_tasks_solved: number;
  correct_answers: number;
  current_streak: number;
  max_streak: number;
  coin_balance: number;
  level: number;
  total_earned: number;
}

interface SubjectRow {
  id: number;
  name: string;
  exam_type: string;
  task_count: number;
  color: string;
}

const EXAM_LABEL: Record<string, string> = { ege: "ЕГЭ", oge: "ОГЭ" };

export function ProgressPage() {
  const [user, setUser] = useState<UserRow | null>(null);
  const [subjects, setSubjects] = useState<SubjectRow[]>([]);
  const [attemptCount, setAttemptCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [userRes, subjectsRes, attemptsRes] = await Promise.all([
        supabase.from("users").select("total_tasks_solved, correct_answers, current_streak, max_streak, coin_balance, level, total_earned").eq("id", 1).maybeSingle(),
        supabase.from("subjects").select("id, name, exam_type, task_count, color").order("id"),
        supabase.from("task_attempts").select("id", { count: "exact", head: true }).eq("user_id", 1),
      ]);

      if (userRes.data) setUser(userRes.data);
      if (subjectsRes.data) setSubjects(subjectsRes.data);
      if (attemptsRes.count !== null) setAttemptCount(attemptsRes.count);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-gray-400 text-lg">Загрузка...</div>
      </div>
    );
  }

  const accuracy = user && user.total_tasks_solved > 0
    ? Math.round((user.correct_answers / user.total_tasks_solved) * 100)
    : 0;

  const levelProgress = ((user?.level ?? 1) % 10) * 10;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Прогресс</h1>
        <p className="text-gray-600 text-sm mt-1">Ваша статистика подготовки</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-5 border-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Решено</p>
              <p className="text-xl font-bold text-gray-900">{user?.total_tasks_solved ?? 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 border-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Точность</p>
              <p className="text-xl font-bold text-gray-900">{accuracy}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 border-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Flame className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Серия</p>
              <p className="text-xl font-bold text-gray-900">{user?.current_streak ?? 0} дн.</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 border-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Award className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Уровень</p>
              <p className="text-xl font-bold text-gray-900">{user?.level ?? 1}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Level Progress */}
      <Card className="p-6 border-0 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Прогресс уровня</h3>
          <span className="text-sm text-gray-600">Уровень {user?.level ?? 1}</span>
        </div>
        <Progress value={levelProgress} className="h-3" />
        <p className="text-sm text-gray-500 mt-2">{levelProgress}% до следующего уровня</p>
      </Card>

      {/* Subject Progress */}
      <Card className="p-6 border-0 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Прогресс по предметам</h3>
        <div className="space-y-4">
          {subjects.map((s) => (
            <div key={s.id}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-sm font-medium text-gray-900">
                    {s.name} ({EXAM_LABEL[s.exam_type]})
                  </span>
                </div>
                <span className="text-sm text-gray-600">{s.task_count} задач</span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
          ))}
        </div>
      </Card>

      {/* Coins & Stats */}
      <Card className="p-6 border-0 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Монеты и достижения</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Баланс монет</p>
            <p className="text-2xl font-bold text-amber-600">{user?.coin_balance?.toLocaleString() ?? 0}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Всего заработано</p>
            <p className="text-2xl font-bold text-amber-600">{user?.total_earned?.toLocaleString() ?? 0}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Максимальная серия</p>
            <p className="text-2xl font-bold text-orange-600">{user?.max_streak ?? 0} дн.</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Попыпок</p>
            <p className="text-2xl font-bold text-blue-600">{attemptCount}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
