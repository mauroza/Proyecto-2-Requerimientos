import { useState } from 'react';
import styles from './Entregar.module.css';

export default function Entregar({ puntosVenta, almacenes, inventarios, onEntregar }) {
  const [paso, setPaso] = useState(1);
  const [puntoVentaId, setPuntoVentaId] = useState('');
  const [almacenId, setAlmacenId] = useState('');
  const [seleccionados, setSeleccionados] = useState({});
  const [errors, setErrors] = useState({});
  const [exito, setExito] = useState(false);

  const puntoVenta = puntosVenta.find((p) => p.id === Number(puntoVentaId));
  const almacen = almacenes.find((a) => a.id === Number(almacenId));
  const inventarioAlmacen = almacenId ? (inventarios[Number(almacenId)] || []) : [];

  const validarPaso1 = () => {
    const errs = {};
    if (!puntoVentaId) errs.puntoVenta = 'Seleccione un punto de venta';
    if (!almacenId) errs.almacen = 'Seleccione un almacén';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validarPaso2 = () => {
    const errs = {};
    if (Object.keys(seleccionados).length === 0) {
      errs.productos = 'Seleccione al menos un producto';
    }
    Object.entries(seleccionados).forEach(([id, cantidad]) => {
      const item = inventarioAlmacen.find((i) => i.id === id);
      if (!item) return;
      if (!cantidad || cantidad <= 0) {
        errs[`cant_${id}`] = 'Cantidad debe ser mayor a 0';
      } else if (cantidad > item.cantidad) {
        errs[`cant_${id}`] = `Máximo disponible: ${item.cantidad} KG`;
      }
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const toggleProducto = (itemId) => {
    setErrors({});
    setSeleccionados((prev) => {
      if (prev[itemId] !== undefined) {
        const { [itemId]: _, ...resto } = prev;
        return resto;
      }
      const item = inventarioAlmacen.find((i) => i.id === itemId);
      return { ...prev, [itemId]: item ? item.cantidad : 1 };
    });
  };

  const setCantidad = (itemId, valor) => {
    setSeleccionados((prev) => ({ ...prev, [itemId]: Number(valor) }));
    setErrors((prev) => { const { [`cant_${itemId}`]: _, ...resto } = prev; return resto; });
  };

  const handleConfirmar = () => {
    const productosEntrega = Object.entries(seleccionados).map(([id, cantidad]) => {
      const item = inventarioAlmacen.find((i) => i.id === id);
      return { id, nombre: item.nombre, cantidad };
    });
    onEntregar({
      puntoVentaId: Number(puntoVentaId),
      puntoVentaNombre: puntoVenta.nombre,
      almacenId: Number(almacenId),
      almacenNombre: almacen.nombre,
      productos: productosEntrega,
      fecha: new Date().toLocaleDateString('es-CR').replace(/\//g, '-'),
      estado: 'ENTREGADO',
      estadoKey: 'entregado'
    });
    setExito(true);
    setTimeout(() => {
      setExito(false);
      setPaso(1);
      setPuntoVentaId('');
      setAlmacenId('');
      setSeleccionados({});
    }, 2500);
  };

  if (exito) {
    return (
      <div className={styles.exitoContainer}>
        <div className={styles.exitoBox}>
          <div className={styles.exitoIcon}>✓</div>
          <h2 className={styles.exitoTitulo}>¡Entrega registrada!</h2>
          <p className={styles.exitoSub}>Los productos fueron descontados del inventario del almacén.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Progress bar */}
      <div className={styles.progressBar}>
        {[
          { n: 1, label: 'SELECCIÓN' },
          { n: 2, label: 'PRODUCTOS' },
          { n: 3, label: 'CONFIRMAR' }
        ].map(({ n, label }) => (
          <div key={n} className={styles.progressStep}>
            <div className={`${styles.stepCircle} ${paso >= n ? styles.stepActivo : ''} ${paso > n ? styles.stepDone : ''}`}>
              {paso > n ? '✓' : n}
            </div>
            <span className={`${styles.stepLabel} ${paso >= n ? styles.stepLabelActivo : ''}`}>{label}</span>
            {n < 3 && <div className={`${styles.stepLine} ${paso > n ? styles.stepLineDone : ''}`} />}
          </div>
        ))}
      </div>

      {/* Paso 1: Seleccionar destino y origen */}
      {paso === 1 && (
        <div className={styles.stepContent}>
          <h2 className={styles.stepTitle}>Seleccionar destino y origen</h2>
          <div className={styles.formGrid}>
            <div className={styles.campo}>
              <label className={styles.label}>PUNTO DE VENTA DESTINO</label>
              <select
                className={`${styles.select} ${errors.puntoVenta ? styles.inputError : ''}`}
                value={puntoVentaId}
                onChange={(e) => { setPuntoVentaId(e.target.value); setErrors({}); }}
              >
                <option value="">— Seleccione un punto de venta —</option>
                {puntosVenta.map((p) => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
              {errors.puntoVenta && <span className={styles.errorMsg}>{errors.puntoVenta}</span>}
            </div>
            <div className={styles.campo}>
              <label className={styles.label}>ALMACÉN ORIGEN</label>
              <select
                className={`${styles.select} ${errors.almacen ? styles.inputError : ''}`}
                value={almacenId}
                onChange={(e) => { setAlmacenId(e.target.value); setSeleccionados({}); setErrors({}); }}
              >
                <option value="">— Seleccione un almacén —</option>
                {almacenes.map((a) => (
                  <option key={a.id} value={a.id}>{a.nombre}</option>
                ))}
              </select>
              {errors.almacen && <span className={styles.errorMsg}>{errors.almacen}</span>}
            </div>
          </div>

          {puntoVenta && almacen && (
            <div className={styles.resumenSeleccion}>
              <div className={styles.resumenRow}>
                <div className={styles.resumenItem}>
                  <span className={styles.resumenLabel}>Destino</span>
                  <span className={styles.resumenVal}>{puntoVenta.nombre}</span>
                  <span className={styles.resumenSub}>{puntoVenta.direccion}</span>
                </div>
                <div className={styles.resumenFlecha}>→</div>
                <div className={styles.resumenItem}>
                  <span className={styles.resumenLabel}>Origen</span>
                  <span className={styles.resumenVal}>{almacen.nombre}</span>
                  <span className={styles.resumenSub}>Transporte: {almacen.transporte}</span>
                </div>
              </div>
            </div>
          )}

          <div className={styles.botones}>
            <button className={styles.btnSiguiente} onClick={() => { if (validarPaso1()) setPaso(2); }}>
              SIGUIENTE →
            </button>
          </div>
        </div>
      )}

      {/* Paso 2: Seleccionar productos */}
      {paso === 2 && (
        <div className={styles.stepContent}>
          <h2 className={styles.stepTitle}>Seleccionar productos a entregar</h2>
          <p className={styles.hint}>Almacén: <strong>{almacen?.nombre}</strong> — Marque los productos y ajuste la cantidad a entregar</p>
          {errors.productos && <div className={styles.errorBox}>{errors.productos}</div>}

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.thCheck}></th>
                  <th>PRODUCTO</th>
                  <th>DISPONIBLE</th>
                  <th>CANTIDAD A ENTREGAR (KG)</th>
                  <th>FECHA INGRESO</th>
                  <th>PROVEEDOR</th>
                </tr>
              </thead>
              <tbody>
                {inventarioAlmacen.length > 0 ? inventarioAlmacen.map((item) => {
                  const checked = seleccionados[item.id] !== undefined;
                  return (
                    <tr key={item.id} className={`${styles.row} ${checked ? styles.rowSeleccionada : ''}`}>
                      <td className={styles.tdCheck}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleProducto(item.id)}
                          className={styles.checkbox}
                        />
                      </td>
                      <td className={styles.tdProducto}>{item.nombre}</td>
                      <td>{item.cantidad} KG</td>
                      <td>
                        {checked ? (
                          <div className={styles.inputCantidadWrap}>
                            <input
                              type="number"
                              min={1}
                              max={item.cantidad}
                              value={seleccionados[item.id]}
                              onChange={(e) => setCantidad(item.id, e.target.value)}
                              className={`${styles.inputCantidad} ${errors[`cant_${item.id}`] ? styles.inputError : ''}`}
                            />
                            {errors[`cant_${item.id}`] && (
                              <span className={styles.errorMsg}>{errors[`cant_${item.id}`]}</span>
                            )}
                          </div>
                        ) : (
                          <span className={styles.sinSeleccionar}>—</span>
                        )}
                      </td>
                      <td>{item.fechaIngreso}</td>
                      <td>{item.proveedor || '—'}</td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={6} className={styles.vacio}>No hay productos en el inventario de este almacén</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className={styles.botones}>
            <button className={styles.btnVolver} onClick={() => setPaso(1)}>← VOLVER</button>
            <button className={styles.btnSiguiente} onClick={() => { if (validarPaso2()) setPaso(3); }}>
              SIGUIENTE →
            </button>
          </div>
        </div>
      )}

      {/* Paso 3: Confirmar */}
      {paso === 3 && (
        <div className={styles.stepContent}>
          <h2 className={styles.stepTitle}>Confirmar entrega</h2>
          <div className={styles.resumenEntrega}>
            <div className={styles.resumenEntregaHeader}>
              <div className={styles.resumenEntregaInfo}>
                <div className={styles.resumenEntregaDato}>
                  <span className={styles.resumenLabel}>DESTINO</span>
                  <span className={styles.resumenVal}>{puntoVenta?.nombre}</span>
                </div>
                <div className={styles.resumenEntregaDato}>
                  <span className={styles.resumenLabel}>ALMACÉN ORIGEN</span>
                  <span className={styles.resumenVal}>{almacen?.nombre}</span>
                </div>
                <div className={styles.resumenEntregaDato}>
                  <span className={styles.resumenLabel}>FECHA</span>
                  <span className={styles.resumenVal}>{new Date().toLocaleDateString('es-CR')}</span>
                </div>
              </div>
            </div>

            <h4 className={styles.productosTitulo}>PRODUCTOS A ENTREGAR</h4>
            <table className={styles.tableResumen}>
              <thead>
                <tr>
                  <th>PRODUCTO</th>
                  <th>CANTIDAD A ENTREGAR</th>
                  <th>DISPONIBLE EN ALMACÉN</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(seleccionados).map(([id, cantidad]) => {
                  const item = inventarioAlmacen.find((i) => i.id === id);
                  return (
                    <tr key={id}>
                      <td>{item?.nombre}</td>
                      <td className={styles.cantidadEntrega}>{cantidad} KG</td>
                      <td className={styles.cantidadResto}>{item ? item.cantidad - cantidad : 0} KG quedará</td>
                    </tr>
                  );
                })}
                <tr className={styles.totalRow}>
                  <td><strong>TOTAL</strong></td>
                  <td><strong>{Object.values(seleccionados).reduce((s, c) => s + c, 0)} KG</strong></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.botones}>
            <button className={styles.btnVolver} onClick={() => setPaso(2)}>← VOLVER</button>
            <button className={styles.btnConfirmar} onClick={handleConfirmar}>
              CONFIRMAR ENTREGA
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
