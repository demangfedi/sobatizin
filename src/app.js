import React, { useEffect, useMemo, useState } from 'react';
import InstallerPage from './pages/install/installer';

function LoadingState() {
  return (
    <div className="app-loading">
      <h2>Loading aplikasi...</h2>
      <p>Mohon tunggu, kami sedang memeriksa status instalasi.</p>
    </div>
  );
}

function LoginPlaceholder() {
  return (
    <div className="login-placeholder">
      <h1>Halaman Login</h1>
      <p>
        Ini adalah placeholder login. Setelah wizard instalasi selesai, aplikasi
        dapat diarahkan ke halaman login sebenarnya.
      </p>
    </div>
  );
}

const INSTALL_STATUS_ENDPOINT = '/api/install/status';
const INSTALL_PREREQUISITES_ENDPOINT = '/api/install/prerequisites';

const fetchJson = async (url, options) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Permintaan tidak dapat diproses');
  }

  return response.json();
};

function App() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [prerequisites, setPrerequisites] = useState([]);
  const [statusError, setStatusError] = useState(null);

  const refreshStatus = useMemo(
    () => async () => {
      setLoading(true);
      setStatusError(null);
      try {
        const status = await fetchJson(INSTALL_STATUS_ENDPOINT);
        setIsInstalled(Boolean(status?.installed));
      } catch (error) {
        console.error('Gagal memuat status instalasi', error);
        setStatusError(error.message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const refreshPrerequisites = useMemo(
    () => async () => {
      try {
        const result = await fetchJson(INSTALL_PREREQUISITES_ENDPOINT);
        setPrerequisites(result?.checks ?? []);
      } catch (error) {
        console.warn('Gagal memuat prasyarat', error);
        setPrerequisites([]);
      }
    },
    []
  );

  useEffect(() => {
    refreshStatus();
    refreshPrerequisites();
  }, [refreshStatus, refreshPrerequisites]);

  if (loading) {
    return <LoadingState />;
  }

  if (statusError) {
    return (
      <div className="status-error">
        <h2>Gagal memuat status instalasi</h2>
        <p>{statusError}</p>
        <button type="button" onClick={refreshStatus}>
          Coba Lagi
        </button>
      </div>
    );
  }

  if (!isInstalled) {
    return (
      <InstallerPage
        onInstalled={refreshStatus}
        prerequisites={prerequisites}
        refreshPrerequisites={refreshPrerequisites}
      />
    );
  }

  return <LoginPlaceholder />;
}

export default App;
