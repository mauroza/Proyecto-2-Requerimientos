import { useState } from 'react';

const STORAGE_KEY = 'pedidos_data';

const initialPedidos = [
  {
    id: 1,
    nombre: 'PEDIDO #1 YUCA GUANACASTE DISTRIBUCION',
    fecha: '21-02-26',
    proveedor: 'COLONO',
    estado: 'EN RECOLECCION',
    estadoKey: 'recoleccion',
    checked: false,
    producto: 'Yuca',
    cantidad: '5 kg',
    puntoVenta: 'Punto SJ',
    transportista: 'Mario Fernandez Hernandez',
    fechaRecoleccion: '21-03-2026',
    almacen: 'Almacen San Carlos',
    estadoTexto: 'En recoleccion',
  },
  {
    id: 2,
    nombre: 'PEDIDO #2 PIÑA SAN CARLOS VENTA PITAL',
    fecha: '11-03-26',
    proveedor: 'AGROSANCARLOS',
    estado: 'RECIBIDO',
    estadoKey: 'recibido',
    checked: false,
    producto: 'Piña',
    cantidad: '12 kg',
    puntoVenta: 'Punto Pital',
    transportista: 'Carlos Mora Jimenez',
    fechaRecoleccion: '11-03-2026',
    almacen: 'Almacen Ciudad Quesada',
    estadoTexto: 'Recibido',
  },
];

function cargarPedidos() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : initialPedidos;
  } catch {
    return initialPedidos;
  }
}

function guardarPedidos(pedidos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pedidos));
}

export function usePedidos() {
  const [pedidos, setPedidosState] = useState(cargarPedidos);

  const setPedidos = (fn) => {
    setPedidosState((prev) => {
      const siguiente = typeof fn === 'function' ? fn(prev) : fn;
      guardarPedidos(siguiente);
      return siguiente;
    });
  };

  const agregarPedido = (pedido) => {
    setPedidos((prev) => [...prev, pedido]);
  };

  const actualizarEstado = (id, nuevoEstado) => {
    const estadoKeyMap = {
      'EN RECOLECCION': 'recoleccion',
      'EN TRANSPORTE': 'transporte',
      'RECIBIDO': 'recibido',
      'CANCELADO': 'cancelado',
    };
    setPedidos((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, estado: nuevoEstado, estadoKey: estadoKeyMap[nuevoEstado], estadoTexto: nuevoEstado.charAt(0) + nuevoEstado.slice(1).toLowerCase() }
          : p
      )
    );
  };

  const editarPedido = (pedidoEditado) => {
    setPedidos((prev) =>
      prev.map((p) => (p.id === pedidoEditado.id ? pedidoEditado : p))
    );
  };

  const toggleCheck = (id) => {
    setPedidos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, checked: !p.checked } : p))
    );
  };

  const toggleAll = (checked) => {
    setPedidos((prev) => prev.map((p) => ({ ...p, checked })));
  };

  return { pedidos, agregarPedido, actualizarEstado, editarPedido, toggleCheck, toggleAll };
}