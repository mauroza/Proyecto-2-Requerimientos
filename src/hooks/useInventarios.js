import { useState } from 'react';

const STORAGE_KEY = 'inventarios_data';

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
}

export function useInventarios() {
  const [inventarios, setInventariosState] = useState(cargar);

  const setInventarios = (fn) => {
    setInventariosState((prev) => {
      const siguiente = typeof fn === 'function' ? fn(prev) : fn;
      guardar(siguiente);
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
    setInventarios
  };
}
