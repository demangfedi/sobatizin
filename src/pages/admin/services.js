import React, { useContext, useEffect, useMemo, useState } from 'react';
import { AdminContext } from '../../app';
import {
  createAdminService,
  updateAdminService,
  deleteAdminService
} from '../../api';

const containerStyles = {
  display: 'grid',
  gap: '24px'
};

const cardStyles = {
  background: '#fff',
  borderRadius: '12px',
  padding: '20px',
  boxShadow: '0 12px 24px rgba(15, 23, 42, 0.08)',
  border: '1px solid #e1e8f5'
};

const fieldStyles = {
  display: 'grid',
  gap: '8px'
};

const inputStyles = {
  padding: '10px 12px',
  borderRadius: '8px',
  border: '1px solid #ccd6eb',
  fontSize: '14px'
};

const textareaStyles = {
  ...inputStyles,
  minHeight: '100px',
  resize: 'vertical'
};

const rowStyles = {
  display: 'flex',
  gap: '12px',
  flexWrap: 'wrap'
};

const buttonPrimary = {
  padding: '10px 16px',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: '#4f6bed',
  color: '#fff',
  fontWeight: 600,
  cursor: 'pointer'
};

const buttonGhost = {
  padding: '10px 16px',
  borderRadius: '8px',
  border: '1px solid #ccd6eb',
  backgroundColor: '#f8faff',
  color: '#1f2a44',
  fontWeight: 500,
  cursor: 'pointer'
};

function formatList(list) {
  return (list || []).join('\n');
}

function parseList(value) {
  if (!value) {
    return [];
  }
  return value
    .split(/\n|,/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function ServiceForm({ initialValue, onSubmit, submitLabel, submitting }) {
  const [formState, setFormState] = useState(() => ({
    name: initialValue?.name || '',
    description: initialValue?.description || '',
    price: initialValue?.price || '',
    serviceTypesText: formatList(initialValue?.serviceTypes),
    whatsappTemplate: initialValue?.whatsappTemplate || '',
    isActive: initialValue?.isActive ?? true
  }));

  useEffect(() => {
    setFormState({
      name: initialValue?.name || '',
      description: initialValue?.description || '',
      price: initialValue?.price || '',
      serviceTypesText: formatList(initialValue?.serviceTypes),
      whatsappTemplate: initialValue?.whatsappTemplate || '',
      isActive: initialValue?.isActive ?? true
    });
  }, [initialValue]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      name: formState.name.trim(),
      description: formState.description.trim(),
      price: formState.price.trim(),
      serviceTypes: parseList(formState.serviceTypesText),
      whatsappTemplate: formState.whatsappTemplate.trim(),
      isActive: Boolean(formState.isActive)
    });
  };

  return (
    <form style={{ ...containerStyles, marginTop: '12px' }} onSubmit={handleSubmit}>
      <div style={fieldStyles}>
        <label htmlFor={`service-name-${initialValue?.id || 'new'}`} style={{ fontWeight: 600 }}>
          Nama Layanan
        </label>
        <input
          id={`service-name-${initialValue?.id || 'new'}`}
          name="name"
          style={inputStyles}
          value={formState.name}
          onChange={handleChange}
          required
        />
      </div>

      <div style={fieldStyles}>
        <label htmlFor={`service-description-${initialValue?.id || 'new'}`} style={{ fontWeight: 600 }}>
          Deskripsi
        </label>
        <textarea
          id={`service-description-${initialValue?.id || 'new'}`}
          name="description"
          style={textareaStyles}
          value={formState.description}
          onChange={handleChange}
          placeholder="Highlight benefit layanan atau dokumen yang diperlukan."
        />
      </div>

      <div style={rowStyles}>
        <div style={{ ...fieldStyles, flex: '1 1 200px' }}>
          <label htmlFor={`service-price-${initialValue?.id || 'new'}`} style={{ fontWeight: 600 }}>
            Harga / Paket
          </label>
          <input
            id={`service-price-${initialValue?.id || 'new'}`}
            name="price"
            style={inputStyles}
            value={formState.price}
            onChange={handleChange}
            placeholder="Mis. Mulai dari Rp3.500.000"
          />
        </div>
        <label style={{ alignSelf: 'flex-end', display: 'flex', gap: '8px', fontWeight: 500 }}>
          <input
            type="checkbox"
            name="isActive"
            checked={Boolean(formState.isActive)}
            onChange={handleChange}
          />
          Aktif ditampilkan
        </label>
      </div>

      <div style={fieldStyles}>
        <label htmlFor={`service-types-${initialValue?.id || 'new'}`} style={{ fontWeight: 600 }}>
          Tag Layanan
        </label>
        <textarea
          id={`service-types-${initialValue?.id || 'new'}`}
          name="serviceTypesText"
          style={textareaStyles}
          value={formState.serviceTypesText}
          onChange={handleChange}
          placeholder="Pisahkan dengan baris baru untuk kategori layanan"
        />
        <p style={{ fontSize: '12px', color: '#6c7a96' }}>Digunakan sebagai filter dan highlight di landing page.</p>
      </div>

      <div style={fieldStyles}>
        <label htmlFor={`service-template-${initialValue?.id || 'new'}`} style={{ fontWeight: 600 }}>
          Template Pesan WhatsApp
        </label>
        <textarea
          id={`service-template-${initialValue?.id || 'new'}`}
          name="whatsappTemplate"
          style={textareaStyles}
          value={formState.whatsappTemplate}
          onChange={handleChange}
          placeholder="Halo Sobat Izin, saya ingin mendaftar layanan..."
        />
        <p style={{ fontSize: '12px', color: '#6c7a96' }}>Opsional, akan dipakai ketika pengguna klik CTA WhatsApp.</p>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button style={buttonPrimary} type="submit" disabled={submitting}>
          {submitting ? 'Menyimpan...' : submitLabel}
        </button>
      </div>
    </form>
  );
}

