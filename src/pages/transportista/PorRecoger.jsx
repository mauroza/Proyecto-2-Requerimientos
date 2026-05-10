import { useState } from 'react';
import { usePedidos } from '../../hooks/usePedidos';
import styles from '../../styles/rolePages.module.css';

export default function PorRecoger() {
  const { pedidos, actualizarEstado } = usePedidos();
  const [confirmar, setConfirmar] = useState(null);
  const [detalle, setDetalle] = useState(null);

  const pedidosPorRecoger = pedidos.filter((p) => p.estado === 'EN RECOLECCION');

  const handleRecoger = () => {
    actualizarEstado(confirmar.id, 'EN TRANSPORTE');
    setConfirmar(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>PEDIDOS POR RECOGER</h1>
      </div>
      <p className={styles.subtitulo}>
        Pedidos que están listos en el proveedor para que los recojas y los lleves al almacén
      </p>
      <hr className={styles.divider} />

      <div className={styles.statsRow}>
        <div className={`${styles.statCard} ${styles.statCardOrange}`}>
          <span className={styles.statLabel}>POR RECOGER</span>
          <span className={styles.statVal}>{pedidosPorRecoger.length}</span>
        </div>
      </div>

      {pedidosPorRecoger.length > 0 && (
        <div className={styles.alertaBanner}>
          <span className={styles.alertaTexto}>
            🚚 Tienes {pedidosPorRecoger.length} pedido{pedidosPorRecoger.length > 1 ? 's' : ''} esperando ser recogido{pedidosPorRecoger.length > 1 ? 's' : ''}
          </span>
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
              <th>FECHA RECOLECCIÓN</th>
              <th>ESTADO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {pedidosPorRecoger.length > 0 ? pedidosPorRecoger.map((p) => (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td>{p.proveedor}</td>
                <td>{p.producto || '—'}</td>
                <td>{p.cantidad || '—'}</td>
                <td>{p.almacen || '—'}</td>
                <td>{p.fechaRecoleccion || '—'}</td>
                <td><span className={`${styles.badge} ${styles.recoleccion}`}>{p.estado}</span></td>
                <td className={styles.tdAcciones}>
                  <button className={styles.btnInfo} onClick={() => setDetalle(p)}>VER</button>
                  <button className={`${styles.btnAccion} ${styles.btnAccionVerde}`} onClick={() => setConfirmar(p)}>
                    RECOGÍ EL PEDIDO
                  </button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={8} className={styles.vacio}>No hay pedidos por recoger en este momento</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal confirmar */}
      {confirmar && (
        <div className={styles.overlay} onClick={() => setConfirmar(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitulo}>Confirmar recolección</h2>
              <button className={styles.btnCerrarX} onClick={() => setConfirmar(null)}>✕</button>
            </div>
            <hr className={styles.modalDivider} />
            <p style={{ fontSize: 13, color: '#555', lineHeight: 1.6 }}>
              Vas a marcar el pedido <strong>{confirmar.nombre}</strong> como recogido del proveedor <strong>{confirmar.proveedor}</strong>.
              <br /><br />
              El pedido pasará a estado <strong>EN TRANSPORTE</strong> hacia <strong>{confirmar.almacen}</strong>.
            </p>
            <div className={styles.modalBotones}>
              <button className={styles.btnCancelar} onClick={() => setConfirmar(null)}>CANCELAR</button>
              <button className={styles.btnConfirmar} onClick={handleRecoger}>CONFIRMAR</button>
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
                <span className={`${styles.badge} ${styles.recoleccion}`}>{detalle.estado}</span>
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
              <div className={styles.detalleItem}><span className={styles.detalleLabel}>Fecha recolección</span><span className={styles.detalleVal}>{detalle.fechaRecoleccion}</span></div>
              <div className={`${styles.detalleItem} ${styles.campoFull}`}><span className={styles.detalleLabel}>Punto de venta final</span><span className={styles.detalleVal}>{detalle.puntoVenta || '—'}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
