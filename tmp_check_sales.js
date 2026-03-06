import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const sales = await prisma.sale.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
    });
    console.log(JSON.stringify(sales, null, 2));
}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
