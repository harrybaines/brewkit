import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create an architect user first
  const architect = await prisma.user.create({
    data: {
      name: 'Sarah Chen',
      email: 'sarah.chen@architectfirm.com',
      role: 'MEMBER'
    },
  });

  // Create the projects in prisma using createMany
  await prisma.project.createMany({
    data: [
      {
        name: 'Victorian Library Restoration',
        description: 'Historical preservation and modernization of 19th century library building while maintaining its architectural integrity.',
        startDate: new Date('2025-04-15'),
        endDate: new Date('2025-12-20'),
        createdById: architect.id
      },
      {
        name: 'Historical Building Renovation',
        description: 'Renovation of a historic building to meet modern safety and energy requirements.',
        startDate: new Date('2025-10-01'),
        endDate: new Date('2026-06-30'),
        createdById: architect.id,
      }
    ]
  })

  console.log('Database seeded with example projects');

  const projects = await prisma.project.findMany();

  console.dir(projects, { depth: null });
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })