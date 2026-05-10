import { useState, useEffect } from 'react';

const STORAGE_KEY = 'transporte_data';
const SYNC_EVENT = 'sync_transporte';

const initialTransporte = [
  {
    id: 1,
    nombre: 'Mario Fernández Hernández',
    tipo: 'CHOFER',
    telefono: '8855-1122',
    vehiculo: 'Camión Mitsubishi Canter',
    placa: 'CL-12345',
    capacidadKG: 3000,
    estado: 'DISPONIBLE',
    estadoKey: 'disponible',
    notas: '',
    checked: false,
  },
  {
    id: 2,
    nombre: 'Carlos Mora Jiménez',
    tipo: 'CHOFER',
    telefono: '8744-3344',
    vehiculo: 'Camión Hino 300',
    placa: 'SJ-98765',
    capacidadKG: 5000,
    estado: 'DISPONIBLE',
    estadoKey: 'disponible',
    notas: '',
    checked: false,
  },
  {
    id: 3,
    nombre: 'TRANSPORTES DEL NORTE S.A.',
    tipo: 'EMPRESA',
    telefono: '2460-9900',
    vehiculo: '3 Camiones Freightliner',
    placa: 'Flota',
    capacidadKG: 15000,
    estado: 'DISPONIBLE',
    estadoKey: 'disponible',
    notas: 'Empresa con contrato anual',
    checked: false,
  },
];

function cargar() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : initialTransporte;
  } catch {
    return initialTransporte;
  }
}

function guardar(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event(SYNC_EVENT));
}

export function useTransporte() {
  const [transportes, setTransportesState] = useState(cargar);

  useEffect(() => {
    const sync = () => setTransportesState(cargar());
    window.addEventListener(SYNC_EVENT, sync);
    return () => window.removeEventListener(SYNC_EVENT, sync);
  }, []);

  const set = (fn) => {
    setTransportesState((prev) => {
      const next = typeof fn === 'function' ? fn(prev) : fn;
      queueMicrotask(() => guardar(next));
      return next;
    });
  };

  const agregarTransporte = (t) => set((prev) => [...prev, { ...t, id: Date.now(), checked: false }]);
  const editarTransporte = (t) => set((prev) => prev.map((x) => (x.id === t.id ? t : x)));
  const eliminarTransporte = (id) => set((prev) => prev.filter((x) => x.id !== id));

  const actualizarEstado = (id, nuevoEstado) => {
    const map = { DISPONIBLE: 'disponible', 'EN RUTA': 'enruta', 'MANTENIMIENTO': 'mantenimiento', INACTIVO: 'inactivo' };
    set((prev) => prev.map((x) => x.id === id ? { ...x, estado: nuevoEstado, estadoKey: map[nuevoEstado] ?? 'disponible' } : x));
  };

  const toggleCheck = (id) => set((prev) => prev.map((x) => x.id === id ? { ...x, checked: !x.checked } : x));
  const toggleAll = (checked) => set((prev) => prev.map((x) => ({ ...x, checked })));

  return { transportes, agregarTransporte, editarTransporte, eliminarTransporte, actualizarEstado, toggleCheck, toggleAll };
}
