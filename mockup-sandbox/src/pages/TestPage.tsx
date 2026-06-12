import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { Clock, ChartBar as BarChart3, FileText, Users } from "lucide-react";

interface TestPageProps {
  subjectId?: number;
}

interface TestRow {
  id: number;
  title: string;
  subject_id: number;
  exam_type: string;
  task_count: number;
  duration: number;
  difficulty: string;
  year: number | null;
  completion_count: number;
  average_score: number | null;
}

interface SubjectRow {
  id: number;
  name: string;
  exam_type: string;
  color: string;
}

const DIFFICULTY_CONFIG: Record<string, { label: string; color: string }> = {
  easy: { label: "Легко", color: "bg-green-100 text-green-800" },
  medium: { label: "Среднее", color: "bg-amber-100 text-amber-800" },
  hard: { label: "Сложно", color: "bg-red-100 text-red-800" },
};

const EXAM_LABEL: Record<string, string> = { ege: "ЕГЭ", oge: "ОГЭ" };

export function TestPage({ subjectId }: TestPageProps) {
  const [tests, setTests] = useState<TestRow[]>([]);
  const [subjects, setSubjects] = useState<SubjectRow[]>([]);
  const [activeSubject, setActiveSubject] = useState<number | null>(subjectId ?? null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [testsRes, subjectsRes] = await Promise.all([
        supabase.from("tests").select("*").order("id"),
        supabase.from("subjects").select("id, name, exam_type, color").order("id"),
      ]);

      if (testsRes.data) setTests(testsRes.data);
      if (subjectsRes.data) setSubjects(subjectsRes.data);
      setLoading(false);
    }
    loadData();
  }, []);

  const filteredTests = activeSubject
    ? tests.filter((t) => t.subject_id === activeSubject)
    : tests;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-gray-400 text-lg">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Тесты и варианты</h1>
        <p className="text-gray-600 text-sm mt-1">Выберите тест для проверки знаний</p>
      </div>

      {/* Subject filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant={activeSubject === null ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveSubject(null)}
        >
          Все предметы
        </Button>
        {subjects.map((s) => (
          <Button
            key={s.id}
            variant={activeSubject === s.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveSubject(s.id)}
          >
            {s.name} ({EXAM_LABEL[s.exam_type]})
          </Button>
        ))}
      </div>

      {/* Test cards */}
      {filteredTests.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Тесты не найдены</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTests.map((test) => {
            const subject = subjects.find((s) => s.id === test.subject_id);
            const diff = DIFFICULTY_CONFIG[test.difficulty] ?? DIFFICULTY_CONFIG.medium;

            return (
              <Card key={test.id} className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: subject?.color ?? "#6B7280" }}
                  >
                    <FileText className="w-5 h-5" />
                  </div>
                  <Badge variant="outline" className={cn("text-xs border-0", diff.color)}>
                    {diff.label}
                  </Badge>
                </div>

                <h3 className="font-semibold text-gray-900 mb-2">{test.title}</h3>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{test.duration} мин</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    <span>{test.task_count} заданий</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{test.completion_count} прошедших</span>
                  </div>
                </div>

                {test.average_score !== null && (
                  <div className="flex items-center gap-1 text-sm">
                    <BarChart3 className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Средний балл: </span>
                    <span className="font-semibold text-gray-900">{test.average_score}%</span>
                  </div>
                )}

                {subject && (
                  <Badge variant="secondary" className="mt-3 text-xs">
                    {subject.name} ({EXAM_LABEL[subject.exam_type]})
                  </Badge>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
