import { z } from 'zod';

const serviceTypeEnum = z.enum(['cv', 'pt', 'yayasan', 'perkumpulan', 'koperasi', 'sbu', 'skk', 'bpom', 'sni', 'iso']);
const statusEnum = z.enum(['pending', 'in_progress', 'completed']);
const leadStatusEnum = z.enum(['new', 'qualified', 'converted', 'archived']);

export const registerSchema = z
  .object({
    name: z.string().min(1, 'Nama wajib diisi'),
    email: z.string().email('Email tidak valid'),
    phone: z.string().min(5).optional(),
    password: z.string().min(12, 'Password minimal 12 karakter'),
  })
  .strict();

export const loginSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(12),
  })
  .strict();

export const orderCreateSchema = z
  .object({
    clientId: z.string().cuid(),
    businessName: z.string().min(1),
    serviceType: serviceTypeEnum,
    status: statusEnum.optional(),
    orderDate: z.coerce.date().optional(),
  })
  .strict();

export const orderUpdateSchema = z
  .object({
    businessName: z.string().min(1).optional(),
    serviceType: serviceTypeEnum.optional(),
    status: statusEnum.optional(),
    orderDate: z.coerce.date().optional(),
  })
  .strict();

export const orderQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(10),
    status: statusEnum.optional(),
    serviceType: serviceTypeEnum.optional(),
    search: z.string().optional(),
  })
  .partial({ status: true, serviceType: true, search: true });

export const leadCreateSchema = z
  .object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(5),
    serviceType: serviceTypeEnum,
    note: z.string().optional(),
    status: leadStatusEnum.optional(),
  })
  .strict();
