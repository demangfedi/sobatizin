const crypto = require('crypto');

class OrderModel {
  constructor() {
    this.records = [];
    this.seedDemoRecords();
  }

  generateReference() {
    return crypto.randomBytes(6).toString('hex').toUpperCase();
  }

  async create(payload = {}) {
    const reference = payload.reference || this.generateReference();
    let finalReference = reference;
    if (
      this.records.some((record) => String(record.reference).toUpperCase() === String(reference).toUpperCase())
    ) {
      finalReference = this.generateReference();
    }

    const record = {
      id: payload.id || crypto.randomUUID?.() || crypto.randomBytes(8).toString('hex'),
      reference: finalReference,
      status: payload.status || 'menunggu',
      history: Array.isArray(payload.history) ? payload.history : [],
      attachments: Array.isArray(payload.attachments) ? payload.attachments : [],
      createdAt: payload.createdAt || new Date().toISOString(),
      updatedAt: payload.updatedAt || new Date().toISOString()
    };

    this.records.push(record);
    return record;
  }

  seedDemoRecords() {
    if (this.records.length) {
      return;
    }

    const reference = 'DEMO-001';
    this.records.push({
      id: crypto.randomUUID?.() || crypto.randomBytes(8).toString('hex'),
      reference,
      status: 'diproses',
      history: [
        {
          status: 'Pesanan diterima',
          date: new Date().toISOString(),
          note: 'Pesanan berhasil dicatat.'
        },
        {
          status: 'Sedang diproses',
          date: new Date().toISOString(),
          note: 'Dokumen sedang diverifikasi.'
        }
      ],
      attachments: [
        {
          name: 'Surat Permohonan',
          url: '/files/contoh-surat-permohonan.pdf'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  async findByReference(reference) {
    if (!reference) {
      return null;
    }

    const normalized = String(reference).trim().toUpperCase();
    return this.records.find((record) => String(record.reference).toUpperCase() === normalized) || null;
  }

  serialize(record) {
    if (!record) {
      return null;
    }

    const attachments = Array.isArray(record.attachments)
      ? record.attachments.map((item, index) => {
          if (typeof item === 'string') {
            return {
              name: `Lampiran ${index + 1}`,
              url: item
            };
          }

          return item;
        })
      : [];

    return {
      reference: record.reference,
      status: record.status,
      history: Array.isArray(record.history) ? record.history : [],
      attachments
    };
  }
}

const orderModel = new OrderModel();

module.exports = {
  OrderModel,
  orderModel
};
