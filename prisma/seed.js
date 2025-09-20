import 'dotenv/config';
import argon2 from 'argon2';
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || 'Super Admin';
  const phone = process.env.ADMIN_PHONE || null;

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be provided in environment variables.');
  }

  if (password.length < 12) {
    throw new Error('Admin password must be at least 12 characters long.');
  }

  const passwordHash = await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1,
  });

  const admin = await prisma.user.upsert({
    where: { email },
    update: { name, phone, passwordHash, role: UserRole.admin },
    create: { name, email, phone, passwordHash, role: UserRole.admin },
  });

  console.log(`Admin user ensured with id ${admin.id}`);
}

main()
  .catch((error) => {
    console.error('Failed to seed admin user:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
