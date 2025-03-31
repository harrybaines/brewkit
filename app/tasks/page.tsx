"use client"

import dayjs from "dayjs"
import { AlertOctagon, CheckCircle2, Circle, Clock, FileText, PlusCircle, UserCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { cn } from "@/lib/utils"

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
    id: "task-2",
    title: "Fix responsive layout issues",
    description: "Dashboard is not displaying correctly on mobile devices",
    status: "todo",
    priority: "medium",
    type: "bug",
    createdAt: new Date(2024, 3, 20),
    dueDate: new Date(2024, 3, 25),
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
    id: "task-3",
    title: "Create user documentation",
    description: "Write comprehensive user guide for the admin dashboard",
    status: "todo",
    priority: "low",
    type: "documentation",
    createdAt: new Date(2024, 3, 18),
    dueDate: new Date(2024, 4, 15),
    assignee: {
      id: "user-2",
      name: "Emily Chen",
      email: "emily@example.com",
      avatarUrl: "/avatars/emily.png",
      initials: "EC"
    },
    project: {
      id: "proj-2",
      name: "Documentation Portal",
      color: "green"
    }
  },
  {
    id: "task-4",
    title: "Optimize database queries",
    description: "Improve performance of dashboard loading times",
    status: "completed",
    priority: "high",
    type: "improvement",
    createdAt: new Date(2024, 3, 10),
    dueDate: new Date(2024, 3, 20),
    assignee: {
      id: "user-3",
      name: "Alex Johnson",
      email: "alex@example.com",
      initials: "AJ"
    },
    project: {
      id: "proj-1",
      name: "Brewkit",
      color: "blue"
    }
  },
  {
    id: "task-5",
    title: "Design new logo options",
    description: "Create 3-5 logo variations for client review",
    status: "blocked",
    priority: "medium",
    type: "feature",
    createdAt: new Date(2024, 3, 12),
    dueDate: new Date(2024, 3, 30),
    assignee: {
      id: "user-4",
      name: "Taylor Williams",
      email: "taylor@example.com",
      initials: "TW"
    },
    project: {
      id: "proj-3",
      name: "Brand Redesign",
      color: "purple"
    }
  },
]

// Unused projects data - can be removed if not needed elsewhere
/*
const projects = [
  {
    id: "proj-1",
    name: "Brewkit",
    color: "blue"
  },
  {
    id: "proj-2",
    name: "Documentation Portal",
    color: "green"
  },
  {
    id: "proj-3",
    name: "Brand Redesign",
    color: "purple"
  },
]
*/

// Get status icon component
function getStatusIcon(status: Task['status'], className?: string) {
  switch (status) {
    case 'todo':
      return <Circle className={cn("h-4 w-4 text-muted-foreground", className)} />
    case 'in-progress':
      return <Clock className={cn("h-4 w-4 text-blue-500", className)} />
    case 'completed':
      return <CheckCircle2 className={cn("h-4 w-4 text-green-500", className)} />
    case 'blocked':
      return <AlertOctagon className={cn("h-4 w-4 text-red-500", className)} />
  }
}

// Get formatted display name for status
function getStatusDisplayName(status: Task['status']) {
  switch (status) {
    case 'todo':
      return 'To Do'
    case 'in-progress':
      return 'In Progress'
    case 'completed':
      return 'Completed'
    case 'blocked':
      return 'Blocked'
    default:
      // This should never happen with our defined types, but TypeScript wants us to handle it
      return 'Unknown Status'
  }
}

// Get status badge color
function getStatusColor(status: Task['status']) {
  switch (status) {
    case 'todo':
      return 'bg-slate-500/10 text-slate-500 border-slate-200'
    case 'in-progress':
      return 'bg-blue-500/10 text-blue-500 border-blue-200'
    case 'completed':
      return 'bg-green-500/10 text-green-500 border-green-200'
    case 'blocked':
      return 'bg-red-500/10 text-red-500 border-red-200'
  }
}

