import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { PageTabs } from "@/components/page-tabs"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// This would come from your database
const projects = [
  {
    id: 1,
    name: "Marketing Website",
    description: "Company website and blog",
    tasks: 12,
    status: "In Progress",
    startDate: "2024-01-15",
    dueDate: "2024-04-01",
    team: ["John Doe", "Jane Smith"],
  },
  {
    id: 2,
    name: "Mobile App",
    description: "iOS and Android applications",
    tasks: 8,
    status: "Planning",
    startDate: "2024-02-01",
    dueDate: "2024-06-30",
    team: ["Alice Johnson", "Bob Wilson"],
  },
  {
    id: 3,
    name: "Dashboard Redesign",
    description: "Internal analytics dashboard",
    tasks: 24,
    status: "In Review",
    startDate: "2024-03-01",
    dueDate: "2024-05-15",
    team: ["Charlie Brown", "Diana Prince"],
  },
]

export default function ProjectPage({ params }: { params: { id: string } }) {
  const project = projects.find((p) => p.id === parseInt(params.id))

  if (!project) {
    notFound()
  }

  const tabs = [
    {
      value: "overview",
      label: "Overview",
      content: (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>Overview of the project status and timeline</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <Badge variant="outline">{project.status}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tasks</span>
                <Badge variant="secondary">{project.tasks} tasks</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Start Date</span>
                <span className="text-sm text-muted-foreground">{project.startDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Due Date</span>
                <span className="text-sm text-muted-foreground">{project.dueDate}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
              <CardDescription>Recent project activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                No recent activity
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      value: "team",
      label: "Team",
      content: (
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>People working on this project</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {project.team.map((member) => (
                <div
                  key={member}
                  className="flex items-center gap-2 rounded-md border p-2"
                >
                  <div className="rounded-full bg-primary/10 p-1">
                    <span className="text-xs">{member[0]}</span>
                  </div>
                  <span className="text-sm">{member}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ),
    },
    {
      value: "tasks",
      label: "Tasks",
      content: (
        <Card>
          <CardHeader>
            <CardTitle>Project Tasks</CardTitle>
            <CardDescription>Manage and track project tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              No tasks created yet
            </div>
          </CardContent>
        </Card>
      ),
    },
    {
      value: "settings",
      label: "Settings",
      content: (
        <Card>
          <CardHeader>
            <CardTitle>Project Settings</CardTitle>
            <CardDescription>Manage project configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Project settings will appear here
            </div>
          </CardContent>
        </Card>
      ),
    },
  ]

  return (
    <div className="flex flex-1 flex-col space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/projects"
          className={buttonVariants({ variant: "ghost", size: "icon" })}
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
          <p className="text-sm text-muted-foreground">{project.description}</p>
        </div>
      </div>

      <PageTabs defaultValue="overview" tabs={tabs} />
    </div>
  )
}