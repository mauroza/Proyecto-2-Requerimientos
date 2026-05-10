import { useState } from 'react';
import { useAlmacenes } from '../../hooks/useAlmacenes';
import { useInventarios } from '../../hooks/useInventarios';
import styles from '../../styles/rolePages.module.css';

export default function InventariosVista() {
  const { almacenes } = useAlmacenes();
  const { inventarios } = useInventarios();
  const [almacenSel, setAlmacenSel] = useState(almacenes[0]?.id || null);

  const almacenActual = almacenes.find((a) => a.id === Number(almacenSel)) || almacenes[0];
  const inventario = almacenActual ? (inventarios[almacenActual.id] || []) : [];

  const capacidadTotal = parseInt(almacenActual?.capacidad) || 100;
  const pesoTotal = inventario.reduce((s, i) => s + (i.cantidad || 0), 0);
  const disponibleKG = Math.max(0, capacidadTotal - pesoTotal);
  const porcUsado = capacidadTotal ? Math.round((pesoTotal / capacidadTotal) * 100) : 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>INVENTARIOS</h1>
      </div>
      <p className={styles.subtitulo}>
        Consulta el inventario actual de cada almacén
      </p>
      <hr className={styles.divider} />

      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
        <label style={{ fontSize: 11, fontWeight: 700, color: '#555', letterSpacing: 0.3 }}>
          ALMACÉN:
        </label>
        <select
          value={almacenSel || ''}
          onChange={(e) => setAlmacenSel(e.target.value)}
          style={{ height: 36, border: '1px solid #ddd', borderRadius: 2, padding: '0 12px', fontSize: 13, minWidth: 280 }}
        >
          {almacenes.length === 0 && <option value="">No hay almacenes</option>}
          {almacenes.map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
        </select>
      </div>

      {almacenActual && (
        <>
          <div className={styles.statsRow}>
            <div className={`${styles.statCard} ${styles.statCardBlue}`}>
              <span className={styles.statLabel}>CAPACIDAD TOTAL</span>
              <span className={styles.statVal}>{capacidadTotal} KG</span>
            </div>
            <div className={`${styles.statCard} ${styles.statCardOrange}`}>
              <span className={styles.statLabel}>EN USO</span>
              <span className={styles.statVal}>{pesoTotal} KG ({porcUsado}%)</span>
            </div>
            <div className={`${styles.statCard} ${styles.statCardGreen}`}>
              <span className={styles.statLabel}>DISPONIBLE</span>
              <span className={styles.statVal}>{disponibleKG} KG</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>PRODUCTOS DISTINTOS</span>
              <span className={styles.statVal}>{inventario.length}</span>
            </div>
          </div>

          <div className={styles.infoBanner}>
            📍 {almacenActual.direccion} — Encargado: {almacenActual.encargado || '—'} — Tel: {almacenActual.telefono || '—'}
          </div>

          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', margin: '8px 0 6px' }}>PRODUCTOS EN ESTE ALMACÉN</h3>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>NOMBRE</th>
                  <th>CANTIDAD</th>
                  <th>FECHA INGRESO</th>
                  <th>PROVEEDOR</th>
                  <th>PUNTO DE VENTA</th>
                  <th>ESTADO</th>
                </tr>
              </thead>
              <tbody>
                {inventario.length > 0 ? inventario.map((item) => (
                  <tr key={item.id}>
                    <td><strong>{item.nombre}</strong></td>
                    <td>{item.cantidad} KG</td>
                    <td>{item.fechaIngreso || '—'}</td>
                    <td>{item.proveedor || '—'}</td>
                    <td>{item.puntoVenta || '—'}</td>
                    <td><span className={`${styles.badge} ${styles.recibido}`}>{item.estado || 'EN ALMACEN'}</span></td>
                  </tr>
                )) : (
                  <tr><td colSpan={6} className={styles.vacio}>El almacén está vacío</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!almacenActual && (
        <div className={styles.vacio}>No hay almacenes registrados todavía</div>
      )}
    </div>
  );
}
