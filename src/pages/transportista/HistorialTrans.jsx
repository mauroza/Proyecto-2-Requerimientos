import { usePedidos } from '../../hooks/usePedidos';
import { useEntregas } from '../../hooks/useEntregas';
import styles from '../../styles/rolePages.module.css';

export default function HistorialTrans() {
  const { pedidos } = usePedidos();
  const { entregas, recolecciones } = useEntregas();

  const pedidosCompletados = pedidos.filter((p) => p.estado === 'RECIBIDO');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>HISTORIAL DE TRANSPORTES</h1>
      </div>
      <p className={styles.subtitulo}>
        Registro de pedidos completados, entregas a puntos de venta y recolecciones realizadas
      </p>
      <hr className={styles.divider} />

      <div className={styles.statsRow}>
        <div className={`${styles.statCard} ${styles.statCardGreen}`}>
          <span className={styles.statLabel}>PEDIDOS COMPLETADOS</span>
          <span className={styles.statVal}>{pedidosCompletados.length}</span>
        </div>
        <div className={`${styles.statCard} ${styles.statCardBlue}`}>
          <span className={styles.statLabel}>ENTREGAS A PV</span>
          <span className={styles.statVal}>{entregas.length}</span>
        </div>
        <div className={`${styles.statCard} ${styles.statCardOrange}`}>
          <span className={styles.statLabel}>RECOLECCIONES PV</span>
          <span className={styles.statVal}>{recolecciones.length}</span>
        </div>
      </div>

      <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', margin: '8px 0 6px' }}>PEDIDOS RECIBIDOS EN ALMACENES</h3>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>NOMBRE</th>
              <th>PROVEEDOR</th>
              <th>PRODUCTO</th>
              <th>CANTIDAD</th>
              <th>ALMACÉN</th>
              <th>ESTADO</th>
            </tr>
          </thead>
          <tbody>
            {pedidosCompletados.length > 0 ? [...pedidosCompletados].reverse().map((p) => (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td>{p.proveedor}</td>
                <td>{p.producto}</td>
                <td>{p.cantidad}</td>
                <td>{p.almacen}</td>
                <td><span className={`${styles.badge} ${styles.recibido}`}>{p.estado}</span></td>
              </tr>
            )) : (
              <tr><td colSpan={6} className={styles.vacio}>Aún no hay pedidos completados</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', margin: '24px 0 6px' }}>ENTREGAS A PUNTOS DE VENTA</h3>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>FECHA</th>
              <th>PUNTO DE VENTA</th>
              <th>ALMACÉN ORIGEN</th>
              <th>PRODUCTOS</th>
              <th>TOTAL KG</th>
            </tr>
          </thead>
          <tbody>
            {entregas.length > 0 ? [...entregas].reverse().map((e) => (
              <tr key={e.id}>
                <td>{e.fecha}</td>
                <td>{e.puntoVentaNombre}</td>
                <td>{e.almacenNombre}</td>
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

      <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', margin: '24px 0 6px' }}>RECOLECCIONES DESDE PUNTOS DE VENTA</h3>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>FECHA</th>
              <th>PUNTO DE VENTA</th>
              <th>ALMACÉN DESTINO</th>
              <th>VENDIDO</th>
              <th>SOBRANTE</th>
            </tr>
          </thead>
          <tbody>
            {recolecciones.length > 0 ? [...recolecciones].reverse().map((r) => (
              <tr key={r.id}>
                <td>{r.fecha}</td>
                <td>{r.puntoVentaNombre}</td>
                <td>{r.almacenNombre || '—'}</td>
                <td>{r.totalVendido != null ? `${r.totalVendido} KG` : '—'}</td>
                <td>{r.totalSobrante != null ? `${r.totalSobrante} KG` : '—'}</td>
              </tr>
            )) : (
              <tr><td colSpan={5} className={styles.vacio}>Aún no hay recolecciones registradas</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
