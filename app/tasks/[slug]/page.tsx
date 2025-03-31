"use client"

import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Edit2,
  FileText,
  MessageSquare,
  PenSquare,
  Tag,
  Trash2,
  UserCircle2
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Combobox } from "@/components/ui/combobox"
import { DatePickerDemo } from "@/components/ui/date-picker"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"

import { cn } from "@/lib/utils"

// Initialize dayjs plugins
dayjs.extend(relativeTime)

// Task type definition (same as in the list page)
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

// Activity and comments types
type ActivityItem = {
  id: string
  action: string
  timestamp: Date
  user: {
    id: string
    name: string
    avatarUrl?: string
    initials: string
  }
  details?: string
}

type Comment = {
  id: string
  content: string
  timestamp: Date
  user: {
    id: string
    name: string
    avatarUrl?: string
    initials: string
  }
}

// Mock data for single task
const mockTask: Task = {
  id: "task-1",
  title: "Implement authentication flow",
  description: "Create login and registration screens with JWT authentication. The flow should include email verification and password reset functionality. The UI should match the design system and be fully responsive. Ensure that the API endpoints are properly secured and that the token handling follows best practices.",
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
}

// Mock data for activity log
const mockActivity: ActivityItem[] = [
  {
    id: "act-1",
    action: "created",
    timestamp: new Date(2024, 3, 15, 9, 30),
    user: {
      id: "user-2",
      name: "Emily Chen",
      avatarUrl: "/avatars/emily.png",
      initials: "EC"
    }
  },
  {
    id: "act-2",
    action: "assigned",
    timestamp: new Date(2024, 3, 15, 10, 15),
    user: {
      id: "user-2",
      name: "Emily Chen",
      avatarUrl: "/avatars/emily.png",
      initials: "EC"
    },
    details: "to Harry Baines"
  },
  {
    id: "act-3",
    action: "updated",
    timestamp: new Date(2024, 3, 17, 14, 22),
    user: {
      id: "user-1",
      name: "Harry Baines",
      initials: "HB"
    },
    details: "status from 'todo' to 'in-progress'"
  },
  {
    id: "act-4",
    action: "updated",
    timestamp: new Date(2024, 3, 18, 11, 5),
    user: {
      id: "user-1",
      name: "Harry Baines",
      initials: "HB"
    },
    details: "description"
  }
]

// Mock comments
const mockComments: Comment[] = [
  {
    id: "com-1",
    content: "I've started working on the login screen. Will update the PR by end of day.",
    timestamp: new Date(2024, 3, 17, 9, 45),
    user: {
      id: "user-1",
      name: "Harry Baines",
      initials: "HB"
    }
  },
  {
    id: "com-2",
    content: "Don't forget to include the password reset functionality as specified in the requirements.",
    timestamp: new Date(2024, 3, 17, 15, 20),
    user: {
      id: "user-3",
      name: "Alex Johnson",
      initials: "AJ"
    }
  }
]

// Status component
function StatusBadge({ status }: { status: Task['status'] }) {
  return (
    <div className="flex items-center gap-2">
      {status === "todo" && (
        <Badge variant="outline" className="flex items-center gap-1.5 capitalize">
          <Circle className="h-3 w-3 text-muted-foreground" />
          To Do
        </Badge>
      )}
      {status === "in-progress" && (
        <Badge variant="outline" className="flex items-center gap-1.5 text-blue-500 border-blue-200 capitalize">
          <Clock className="h-3 w-3" />
          In Progress
        </Badge>
      )}
      {status === "completed" && (
        <Badge variant="outline" className="flex items-center gap-1.5 text-green-500 border-green-200 capitalize">
          <CheckCircle2 className="h-3 w-3" />
          Completed
        </Badge>
      )}
      {status === "blocked" && (
        <Badge variant="destructive" className="flex items-center gap-1.5 capitalize">
          Blocked
        </Badge>
      )}
    </div>
  )
}

