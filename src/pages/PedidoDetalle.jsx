import styles from './Pedidodetalle.module.css';

export default function PedidoDetalle({ pedido, onVolver }) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>INFORMACION DEL PEDIDO</h1>
      <hr className={styles.divider} />

      <div className={styles.tabla}>
        <div className={styles.fila}>
          <span className={styles.label}>Nombre del pedido:</span>
          <span className={styles.valor}>{pedido.nombre}</span>
        </div>
        <div className={styles.fila}>
          <span className={styles.label}>Producto:</span>
          <span className={styles.valor}>{pedido.producto}</span>
        </div>
        <div className={styles.fila}>
          <span className={styles.label}>Cantidad de productos:</span>
          <span className={styles.valor}>{pedido.cantidad}</span>
        </div>
        <div className={styles.fila}>
          <span className={styles.label}>Proveedor:</span>
          <span className={styles.valor}>{pedido.proveedor}</span>
        </div>
        <div className={styles.fila}>
          <span className={styles.label}>Punto de venta:</span>
          <span className={styles.valor}>{pedido.puntoVenta}</span>
        </div>
        <div className={styles.fila}>
          <span className={styles.label}>Transportista a cargo:</span>
          <span className={styles.valor}>{pedido.transportista}</span>
        </div>
        <div className={styles.fila}>
          <span className={styles.label}>Fecha Recoleccion:</span>
          <span className={styles.valor}>{pedido.fechaRecoleccion}</span>
        </div>
        <div className={styles.fila}>
          <span className={styles.label}>Almacén a entregar:</span>
          <span className={styles.valor}>{pedido.almacen}</span>
        </div>
        <div className={styles.fila}>
          <span className={styles.label}>Estado del pedido:</span>
          <span className={`${styles.valor} ${styles[pedido.estadoKey]}`}>
            {pedido.estadoTexto}
          </span>
        </div>
      </div>

      <button className={styles.btnVolver} onClick={onVolver}>
        VOLVER
      </button>
    </div>
  );
}