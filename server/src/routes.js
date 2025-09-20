const express = require('express');
const adminService = require('./services/adminService');
const { requireAdmin } = require('./middleware/auth');

const router = express.Router();

router.get('/api/settings', (req, res) => {
  const settings = adminService.getSettings();
  res.json({ settings });
});

router.get('/api/services', (req, res) => {
  const services = adminService.listServices().filter((service) => service.isActive !== false);
  res.json({ services });
});

router.get('/api/admin/settings', requireAdmin, (req, res) => {
  const settings = adminService.getSettings();
  res.json({ settings });
});

router.put('/api/admin/settings', requireAdmin, (req, res) => {
  try {
    const settings = adminService.updateSettings(req.body || {});
    res.json({ settings });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/api/admin/services', requireAdmin, (req, res) => {
  const services = adminService.listServices();
  res.json({ services });
});

router.post('/api/admin/services', requireAdmin, (req, res) => {
  try {
    const service = adminService.createService(req.body || {});
    res.status(201).json({ service });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/api/admin/services/:id', requireAdmin, (req, res) => {
  try {
    const service = adminService.updateService(req.params.id, req.body || {});
    res.json({ service });
  } catch (error) {
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({ message: error.message });
  }
});

router.delete('/api/admin/services/:id', requireAdmin, (req, res) => {
  try {
    adminService.deleteService(req.params.id);
    res.status(204).send();
  } catch (error) {
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({ message: error.message });
  }
});

module.exports = router;
