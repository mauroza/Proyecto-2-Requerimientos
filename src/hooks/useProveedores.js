import { useState, useEffect } from 'react';

const STORAGE_KEY = 'proveedores_data';
const SYNC_EVENT = 'sync_proveedores';

const initialProveedores = [
  {
    id: 1,
    nombre: 'COLONO AGROPECUARIO',
    contacto: 'Rafael Solano',
    telefono: '2460-1234',
    email: 'rsolano@colono.cr',
    direccion: 'Ciudad Quesada, San Carlos',
    productosSuministrados: ['Yuca', 'Papaya'],
    estado: 'ACTIVO',
    estadoKey: 'activo',
    notas: 'Proveedor principal zona norte',
    checked: false,
  },
  {
    id: 2,
    nombre: 'AGROSANCARLOS S.A.',
    contacto: 'María Alvarado',
    telefono: '2477-5678',
    email: 'malvarado@agrosancarlos.cr',
    direccion: 'Pital, San Carlos',
    productosSuministrados: ['Piña', 'Banano'],
    estado: 'ACTIVO',
    estadoKey: 'activo',
    notas: '',
    checked: false,
  },
];

function cargar() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : initialProveedores;
  } catch {
    return initialProveedores;
  }
}

function guardar(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event(SYNC_EVENT));
}

export function useProveedores() {
  const [proveedores, setProveedoresState] = useState(cargar);

  useEffect(() => {
    const sync = () => setProveedoresState(cargar());
    window.addEventListener(SYNC_EVENT, sync);
    return () => window.removeEventListener(SYNC_EVENT, sync);
  }, []);

  const set = (fn) => {
    setProveedoresState((prev) => {
      const next = typeof fn === 'function' ? fn(prev) : fn;
      queueMicrotask(() => guardar(next));
      return next;
    });
  };

  const agregarProveedor = (p) => set((prev) => [...prev, { ...p, id: Date.now(), checked: false }]);
  const editarProveedor = (p) => set((prev) => prev.map((x) => (x.id === p.id ? p : x)));
  const eliminarProveedor = (id) => set((prev) => prev.filter((x) => x.id !== id));

  const actualizarEstado = (id, nuevoEstado) => {
    const map = { ACTIVO: 'activo', INACTIVO: 'inactivo', SUSPENDIDO: 'suspendido' };
    set((prev) => prev.map((x) => x.id === id ? { ...x, estado: nuevoEstado, estadoKey: map[nuevoEstado] } : x));
  };

  const toggleCheck = (id) => set((prev) => prev.map((x) => x.id === id ? { ...x, checked: !x.checked } : x));
  const toggleAll = (checked) => set((prev) => prev.map((x) => ({ ...x, checked })));

  return { proveedores, agregarProveedor, editarProveedor, eliminarProveedor, actualizarEstado, toggleCheck, toggleAll };
}
