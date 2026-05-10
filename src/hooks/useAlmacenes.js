import { useState, useEffect } from 'react';

const STORAGE_KEY = 'almacenes_data';
const SYNC_EVENT = 'sync_almacenes';

const initialAlmacenes = [
  {
    id: 1,
    nombre: 'ALMACEN GUANACASTE',
    direccion: 'Liberia, Guanacaste',
    disponibilidad: 100,
    transporte: '2 CAMIONES',
    encargado: 'María Fernández',
    telefono: '2665-5678',
    capacidad: '100',
    estado: 'ACTIVO',
    estadoKey: 'activo',
    checked: false
  },
  {
    id: 2,
    nombre: 'ALMACEN SAN JOSE',
    direccion: 'La Sabana, San José',
    disponibilidad: 100,
    transporte: '3 CAMIONES',
    encargado: 'Carlos Rodríguez',
    telefono: '2256-1234',
    capacidad: '100',
    estado: 'ACTIVO',
    estadoKey: 'activo',
    checked: false
  },
  {
    id: 3,
    nombre: 'ALMACEN HEREDIA',
    direccion: 'Heredia centro',
    disponibilidad: 100,
    transporte: '1 CAMION',
    encargado: 'Laura Mora',
    telefono: '2261-7890',
    capacidad: '100',
    estado: 'ACTIVO',
    estadoKey: 'activo',
    checked: false
  }
];

function cargar() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : initialAlmacenes;
  } catch {
    return initialAlmacenes;
  }
}

function guardar(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event(SYNC_EVENT));
}

export function useAlmacenes() {
  const [almacenes, setAlmacenesState] = useState(cargar);

  useEffect(() => {
    const sync = () => setAlmacenesState(cargar());
    window.addEventListener(SYNC_EVENT, sync);
    return () => window.removeEventListener(SYNC_EVENT, sync);
  }, []);

  const setAlmacenes = (fn) => {
    setAlmacenesState((prev) => {
      const siguiente = typeof fn === 'function' ? fn(prev) : fn;
      queueMicrotask(() => guardar(siguiente));
      return siguiente;
    });
  };

  const agregarAlmacen = (almacen) => {
    setAlmacenes((prev) => [...prev, { ...almacen, id: Date.now() }]);
  };

  const editarAlmacen = (almacen) => {
    setAlmacenes((prev) => prev.map((a) => (a.id === almacen.id ? almacen : a)));
  };

  const eliminarAlmacen = (id) => {
    setAlmacenes((prev) => prev.filter((a) => a.id !== id));
  };

  const actualizarEstado = (id, nuevoEstado) => {
    const estadoKeyMap = {
      'ACTIVO': 'activo',
      'MANTENIMIENTO': 'mantenimiento',
      'INACTIVO': 'inactivo'
    };
    setAlmacenes((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, estado: nuevoEstado, estadoKey: estadoKeyMap[nuevoEstado] }
          : a
      )
    );
  };

  const toggleCheck = (id) => {
    setAlmacenes((prev) =>
      prev.map((a) => (a.id === id ? { ...a, checked: !a.checked } : a))
    );
  };

  const toggleAll = (checked) => {
    setAlmacenes((prev) => prev.map((a) => ({ ...a, checked })));
  };

  return { 
    almacenes, 
    agregarAlmacen, 
    editarAlmacen, 
    eliminarAlmacen, 
    actualizarEstado,
    toggleCheck, 
    toggleAll 
  };
}