// Priority badge component
function PriorityBadge({ priority }: { priority: Task['priority'] }) {
  return (
    <Badge
      className={cn(
        "capitalize",
        priority === "low" && "bg-slate-500/15 text-slate-500",
        priority === "medium" && "bg-blue-500/15 text-blue-500",
        priority === "high" && "bg-amber-500/15 text-amber-500",
        priority === "urgent" && "bg-red-500/15 text-red-500",
      )}
    >
      {priority}
    </Badge>
  )
}

// Type badge component
function TypeBadge({ type }: { type: Task['type'] }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "capitalize",
        type === "feature" && "border-blue-200",
        type === "bug" && "border-red-200",
        type === "documentation" && "border-purple-200",
        type === "improvement" && "border-green-200"
      )}
    >
      {type}
    </Badge>
  )
}

export default function TaskDetail({ params }: { params: { slug: string } }) {
  // Remove React.use() since it's causing TypeScript errors with client components
  const { slug } = params;

  const router = useRouter()
  const [task, setTask] = useState<Task | null>(null)
  const [activity, setActivity] = useState<ActivityItem[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [status, setStatus] = useState<string>("")
  const [priority, setPriority] = useState<string>("")

  // Define combobox options
  const statusOptions = [
    { value: "todo", label: "To Do" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "blocked", label: "Blocked" }
  ]

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" }
  ]

  const typeOptions = [
    { value: "feature", label: "Feature" },
    { value: "bug", label: "Bug" },
    { value: "documentation", label: "Documentation" },
    { value: "improvement", label: "Improvement" }
  ]

  // Fetch task data (mocked here)
  useEffect(() => {
    // In a real app, this would be an API call
    if (slug === mockTask.id) {
      setTask(mockTask)
      setActivity(mockActivity)
      setComments(mockComments)
      setStatus(mockTask.status)
      setPriority(mockTask.priority)
    } else {
      // Handle task not found (optional redirect)
      // router.push('/tasks')
    }
  }, [slug, router])

  const handleAddComment = () => {
    if (!newComment.trim() || !task) return

    const comment: Comment = {
      id: `com-${comments.length + 1}`,
      content: newComment,
      timestamp: new Date(),
      user: {
        id: "user-1",
        name: "Harry Baines",
        initials: "HB"
      }
    }

    setComments([...comments, comment])
    setNewComment("")

    // Also add to activity log
    const activityItem: ActivityItem = {
      id: `act-${activity.length + 1}`,
      action: "commented",
      timestamp: new Date(),
      user: {
        id: "user-1",
        name: "Harry Baines",
        initials: "HB"
      }
    }

    setActivity([...activity, activityItem])
  }

  // Loading state
  if (!task) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Loading task...</h2>
          <p className="text-muted-foreground">Please wait</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col space-y-8 pb-40">
      {/* Header with navigation */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1"
          onClick={() => router.push('/tasks')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tasks
        </Button>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Edit2 className="h-3.5 w-3.5" />
            Edit
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <circle cx="7.5" cy="3.5" r="1.5" fill="currentColor" />
                  <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" />
                  <circle cx="7.5" cy="11.5" r="1.5" fill="currentColor" />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Task
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <PenSquare className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main task content */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl mb-1">{task.title}</CardTitle>
                  <CardDescription>
                    Task #{task.id} · Created {dayjs(task.createdAt).format("MMMM D, YYYY")}
                  </CardDescription>
                </div>
                <StatusBadge status={task.status} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="space-y-3">
                  <div className="text-sm font-medium">Description</div>
                  <div className="text-sm leading-relaxed">{task.description}</div>
                </div>

                <div className="flex flex-wrap gap-8 text-sm">
                  <div className="min-w-[120px]">
                    <div className="font-medium mb-2">Project</div>
                    <Link
                      href={`/projects/${task.project.id}`}
                      className="mt-1 flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
                    >
                      <Badge
                        className={cn(
                          "rounded-sm",
                          task.project.color === "blue" && "bg-blue-500/15 text-blue-500",
                          task.project.color === "green" && "bg-green-500/15 text-green-500",
                          task.project.color === "purple" && "bg-purple-500/15 text-purple-500",
                        )}
                      >
                        {task.project.name}
                      </Badge>
                    </Link>
                  </div>

                  <div className="min-w-[120px]">
                    <div className="font-medium mb-2">Task Type</div>
                    <div className="mt-1 flex items-center gap-1.5 text-muted-foreground">
                      <TypeBadge type={task.type} />
                    </div>
                  </div>

                  <div className="min-w-[120px]">
                    <div className="font-medium mb-2">Priority</div>
                    <div className="mt-1 flex items-center gap-1.5 text-muted-foreground">
                      <PriorityBadge priority={task.priority} />
                    </div>
                  </div>

                  <div className="min-w-[150px]">
                    <div className="font-medium mb-2">Due Date</div>
                    <div className="mt-1 flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {task.dueDate ? dayjs(task.dueDate).format("MMMM D, YYYY") : "Not set"}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Comments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map(comment => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-8 w-8 mt-0.5">
                        {comment.user.avatarUrl && <AvatarImage src={comment.user.avatarUrl} alt={comment.user.name} />}
                        <AvatarFallback>{comment.user.initials}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{comment.user.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {dayjs(comment.timestamp).format("MMM D, YYYY 'at' h:mm a")}
                          </span>
                        </div>
                        <div className="text-sm">{comment.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  No comments yet. Add one below.
                </div>
              )}
              <div className="space-y-3 pt-2">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewComment(e.target.value)}
                  rows={3}
                />
                <Button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="gap-1.5"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  Add Comment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar with details */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="text-sm font-medium">Status</div>
                <Combobox
                  options={statusOptions}
                  value={status}
                  onChange={setStatus}
                  placeholder="Select status"
                />
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Assignee</div>
                <div className="flex items-center space-x-2">
                  {task.assignee ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        {task.assignee.avatarUrl && <AvatarImage src={task.assignee.avatarUrl} alt={task.assignee.name} />}
                        <AvatarFallback>{task.assignee.initials}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{task.assignee.name}</span>
                      <Button variant="ghost" size="icon" className="h-7 w-7 ml-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                          <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                        </svg>
                      </Button>
                    </div>
                  ) : (
                    <Button variant="outline" size="sm" className="w-full gap-1.5">
                      <UserCircle2 className="h-3.5 w-3.5" />
                      Assign to...
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Due Date</div>
                <DatePickerDemo />
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Priority</div>
                <Combobox
                  options={priorityOptions}
                  value={priority}
                  onChange={setPriority}
                  placeholder="Select priority"
                />
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Type</div>
                <Combobox
                  options={typeOptions}
                  value={task.type}
                  onChange={() => { }}
                  placeholder="Select type"
                />
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Tags</div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="h-8 gap-1.5">
                    <Tag className="h-3.5 w-3.5" />
                    Add tags
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity log */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-0 relative pl-6 before:absolute before:left-2.5 before:top-0 before:h-full before:w-px before:bg-border">
                {activity.map((item) => (
                  <div key={item.id} className="relative pb-8">
                    <div className="absolute left-[-24px] flex h-5 w-5 items-center justify-center rounded-full border border-border bg-card ring-4 ring-background">
                      <span className="h-2 w-2 rounded-full bg-primary"></span>
                    </div>
                    <div className="flex flex-col space-y-0.5">
                      <div className="text-sm">
                        <span className="font-medium">{item.user.name}</span>
                        {" "}
                        <span className="text-muted-foreground">{item.action}</span>
                        {" "}
                        {item.details && <span className="text-muted-foreground">{item.details}</span>}
                        {" "}
                        <span className="text-xs text-muted-foreground">• {dayjs(item.timestamp).fromNow()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Related items (optional) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Related</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  Add related items
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
