const { v4: uuidv4 } = require('uuid');

const DEFAULT_SETTINGS = {
  pricingDescription: '',
  serviceTypes: [],
  whatsappNumber: '',
  clientIntakeFields: []
};

function ensureArray(value) {
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    return value
      .split(/[\n,]/)
      .map((entry) => entry.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeString(value, { allowEmpty = true } = {}) {
  if (value === undefined || value === null) {
    return allowEmpty ? '' : null;
  }
  if (typeof value !== 'string') {
    value = String(value);
  }
  const trimmed = value.trim();
  if (!allowEmpty && trimmed.length === 0) {
    return null;
  }
  return trimmed;
}

function uniqueArray(values) {
  return Array.from(new Set(values));
}

function normalizeWhatsappNumber(number) {
  const normalized = normalizeString(number);
  if (!normalized) {
    return '';
  }
  const cleaned = normalized.replace(/\s+/g, '');
  if (!/^\+?\d{6,15}$/.test(cleaned)) {
    throw new Error('Nomor WhatsApp tidak valid. Gunakan format internasional, mis. +628123456789.');
  }
  return cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
}

function normalizeClientIntakeFields(value) {
  const entries = ensureArray(value).map((field) => {
    if (typeof field !== 'string') {
      field = String(field || '');
    }
    return field.trim();
  });
  const filtered = entries.filter(Boolean);
  return uniqueArray(filtered);
}

function buildSettings(payload = {}) {
  const pricingDescription = normalizeString(payload.pricingDescription ?? payload.pricing ?? '');
  const serviceTypes = uniqueArray(ensureArray(payload.serviceTypes).map((type) => normalizeString(type)).filter(Boolean));
  let whatsappNumber = '';
  if (payload.whatsappNumber) {
    whatsappNumber = normalizeWhatsappNumber(payload.whatsappNumber);
  }
  const clientIntakeFields = normalizeClientIntakeFields(payload.clientIntakeFields);

  return {
    ...DEFAULT_SETTINGS,
    pricingDescription,
    serviceTypes,
    whatsappNumber,
    clientIntakeFields,
    updatedAt: new Date().toISOString()
  };
}

function coerceBoolean(value, fallback = false) {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    return ['true', '1', 'yes', 'on'].includes(value.toLowerCase());
  }
  if (typeof value === 'number') {
    return value !== 0;
  }
  return fallback;
}

function buildService(payload = {}) {
  const name = normalizeString(payload.name, { allowEmpty: false });
  if (!name) {
    throw new Error('Nama layanan wajib diisi.');
  }
  const description = normalizeString(payload.description ?? '', { allowEmpty: true });
  const price = normalizeString(payload.price ?? '', { allowEmpty: true });
  const whatsappTemplate = normalizeString(payload.whatsappTemplate ?? '', { allowEmpty: true });
  const isActive = coerceBoolean(payload.isActive, true);
  const serviceTypes = uniqueArray(ensureArray(payload.serviceTypes).map((type) => normalizeString(type)).filter(Boolean));

  return {
    id: payload.id ?? uuidv4(),
    name,
    description,
    price,
    whatsappTemplate,
    serviceTypes,
    isActive,
    createdAt: payload.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

function applyServiceUpdates(current, payload = {}) {
  if (!current) {
    throw new Error('Layanan tidak ditemukan.');
  }
  const next = { ...current };
  if (payload.name !== undefined) {
    const name = normalizeString(payload.name, { allowEmpty: false });
    if (!name) {
      throw new Error('Nama layanan wajib diisi.');
    }
    next.name = name;
  }
  if (payload.description !== undefined) {
    next.description = normalizeString(payload.description ?? '', { allowEmpty: true });
  }
  if (payload.price !== undefined) {
    next.price = normalizeString(payload.price ?? '', { allowEmpty: true });
  }
  if (payload.whatsappTemplate !== undefined) {
    next.whatsappTemplate = normalizeString(payload.whatsappTemplate ?? '', { allowEmpty: true });
  }
  if (payload.isActive !== undefined) {
    next.isActive = coerceBoolean(payload.isActive, true);
  }
  if (payload.serviceTypes !== undefined) {
    next.serviceTypes = uniqueArray(ensureArray(payload.serviceTypes).map((type) => normalizeString(type)).filter(Boolean));
  }
  next.updatedAt = new Date().toISOString();
  return next;
}

module.exports = {
  DEFAULT_SETTINGS,
  buildSettings,
  buildService,
  applyServiceUpdates
};
