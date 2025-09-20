import { describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from '../server/utils/password.js';

describe('password utilities', () => {
  it('hashes and verifies passwords', async () => {
    const password = 'SuperSecurePass123!';
    const hash = await hashPassword(password);
    expect(hash).not.toBe(password);
    expect(await verifyPassword(password, hash)).toBe(true);
    expect(await verifyPassword('WrongPassword!!', hash)).toBe(false);
  });

  it('enforces minimum length', async () => {
    await expect(hashPassword('short')).rejects.toThrow(/Password must be at least/);
  });
});
