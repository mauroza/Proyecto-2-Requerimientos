import { useState, useEffect } from 'react';

const STORAGE_KEY = 'inventarios_data';
const SYNC_EVENT = 'sync_inventarios';

const initialInventariosData = {
  1: [],
  2: [],
  3: [],
};

function cargar() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : initialInventariosData;
  } catch {
    return initialInventariosData;
  }
}

function guardar(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event(SYNC_EVENT));
}

export function useInventarios() {
  const [inventarios, setInventariosState] = useState(cargar);

  useEffect(() => {
    const sync = () => setInventariosState(cargar());
    window.addEventListener(SYNC_EVENT, sync);
    return () => window.removeEventListener(SYNC_EVENT, sync);
  }, []);

  const setInventarios = (fn) => {
    setInventariosState((prev) => {
      const siguiente = typeof fn === 'function' ? fn(prev) : fn;
      queueMicrotask(() => guardar(siguiente));
      return siguiente;
    });
  };

  const agregarProducto = (almacenId, producto) => {
    setInventarios((prev) => ({
      ...prev,
      [almacenId]: [...(prev[almacenId] || []), producto]
    }));
  };

  const eliminarProducto = (almacenId, productoId) => {
    setInventarios((prev) => ({
      ...prev,
      [almacenId]: prev[almacenId].filter((p) => p.id !== productoId)
    }));
  };

  const editarProducto = (almacenId, productoId, datosActualizados) => {
    setInventarios((prev) => ({
      ...prev,
      [almacenId]: prev[almacenId].map((p) =>
        p.id === productoId ? { ...p, ...datosActualizados } : p
      )
    }));
  };

  const devolverProductos = (almacenId, productosADevolver) => {
    setInventarios((prev) => {
      const actual = [...(prev[almacenId] || [])];
      productosADevolver.forEach((p) => {
        if (!p.sobrante || p.sobrante <= 0) return;
        const idx = actual.findIndex((item) => item.id === p.id);
        if (idx >= 0) {
          actual[idx] = { ...actual[idx], cantidad: actual[idx].cantidad + p.sobrante };
        } else {
          actual.push({
            id: p.id,
            nombre: p.nombre,
            cantidad: p.sobrante,
            fechaIngreso: new Date().toLocaleDateString('es-CR').replace(/\//g, '-'),
            proveedor: '',
          });
        }
      });
      return { ...prev, [almacenId]: actual };
    });
  };

  const descontarProductos = (almacenId, productosADescontar) => {
    setInventarios((prev) => {
      const inventarioActual = prev[almacenId] || [];
      const actualizado = inventarioActual.reduce((acc, item) => {
        const descuento = productosADescontar.find((p) => p.id === item.id);
        if (!descuento) {
          acc.push(item);
        } else {
          const nueva = item.cantidad - descuento.cantidad;
          if (nueva > 0) acc.push({ ...item, cantidad: nueva });
        }
        return acc;
      }, []);
      return { ...prev, [almacenId]: actualizado };
    });
  };

  return {
    inventarios,
    agregarProducto,
    eliminarProducto,
    editarProducto,
    descontarProductos,
    devolverProductos,
    setInventarios
  };
}
