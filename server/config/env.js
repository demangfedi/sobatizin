import 'dotenv/config';

const parseIntSafe = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number.parseInt(process.env.PORT ?? '4000', 10),
  databaseUrl: process.env.DATABASE_URL || 'file:./prisma/dev.db',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  accessTokenTtlMinutes: parseIntSafe(process.env.ACCESS_TOKEN_TTL_MINUTES, 15),
  refreshTokenTtlDays: parseIntSafe(process.env.REFRESH_TOKEN_TTL_DAYS, 7),
  loginRateLimitPerMinute: 5,
};

export function assertSecrets() {
  if (!env.jwtAccessSecret || !env.jwtRefreshSecret) {
    throw new Error('JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be configured');
  }
}
