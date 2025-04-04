import { getTaskById } from "@/lib/services/task.service"
import TaskNotFound from "./not-found"
import { TaskDetailContent } from "./task-detail-content"

export default async function TaskDetailPage({ params }: { params: { slug: string } }) {
  const task = await getTaskById(params.slug)

  if (!task) {
    return <TaskNotFound />
  }

  return <TaskDetailContent task={task} />
}
