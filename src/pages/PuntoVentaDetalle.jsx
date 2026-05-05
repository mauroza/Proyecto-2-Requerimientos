import styles from './PuntoVentaDetalle.module.css';

export default function PuntoVentaDetalle({ puntoVenta, onVolver }) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>INFORMACION DEL PUNTO DE VENTA</h1>
      <hr className={styles.divider} />

      <div className={styles.tabla}>
        <div className={styles.fila}>
          <span className={styles.label}>Nombre del punto de venta:</span>
          <span className={styles.valor}>{puntoVenta.nombre}</span>
        </div>
        <div className={styles.fila}>
          <span className={styles.label}>Dirección:</span>
          <span className={styles.valor}>{puntoVenta.direccion}</span>
        </div>
        <div className={styles.fila}>
          <span className={styles.label}>Gerente:</span>
          <span className={styles.valor}>{puntoVenta.gerente}</span>
        </div>
        <div className={styles.fila}>
          <span className={styles.label}>Teléfono:</span>
          <span className={styles.valor}>{puntoVenta.telefono}</span>
        </div>
        <div className={styles.fila}>
          <span className={styles.label}>Productos negociados:</span>
          <span className={styles.valor}>{puntoVenta.productosNegociados.join(', ')}</span>
        </div>
        <div className={styles.fila}>
          <span className={styles.label}>Fecha departamento:</span>
          <span className={styles.valor}>{puntoVenta.fechaDepartamento}</span>
        </div>
        <div className={styles.fila}>
          <span className={styles.label}>Fecha recogedor producto:</span>
          <span className={styles.valor}>{puntoVenta.fechaRecogedor}</span>
        </div>
        <div className={styles.fila}>
          <span className={styles.label}>Estado:</span>
          <span className={`${styles.valor} ${styles[puntoVenta.estadoKey]}`}>
            {puntoVenta.estado}
          </span>
        </div>
      </div>

      <button className={styles.btnVolver} onClick={onVolver}>
        VOLVER
      </button>
    </div>
  );
}
