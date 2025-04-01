"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import dayjs from "dayjs"
import { CornerDownRight, FileText, PlusCircle, UserCircle2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

// Define the Task type
type Task = {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "completed" | "blocked"
  priority: "low" | "medium" | "high" | "urgent"
  type: "feature" | "bug" | "documentation" | "improvement"
  createdAt: Date
  dueDate: Date | null
  assignee: {
    id: string
    name: string
    email: string
    avatarUrl?: string
    initials: string
  } | null
  project: {
    id: string
    name: string
    color: string
  }
}

// Mock data for tasks
const mockTasks: Task[] = [
  {
    id: "task-1",
    title: "Implement authentication flow",
    description: "Create login and registration screens with JWT authentication",
    status: "in-progress",
    priority: "high",
    type: "feature",
    createdAt: new Date(2024, 3, 15),
    dueDate: new Date(2024, 4, 1),
    assignee: {
      id: "user-1",
      name: "Harry Baines",
      email: "harry@example.com",
      initials: "HB"
    },
    project: {
      id: "proj-1",
      name: "Brewkit",
      color: "blue"
    }
  },
  {
    id: "task-6",
    title: "Add user profile settings page",
    description: "Create a settings page allowing users to update their profile details",
    status: "in-progress",
    priority: "medium",
    type: "feature",
    createdAt: new Date(2024, 3, 18),
    dueDate: new Date(2024, 4, 10),
    assignee: {
      id: "user-1",
      name: "Harry Baines",
      email: "harry@example.com",
      initials: "HB"
    },
    project: {
      id: "proj-1",
      name: "Brewkit",
      color: "blue"
    }
  },
  {
    id: "task-7",
    title: "Optimize image loading performance",
    description: "Implement lazy loading and image optimization to improve page load times",
    status: "in-progress",
    priority: "high",
    type: "improvement",
    createdAt: new Date(2024, 3, 20),
    dueDate: new Date(2024, 4, 5),
    assignee: {
      id: "user-1",
      name: "Harry Baines",
      email: "harry@example.com",
      initials: "HB"
    },
    project: {
      id: "proj-2",
      name: "Documentation Portal",
      color: "green"
    }
  },
  {
    id: "task-8",
    title: "Fix responsive layout for mobile",
    description: "Address mobile layout issues on the dashboard",
    status: "in-progress",
    priority: "medium",
    type: "bug",
    createdAt: new Date(2024, 3, 19),
    dueDate: new Date(2024, 4, 3),
    assignee: {
      id: "user-1",
      name: "Harry Baines",
      email: "harry@example.com",
      initials: "HB"
    },
    project: {
      id: "proj-1",
      name: "Brewkit",
      color: "blue"
    }
  }
]

// Task row component
function TaskRow({ task }: { task: Task }) {
  const router = useRouter()

  // Define a random avatar URL from UI Avatars API
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(task.assignee?.name || 'User')}&background=random&color=fff&size=32`

  return (
    <div
      className="group px-3 py-2 border border-border rounded-md mb-2 hover:border-primary/30 hover:bg-accent/30 transition-all duration-200 flex items-center gap-2.5 cursor-pointer"
      onClick={() => router.push(`/tasks/${task.id}`)}
    >
      {/* Title - without description */}
      <div className="flex-1 min-w-0">
        <span className="text-xs font-medium">{task.title}</span>
      </div>

      {/* Right aligned info */}
      <div className="flex items-center gap-2 ml-auto shrink-0">
        {/* Project - smaller text */}
        <span className="text-[10px] py-0.5 px-1.5 bg-accent rounded-sm">
          {task.project.name}
        </span>

        {/* Assignee Avatar */}
        {task.assignee ? (
          <Avatar className="h-5 w-5 shrink-0">
            <AvatarImage src={avatarUrl} alt={task.assignee.name} />
            <AvatarFallback className="text-[10px]">{task.assignee.initials}</AvatarFallback>
          </Avatar>
        ) : (
          <div className="h-5 w-5 rounded-full border border-border flex items-center justify-center shrink-0">
            <UserCircle2 className="h-3 w-3 text-muted-foreground" />
          </div>
        )}

        {/* Due date - smaller text */}
        {task.dueDate ? (
          <div className={cn(
            "text-[10px] min-w-[70px] text-right font-medium",
            dayjs(task.dueDate).isBefore(dayjs(), "day") && task.status !== "completed" && "text-red-500 font-semibold"
          )}>
            {dayjs(task.dueDate).format("MMM D, YYYY")}
          </div>
        ) : (
          <div className="text-[10px] text-muted-foreground min-w-[70px] text-right">No deadline</div>
        )}
      </div>
    </div>
  )
}

export function AssignedTasksCard() {
  // In a real app, you would fetch tasks from an API or use a context
  const [tasks] = useState<Task[]>(mockTasks)

  // Filter tasks: only keep those that are assigned to current user (user-1) and are in progress
  const assignedInProgressTasks = tasks.filter(
    task => task.assignee?.id === "user-1" && task.status === "in-progress"
  )

  // Display only the first 2 tasks
  const visibleTasks = assignedInProgressTasks.slice(0, 2)
  const remainingCount = assignedInProgressTasks.length - 2
  const hasMoreTasks = remainingCount > 0

  return (
    <div className="space-y-3 relative">
      {assignedInProgressTasks.length > 0 ? (
        <div className="space-y-2">
          {visibleTasks.map(task => (
            <TaskRow key={task.id} task={task} />
          ))}

          {hasMoreTasks && (
            <div className="flex items-center justify-start ml-2 -mt-1 mb-1">
              <div className="flex items-center bg-muted px-2 py-0.5 rounded-sm text-muted-foreground gap-1 text-xs">
                <CornerDownRight className="h-3 w-3 text-muted-foreground" />
                <span className="font-medium">{remainingCount}</span>
                <span>more</span>
              </div>
            </div>
          )}

          <div className="pt-1 flex items-center">
            <Link href="/tasks?tab=my-tasks" passHref className="w-full">
              <Button variant="outline" size="sm" className="w-full text-xs h-8">
                View All My Tasks
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <FileText className="h-8 w-8 text-muted-foreground mb-2" />
          <h3 className="text-sm font-medium">No in-progress tasks</h3>
          <p className="text-xs text-muted-foreground mt-1">
            You have no tasks in progress right now
          </p>
          <Link href="/tasks" passHref>
            <Button size="sm" className="gap-1.5 mt-3 h-7 text-xs">
              <PlusCircle className="h-3 w-3" />
              New Task
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}