import {
  Priority,
  Prisma,
  PrismaClient,
  TaskStatus,
  TaskType,
} from "@prisma/client";

const prisma = new PrismaClient();

const initialProjects: Prisma.ProjectCreateInput[] = [
  {
    name: "Victorian Library Restoration",
    slug: "victorian-library-restoration",
    description:
      "Historical preservation and modernization of 19th century library building while maintaining its architectural integrity.",
    startDate: new Date("2025-04-15"),
    endDate: new Date("2025-12-20"),
    // createdBy: {
    //     connectOrCreate: {
    //         where: {
    //             email: 'sarah.chen@architectfirm.com'
    //         },
    //         create: {
    //             email: 'sarah.chen@architectfirm.com',
    //             name: 'Sarah Chen'
    //         }
    //     }
    // }
  },
  {
    name: "Historical Building Renovation",
    slug: "historical-building-renovation",
    description:
      "Renovation of a historic building to meet modern safety and energy requirements.",
    startDate: new Date("2025-10-01"),
    endDate: new Date("2026-06-30"),
    // createdBy: {
    //     connectOrCreate: {
    //         where: {
    //             email: 'sarah.chen@architectfirm.com'
    //         },
    //         create: {
    //             email: 'sarah.chen@architectfirm.com',
    //             name: 'Sarah Chen'
    //         }
    //     }
    // }
  },
];

const initialTasks: Prisma.TaskCreateInput[] = [
  {
    title: "Structural Assessment Report",
    description:
      "Conduct a comprehensive structural assessment of the Victorian library building and prepare a detailed report.",
    status: TaskStatus.TODO,
    priority: Priority.HIGH,
    type: TaskType.DOCUMENTATION,
    dueDate: new Date("2025-05-01"),
    project: {
      connect: {
        slug: "victorian-library-restoration",
      },
    },
  },
  {
    title: "Energy Efficiency Plan",
    description:
      "Develop a plan to improve energy efficiency while preserving historical features.",
    status: TaskStatus.TODO,
    priority: Priority.MEDIUM,
    type: TaskType.FEATURE,
    dueDate: new Date("2025-05-15"),
    project: {
      connect: {
        slug: "historical-building-renovation",
      },
    },
  },
  {
    title: "Heritage Compliance Review",
    description:
      "Review and document compliance with heritage preservation guidelines.",
    status: TaskStatus.TODO,
    priority: Priority.HIGH,
    type: TaskType.DOCUMENTATION,
    dueDate: new Date("2025-06-01"),
    project: {
      connect: {
        slug: "victorian-library-restoration",
      },
    },
  },
];

async function main() {
  console.log("Seeding database...");

  // Create the projects in prisma using createMany
  await prisma.project.createMany({ data: initialProjects });

  console.log("Projects seeded successfully");

  // Create tasks one by one since we need to establish relationships
  for (const task of initialTasks) {
    await prisma.task.create({ data: task });
  }

  console.log("Tasks seeded successfully");

  const projects = await prisma.project.findMany({
    include: {
      tasks: true,
    },
  });

  console.dir(projects, { depth: null });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
