export type EventStatus = "planning" | "active" | "completed" | "cancelled";
export type TaskStatus = "todo" | "doing" | "done";
export type Priority = "low" | "medium" | "high" | "critical";
export type RiskSeverity = "low" | "medium" | "high" | "critical";
export type AnnouncementStatus = "draft" | "published";

export interface Event {
  id: string;
  name: string;
  description: string | null;
  date: string | null;
  location: string | null;
  status: EventStatus;
  created_at: string;
  updated_at: string;
}

export interface Member {
  id: string;
  event_id: string | null;
  name: string;
  email: string;
  role: string;
  skills: string[] | null;
  created_at: string;
}

export interface Task {
  id: string;
  event_id: string;
  title: string;
  description: string | null;
  owner_id: string | null;
  deadline: string | null;
  status: TaskStatus;
  priority: Priority;
  depends_on: string | null;
  created_at: string;
  updated_at: string;
  // joined relations
  owner?: Member | null;
  dependency?: Task | null;
}

export interface Meeting {
  id: string;
  event_id: string | null;
  title: string;
  transcript: string | null;
  summary: string | null;
  date: string;
  created_at: string;
}

export interface Risk {
  id: string;
  event_id: string;
  task_id: string | null;
  severity: RiskSeverity;
  title: string;
  explanation: string | null;
  suggestion: string | null;
  resolved: boolean;
  created_at: string;
  task?: Task | null;
}

export interface Announcement {
  id: string;
  event_id: string | null;
  title: string;
  body: string | null;
  status: AnnouncementStatus;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  event_id: string | null;
  title: string;
  content: string | null;
  file_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface DocumentChunk {
  id: string;
  document_id: string;
  content: string;
  embedding: number[] | null;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  event_id: string | null;
  action: string;
  details: string | null;
  created_at: string;
}
