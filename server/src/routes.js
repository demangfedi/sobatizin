const { orderModel } = require('./models/order.js');

async function getTrackingPayload(reference, model = orderModel) {
  const order = await model.findByReference(reference);
  if (!order) {
    return null;
  }

  return model.serialize(order);
}

function registerTrackingEndpoint(app, options = {}) {
  if (!app || typeof app.get !== 'function') {
    throw new Error('Instance Express app atau router dibutuhkan untuk mendaftarkan rute tracking.');
  }

  const model = options.orderModel || orderModel;

  app.get('/api/tracking/:reference', async (req, res) => {
    try {
      const { reference } = req.params;
      const payload = await getTrackingPayload(reference, model);

      if (!payload) {
        return res.status(404).json({ error: 'Kode tracking tidak valid atau tidak ditemukan.' });
      }

      return res.json(payload);
    } catch (error) {
      console.error('Gagal mengambil data tracking:', error);
      return res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
    }
  });

  return app;
}

module.exports = {
  registerTrackingEndpoint,
  getTrackingPayload
};
