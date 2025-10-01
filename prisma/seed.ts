 
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();



async function main() {
    // Seed a customer user
    const hashedCustomerPassword = await bcrypt.hash('miyanda', 10); 
    const customer = await prisma.user.upsert({
        where: {
            email: 'miyanda@gmail.com'  // Using email as unique constraint
        },
        update: {},
        create: {
            email: 'miyanda@gmail.com',
            firstName: 'Miyanda',
            lastName: 'Hatyoka',
            phoneNumber: '+260975550955',
            password: hashedCustomerPassword, // Make sure to hash in production!
            role: 'CUSTOMER', 
        }
    });

    // Seed a staff user
    const hashedStaffPassword = await bcrypt.hash('admin', 10);
    const staff = await prisma.user.upsert({
        where: {
            email: 'admin@gmail.com'
        },
        update: {},
        create: {
            email: 'admin@gmail.com',
            firstName: 'Kelvin',
            lastName: 'Banda',
            phoneNumber: '+260760851983',
            password: hashedStaffPassword, // Hash this in production
            role: 'SUPER_ADMIN', 
        }
    });

    console.log('Seed data created: 1 customer and 1 staff user');
}

main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
