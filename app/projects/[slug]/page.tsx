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
import { prisma } from "@/lib/prisma"
import { unstable_cache as cache } from "next/cache"

const getCachedProject = cache((slug) => {
  return prisma.project.findUnique({
    where: {
      slug,
    },
  })
})

export default async function ProjectPage({ params }) {
  // Remove React.use() since it cannot be used in an async function
  const { slug } = params;

  const project = await getCachedProject(slug);

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
                {/* <Badge variant="secondary">{project.tasks} tasks</Badge> */}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Start Date</span>
                {/* <span className="text-sm text-muted-foreground">{project.startDate}</span> */}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Due Date</span>
                {/* <span className="text-sm text-muted-foreground">{project.dueDate}</span> */}
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
            {/* <div className="space-y-2">
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
            </div> */}
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