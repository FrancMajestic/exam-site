import { X, Hop as Home, BookOpen, FileText, TrendingUp, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Page } from "@/App";

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  open: boolean;
  onClose: () => void;
}

const EGE_SUBJECTS = [
  { id: 1, name: "Математика", color: "bg-blue-500" },
  { id: 2, name: "Русский язык", color: "bg-red-500" },
  { id: 3, name: "Физика", color: "bg-purple-500" },
  { id: 4, name: "Обществознание", color: "bg-green-500" },
  { id: 5, name: "История", color: "bg-orange-500" },
  { id: 6, name: "Химия", color: "bg-emerald-500" },
];

const OGE_SUBJECTS = [
  { id: 7, name: "Математика", color: "bg-blue-500" },
  { id: 8, name: "Русский язык", color: "bg-red-500" },
  { id: 9, name: "Физика", color: "bg-purple-500" },
  { id: 10, name: "Обществознание", color: "bg-green-500" },
];

export function Sidebar({
  currentPage,
  onNavigate,
  open,
  onClose,
}: SidebarProps) {
  const isCurrentPage = (page: Page) => {
    if (page.type !== currentPage.type) return false;
    if (page.type === "subject" && currentPage.type === "subject") {
      return page.subjectId === currentPage.subjectId;
    }
    return true;
  };

  const navItems = [
    {
      icon: Home,
      label: "Главная",
      page: { type: "home" } as Page,
    },
    {
      icon: BookOpen,
      label: "Предметы",
      page: { type: "home" } as Page,
    },
    {
      icon: FileText,
      label: "Тесты",
      page: { type: "tests" } as Page,
    },
    {
      icon: TrendingUp,
      label: "Прогресс",
      page: { type: "progress" } as Page,
    },
    {
      icon: Trophy,
      label: "Рейтинг",
      page: { type: "leaderboard" } as Page,
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 z-40",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo Area */}
        <div className="h-16 border-b border-slate-200 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-base">
              ЕГЭ
            </div>
            <span className="font-semibold text-slate-900">Подготовка</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isCurrentPage(item.page);
            return (
              <button
                key={item.label}
                onClick={() => onNavigate(item.page)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors",
                  isActive
                    ? "bg-blue-100 text-blue-700"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </button>
            );
          })}

          {/* Separator */}
          <div className="h-px bg-slate-200 my-4" />

          {/* EGE Subjects Section */}
          <div>
            <h3 className="px-4 py-2 text-xs font-semibold uppercase text-slate-500 tracking-wide">
              ЕГЭ
            </h3>
            <div className="space-y-1.5">
              {EGE_SUBJECTS.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() =>
                    onNavigate({ type: "subject", subjectId: subject.id })
                  }
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors",
                    currentPage.type === "subject" &&
                      currentPage.subjectId === subject.id
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <div
                    className={cn("h-2.5 w-2.5 rounded-full", subject.color)}
                  />
                  {subject.name}
                </button>
              ))}
            </div>
          </div>

          {/* OGE Subjects Section */}
          <div className="mt-6">
            <h3 className="px-4 py-2 text-xs font-semibold uppercase text-slate-500 tracking-wide">
              ОГЭ
            </h3>
            <div className="space-y-1.5">
              {OGE_SUBJECTS.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() =>
                    onNavigate({ type: "subject", subjectId: subject.id })
                  }
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors",
                    currentPage.type === "subject" &&
                      currentPage.subjectId === subject.id
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <div
                    className={cn("h-2.5 w-2.5 rounded-full", subject.color)}
                  />
                  {subject.name}
                </button>
              ))}
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}
