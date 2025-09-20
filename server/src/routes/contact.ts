import type { Request, Response } from 'express';
import { Router } from 'express';
import { z } from 'zod';
import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const optionalEmailSchema = z.preprocess(
  (value) => {
    if (typeof value !== 'string') {
      return value;
    }

    const trimmed = value.trim();
    return trimmed === '' ? undefined : trimmed;
  },
  z.string().email('Please provide a valid email address').optional()
);

const optionalPhoneSchema = z.preprocess(
  (value) => {
    if (typeof value !== 'string') {
      return value;
    }

    const trimmed = value.trim();
    return trimmed === '' ? undefined : trimmed;
  },
  z
    .string()
    .regex(/^[+\d\s().-]{7,}$/u, 'Please provide a valid phone number')
    .optional()
);

const contactSchema = z
  .object({
    name: z
      .string({ required_error: 'Name is required' })
      .trim()
      .min(1, 'Name is required'),
    email: optionalEmailSchema,
    phone: optionalPhoneSchema,
    service: z
      .string({ required_error: 'Service is required' })
      .trim()
      .min(1, 'Service is required'),
    message: z
      .string({ required_error: 'Message is required' })
      .trim()
      .min(1, 'Message is required')
  })
  .refine((data) => Boolean(data.email || data.phone), {
    message: 'Either an email or phone number is required',
    path: ['form']
  });

const logFilePath = path.resolve(
  __dirname,
  '..',
  '..',
  '..',
  'logs',
  'contact-submissions.log'
);

async function ensureLogDirExists(): Promise<void> {
  const logDir = path.dirname(logFilePath);
  await mkdir(logDir, { recursive: true });
}

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const parseResult = contactSchema.safeParse(req.body);

  if (!parseResult.success) {
    const errors = parseResult.error.errors.map((issue) => ({
      field: issue.path.join('.') || null,
      message: issue.message
    }));

    return res.status(400).json({
      message: 'Validation failed',
      errors
    });
  }

  const submission = parseResult.data;

  const metadata = {
    receivedAt: new Date().toISOString(),
    ip: req.ip,
    forwardedFor: req.headers['x-forwarded-for'] ?? null,
    userAgent: req.headers['user-agent'] ?? null
  };

  try {
    await ensureLogDirExists();
    await appendFile(logFilePath, `${JSON.stringify({ submission, metadata })}\n`, {
      encoding: 'utf8'
    });
  } catch (error) {
    console.error('Unable to write contact submission log:', error);
    return res.status(500).json({
      message: 'Unable to save your message right now. Please try again later.'
    });
  }

  return res.status(201).json({
    message: 'Your message has been received. We will reach out soon.'
  });
});

export default router;
