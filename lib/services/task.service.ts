import { prisma } from "@/lib/prisma";
import { Prisma, Task } from "@prisma/client";

// We can use Prisma's generated types instead of custom DTOs
type TaskCreateInput = Prisma.TaskCreateInput;
type TaskUpdateInput = Prisma.TaskUpdateInput;

// Output type using Prisma's built-in types
type TaskWithRelations = Prisma.TaskGetPayload<{
  include: {
    assignedTo: true;
    project: true;
  };
}>;

// Task repository functions
export async function getAllTasks(): Promise<TaskWithRelations[]> {
  return prisma.task.findMany({
    include: {
      assignedTo: true,
      project: true,
    },
  });
}

export async function getTaskById(
  id: string
): Promise<TaskWithRelations | null> {
  return prisma.task.findUnique({
    where: { id },
    include: {
      assignedTo: true,
      project: true,
    },
  });
}

export async function createTask(
  data: TaskCreateInput
): Promise<TaskWithRelations> {
  return prisma.task.create({
    data,
    include: {
      assignedTo: true,
      project: true,
    },
  });
}

export async function updateTask(
  id: string,
  data: TaskUpdateInput
): Promise<TaskWithRelations> {
  console.log(id, data);
  return prisma.task.update({
    where: { id },
    data,
    include: {
      assignedTo: true,
      project: true,
    },
  });
}

export async function deleteTask(id: string): Promise<Task> {
  return prisma.task.delete({
    where: { id },
  });
}
