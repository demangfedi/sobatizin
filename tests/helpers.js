import { execSync } from 'node:child_process';
import { prisma } from '../server/lib/prisma.js';

let migrated = false;

export function applyMigrations() {
  if (migrated) return;
  execSync('npx prisma migrate deploy --schema=prisma/schema.prisma', { stdio: 'inherit' });
  migrated = true;
}

export async function resetDatabase() {
  const tables = ['FileUpload', 'OrderHistory', 'Order', 'ContactLead', 'User'];
  for (const table of tables) {
    await prisma.$executeRawUnsafe(`DELETE FROM "${table}"`);
  }
}

export { prisma };
