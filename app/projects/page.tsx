import { PenLine } from "lucide-react"
import Link from "next/link"

import { CreateProjectForm } from "@/components/create-project-form"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PageHeader } from "@/components/ui/page-header"

const projects = [
  {
    id: 1,
    name: "Marketing Website",
    description: "Company website and blog",
    tasks: 12,
    status: "In Progress",
  },
  {
    id: 2,
    name: "Mobile App",
    description: "iOS and Android applications",
    tasks: 8,
    status: "Planning",
  },
  {
    id: 3,
    name: "Dashboard Redesign",
    description: "Internal analytics dashboard",
    tasks: 24,
    status: "In Review",
  },
]

export default function ProjectsPage() {
  return (
    <div className="flex flex-1 flex-col space-y-8">
      <PageHeader
        title="Projects"
        description="Manage your projects and track their progress."
      >
        <CreateProjectForm />
      </PageHeader>

      <div className="space-y-4">
        {projects.map((project) => (
          <Card key={project.id} className="transition-colors">
            <Link href={`/projects/${project.id}`}>
              <CardHeader className="flex flex-row items-center space-y-0 p-4 hover:bg-muted/50">
                <div className="flex items-center gap-4">
                  <div className="rounded-md bg-primary/10 p-2">
                    <PenLine className="h-4 w-4 text-primary" />
                  </div>
                  <div className="grid gap-1">
                    <CardTitle className="text-base">{project.name}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </div>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <Badge variant="secondary">{project.tasks} tasks</Badge>
                  <Badge variant="outline">{project.status}</Badge>
                  <Button variant="ghost" size="icon" className="ml-2 h-8 w-8">
                    <span className="sr-only">Open menu</span>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                    >
                      <path
                        d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Button>
                </div>
              </CardHeader>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  )
}