import { useState } from 'react';
import { usePedidos } from '../../hooks/usePedidos';
import { useAlmacenes } from '../../hooks/useAlmacenes';
import { useInventarios } from '../../hooks/useInventarios';
import styles from '../../styles/rolePages.module.css';

export default function PorRecibir() {
  const { pedidos, actualizarEstado } = usePedidos();
  const { almacenes } = useAlmacenes();
  const { agregarProducto } = useInventarios();
  const [confirmar, setConfirmar] = useState(null);
  const [detalle, setDetalle] = useState(null);
  const [filtroAlmacen, setFiltroAlmacen] = useState('');

  const pedidosEnTransporte = pedidos.filter((p) => p.estado === 'EN TRANSPORTE');
  const pedidosFiltrados = filtroAlmacen
    ? pedidosEnTransporte.filter((p) => p.almacen?.toUpperCase() === filtroAlmacen.toUpperCase())
    : pedidosEnTransporte;

  const buscarAlmacenId = (nombre) => {
    const a = almacenes.find((x) => x.nombre?.toUpperCase() === nombre?.toUpperCase());
    return a?.id;
  };

  const handleRecibir = () => {
    const almacenId = buscarAlmacenId(confirmar.almacen);
    if (almacenId) {
      const cantidadKG = parseInt(confirmar.cantidad) || 0;
      agregarProducto(almacenId, {
        id: `pedido-${confirmar.id}`,
        nombre: confirmar.producto || confirmar.nombre,
        cantidad: cantidadKG,
        fechaIngreso: new Date().toLocaleDateString('es-CR').replace(/\//g, '-'),
        puntoVenta: confirmar.puntoVenta || '',
        proveedor: confirmar.proveedor || '',
        fechaEntrega: confirmar.fechaRecoleccion || '',
        estado: 'EN ALMACEN',
        estadoKey: 'enalmacen',
      });
    }
    actualizarEstado(confirmar.id, 'RECIBIDO');
    setConfirmar(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>PEDIDOS POR RECIBIR</h1>
      </div>
      <p className={styles.subtitulo}>
        Pedidos que están llegando a los almacenes. Marca como recibido cuando físicamente llegue el producto.
      </p>
      <hr className={styles.divider} />

      <div className={styles.statsRow}>
        <div className={`${styles.statCard} ${styles.statCardOrange}`}>
          <span className={styles.statLabel}>POR RECIBIR</span>
          <span className={styles.statVal}>{pedidosEnTransporte.length}</span>
        </div>
        <div className={`${styles.statCard} ${styles.statCardBlue}`}>
          <span className={styles.statLabel}>ALMACENES ACTIVOS</span>
          <span className={styles.statVal}>{almacenes.filter((a) => a.estado === 'ACTIVO').length}</span>
        </div>
      </div>

      {pedidosEnTransporte.length > 0 && (
        <div className={styles.alertaBanner}>
          <span className={styles.alertaTexto}>
            🚚 {pedidosEnTransporte.length} pedido{pedidosEnTransporte.length > 1 ? 's' : ''} en camino — listo{pedidosEnTransporte.length > 1 ? 's' : ''} para recibir
          </span>
        </div>
      )}

      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 11, fontWeight: 700, color: '#555', letterSpacing: 0.3, marginRight: 8 }}>
          FILTRAR POR ALMACÉN:
        </label>
        <select
          value={filtroAlmacen}
          onChange={(e) => setFiltroAlmacen(e.target.value)}
          style={{ height: 32, border: '1px solid #ddd', borderRadius: 2, padding: '0 10px', fontSize: 12 }}
        >
          <option value="">Todos los almacenes</option>
          {almacenes.map((a) => <option key={a.id} value={a.nombre}>{a.nombre}</option>)}
        </select>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>NOMBRE DEL PEDIDO</th>
              <th>PROVEEDOR</th>
              <th>PRODUCTO</th>
              <th>CANTIDAD</th>
              <th>ALMACÉN DESTINO</th>
              <th>FECHA</th>
              <th>ESTADO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {pedidosFiltrados.length > 0 ? pedidosFiltrados.map((p) => (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td>{p.proveedor}</td>
                <td>{p.producto || '—'}</td>
                <td>{p.cantidad || '—'}</td>
                <td>{p.almacen || '—'}</td>
                <td>{p.fecha}</td>
                <td><span className={`${styles.badge} ${styles.transporte}`}>{p.estado}</span></td>
                <td className={styles.tdAcciones}>
                  <button className={styles.btnInfo} onClick={() => setDetalle(p)}>VER</button>
                  <button className={`${styles.btnAccion} ${styles.btnAccionVerde}`} onClick={() => setConfirmar(p)}>
                    RECIBIR PRODUCTO
                  </button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={8} className={styles.vacio}>No hay pedidos por recibir</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal confirmar recepción */}
      {confirmar && (
        <div className={styles.overlay} onClick={() => setConfirmar(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitulo}>Confirmar recepción</h2>
              <button className={styles.btnCerrarX} onClick={() => setConfirmar(null)}>✕</button>
            </div>
            <hr className={styles.modalDivider} />
            <p style={{ fontSize: 13, color: '#555', lineHeight: 1.6 }}>
              Confirmar la recepción del pedido <strong>{confirmar.nombre}</strong> en el almacén <strong>{confirmar.almacen}</strong>.
              <br /><br />
              Se agregará al inventario: <strong>{confirmar.producto} ({confirmar.cantidad})</strong> y el pedido pasará a estado <strong>RECIBIDO</strong>.
            </p>
            <div className={styles.modalBotones}>
              <button className={styles.btnCancelar} onClick={() => setConfirmar(null)}>CANCELAR</button>
              <button className={styles.btnConfirmar} onClick={handleRecibir}>CONFIRMAR RECEPCIÓN</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal detalle */}
      {detalle && (
        <div className={styles.overlay} onClick={() => setDetalle(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitulo}>{detalle.nombre}</h2>
                <span className={`${styles.badge} ${styles.transporte}`}>{detalle.estado}</span>
              </div>
              <button className={styles.btnCerrarX} onClick={() => setDetalle(null)}>✕</button>
            </div>
            <hr className={styles.modalDivider} />
            <div className={styles.detalleGrid}>
              <div className={styles.detalleItem}><span className={styles.detalleLabel}>Proveedor</span><span className={styles.detalleVal}>{detalle.proveedor}</span></div>
              <div className={styles.detalleItem}><span className={styles.detalleLabel}>Producto</span><span className={styles.detalleVal}>{detalle.producto}</span></div>
              <div className={styles.detalleItem}><span className={styles.detalleLabel}>Cantidad</span><span className={styles.detalleVal}>{detalle.cantidad}</span></div>
              <div className={styles.detalleItem}><span className={styles.detalleLabel}>Fecha pedido</span><span className={styles.detalleVal}>{detalle.fecha}</span></div>
              <div className={styles.detalleItem}><span className={styles.detalleLabel}>Almacén destino</span><span className={styles.detalleVal}>{detalle.almacen}</span></div>
              <div className={styles.detalleItem}><span className={styles.detalleLabel}>Transportista</span><span className={styles.detalleVal}>{detalle.transportista || '—'}</span></div>
              <div className={`${styles.detalleItem} ${styles.campoFull}`}><span className={styles.detalleLabel}>Punto de venta final</span><span className={styles.detalleVal}>{detalle.puntoVenta || '—'}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
