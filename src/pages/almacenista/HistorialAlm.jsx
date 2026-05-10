import { usePedidos } from '../../hooks/usePedidos';
import { useAlmacenes } from '../../hooks/useAlmacenes';
import { useEntregas } from '../../hooks/useEntregas';
import styles from '../../styles/rolePages.module.css';

export default function HistorialAlm() {
  const { pedidos } = usePedidos();
  const { almacenes } = useAlmacenes();
  const { entregas } = useEntregas();

  const pedidosRecibidos = pedidos.filter((p) => p.estado === 'RECIBIDO');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>HISTORIAL DE RECEPCIONES</h1>
      </div>
      <p className={styles.subtitulo}>
        Pedidos que han sido recibidos en los almacenes y entregas realizadas a puntos de venta
      </p>
      <hr className={styles.divider} />

      <div className={styles.statsRow}>
        <div className={`${styles.statCard} ${styles.statCardGreen}`}>
          <span className={styles.statLabel}>PEDIDOS RECIBIDOS</span>
          <span className={styles.statVal}>{pedidosRecibidos.length}</span>
        </div>
        <div className={`${styles.statCard} ${styles.statCardBlue}`}>
          <span className={styles.statLabel}>ENTREGAS REALIZADAS</span>
          <span className={styles.statVal}>{entregas.length}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>ALMACENES</span>
          <span className={styles.statVal}>{almacenes.length}</span>
        </div>
      </div>

      <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', margin: '8px 0 6px' }}>PEDIDOS RECIBIDOS</h3>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>NOMBRE</th>
              <th>PROVEEDOR</th>
              <th>PRODUCTO</th>
              <th>CANTIDAD</th>
              <th>ALMACÉN</th>
              <th>FECHA</th>
              <th>ESTADO</th>
            </tr>
          </thead>
          <tbody>
            {pedidosRecibidos.length > 0 ? [...pedidosRecibidos].reverse().map((p) => (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td>{p.proveedor}</td>
                <td>{p.producto}</td>
                <td>{p.cantidad}</td>
                <td>{p.almacen}</td>
                <td>{p.fecha}</td>
                <td><span className={`${styles.badge} ${styles.recibido}`}>{p.estado}</span></td>
              </tr>
            )) : (
              <tr><td colSpan={7} className={styles.vacio}>Aún no hay pedidos recibidos</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', margin: '24px 0 6px' }}>ENTREGAS DESDE ALMACENES</h3>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>FECHA</th>
              <th>ALMACÉN ORIGEN</th>
              <th>PUNTO DE VENTA DESTINO</th>
              <th>PRODUCTOS</th>
              <th>TOTAL KG</th>
            </tr>
          </thead>
          <tbody>
            {entregas.length > 0 ? [...entregas].reverse().map((e) => (
              <tr key={e.id}>
                <td>{e.fecha}</td>
                <td>{e.almacenNombre}</td>
                <td>{e.puntoVentaNombre}</td>
                <td>
                  <div className={styles.productosWrap}>
                    {e.productos.map((p) => (
                      <span key={p.id} className={styles.productoBadge}>{p.nombre} {p.cantidad}KG</span>
                    ))}
                  </div>
                </td>
                <td>{e.productos.reduce((s, p) => s + p.cantidad, 0)} KG</td>
              </tr>
            )) : (
              <tr><td colSpan={5} className={styles.vacio}>Aún no hay entregas registradas</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
