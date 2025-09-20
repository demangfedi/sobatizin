import React, { useContext, useEffect, useMemo, useState } from 'react';
import { AdminContext } from '../../app';
import { updateAdminSettings } from '../../api';

const formStyles = {
  display: 'grid',
  gap: '20px',
  maxWidth: '720px'
};

const fieldStyles = {
  display: 'grid',
  gap: '8px'
};

const labelStyles = {
  fontWeight: 600,
  color: '#25324b'
};

const inputStyles = {
  padding: '10px 12px',
  borderRadius: '8px',
  border: '1px solid #ccd6eb',
  fontSize: '14px'
};

const textareaStyles = {
  ...inputStyles,
  minHeight: '120px',
  resize: 'vertical'
};

const helperStyles = {
  fontSize: '12px',
  color: '#6c7a96'
};

const buttonStyles = {
  padding: '12px 20px',
  borderRadius: '10px',
  backgroundColor: '#4f6bed',
  border: 'none',
  color: '#fff',
  fontWeight: 600,
  cursor: 'pointer',
  justifySelf: 'flex-start'
};

const statusStyles = {
  padding: '12px 16px',
  borderRadius: '10px',
  fontWeight: 500
};

function extractList(value) {
  if (!value) {
    return [];
  }
  return value
    .split(/\n|,/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function SettingsPage({ onSave = updateAdminSettings }) {
  const { settings, loading, error } = useContext(AdminContext);
  const [formState, setFormState] = useState({
    pricingDescription: '',
    whatsappNumber: '',
    serviceTypesText: '',
    clientFieldsText: ''
  });
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (settings) {
      setFormState({
        pricingDescription: settings.pricingDescription || '',
        whatsappNumber: settings.whatsappNumber || '',
        serviceTypesText: (settings.serviceTypes || []).join('\n'),
        clientFieldsText: (settings.clientIntakeFields || []).join('\n')
      });
    }
  }, [settings]);

  useEffect(() => {
    if (loading) {
      setStatus(null);
    }
  }, [loading]);

  const disabled = useMemo(() => loading && !settings, [loading, settings]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);

    const payload = {
      pricingDescription: formState.pricingDescription.trim(),
      whatsappNumber: formState.whatsappNumber.trim(),
      serviceTypes: extractList(formState.serviceTypesText),
      clientIntakeFields: extractList(formState.clientFieldsText)
    };

    try {
      await onSave(payload);
      setStatus({ type: 'success', message: 'Pengaturan berhasil disimpan.' });
    } catch (submitError) {
      setStatus({ type: 'error', message: submitError.message || 'Gagal menyimpan pengaturan.' });
    }
  };

  const currentError = status?.type === 'error' ? status.message : error;
  const successMessage = status?.type === 'success' ? status.message : null;

  return (
    <section>
      <header style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0 }}>Pengaturan Umum</h2>
        <p style={{ color: '#6c7a96', marginTop: '6px' }}>
          Kelola konfigurasi harga, tipe layanan, dan form input klien.
        </p>
      </header>

      {currentError ? (
        <div style={{ ...statusStyles, backgroundColor: '#ffe5e5', color: '#c62828' }}>{currentError}</div>
      ) : null}
      {successMessage ? (
        <div style={{ ...statusStyles, backgroundColor: '#e7f6e7', color: '#2e7d32' }}>{successMessage}</div>
      ) : null}

      <form style={formStyles} onSubmit={handleSubmit}>
        <div style={fieldStyles}>
          <label htmlFor="pricingDescription" style={labelStyles}>
            Ringkasan Pricing
          </label>
          <textarea
            id="pricingDescription"
            name="pricingDescription"
            style={textareaStyles}
            value={formState.pricingDescription}
            onChange={handleChange}
            disabled={disabled}
            placeholder="Jelaskan paket harga, SLA, atau ketentuan biaya."
          />
          <p style={helperStyles}>Gunakan baris baru untuk memudahkan pembacaan.</p>
        </div>

        <div style={fieldStyles}>
          <label htmlFor="serviceTypesText" style={labelStyles}>
            Jenis Layanan
          </label>
          <textarea
            id="serviceTypesText"
            name="serviceTypesText"
            style={textareaStyles}
            value={formState.serviceTypesText}
            onChange={handleChange}
            disabled={disabled}
            placeholder="Contoh: Pendirian PT\nPembuatan NIB\nPerizinan OSS"
          />
          <p style={helperStyles}>Satu layanan per baris akan ditampilkan sebagai opsi di landing page.</p>
        </div>

        <div style={fieldStyles}>
          <label htmlFor="whatsappNumber" style={labelStyles}>
            Nomor WhatsApp Admin
          </label>
          <input
            id="whatsappNumber"
            name="whatsappNumber"
            type="tel"
            style={inputStyles}
            value={formState.whatsappNumber}
            onChange={handleChange}
            disabled={disabled}
            placeholder="Mis. +6281234567890"
          />
          <p style={helperStyles}>Gunakan format internasional untuk memudahkan auto-link ke WhatsApp.</p>
        </div>

        <div style={fieldStyles}>
          <label htmlFor="clientFieldsText" style={labelStyles}>
            Input Wajib Dari Klien
          </label>
          <textarea
            id="clientFieldsText"
            name="clientFieldsText"
            style={textareaStyles}
            value={formState.clientFieldsText}
            onChange={handleChange}
            disabled={disabled}
            placeholder={'Contoh:\nNama Perusahaan\nJenis Usaha\nAlamat Operasional'}
          />
          <p style={helperStyles}>Daftar pertanyaan yang perlu dijawab calon klien saat request layanan.</p>
        </div>

        <button style={buttonStyles} type="submit" disabled={disabled}>
          {loading ? 'Menyimpan...' : 'Simpan Pengaturan'}
        </button>
      </form>
    </section>
  );
}

export default SettingsPage;
