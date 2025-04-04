"use client"

import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import {
  ArrowLeft,
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
import { useRouter } from "next/navigation"
import { useState } from "react"

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
import { ActivityItem, Comment, PRIORITY_OPTIONS, STATUS_OPTIONS, TYPE_OPTIONS } from "@/lib/constants/task.constants"
import { cn } from "@/lib/utils"
import { Task } from "@prisma/client"

// Initialize dayjs plugins
dayjs.extend(relativeTime)

// Status component
function StatusBadge({ status }: { status: Task['status'] }) {
  return (
    <div className="flex items-center gap-2">
      {status === "TODO" && (
        <Badge variant="outline" className="flex items-center gap-1.5 capitalize">
          <Circle className="h-3 w-3 text-muted-foreground" />
          To Do
        </Badge>
      )}
      {status === "IN_PROGRESS" && (
        <Badge variant="outline" className="flex items-center gap-1.5 text-blue-500 border-blue-200 capitalize">
          <Clock className="h-3 w-3" />
          In Progress
        </Badge>
      )}
      {status === "COMPLETED" && (
        <Badge variant="outline" className="flex items-center gap-1.5 text-green-500 border-green-200 capitalize">
          <CheckCircle2 className="h-3 w-3" />
          Completed
        </Badge>
      )}
      {status === "BLOCKED" && (
        <Badge variant="destructive" className="flex items-center gap-1.5 capitalize">
          Blocked
        </Badge>
      )}
    </div>
  )
}

type TaskWithRelations = Task & {
  assignedTo: { id: string, name: string, email: string } | null
  project: { id: string, name: string, slug: string }
}

interface TaskDetailClientProps {
  task: TaskWithRelations
  onUpdateTask: (field: string, value: string) => Promise<void>
}

export function TaskDetailClient({ task: initialTask, onUpdateTask }: TaskDetailClientProps) {
  const router = useRouter()
  const [task] = useState(initialTask)
  const [activity, setActivity] = useState<ActivityItem[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")

  const handleAddComment = () => {
    if (!newComment.trim()) return

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

    // Add to activity log
    const activityItem: ActivityItem = {
      id: `act-${activity.length + 1}`,
      action: "added",
      timestamp: new Date(),
      user: {
        id: "user-1",
        name: "Harry Baines",
        initials: "HB"
      },
      details: "a comment"
    }
    setActivity([...activity, activityItem])
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
                  <CardTitle className="text-2xl font-semibold mb-1">{task.title}</CardTitle>
                  <CardDescription className="text-sm flex items-center gap-2">
                    Created {dayjs(task.createdAt).format("MMMM D, YYYY")} •
                    <div className="flex items-center gap-1.5">
                      <Avatar className="h-4 w-4">
                        <AvatarFallback className="text-xs">HB</AvatarFallback>
                      </Avatar>
                      <span>Harry Baines</span>
                    </div>
                  </CardDescription>
                </div>
                <StatusBadge status={task.status} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Description */}
                {task.description && (
                  <div className="prose prose-sm max-w-none text-muted-foreground">
                    {task.description}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Activity log */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={cn(
                "relative pl-6",
                activity.length > 0 && "before:absolute before:left-2.5 before:top-0 before:h-full before:w-px before:bg-border"
              )}>
                {activity.length > 0 ? (
                  activity.map((item) => (
                    <div key={item.id} className="relative pb-8 last:pb-0">
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
                  ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground text-sm">
                    No activity yet.
                  </div>
                )}
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
                  onChange={(e) => setNewComment(e.target.value)}
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
                <div className="text-sm font-medium">Project</div>
                <Combobox
                  options={[
                    { label: task.project.name, value: task.project.id },
                    // Add other project options here
                  ]}
                  value={task.project.id}
                  onChange={(value) => onUpdateTask('projectId', value)}
                  placeholder="Select project"
                />
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Status</div>
                <Combobox
                  options={STATUS_OPTIONS}
                  value={task.status || ""}
                  onChange={(value) => onUpdateTask('status', value)}
                  placeholder="Select status"
                />
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Priority</div>
                <Combobox
                  options={PRIORITY_OPTIONS}
                  value={task.priority || ""}
                  onChange={(value) => onUpdateTask('priority', value)}
                  placeholder="Select priority"
                />
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Type</div>
                <Combobox
                  options={TYPE_OPTIONS}
                  value={task.type || ""}
                  onChange={(value) => onUpdateTask('type', value)}
                  placeholder="Select type"
                />
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Assignee</div>
                <div className="flex items-center space-x-2">
                  {task.assignedTo ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>{task.assignedTo.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{task.assignedTo.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 ml-auto"
                        onClick={() => onUpdateTask('assignedToId', '')}
                      >
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

          {/* Related items */}
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