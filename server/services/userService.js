import { prisma } from '../lib/prisma.js';
import { hashPassword } from '../utils/password.js';
import { registerSchema } from '../utils/validators.js';

export async function registerClient(input) {
  const data = registerSchema.parse(input);
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    throw new Error('Email already registered');
  }

  const passwordHash = await hashPassword(data.password);
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      passwordHash,
      role: 'client',
    },
  });

  return user;
}

export function getUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

export function getUserById(id) {
  return prisma.user.findUnique({ where: { id } });
}
