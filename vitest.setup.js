import fs from 'node:fs';
import path from 'node:path';

process.env.NODE_ENV = 'test';
process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'test-access-secret-please-change';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'test-refresh-secret-please-change';
process.env.ACCESS_TOKEN_TTL_MINUTES = process.env.ACCESS_TOKEN_TTL_MINUTES || '15';
process.env.REFRESH_TOKEN_TTL_DAYS = process.env.REFRESH_TOKEN_TTL_DAYS || '7';

const testDbPath = path.resolve('prisma', 'test.db');
process.env.DATABASE_URL = `file:${testDbPath}`;

if (fs.existsSync(testDbPath)) {
  fs.rmSync(testDbPath);
}
