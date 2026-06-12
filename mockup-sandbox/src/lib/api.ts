import { supabase } from "./supabase";
import type {
  Subject,
  Topic,
  Task,
  TaskDetail,
  AnswerResult,
  Test,
  ProgressSummary,
  TopicProgress,
  LeaderboardEntry,
} from "./types";

const API_BASE = "/api";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const { data, error } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export const api = {
  subjects: {
    list: () => apiFetch<Subject[]>("/subjects"),
    topics: (subjectId: number) =>
      apiFetch<Topic[]>(`/subjects/${subjectId}/topics`),
  },
  tasks: {
    list: (params?: Record<string, string | number>) => {
      const qs = params
        ? "?" +
          Object.entries(params)
            .filter(([, v]) => v !== undefined)
            .map(([k, v]) => `${k}=${v}`)
            .join("&")
        : "";
      return apiFetch<{ tasks: Task[]; total: number; offset: number; limit: number }>(`/tasks${qs}`);
    },
    get: (taskId: number) => apiFetch<TaskDetail>(`/tasks/${taskId}`),
    submit: (taskId: number, answer: string, userId: number) =>
      apiFetch<AnswerResult>(`/tasks/${taskId}/submit`, {
        method: "POST",
        body: JSON.stringify({ answer, userId }),
      }),
  },
  tests: {
    list: (params?: Record<string, string | number>) => {
      const qs = params
        ? "?" +
          Object.entries(params)
            .filter(([, v]) => v !== undefined)
            .map(([k, v]) => `${k}=${v}`)
            .join("&")
        : "";
      return apiFetch<Test[]>(`/tests${qs}`);
    },
  },
  progress: {
    summary: (userId?: number) =>
      apiFetch<ProgressSummary>(
        `/progress/summary${userId ? `?userId=${userId}` : ""}`,
      ),
    byTopic: (subjectId?: number, userId?: number) => {
      const params = new URLSearchParams();
      if (subjectId) params.set("subjectId", String(subjectId));
      if (userId) params.set("userId", String(userId));
      const qs = params.toString();
      return apiFetch<TopicProgress[]>(`/progress/by-topic${qs ? `?${qs}` : ""}`);
    },
  },
  leaderboard: (subjectId?: number, period?: string) => {
    const params = new URLSearchParams();
    if (subjectId) params.set("subjectId", String(subjectId));
    if (period) params.set("period", period);
    const qs = params.toString();
    return apiFetch<LeaderboardEntry[]>(`/leaderboard${qs ? `?${qs}` : ""}`);
  },
};
