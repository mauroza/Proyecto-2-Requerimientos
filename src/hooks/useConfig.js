import { useState, useEffect } from 'react';

const STORAGE_KEY = 'app_config';

const defaultConfig = {
  nombre: 'Administrador',
  email: 'admin@distribucion.com',
  foto: null,
  darkMode: false,
};

function cargar() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultConfig, ...JSON.parse(raw) } : defaultConfig;
  } catch {
    return defaultConfig;
  }
}

export function useConfig() {
  const [config, setConfigState] = useState(cargar);

  useEffect(() => {
    if (config.darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [config.darkMode]);

  const setConfig = (fn) => {
    setConfigState((prev) => {
      const next = typeof fn === 'function' ? fn(prev) : { ...prev, ...fn };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const actualizarPerfil = (datos) => setConfig((prev) => ({ ...prev, ...datos }));
  const toggleDarkMode = () => setConfig((prev) => ({ ...prev, darkMode: !prev.darkMode }));

  return { config, actualizarPerfil, toggleDarkMode };
}
