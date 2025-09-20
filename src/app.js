import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from './components/layout';
import SettingsPage from './pages/admin/settings';
import ServicesPage from './pages/admin/services';
import {
  fetchAdminState,
  onChange as subscribeToApi,
  updateAdminSettings
} from './api';

export const AdminContext = React.createContext({
  settings: null,
  services: [],
  loading: false,
  error: null,
  initialized: false,
  refresh: () => {}
});

function App() {
  const [state, setState] = useState({
    settings: null,
    services: [],
    loading: false,
    error: null,
    initialized: false
  });

  const refresh = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await fetchAdminState();
      setState({
        settings: data.settings,
        services: data.services,
        loading: false,
        error: null,
        initialized: true
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Gagal memuat data admin.',
        initialized: prev.initialized
      }));
    }
  }, []);

  useEffect(() => {
    refresh();
    const unsubscribe = subscribeToApi(() => {
      refresh();
    });
    return () => unsubscribe();
  }, [refresh]);

  const contextValue = useMemo(
    () => ({
      ...state,
      refresh
    }),
    [state, refresh]
  );

  const handleSettingsSave = useCallback(
    async (payload) => {
      await updateAdminSettings(payload);
    },
    []
  );

  return (
    <BrowserRouter>
      <AdminContext.Provider value={contextValue}>
        <Routes>
          <Route path="/admin" element={<AdminLayout /> }>
            <Route index element={<Navigate to="settings" replace />} />
            <Route path="settings" element={<SettingsPage onSave={handleSettingsSave} />} />
            <Route path="services" element={<ServicesPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/admin/settings" replace />} />
        </Routes>
      </AdminContext.Provider>
    </BrowserRouter>
  );
}

export default App;
