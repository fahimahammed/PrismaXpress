import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const main = async () => {
    await prisma.user.deleteMany();

    // Create new users
    await prisma.user.createMany({
        data: [
            {
                name: 'John Doe',
                email: 'johndoe@example.com',
            },
            {
                name: 'Jane Doe',
                email: 'janedoe@example.com',
            },
            {
                name: 'Alice Smith',
                email: 'alice.smith@example.com',
            },
        ],
    });

    console.log('Seed data inserted');
};

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
