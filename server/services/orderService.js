import { prisma } from '../lib/prisma.js';
import { orderCreateSchema, orderUpdateSchema, orderQuerySchema } from '../utils/validators.js';

export async function listOrders(rawQuery, user) {
  const query = orderQuerySchema.parse(rawQuery);
  const where = {};

  if (user.role === 'client') {
    where.clientId = user.id;
  }

  if (query.status) {
    where.status = query.status;
  }

  if (query.serviceType) {
    where.serviceType = query.serviceType;
  }

  if (query.search) {
    where.businessName = { contains: query.search, mode: 'insensitive' };
  }

  const skip = (query.page - 1) * query.pageSize;
  const [total, items] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      skip,
      take: query.pageSize,
      orderBy: [{ orderDate: 'desc' }, { createdAt: 'desc' }],
      include: { history: { orderBy: { updatedAt: 'desc' } }, files: true, client: true },
    }),
  ]);

  return {
    items,
    total,
    page: query.page,
    pageSize: query.pageSize,
    totalPages: Math.ceil(total / query.pageSize) || 1,
  };
}

export async function getOrderById(id, user) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { history: { orderBy: { updatedAt: 'desc' } }, files: true, client: true },
  });
  if (!order) {
    throw new Error('Order not found');
  }
  if (user.role === 'client' && order.clientId !== user.id) {
    throw new Error('Forbidden');
  }
  return order;
}

export async function createOrder(input, actor) {
  const data = orderCreateSchema.parse(input);
  const order = await prisma.order.create({
    data: {
      clientId: data.clientId,
      businessName: data.businessName,
      serviceType: data.serviceType,
      status: data.status ?? 'pending',
      orderDate: data.orderDate ?? new Date(),
      history: {
        create: {
          status: data.status ?? 'pending',
          updatedByRole: actor.role,
        },
      },
    },
    include: { history: true, client: true },
  });
  return order;
}

export async function updateOrder(id, input, actor) {
  const data = orderUpdateSchema.parse(input);
  const existing = await prisma.order.findUnique({ where: { id } });
  if (!existing) {
    throw new Error('Order not found');
  }

  if (actor.role === 'client' && existing.clientId !== actor.id) {
    throw new Error('Forbidden');
  }

  const order = await prisma.order.update({
    where: { id },
    data: {
      ...('businessName' in data ? { businessName: data.businessName } : {}),
      ...('serviceType' in data ? { serviceType: data.serviceType } : {}),
      ...('status' in data ? { status: data.status } : {}),
      ...('orderDate' in data ? { orderDate: data.orderDate } : {}),
      history:
        data.status && data.status !== existing.status
          ? {
              create: {
                status: data.status,
                updatedByRole: actor.role,
              },
            }
          : undefined,
    },
    include: { history: { orderBy: { updatedAt: 'desc' } } },
  });
  return order;
}

export async function deleteOrder(id) {
  await prisma.orderHistory.deleteMany({ where: { orderId: id } });
  await prisma.fileUpload.deleteMany({ where: { orderId: id } });
  return prisma.order.delete({ where: { id } });
}
