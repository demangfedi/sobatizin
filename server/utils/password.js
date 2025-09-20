import argon2 from 'argon2';

const MIN_PASSWORD_LENGTH = 12;

export function validatePasswordPolicy(password) {
  if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`);
  }
}

export async function hashPassword(password) {
  validatePasswordPolicy(password);
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1,
  });
}

export function verifyPassword(password, hash) {
  return argon2.verify(hash, password);
}
