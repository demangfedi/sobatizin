import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { applyMigrations, prisma, resetDatabase } from './helpers.js';
import { hashPassword } from '../server/utils/password.js';

let app;

beforeAll(async () => {
  applyMigrations();
  ({ app } = await import('../server/server.js'));
});

beforeEach(async () => {
  await resetDatabase();
});

describe('authentication flow', () => {
  it('registers a client and returns auth cookies', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Client Example',
        email: 'client@example.com',
        password: 'VerySecurePass12!',
      })
      .expect(201);

    expect(response.body.user.email).toBe('client@example.com');
    const cookies = response.get('set-cookie') || [];
    expect(cookies.some((cookie) => cookie.includes('sobatizin_access'))).toBe(true);
    expect(cookies.some((cookie) => cookie.includes('sobatizin_refresh'))).toBe(true);
  });

  it('allows login with valid credentials', async () => {
    const passwordHash = await hashPassword('VerySecurePass12!');
    await prisma.user.create({
      data: {
        name: 'Existing Client',
        email: 'existing@example.com',
        passwordHash,
        role: 'client',
      },
    });

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'existing@example.com', password: 'VerySecurePass12!' })
      .expect(200);

    expect(response.body.user.email).toBe('existing@example.com');
  });
});

describe('RBAC guards', () => {
  it('prevents clients from creating orders', async () => {
    const clientPassword = 'ClientPassword12!';
    const passwordHash = await hashPassword(clientPassword);
    const client = await prisma.user.create({
      data: {
        name: 'Client User',
        email: 'clientuser@example.com',
        passwordHash,
        role: 'client',
      },
    });

    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: client.email, password: clientPassword })
      .expect(200);

    const cookies = login.get('set-cookie');

    await request(app)
      .post('/api/orders')
      .set('Cookie', cookies)
      .send({
        clientId: client.id,
        businessName: 'Forbidden Order',
        serviceType: 'cv',
      })
      .expect(403);
  });

  it('allows admin to create and list orders with pagination', async () => {
    const adminPassword = 'AdminPassword12!';
    const admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@example.com',
        passwordHash: await hashPassword(adminPassword),
        role: 'admin',
      },
    });

    const client = await prisma.user.create({
      data: {
        name: 'Client B',
        email: 'clientb@example.com',
        passwordHash: await hashPassword('ClientPassword34!'),
        role: 'client',
      },
    });

    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: admin.email, password: adminPassword })
      .expect(200);

    const cookies = login.get('set-cookie');

    for (let i = 0; i < 12; i += 1) {
      await request(app)
        .post('/api/orders')
        .set('Cookie', cookies)
        .send({
          clientId: client.id,
          businessName: `Order ${i}`,
          serviceType: 'pt',
          status: 'pending',
        })
        .expect(201);
    }

    const listResponse = await request(app)
      .get('/api/orders?page=2&pageSize=5')
      .set('Cookie', cookies)
      .expect(200);

    expect(listResponse.body.page).toBe(2);
    expect(listResponse.body.pageSize).toBe(5);
    expect(listResponse.body.total).toBe(12);
    expect(listResponse.body.items.length).toBe(5);
  });
});
