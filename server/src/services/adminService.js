const database = require('../database');
const { buildSettings, buildService, applyServiceUpdates } = require('../models');

function getSettings() {
  return database.getSettings();
}

function updateSettings(payload) {
  const settings = buildSettings(payload);
  return database.updateSettings(settings);
}

function listServices() {
  return database.listServices();
}

function createService(payload) {
  const service = buildService(payload);
  return database.insertService(service);
}

function updateService(id, payload) {
  const existing = database.getServiceById(id);
  if (!existing) {
    const error = new Error('Layanan tidak ditemukan.');
    error.statusCode = 404;
    throw error;
  }
  const updated = applyServiceUpdates(existing, payload);
  return database.updateService(id, updated);
}

function deleteService(id) {
  const success = database.deleteService(id);
  if (!success) {
    const error = new Error('Layanan tidak ditemukan.');
    error.statusCode = 404;
    throw error;
  }
  return success;
}

module.exports = {
  getSettings,
  updateSettings,
  listServices,
  createService,
  updateService,
  deleteService
};
