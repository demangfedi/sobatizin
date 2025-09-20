import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { registerClient, getUserByEmail } from '../services/userService.js';
import { loginSchema } from '../utils/validators.js';
import { verifyPassword } from '../utils/password.js';
import {
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies,
  clearAuthCookies,
  readTokensFromCookies,
  verifyRefreshToken,
} from '../utils/tokens.js';
import { prisma } from '../lib/prisma.js';

export const authRouter = Router();

const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  legacyHeaders: false,
  message: 'Too many login attempts. Please try again later.',
});

authRouter.post('/register', async (req, res) => {
  try {
    const user = await registerClient(req.body);
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    setAuthCookies(res, { accessToken, refreshToken });
    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

authRouter.post('/login', limiter, async (req, res) => {
  try {
    const credentials = loginSchema.parse(req.body);
    const user = await getUserByEmail(credentials.email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordValid = await verifyPassword(credentials.password, user.passwordHash);
    if (!passwordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    setAuthCookies(res, { accessToken, refreshToken });
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

authRouter.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = readTokensFromCookies(req);
    if (!refreshToken) {
      return res.status(401).json({ message: 'Missing refresh token' });
    }
    const payload = verifyRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    setAuthCookies(res, { accessToken, refreshToken: newRefreshToken });
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token', details: error.message });
  }
});

authRouter.post('/logout', (req, res) => {
  clearAuthCookies(res);
  res.status(204).send();
});
