import { updateTask } from "@/lib/services/task.service"
import { Task } from "@prisma/client"
import { TaskDetailClient } from "./task-detail-client"

type TaskWithRelations = Task & {
  assignedTo: { id: string, name: string, email: string } | null
  project: { id: string, name: string, slug: string }
}

export async function TaskDetailContent({ task: initialTask }: { task: TaskWithRelations }) {
  async function handleTaskUpdate(field: string, value: string) {
    'use server'

    try {
      await updateTask(initialTask.id, { [field]: value })
    } catch {
      throw new Error('Failed to update task')
    }
  }

  return <TaskDetailClient task={initialTask} onUpdateTask={handleTaskUpdate} />
}