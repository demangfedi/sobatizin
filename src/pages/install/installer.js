import React, { useCallback, useMemo, useState } from 'react';
import './installer.css';

const INSTALL_ENDPOINT = '/api/install';

const defaultFormState = {
  siteName: '',
  siteDomain: '',
  hostName: '',
  adminUsername: '',
  adminPassword: '',
  adminPasswordConfirm: '',
  dbHost: '',
  dbPort: 3306,
  dbName: '',
  dbUser: '',
  dbPassword: '',
  masterDbUser: '',
  masterDbPassword: '',
  cpanelUser: '',
  cpanelToken: '',
};

const fetchJson = async (url, options) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Permintaan tidak dapat diproses');
  }

  return response.json();
};

const Checklist = ({ items }) => {
  if (!items.length) {
    return (
      <div className="installer-checklist empty">
        <p>Prasyarat belum dapat diverifikasi. Pastikan server dapat mengakses endpoint backend.</p>
      </div>
    );
  }

  return (
    <ul className="installer-checklist">
      {items.map((item) => (
        <li key={item.key} className={item.passed ? 'passed' : 'failed'}>
          <div className="indicator" aria-hidden="true" />
          <div>
            <strong>{item.label}</strong>
            <p>{item.message}</p>
          </div>
        </li>
      ))}
    </ul>
  );
};

function InstallerPage({ onInstalled, prerequisites, refreshPrerequisites }) {
  const [form, setForm] = useState(defaultFormState);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const isFormValid = useMemo(() => {
    const requiredFields = [
      'siteName',
      'adminUsername',
      'adminPassword',
      'adminPasswordConfirm',
      'dbHost',
      'dbName',
      'dbUser',
      'dbPassword',
    ];

    const hasEmptyRequired = requiredFields.some((field) => !`${form[field]}`.trim());
    if (hasEmptyRequired) {
      return false;
    }

    return form.adminPassword === form.adminPasswordConfirm;
  }, [form]);

  const updateForm = useCallback((event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }, []);

  const submit = useCallback(
    async (event) => {
      event.preventDefault();
      if (!isFormValid) {
        setErrorMessage('Periksa kembali data instalasi dan pastikan seluruh kolom wajib telah terisi.');
        return;
      }

      setSubmitting(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      try {
        await fetchJson(INSTALL_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            site: {
              name: form.siteName,
              domain: form.siteDomain,
              host: form.hostName,
            },
            admin: {
              username: form.adminUsername,
              password: form.adminPassword,
            },
            database: {
              host: form.dbHost,
              port: Number(form.dbPort) || 3306,
              name: form.dbName,
              user: form.dbUser,
              password: form.dbPassword,
              masterUser: form.masterDbUser,
              masterPassword: form.masterDbPassword,
            },
            cpanel: {
              user: form.cpanelUser,
              token: form.cpanelToken,
            },
          }),
        });

        setSuccessMessage('Instalasi berhasil. Anda akan diarahkan ke halaman login.');
        setTimeout(() => {
          onInstalled?.();
        }, 1500);
      } catch (error) {
        console.error('Instalasi gagal', error);
        setErrorMessage(error.message);
      } finally {
        setSubmitting(false);
        refreshPrerequisites?.();
      }
    },
    [form, isFormValid, onInstalled, refreshPrerequisites]
  );

  return (
    <div className="installer-wrapper">
      <section className="installer-intro">
        <h1>Wizard Instalasi Sobat Izin</h1>
        <p>
          Lengkapi formulir di bawah ini untuk mengonfigurasi website, membuat pengguna admin pertama,
          dan menyiapkan koneksi database. Pastikan seluruh prasyarat server terpenuhi sebelum melanjutkan.
        </p>
      </section>

      <section className="installer-checklist-section">
        <div className="section-header">
          <h2>Prasyarat Server</h2>
          <button type="button" onClick={refreshPrerequisites} disabled={submitting}>
            Muat ulang
          </button>
        </div>
        <Checklist items={prerequisites} />
      </section>

      <form className="installer-form" onSubmit={submit}>
        <div className="form-grid">
          <fieldset>
            <legend>Informasi Website</legend>
            <label>
              Nama Website
              <input
                type="text"
                name="siteName"
                value={form.siteName}
                onChange={updateForm}
                required
              />
            </label>
            <label>
              Domain
              <input
                type="text"
                name="siteDomain"
                value={form.siteDomain}
                onChange={updateForm}
                placeholder="contoh: example.go.id"
              />
            </label>
            <label>
              Host/Server
              <input
                type="text"
                name="hostName"
                value={form.hostName}
                onChange={updateForm}
                placeholder="mis. Pusat Data Kominfo"
              />
            </label>
          </fieldset>

          <fieldset>
            <legend>Akun Admin</legend>
            <label>
              Username Admin
              <input
                type="text"
                name="adminUsername"
                value={form.adminUsername}
                onChange={updateForm}
                required
              />
            </label>
            <label>
              Password Admin
              <input
                type="password"
                name="adminPassword"
                value={form.adminPassword}
                onChange={updateForm}
                required
              />
            </label>
            <label>
              Konfirmasi Password
              <input
                type="password"
                name="adminPasswordConfirm"
                value={form.adminPasswordConfirm}
                onChange={updateForm}
                required
              />
            </label>
          </fieldset>

          <fieldset>
            <legend>Koneksi Database</legend>
            <label>
              Host Database
              <input type="text" name="dbHost" value={form.dbHost} onChange={updateForm} required />
            </label>
            <label>
              Port
              <input type="number" name="dbPort" value={form.dbPort} onChange={updateForm} min="1" />
            </label>
            <label>
              Nama Database
              <input type="text" name="dbName" value={form.dbName} onChange={updateForm} required />
            </label>
            <label>
              Username Database
              <input type="text" name="dbUser" value={form.dbUser} onChange={updateForm} required />
            </label>
            <label>
              Password Database
              <input type="password" name="dbPassword" value={form.dbPassword} onChange={updateForm} required />
            </label>
            <label>
              Master Username (opsional)
              <input
                type="text"
                name="masterDbUser"
                value={form.masterDbUser}
                onChange={updateForm}
                placeholder="Root/akun cPanel"
              />
            </label>
            <label>
              Master Password/Token (opsional)
              <input
                type="password"
                name="masterDbPassword"
                value={form.masterDbPassword}
                onChange={updateForm}
              />
            </label>
          </fieldset>

          <fieldset>
            <legend>Kredensial cPanel (opsional)</legend>
            <label>
              Username cPanel
              <input type="text" name="cpanelUser" value={form.cpanelUser} onChange={updateForm} />
            </label>
            <label>
              Token API cPanel
              <input type="password" name="cpanelToken" value={form.cpanelToken} onChange={updateForm} />
            </label>
          </fieldset>
        </div>

        {errorMessage && <div className="form-alert error">{errorMessage}</div>}
        {successMessage && <div className="form-alert success">{successMessage}</div>}

        <div className="form-actions">
          <button type="submit" disabled={submitting || !isFormValid}>
            {submitting ? 'Memproses...' : 'Mulai Instalasi'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default InstallerPage;
