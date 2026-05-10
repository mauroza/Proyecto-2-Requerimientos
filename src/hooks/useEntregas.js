import { useState, useEffect } from 'react';

const STORAGE_KEY = 'entregas_recolecciones_data';
const SYNC_EVENT = 'sync_entregas';

const initialData = {
  entregas: [],
  recolecciones: []
};

function cargar() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : initialData;
  } catch {
    return initialData;
  }
}

function guardar(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event(SYNC_EVENT));
}

export function useEntregas() {
  const [data, setData] = useState(cargar);

  useEffect(() => {
    const sync = () => setData(cargar());
    window.addEventListener(SYNC_EVENT, sync);
    return () => window.removeEventListener(SYNC_EVENT, sync);
  }, []);

  const mutate = (fn) => {
    setData((prev) => {
      const next = fn(prev);
      queueMicrotask(() => guardar(next));
      return next;
    });
  };

  const agregarEntrega = (entrega) => {
    mutate((prev) => ({
      ...prev,
      entregas: [...prev.entregas, { ...entrega, id: Date.now() }]
    }));
  };

  const agregarRecoleccion = (recoleccion) => {
    mutate((prev) => ({
      ...prev,
      recolecciones: [...prev.recolecciones, { ...recoleccion, id: Date.now() }]
    }));
  };

  return {
    entregas: data.entregas,
    recolecciones: data.recolecciones,
    agregarEntrega,
    agregarRecoleccion
  };
}
