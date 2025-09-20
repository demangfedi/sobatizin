import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const ACCESS_COOKIE_NAME = 'sobatizin_access';
export const REFRESH_COOKIE_NAME = 'sobatizin_refresh';

export function generateAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
      email: user.email,
    },
    env.jwtAccessSecret,
    { expiresIn: `${env.accessTokenTtlMinutes}m` }
  );
}

export function generateRefreshToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
    },
    env.jwtRefreshSecret,
    { expiresIn: `${env.refreshTokenTtlDays}d` }
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.jwtAccessSecret);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, env.jwtRefreshSecret);
}

export function setAuthCookies(res, { accessToken, refreshToken }) {
  const secure = env.nodeEnv !== 'development';
  res.cookie(ACCESS_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    maxAge: env.accessTokenTtlMinutes * 60 * 1000,
  });
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    maxAge: env.refreshTokenTtlDays * 24 * 60 * 60 * 1000,
  });
}

export function clearAuthCookies(res) {
  const secure = env.nodeEnv !== 'development';
  res.clearCookie(ACCESS_COOKIE_NAME, { httpOnly: true, secure, sameSite: 'lax' });
  res.clearCookie(REFRESH_COOKIE_NAME, { httpOnly: true, secure, sameSite: 'lax' });
}

export function readTokensFromCookies(req) {
  return {
    accessToken: req.cookies?.[ACCESS_COOKIE_NAME] || null,
    refreshToken: req.cookies?.[REFRESH_COOKIE_NAME] || null,
  };
}
