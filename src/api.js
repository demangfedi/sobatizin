const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

let adminToken = null;
const listeners = new Set();

function loadStoredToken() {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    return window.localStorage.getItem('sobatizin:adminToken');
  } catch (error) {
    return null;
  }
}

function storeToken(token) {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    if (token) {
      window.localStorage.setItem('sobatizin:adminToken', token);
    } else {
      window.localStorage.removeItem('sobatizin:adminToken');
    }
  } catch (error) {
    // ignore
  }
}

adminToken = loadStoredToken();
if (!adminToken) {
  adminToken = process.env.REACT_APP_ADMIN_TOKEN || 'admin-secret';
  if (adminToken) {
    storeToken(adminToken);
  }
}

function emitChange() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (error) {
      // ignore listener errors
    }
  });
}

export function onChange(listener) {
  if (typeof listener === 'function') {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }
  return () => {};
}

export function setAdminToken(token) {
  adminToken = token || null;
  storeToken(adminToken);
  emitChange();
}

function resolveUrl(path) {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return `${API_BASE_URL}${path}`;
}

async function request(path, { method = 'GET', admin = false, body, headers: customHeaders } = {}) {
  const url = resolveUrl(path);
  const headers = new Headers(customHeaders || {});
  if (body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (admin && adminToken) {
    headers.set('x-admin-token', adminToken);
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined
  });

  if (!response.ok) {
    let message = 'Request gagal.';
    try {
      const payload = await response.json();
      message = payload.message || message;
    } catch (error) {
      // ignore parse errors
    }
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) {
    return null;
  }
  return response.json();
}

export async function fetchPublicSettings() {
  const payload = await request('/api/settings');
  return payload.settings;
}

export async function fetchPublicServices() {
  const payload = await request('/api/services');
  return payload.services;
}

export async function fetchAdminSettings() {
  const payload = await request('/api/admin/settings', { admin: true });
  return payload.settings;
}

export async function updateAdminSettings(settings) {
  const payload = await request('/api/admin/settings', {
    method: 'PUT',
    admin: true,
    body: settings
  });
  emitChange();
  return payload.settings;
}

export async function fetchAdminServices() {
  const payload = await request('/api/admin/services', { admin: true });
  return payload.services;
}

export async function createAdminService(service) {
  const payload = await request('/api/admin/services', {
    method: 'POST',
    admin: true,
    body: service
  });
  emitChange();
  return payload.service;
}

export async function updateAdminService(id, service) {
  const payload = await request(`/api/admin/services/${id}`, {
    method: 'PUT',
    admin: true,
    body: service
  });
  emitChange();
  return payload.service;
}

export async function deleteAdminService(id) {
  await request(`/api/admin/services/${id}`, {
    method: 'DELETE',
    admin: true
  });
  emitChange();
}

export async function fetchAdminState() {
  const [settings, services] = await Promise.all([fetchAdminSettings(), fetchAdminServices()]);
  return { settings, services };
}

export function getAdminToken() {
  return adminToken;
}