function ServiceCard({ service }) {
  const [mode, setMode] = useState('view');
  const [status, setStatus] = useState(null);
  const submitting = status === 'pending';

  useEffect(() => {
    setStatus(null);
  }, [service]);

  const handleUpdate = async (values) {
    try {
      setStatus('pending');
      await updateAdminService(service.id, values);
      setStatus('success');
      setMode('view');
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Gagal memperbarui layanan.' });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Hapus layanan "${service.name}"?`)) {
      return;
    }
    try {
      setStatus('pending');
      await deleteAdminService(service.id);
      setStatus('success');
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Gagal menghapus layanan.' });
    }
  };

  const errorMessage = typeof status === 'object' ? status.message : null;

  if (mode === 'edit') {
    return (
      <article style={cardStyles}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>{service.name}</h3>
          <button style={buttonGhost} type="button" onClick={() => setMode('view')} disabled={submitting}>
            Batal
          </button>
        </header>
        {errorMessage ? (
          <p style={{ color: '#c62828', fontWeight: 500 }}>{errorMessage}</p>
        ) : null}
        <ServiceForm initialValue={service} onSubmit={handleUpdate} submitLabel="Simpan Perubahan" submitting={submitting} />
      </article>
    );
  }

  return (
    <article style={cardStyles}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: '0 0 4px' }}>{service.name}</h3>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '4px 10px',
              borderRadius: '999px',
              backgroundColor: service.isActive ? '#e7f6e7' : '#ffecec',
              color: service.isActive ? '#2e7d32' : '#c62828',
              fontSize: '12px',
              fontWeight: 600
            }}
          >
            {service.isActive ? 'Aktif' : 'Nonaktif'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={buttonGhost} type="button" onClick={() => setMode('edit')}>
            Ubah
          </button>
          <button style={{ ...buttonGhost, color: '#c62828', borderColor: '#ffcdd2' }} type="button" onClick={handleDelete} disabled={submitting}>
            Hapus
          </button>
        </div>
      </header>
      {errorMessage ? (
        <p style={{ color: '#c62828', fontWeight: 500 }}>{errorMessage}</p>
      ) : null}
      <p style={{ marginTop: '16px', lineHeight: 1.6 }}>{service.description || 'Belum ada deskripsi.'}</p>
      {service.price ? (
        <p style={{ marginTop: '8px', fontWeight: 600 }}>Harga: {service.price}</p>
      ) : null}
      {service.serviceTypes?.length ? (
        <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {service.serviceTypes.map((type) => (
            <span
              key={type}
              style={{
                backgroundColor: '#f1f5ff',
                color: '#3246c5',
                padding: '6px 12px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 600
              }}
            >
              {type}
            </span>
          ))}
        </div>
      ) : null}
      {service.whatsappTemplate ? (
        <div style={{ marginTop: '16px', backgroundColor: '#f8faff', padding: '12px', borderRadius: '8px', color: '#1f2a44' }}>
          <strong>Template WhatsApp:</strong>
          <p style={{ marginTop: '6px', whiteSpace: 'pre-wrap' }}>{service.whatsappTemplate}</p>
        </div>
      ) : null}
    </article>
  );
}

function ServicesPage() {
  const { services, loading } = useContext(AdminContext);
  const [status, setStatus] = useState(null);
  const submitting = status === 'pending';

  const sortedServices = useMemo(() => {
    return [...(services || [])].sort((a, b) => a.name.localeCompare(b.name));
  }, [services]);

  const handleCreate = async (values) => {
    try {
      setStatus('pending');
      await createAdminService(values);
      setStatus('success');
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Gagal menambahkan layanan.' });
    }
  };

  const errorMessage = typeof status === 'object' ? status.message : null;

  return (
    <section style={containerStyles}>
      <header>
        <h2 style={{ margin: 0 }}>Manajemen Layanan</h2>
        <p style={{ color: '#6c7a96', marginTop: '6px' }}>
          Tambah, ubah, dan nonaktifkan layanan yang ditawarkan kepada klien.
        </p>
      </header>

      <article style={cardStyles}>
        <h3 style={{ marginTop: 0 }}>Tambah Layanan Baru</h3>
        {errorMessage ? (
          <p style={{ color: '#c62828', fontWeight: 500 }}>{errorMessage}</p>
        ) : status === 'success' ? (
          <p style={{ color: '#2e7d32', fontWeight: 500 }}>Layanan berhasil ditambahkan.</p>
        ) : null}
        <ServiceForm initialValue={null} onSubmit={handleCreate} submitLabel="Simpan Layanan" submitting={submitting} />
      </article>

      <div style={{ display: 'grid', gap: '20px' }}>
        {loading && !services?.length ? <p>Sedang memuat layanan...</p> : null}
        {sortedServices.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
        {!loading && sortedServices.length === 0 ? <p>Belum ada layanan yang terdaftar.</p> : null}
      </div>
    </section>
  );
}

export default ServicesPage;
