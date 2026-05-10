import { useState } from 'react';
import { usePedidos } from '../../hooks/usePedidos';
import styles from '../../styles/rolePages.module.css';

export default function EnRuta() {
  const { pedidos } = usePedidos();
  const [detalle, setDetalle] = useState(null);

  const enRuta = pedidos.filter((p) => p.estado === 'EN TRANSPORTE');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>EN RUTA</h1>
      </div>
      <p className={styles.subtitulo}>
        Pedidos que ya recogiste y están en camino hacia los almacenes. El almacenista los marcará como recibidos cuando lleguen.
      </p>
      <hr className={styles.divider} />

      <div className={styles.statsRow}>
        <div className={`${styles.statCard} ${styles.statCardBlue}`}>
          <span className={styles.statLabel}>EN RUTA</span>
          <span className={styles.statVal}>{enRuta.length}</span>
        </div>
      </div>

      {enRuta.length > 0 && (
        <div className={styles.infoBanner}>
          📦 {enRuta.length} pedido{enRuta.length > 1 ? 's' : ''} viajando hacia los almacenes
        </div>
      )}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>NOMBRE DEL PEDIDO</th>
              <th>PROVEEDOR</th>
              <th>PRODUCTO</th>
              <th>CANTIDAD</th>
              <th>ALMACÉN DESTINO</th>
              <th>ESTADO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {enRuta.length > 0 ? enRuta.map((p) => (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td>{p.proveedor}</td>
                <td>{p.producto || '—'}</td>
                <td>{p.cantidad || '—'}</td>
                <td>{p.almacen || '—'}</td>
                <td><span className={`${styles.badge} ${styles.transporte}`}>{p.estado}</span></td>
                <td className={styles.tdAcciones}>
                  <button className={styles.btnInfo} onClick={() => setDetalle(p)}>VER DETALLE</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={7} className={styles.vacio}>No hay pedidos en ruta</td></tr>
            )}
          </tbody>
        </table>
      </div>

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
              <div className={styles.detalleItem}><span className={styles.detalleLabel}>Fecha</span><span className={styles.detalleVal}>{detalle.fecha}</span></div>
              <div className={styles.detalleItem}><span className={styles.detalleLabel}>Almacén destino</span><span className={styles.detalleVal}>{detalle.almacen}</span></div>
              <div className={styles.detalleItem}><span className={styles.detalleLabel}>Punto de venta final</span><span className={styles.detalleVal}>{detalle.puntoVenta || '—'}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
