import styles from './PuntoVentaDetalle.module.css';

const fmt = (n) =>
  new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(n ?? 0);

export default function PuntoVentaDetalle({ puntoVenta, onVolver }) {
  return (
    <div className={styles.overlay} onClick={onVolver}>
      <div className={styles.modalGrande} onClick={(e) => e.stopPropagation()}>
        <div className={styles.detalleHeader}>
          <div>
            <h2 className={styles.detalleTitulo}>{puntoVenta.nombre}</h2>
            <span className={`${styles.badge} ${styles[puntoVenta.estadoKey]}`}>
              {puntoVenta.estado}
            </span>
          </div>
          <button className={styles.btnCerrarX} onClick={onVolver}>✕</button>
        </div>
        <hr className={styles.modalDivider} />

        <div className={styles.detalleGrid}>
          <div className={styles.detalleItem}>
            <span className={styles.detalleLabel}>Gerente</span>
            <span className={styles.detalleVal}>{puntoVenta.gerente || '—'}</span>
          </div>
          <div className={styles.detalleItem}>
            <span className={styles.detalleLabel}>Teléfono</span>
            <span className={styles.detalleVal}>{puntoVenta.telefono || '—'}</span>
          </div>
          <div className={`${styles.detalleItem} ${styles.campoFull}`}>
            <span className={styles.detalleLabel}>Dirección</span>
            <span className={styles.detalleVal}>{puntoVenta.direccion || '—'}</span>
          </div>
          <div className={`${styles.detalleItem} ${styles.campoFull}`}>
            <span className={styles.detalleLabel}>Productos negociados</span>
            <div className={styles.productosWrap}>
              {puntoVenta.productosNegociados && puntoVenta.productosNegociados.length > 0
                ? puntoVenta.productosNegociados.map((p) => (
                    <span key={p} className={styles.productoBadge}>{p}</span>
                  ))
                : <span className={styles.sinDato}>No especificados</span>}
            </div>
          </div>
          <div className={styles.detalleItem}>
            <span className={styles.detalleLabel}>Fecha departamento</span>
            <span className={styles.detalleVal}>{puntoVenta.fechaDepartamento || '—'}</span>
          </div>
          <div className={styles.detalleItem}>
            <span className={styles.detalleLabel}>Fecha recogedor producto</span>
            <span className={styles.detalleVal}>{puntoVenta.fechaRecogedor || '—'}</span>
          </div>
          {puntoVenta.ganancias != null && (
            <div className={`${styles.detalleItem} ${styles.campoFull}`}>
              <span className={styles.detalleLabel}>Ganancias acumuladas</span>
              <span className={`${styles.detalleVal} ${styles.gananciasVal}`}>
                {fmt(puntoVenta.ganancias)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
