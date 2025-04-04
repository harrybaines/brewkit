import { getAllTasks } from "@/lib/services/task.service";
import { TasksContent } from "./tasks-content";

export default async function TasksPage() {
  const tasks = await getAllTasks();

  return <TasksContent tasks={tasks} />
}
