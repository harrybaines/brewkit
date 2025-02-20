import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const initialProjects: Prisma.ProjectCreateInput[] = [
    {
        name: 'Victorian Library Restoration',
        slug: 'victorian-library-restoration',
        description: 'Historical preservation and modernization of 19th century library building while maintaining its architectural integrity.',
        startDate: new Date('2025-04-15'),
        endDate: new Date('2025-12-20'),
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
        name: 'Historical Building Renovation',
        slug: 'historical-building-renovation',
        description: 'Renovation of a historic building to meet modern safety and energy requirements.',
        startDate: new Date('2025-10-01'),
        endDate: new Date('2026-06-30'),
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
    }
]

async function main() {
    console.log("Seeding database...")

    // Create the projects in prisma using createMany
    await prisma.project.createMany({ data: initialProjects })

    console.log('Database seeded successfully');

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