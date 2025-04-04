import { FileQuestion } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function TaskNotFound() {
  return (
    <div className="flex h-[80vh] items-center justify-center">
      <Card className="w-full max-w-md border-none shadow-none">
        <CardContent className="flex flex-col items-center justify-center space-y-6 pt-12">
          <div className="rounded-full bg-muted p-4">
            <FileQuestion className="h-12 w-12 text-muted-foreground" />
          </div>

          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Task not found</h1>
            <p className="text-sm text-muted-foreground">
              The task you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" asChild>
              <Link href="/tasks">View all tasks</Link>
            </Button>
            <Button asChild>
              <Link href="/tasks?new=true">Create new task</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}