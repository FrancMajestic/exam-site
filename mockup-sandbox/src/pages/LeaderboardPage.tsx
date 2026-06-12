import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { Trophy, Medal } from "lucide-react";

interface LeaderboardEntry {
  id: number;
  name: string;
  coin_balance: number;
  total_tasks_solved: number;
  correct_answers: number;
  current_streak: number;
  level: number;
}

interface SubjectRow {
  id: number;
  name: string;
  exam_type: string;
  color: string;
}

const EXAM_LABEL: Record<string, string> = { ege: "ЕГЭ", oge: "ОГЭ" };

const MEDAL_COLORS = ["text-amber-500", "text-gray-400", "text-amber-700"];

export function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardEntry[]>([]);
  const [subjects, setSubjects] = useState<SubjectRow[]>([]);
  const [activeSubject, setActiveSubject] = useState<number | null>(null);
  const [period, setPeriod] = useState<"week" | "month" | "all">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [usersRes, subjectsRes] = await Promise.all([
        supabase.from("users").select("id, name, coin_balance, total_tasks_solved, correct_answers, current_streak, level").order("coin_balance", { ascending: false }),
        supabase.from("subjects").select("id, name, exam_type, color").order("id"),
      ]);

      if (usersRes.data) setUsers(usersRes.data);
      if (subjectsRes.data) setSubjects(subjectsRes.data);
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

  const top3 = users.slice(0, 3);
  const rest = users.slice(3);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Рейтинг</h1>
        <p className="text-gray-600 text-sm mt-1">Лучшие ученики платформы</p>
      </div>

      {/* Period filter */}
      <div className="flex items-center gap-2">
        {(["week", "month", "all"] as const).map((p) => (
          <Button
            key={p}
            variant={period === p ? "default" : "outline"}
            size="sm"
            onClick={() => setPeriod(p)}
          >
            {p === "week" ? "Неделя" : p === "month" ? "Месяц" : "Всё время"}
          </Button>
        ))}
      </div>

      {/* Top 3 Podium */}
      {top3.length > 0 && (
        <div className="flex items-end justify-center gap-4 py-8">
          {top3.map((u, i) => {
            const place = i + 1;
            const heights = ["h-36", "h-28", "h-24"];
            const podiumOrder = [1, 0, 2];

            return (
              <div
                key={u.id}
                className="flex flex-col items-center gap-2"
                style={{ order: podiumOrder[i] }}
              >
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xl font-bold mx-auto">
                    {u.name.charAt(0)}
                  </div>
                  <p className="font-semibold text-gray-900 mt-2 text-sm">{u.name}</p>
                  <p className="text-xs text-gray-500">{u.coin_balance} монет</p>
                </div>
                <div
                  className={cn(
                    "w-24 rounded-t-lg flex items-start justify-center pt-3",
                    heights[i],
                    place === 1 ? "bg-amber-400" : place === 2 ? "bg-gray-300" : "bg-amber-600"
                  )}
                >
                  <span className="text-2xl font-bold text-white">{place}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full leaderboard table */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="divide-y">
          {rest.map((u, i) => {
            const place = i + 4;
            const accuracy = u.total_tasks_solved > 0
              ? Math.round((u.correct_answers / u.total_tasks_solved) * 100)
              : 0;

            return (
              <div key={u.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <span className="w-8 text-center font-bold text-gray-400">{place}</span>
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{u.name}</p>
                    <p className="text-sm text-gray-500">Уровень {u.level}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{u.total_tasks_solved}</p>
                    <p className="text-gray-500">задач</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{accuracy}%</p>
                    <p className="text-gray-500">точность</p>
                  </div>
                  <Badge variant="secondary" className="font-semibold">
                    {u.coin_balance} мон.
                  </Badge>
                </div>
              </div>
            );
          })}

          {users.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p>Пока нет участников</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
