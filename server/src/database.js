const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data.json');

const defaultData = {
  settings: {
    pricingDescription: '',
    serviceTypes: [],
    whatsappNumber: '',
    clientIntakeFields: []
  },
  services: []
};

const serialize = (value) => JSON.stringify(value, null, 2);

function ensureDataFile() {
  const directory = path.dirname(DATA_FILE);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, serialize(defaultData), 'utf-8');
  }
}

function loadState() {
  ensureDataFile();
  try {
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(content);
    return {
      settings: { ...defaultData.settings, ...parsed.settings },
      services: Array.isArray(parsed.services) ? parsed.services : []
    };
  } catch (error) {
    return JSON.parse(serialize(defaultData));
  }
}

let state = loadState();

function persist() {
  fs.writeFileSync(DATA_FILE, serialize(state));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

const database = {
  getSettings() {
    return clone(state.settings);
  },
  updateSettings(settings) {
    state.settings = clone(settings);
    persist();
    return clone(state.settings);
  },
  listServices() {
    return clone(state.services);
  },
  getServiceById(id) {
    return clone(state.services.find((service) => service.id === id));
  },
  insertService(service) {
    state.services.push(clone(service));
    persist();
    return clone(service);
  },
  updateService(id, payload) {
    const index = state.services.findIndex((service) => service.id === id);
    if (index === -1) {
      return null;
    }
    const updated = { ...state.services[index], ...clone(payload) };
    state.services[index] = updated;
    persist();
    return clone(updated);
  },
  deleteService(id) {
    const index = state.services.findIndex((service) => service.id === id);
    if (index === -1) {
      return false;
    }
    state.services.splice(index, 1);
    persist();
    return true;
  },
  reset() {
    state = JSON.parse(serialize(defaultData));
    persist();
  }
};

module.exports = database;
