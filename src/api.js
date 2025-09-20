export async function fetchTracking(reference, options = {}) {
  const { fetchFn = (typeof fetch !== 'undefined' ? fetch : null), signal } = options;

  if (!reference) {
    throw new Error('Nomor referensi diperlukan.');
  }

  if (typeof fetchFn !== 'function') {
    throw new Error('Fungsi fetch tidak tersedia di lingkungan ini.');
  }

  const trimmed = String(reference).trim();
  if (!trimmed) {
    throw new Error('Nomor referensi diperlukan.');
  }

  const response = await fetchFn(`/api/tracking/${encodeURIComponent(trimmed)}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    },
    signal
  });

  if (!response.ok) {
    let message = 'Kode tracking tidak ditemukan.';
    try {
      const payload = await response.json();
      if (payload && payload.error) {
        message = payload.error;
      }
    } catch (error) {
      // abaikan, gunakan pesan bawaan
    }

    throw new Error(message);
  }

  return response.json();
}

export default {
  fetchTracking
};
