import { useState } from 'react';

const STORAGE_KEY = 'puntos_venta_data';

const initialPuntosVenta = [
  {
    id: 1,
    nombre: 'PUNTO DE VENTA SAN JOSE',
    direccion: 'Barrio Escalante, San José',
    gerente: 'Juan Pérez',
    telefono: '2222-1111',
    productosNegociados: ['Yuca', 'Piña'],
    fechaDepartamento: '2026-01-15',
    fechaRecogedor: '2026-01-20',
    estado: 'ACTIVO',
    estadoKey: 'activo',
    checked: false
  },
  {
    id: 2,
    nombre: 'PUNTO DE VENTA SAN CARLOS',
    direccion: 'Centro San Carlos',
    gerente: 'María García',
    telefono: '2777-5555',
    productosNegociados: ['Banano', 'Mango'],
    fechaDepartamento: '2026-01-10',
    fechaRecogedor: '2026-01-18',
    estado: 'ACTIVO',
    estadoKey: 'activo',
    checked: false
  },
  {
    id: 3,
    nombre: 'PUNTO DE VENTA HEREDIA',
    direccion: 'Centro Heredia',
    gerente: 'Carlos López',
    telefono: '2261-3333',
    productosNegociados: ['Papaya'],
    fechaDepartamento: '2026-01-12',
    fechaRecogedor: '2026-01-19',
    estado: 'MANTENIMIENTO',
    estadoKey: 'mantenimiento',
    checked: false
  }
];

function cargar() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : initialPuntosVenta;
  } catch {
    return initialPuntosVenta;
  }
}

function guardar(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function usePuntosVenta() {
  const [puntosVenta, setPuntosVentaState] = useState(cargar);

  const setPuntosVentaData = (fn) => {
    setPuntosVentaState((prev) => {
      const siguiente = typeof fn === 'function' ? fn(prev) : fn;
      guardar(siguiente);
      return siguiente;
    });
  };

  const agregarPuntoVenta = (puntoVenta) => {
    setPuntosVentaData((prev) => [...prev, { ...puntoVenta, id: Date.now() }]);
  };

  const editarPuntoVenta = (puntoVenta) => {
    setPuntosVentaData((prev) => prev.map((p) => (p.id === puntoVenta.id ? puntoVenta : p)));
  };

  const eliminarPuntoVenta = (id) => {
    setPuntosVentaData((prev) => prev.filter((p) => p.id !== id));
  };

  const actualizarEstado = (id, nuevoEstado) => {
    const estadoKeyMap = {
      'ACTIVO': 'activo',
      'MANTENIMIENTO': 'mantenimiento',
      'INACTIVO': 'inactivo'
    };
    setPuntosVentaData((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, estado: nuevoEstado, estadoKey: estadoKeyMap[nuevoEstado] }
          : p
      )
    );
  };

  const toggleCheck = (id) => {
    setPuntosVentaData((prev) =>
      prev.map((p) => (p.id === id ? { ...p, checked: !p.checked } : p))
    );
  };

  const toggleAll = (checked) => {
    setPuntosVentaData((prev) => prev.map((p) => ({ ...p, checked })));
  };

  return {
    puntosVenta,
    agregarPuntoVenta,
    editarPuntoVenta,
    eliminarPuntoVenta,
    actualizarEstado,
    toggleCheck,
    toggleAll
  };
}
