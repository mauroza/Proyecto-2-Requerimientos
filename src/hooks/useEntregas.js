import { useState } from 'react';

const STORAGE_KEY = 'entregas_recolecciones_data';

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
}

export function useEntregas() {
  const [data, setData] = useState(cargar);

  const mutate = (fn) => {
    setData((prev) => {
      const next = fn(prev);
      guardar(next);
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
