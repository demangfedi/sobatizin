import { PrismaClient } from '@prisma/client';

if (!process.env.TZ) {
  process.env.TZ = 'Asia/Jakarta';
}

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});
