import { useState } from 'react';
import styles from './HistorialMovimientos.module.css';

export default function HistorialMovimientos({ entregas, recolecciones }) {
  const [tabActivo, setTabActivo] = useState('entregas');

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tabActivo === 'entregas' ? styles.tabActivo : ''}`}
          onClick={() => setTabActivo('entregas')}
        >
          ENTREGAS <span className={styles.count}>{entregas.length}</span>
        </button>
        <button
          className={`${styles.tab} ${tabActivo === 'recolecciones' ? styles.tabActivo : ''}`}
          onClick={() => setTabActivo('recolecciones')}
        >
          RECOLECCIONES <span className={styles.count}>{recolecciones.length}</span>
        </button>
      </div>

      {tabActivo === 'entregas' && (
        <div className={styles.tableWrapper}>
          <p className={styles.hint}>Productos entregados desde almacenes a puntos de venta</p>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>FECHA</th>
                <th>PUNTO DE VENTA DESTINO</th>
                <th>ALMACÉN ORIGEN</th>
                <th>PRODUCTOS</th>
                <th>TOTAL KG</th>
                <th>ESTADO</th>
              </tr>
            </thead>
            <tbody>
              {entregas.length > 0 ? [...entregas].reverse().map((e) => (
                <tr key={e.id} className={styles.row}>
                  <td>{e.fecha}</td>
                  <td>{e.puntoVentaNombre}</td>
                  <td>{e.almacenNombre}</td>
                  <td className={styles.tdProductos}>
                    {e.productos.map((p) => (
                      <span key={p.id} className={styles.productoBadge}>{p.nombre} {p.cantidad}KG</span>
                    ))}
                  </td>
                  <td className={styles.totalKg}>{e.productos.reduce((s, p) => s + p.cantidad, 0)} KG</td>
                  <td>
                    <span className={`${styles.badge} ${styles[e.estadoKey]}`}>{e.estado}</span>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={6} className={styles.vacio}>No hay entregas registradas aún</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {tabActivo === 'recolecciones' && (
        <div className={styles.tableWrapper}>
          <p className={styles.hint}>Recolecciones programadas o completadas desde puntos de venta</p>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>FECHA REGISTRO</th>
                <th>PUNTO DE VENTA</th>
                <th>PRODUCTO</th>
                <th>CANTIDAD</th>
                <th>FECHA RECOLECCIÓN</th>
                <th>TRANSPORTISTA</th>
                <th>ESTADO</th>
              </tr>
            </thead>
            <tbody>
              {recolecciones.length > 0 ? [...recolecciones].reverse().map((r) => (
                <tr key={r.id} className={styles.row}>
                  <td>{r.fechaRegistro}</td>
                  <td>{r.puntoVentaNombre}</td>
                  <td>{r.producto}</td>
                  <td>{r.cantidad} KG</td>
                  <td>{r.fecha}</td>
                  <td>{r.transportista || <span className={styles.sinDato}>—</span>}</td>
                  <td>
                    <span className={`${styles.badge} ${styles[r.estadoKey]}`}>{r.estado}</span>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={7} className={styles.vacio}>No hay recolecciones registradas aún</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
