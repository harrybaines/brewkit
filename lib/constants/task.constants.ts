export const STATUS_OPTIONS = [
  { value: "TODO", label: "To Do" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "BLOCKED", label: "Blocked" },
] as const;

export const PRIORITY_OPTIONS = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "URGENT", label: "Urgent" },
] as const;

export const TYPE_OPTIONS = [
  { value: "FEATURE", label: "Feature" },
  { value: "BUG", label: "Bug" },
  { value: "DOCUMENTATION", label: "Documentation" },
  { value: "IMPROVEMENT", label: "Improvement" },
] as const;

export type ActivityItem = {
  id: string;
  action: string;
  timestamp: Date;
  user: {
    id: string;
    name: string;
    avatarUrl?: string;
    initials: string;
  };
  details?: string;
};

export type Comment = {
  id: string;
  content: string;
  timestamp: Date;
  user: {
    id: string;
    name: string;
    avatarUrl?: string;
    initials: string;
  };
};

export type TaskStatus = (typeof STATUS_OPTIONS)[number]["value"];
export type TaskPriority = (typeof PRIORITY_OPTIONS)[number]["value"];
export type TaskType = (typeof TYPE_OPTIONS)[number]["value"];

export interface TaskOption {
  value: string;
  label: string;
}