// Task row component
function TaskRow({ task, onStatusChange }: {
  task: Task,
  onStatusChange: (taskId: string, newStatus: Task['status']) => void
}) {
  const router = useRouter()

  // Define a random avatar URL from UI Avatars API
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(task.assignee?.name || 'User')}&background=random&color=fff&size=32`

  return (
    <div
      className="group px-4 py-2.5 border border-border rounded-md mb-2 hover:border-primary/30 hover:bg-accent/30 transition-all duration-200 flex items-center gap-3"
      onClick={() => router.push(`/tasks/${task.id}`)}
    >
      {/* Title and Description - now inline */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{task.title}</span>
          <span className="text-xs text-muted-foreground truncate">— {task.description}</span>
        </div>
      </div>

      {/* Right aligned info */}
      <div className="flex items-center gap-3 ml-auto shrink-0">
        {/* Project - simplified to text only */}
        <span className="text-xs py-1 px-2 bg-accent rounded-sm hidden sm:inline-block">
          {task.project.name}
        </span>

        {/* Assignee */}
        {task.assignee ? (
          <Avatar className="h-6 w-6">
            <AvatarImage src={avatarUrl} alt={task.assignee.name} />
            <AvatarFallback className="text-xs">{task.assignee.initials}</AvatarFallback>
          </Avatar>
        ) : (
          <div className="h-6 w-6 rounded-full border border-border flex items-center justify-center">
            <UserCircle2 className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
        )}

        {/* Due date - made bolder */}
        {task.dueDate ? (
          <div className={cn(
            "text-xs min-w-[80px] text-right font-medium",
            dayjs(task.dueDate).isBefore(dayjs(), "day") && task.status !== "completed" && "text-red-500 font-semibold"
          )}>
            {dayjs(task.dueDate).format("MMM D, YYYY")}
          </div>
        ) : (
          <div className="text-xs text-muted-foreground min-w-[80px] text-right">No deadline</div>
        )}
      </div>
    </div>
  )
}

// Group header component
function TaskGroupHeader({ title, count, icon }: { title: string; count: number; icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3 mt-5">
      <div className="flex items-center gap-2">
        <span className="h-5 w-5 flex items-center justify-center">{icon}</span>
        <h3 className="text-sm font-semibold">{title}</h3>
        <Badge variant="outline" className="rounded-sm px-1.5 py-0 text-xs">
          {count}
        </Badge>
      </div>
    </div>
  )
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // Handle status change
  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    )
  }

  // Filter tasks based on search query and active tab
  const filteredTasks = tasks.filter(task => {
    // Search filter
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.project.name.toLowerCase().includes(searchQuery.toLowerCase());

    // Tab filter
    if (activeTab === "my-tasks") {
      return matchesSearch && task.assignee?.id === "user-1"; // Current user's ID
    } else if (activeTab === "overdue") {
      return matchesSearch && task.dueDate && dayjs(task.dueDate).isBefore(dayjs(), "day") && task.status !== "completed";
    }

    return matchesSearch;
  });

  // Group tasks by status
  const todoTasks = filteredTasks.filter(task => task.status === "todo");
  const inProgressTasks = filteredTasks.filter(task => task.status === "in-progress");
  const completedTasks = filteredTasks.filter(task => task.status === "completed");
  const blockedTasks = filteredTasks.filter(task => task.status === "blocked");

  return (
    <div className="flex flex-1 flex-col space-y-8 pb-40">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <p className="text-muted-foreground">
          Manage your tasks, track progress, and collaborate with team members.
        </p>
      </div>

      {/* Main Content - Removed Stat Cards */}
      <Card>
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <CardHeader className="pb-0">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <TabsList>
                <TabsTrigger value="all">All Tasks</TabsTrigger>
                <TabsTrigger value="my-tasks">My Tasks</TabsTrigger>
                <TabsTrigger value="overdue">Overdue</TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <div className="relative w-full sm:w-64">
                  <Input
                    placeholder="Search tasks..."
                    className="pr-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <Button className="gap-1.5">
                  <PlusCircle className="h-3.5 w-3.5" />
                  New Task
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <TabsContent value="all" className="m-0 space-y-2">
              {/* To Do Tasks */}
              {todoTasks.length > 0 && (
                <div>
                  <TaskGroupHeader
                    title="To Do"
                    count={todoTasks.length}
                    icon={<Circle className="h-3.5 w-3.5 text-muted-foreground" />}
                  />
                  {todoTasks.map(task => (
                    <TaskRow key={task.id} task={task} onStatusChange={handleStatusChange} />
                  ))}
                </div>
              )}

              {/* In Progress Tasks */}
              {inProgressTasks.length > 0 && (
                <div>
                  <TaskGroupHeader
                    title="In Progress"
                    count={inProgressTasks.length}
                    icon={<Clock className="h-3.5 w-3.5 text-blue-500" />}
                  />
                  {inProgressTasks.map(task => (
                    <TaskRow key={task.id} task={task} onStatusChange={handleStatusChange} />
                  ))}
                </div>
              )}

              {/* Blocked Tasks */}
              {blockedTasks.length > 0 && (
                <div>
                  <TaskGroupHeader
                    title="Blocked"
                    count={blockedTasks.length}
                    icon={<AlertOctagon className="h-3.5 w-3.5 text-red-500" />}
                  />
                  {blockedTasks.map(task => (
                    <TaskRow key={task.id} task={task} onStatusChange={handleStatusChange} />
                  ))}
                </div>
              )}

              {/* Completed Tasks */}
              {completedTasks.length > 0 && (
                <div>
                  <TaskGroupHeader
                    title="Completed"
                    count={completedTasks.length}
                    icon={<CheckCircle2 className="h-3.5 w-3.5 text-green-500" />}
                  />
                  {completedTasks.map(task => (
                    <TaskRow key={task.id} task={task} onStatusChange={handleStatusChange} />
                  ))}
                </div>
              )}

              {/* No tasks message */}
              {filteredTasks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium">No tasks found</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {searchQuery ? "Try adjusting your search or filters" : "Create your first task to get started"}
                  </p>
                  <Button className="gap-1.5 mt-6">
                    <PlusCircle className="h-3.5 w-3.5" />
                    New Task
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="my-tasks" className="m-0">
              {/* Reuse the same format as "all" tab but with filtered tasks */}
              {todoTasks.length > 0 && (
                <div>
                  <TaskGroupHeader
                    title="To Do"
                    count={todoTasks.length}
                    icon={<Circle className="h-3.5 w-3.5 text-muted-foreground" />}
                  />
                  {todoTasks.map(task => (
                    <TaskRow key={task.id} task={task} onStatusChange={handleStatusChange} />
                  ))}
                </div>
              )}

              {/* Repeat for other statuses */}
              {inProgressTasks.length > 0 && (
                <div>
                  <TaskGroupHeader
                    title="In Progress"
                    count={inProgressTasks.length}
                    icon={<Clock className="h-3.5 w-3.5 text-blue-500" />}
                  />
                  {inProgressTasks.map(task => (
                    <TaskRow key={task.id} task={task} onStatusChange={handleStatusChange} />
                  ))}
                </div>
              )}

              {completedTasks.length > 0 && (
                <div>
                  <TaskGroupHeader
                    title="Completed"
                    count={completedTasks.length}
                    icon={<CheckCircle2 className="h-3.5 w-3.5 text-green-500" />}
                  />
                  {completedTasks.map(task => (
                    <TaskRow key={task.id} task={task} onStatusChange={handleStatusChange} />
                  ))}
                </div>
              )}

              {blockedTasks.length > 0 && (
                <div>
                  <TaskGroupHeader
                    title="Blocked"
                    count={blockedTasks.length}
                    icon={<AlertOctagon className="h-3.5 w-3.5 text-red-500" />}
                  />
                  {blockedTasks.map(task => (
                    <TaskRow key={task.id} task={task} onStatusChange={handleStatusChange} />
                  ))}
                </div>
              )}

              {filteredTasks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium">No tasks assigned to you</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tasks assigned to you will appear here
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="overdue" className="m-0">
              {/* Show overdue tasks grouped by status */}
              {filteredTasks.length > 0 ? (
                <>
                  {todoTasks.length > 0 && (
                    <div>
                      <TaskGroupHeader
                        title="To Do"
                        count={todoTasks.length}
                        icon={<Circle className="h-3.5 w-3.5 text-muted-foreground" />}
                      />
                      {todoTasks.map(task => (
                        <TaskRow key={task.id} task={task} onStatusChange={handleStatusChange} />
                      ))}
                    </div>
                  )}

                  {inProgressTasks.length > 0 && (
                    <div>
                      <TaskGroupHeader
                        title="In Progress"
                        count={inProgressTasks.length}
                        icon={<Clock className="h-3.5 w-3.5 text-blue-500" />}
                      />
                      {inProgressTasks.map(task => (
                        <TaskRow key={task.id} task={task} onStatusChange={handleStatusChange} />
                      ))}
                    </div>
                  )}

                  {blockedTasks.length > 0 && (
                    <div>
                      <TaskGroupHeader
                        title="Blocked"
                        count={blockedTasks.length}
                        icon={<AlertOctagon className="h-3.5 w-3.5 text-red-500" />}
                      />
                      {blockedTasks.map(task => (
                        <TaskRow key={task.id} task={task} onStatusChange={handleStatusChange} />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mb-3" />
                  <h3 className="text-lg font-medium">No overdue tasks</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    You&apos;re all caught up!
                  </p>
                </div>
              )}
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  )
}
