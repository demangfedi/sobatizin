import { describe, expect, it } from 'vitest';
import { orderCreateSchema } from '../server/utils/validators.js';

describe('order schema validation', () => {
  it('rejects invalid service type', () => {
    expect(() =>
      orderCreateSchema.parse({
        clientId: 'ckxy1234567890example',
        businessName: 'Test Biz',
        serviceType: 'invalid',
      })
    ).toThrow();
  });

  it('accepts valid payload', () => {
    const parsed = orderCreateSchema.parse({
      clientId: 'ckxy1234567890example',
      businessName: 'Test Biz',
      serviceType: 'pt',
    });
    expect(parsed.serviceType).toBe('pt');
  });
});
