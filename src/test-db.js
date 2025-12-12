const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });

async function main() {
    console.log("Attempting to connect to database...");
    try {
        await prisma.$connect();
        console.log("Connection established. Querying languages...");
        const languages = await prisma.language.findMany();
        console.log("Success! Found languages:", languages);
    } catch (e) {
        console.error("Detailed Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
