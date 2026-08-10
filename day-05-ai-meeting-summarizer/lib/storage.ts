import { MeetingSession } from "@/types";

const STORAGE_KEY = "meetingmind_sessions";

export const getSessions = (): MeetingSession[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveSession = (session: MeetingSession): void => {
  if (typeof window === "undefined") return;
  const sessions = getSessions();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([session, ...sessions]));
};

export const deleteSession = (id: string): void => {
  if (typeof window === "undefined") return;
  const sessions = getSessions();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions.filter(s => s.id !== id)));
};
