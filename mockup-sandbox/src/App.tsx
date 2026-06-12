import { useState } from "react";
import { HomePage } from "./pages/HomePage";
import { SubjectPage } from "./pages/SubjectPage";
import { TaskPage } from "./pages/TaskPage";
import { TestPage } from "./pages/TestPage";
import { ProgressPage } from "./pages/ProgressPage";
import { LeaderboardPage } from "./pages/LeaderboardPage";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";

export type Page =
  | { type: "home" }
  | { type: "subject"; subjectId: number }
  | { type: "task"; taskId: number; subjectId: number }
  | { type: "tests"; subjectId?: number }
  | { type: "progress" }
  | { type: "leaderboard" };

function App() {
  const [page, setPage] = useState<Page>({ type: "home" });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = (p: Page) => {
    setPage(p);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar
        currentPage={page}
        onNavigate={navigate}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {page.type === "home" && <HomePage onNavigate={navigate} />}
          {page.type === "subject" && (
            <SubjectPage subjectId={page.subjectId} onNavigate={navigate} />
          )}
          {page.type === "task" && (
            <TaskPage taskId={page.taskId} subjectId={page.subjectId} onNavigate={navigate} />
          )}
          {page.type === "tests" && <TestPage subjectId={page.subjectId} />}
          {page.type === "progress" && <ProgressPage />}
          {page.type === "leaderboard" && <LeaderboardPage />}
        </main>
      </div>
    </div>
  );
}

export default App;
