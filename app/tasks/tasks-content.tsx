"use client"

import dayjs from "dayjs"
import { AlertOctagon, CheckCircle2, ChevronRight, Circle, Clock, FileText, MoreHorizontal, Pen, PlusCircle, UserCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { AddTaskDialog } from "@/components/add-task-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { Task } from "@prisma/client"

// Update status mapping functions to handle new enum values
function getStatusIcon(status: Task['status'], className?: string) {
  switch (status) {
    case 'TODO':
      return <Circle className={cn("h-4 w-4 text-muted-foreground", className)} />
    case 'IN_PROGRESS':
      return <Clock className={cn("h-4 w-4 text-blue-500", className)} />
    case 'COMPLETED':
      return <CheckCircle2 className={cn("h-4 w-4 text-green-500", className)} />
    case 'BLOCKED':
      return <AlertOctagon className={cn("h-4 w-4 text-red-500", className)} />
  }
}

// Get status color class
function getStatusColorClass(status: Task['status']) {
  switch (status) {
    case 'TODO':
      return 'bg-slate-500/10 text-slate-500 border-slate-200'
    case 'IN_PROGRESS':
      return 'bg-blue-500/10 text-blue-500 border-blue-200'
    case 'COMPLETED':
      return 'bg-green-500/10 text-green-500 border-green-200'
    case 'BLOCKED':
      return 'bg-red-500/10 text-red-500 border-red-200'
  }
}

function TaskRow({ task }: { task: Task & { assignedTo: { id: string, name: string, email: string } | null, project: { id: string, name: string, slug: string } } }) {
  const router = useRouter()
  // Define a random avatar URL from UI Avatars API
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(task.assignedTo?.name || 'User')}&background=random&color=fff&size=32`

  return (
    <div
      className="group px-6 py-2 hover:bg-accent/50 transition-all duration-200 flex items-center cursor-pointer border-b border-border/40"
      onClick={() => router.push(`/tasks/${task.id}`)}
    >
      {/* Status Icon - Fixed width */}
      <div className="w-8 shrink-0">
        {getStatusIcon(task.status)}
      </div>

      {/* Title - Flexible width */}
      <span className="font-medium text-sm flex-1 min-w-0 truncate pr-4">
        {task.title}
      </span>

      {/* Right aligned info - Fixed widths for consistent alignment */}
      <div className="flex items-center shrink-0 gap-4">
        {/* Assignee - Fixed width */}
        <div className="w-24 flex justify-end">
          {task.assignedTo ? (
            <Avatar className="h-6 w-6">
              <AvatarImage src={avatarUrl} alt={task.assignedTo.name} />
              <AvatarFallback className="text-xs">{task.assignedTo.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
          ) : (
            <div className="h-6 w-6 rounded-full border border-border flex items-center justify-center">
              <UserCircle2 className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Due date - Fixed width */}
        <div className="w-16">
          {task.dueDate && (
            <div className={cn(
              "text-xs font-medium whitespace-nowrap",
              dayjs(task.dueDate).isBefore(dayjs(), "day") && task.status !== "COMPLETED" && "text-red-500"
            )}>
              {dayjs(task.dueDate).format("MMM D")}
            </div>
          )}
        </div>

        {/* Actions Button - Fixed width */}
        <div className="w-8">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-accent/50"
            onClick={(e) => {
              e.stopPropagation()
              // Add your actions menu logic here
            }}
          >
            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// Group header component
function TaskGroupHeader({ title, count, icon, isExpanded, onToggle, colorClass }: {
  title: string
  count: number
  icon: React.ReactNode
  isExpanded: boolean
  onToggle: () => void
  colorClass: string
}) {
  return (
    <div className="flex items-center justify-between mb-3 mt-5 first:mt-0">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0 hover:bg-accent"
          onClick={(e) => {
            e.stopPropagation()
            onToggle()
          }}
        >
          <ChevronRight className={cn("h-4 w-4 text-muted-foreground transition-transform", isExpanded && "rotate-90")} />
        </Button>
        <Badge variant="outline" className={cn("gap-2", colorClass)}>
          {icon}
          <span>{title}</span>
        </Badge>
        <Badge variant="outline" className="rounded-sm px-1.5 py-0 text-xs">
          {count}
        </Badge>
      </div>
    </div>
  )
}

type TaskWithRelations = Task & {
  assignedTo: { id: string, name: string, email: string } | null
  project: { id: string, name: string, slug: string }
}

function TaskGroup({ tasks, status, expandedGroups, onToggle }: {
  tasks: TaskWithRelations[]
  status: Task['status']
  expandedGroups: Record<string, boolean>
  onToggle: (group: string) => void
}) {
  if (tasks.length === 0) return null;

  const statusConfig = {
    'TODO': { title: 'To Do', icon: <Pen className="h-3.5 w-3.5" /> },
    'IN_PROGRESS': { title: 'In Progress', icon: <Clock className="h-3.5 w-3.5" /> },
    'COMPLETED': { title: 'Completed', icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
    'BLOCKED': { title: 'Blocked', icon: <AlertOctagon className="h-3.5 w-3.5" /> }
  };

  const { title, icon } = statusConfig[status];

  return (
    <div className="space-y-4">
      <TaskGroupHeader
        title={title}
        count={tasks.length}
        icon={icon}
        isExpanded={expandedGroups[status]}
        onToggle={() => onToggle(status)}
        colorClass={getStatusColorClass(status)}
      />
      {expandedGroups[status] && (
        <div className="grid">
          {tasks.map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}

export function TasksContent({ tasks }: { tasks: TaskWithRelations[] }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    TODO: true,
    IN_PROGRESS: true,
    COMPLETED: true,
    BLOCKED: true,
  })

  // Toggle group expansion
  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }))
  }

  const filteredTasks = tasks.filter(task => {
    // Search filter
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.project.name.toLowerCase().includes(searchQuery.toLowerCase());

    // Tab filter
    if (activeTab === "my-tasks") {
      return matchesSearch && task.assignedTo?.id === "user-1"; // Current user's ID
    } else if (activeTab === "overdue") {
      return matchesSearch && task.dueDate && dayjs(task.dueDate).isBefore(dayjs(), "day") && task.status !== "COMPLETED";
    }

    return matchesSearch;
  });

  // Group tasks by status
  const todoTasks = filteredTasks.filter(task => task.status === "TODO");
  const inProgressTasks = filteredTasks.filter(task => task.status === "IN_PROGRESS");
  const completedTasks = filteredTasks.filter(task => task.status === "COMPLETED");
  const blockedTasks = filteredTasks.filter(task => task.status === "BLOCKED");

  const taskGroups = {
    TODO: todoTasks,
    IN_PROGRESS: inProgressTasks,
    COMPLETED: completedTasks,
    BLOCKED: blockedTasks
  };

  const renderTaskGroups = () => (
    <div className="space-y-10">
      {Object.entries(taskGroups).map(([status, tasks]) => (
        <TaskGroup
          key={status}
          tasks={tasks}
          status={status as Task['status']}
          expandedGroups={expandedGroups}
          onToggle={toggleGroup}
        />
      ))}

      {filteredTasks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-3" />
          <h3 className="text-lg font-medium">No tasks found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {searchQuery ? "Try adjusting your search or filters" : "You have no assigned tasks"}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-1 flex-col space-y-8 pb-40">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <p className="text-muted-foreground">
          Manage and track your tasks
        </p>
      </div>

      {/* Main Content */}
      <div>
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <CardHeader className="px-0 pb-3">
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

                <AddTaskDialog
                  trigger={
                    <Button className="gap-1.5">
                      <PlusCircle className="h-3.5 w-3.5" />
                      New Task
                    </Button>
                  }
                  onSubmit={async (data) => {
                    // TODO: Implement task creation
                    console.log("Creating task:", data)
                  }}
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6 px-0">
            <TabsContent value="all" className="m-0">
              {renderTaskGroups()}
            </TabsContent>

            <TabsContent value="my-tasks" className="m-0">
              {renderTaskGroups()}
            </TabsContent>

            <TabsContent value="overdue" className="m-0">
              {filteredTasks.length > 0 ? (
                renderTaskGroups()
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
      </div>
    </div>
  )
}