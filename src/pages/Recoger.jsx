import { useState } from 'react';
import styles from './Recoger.module.css';

const fmt = (n) =>
  new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(n);

export default function Recoger({ puntosVenta, entregas, onRecoger }) {
  const [puntoVentaId, setPuntoVentaId] = useState('');
  const [entregaId, setEntregaId] = useState('');
  const [vendido, setVendido] = useState({});
  const [ganancias, setGanancias] = useState('');
  const [fecha, setFecha] = useState('');
  const [transportista, setTransportista] = useState('');
  const [notas, setNotas] = useState('');
  const [errors, setErrors] = useState({});
  const [exito, setExito] = useState(false);

  const puntoVenta = puntosVenta.find((p) => p.id === Number(puntoVentaId));
  const entregasDelPunto = (entregas ?? []).filter((e) => e.puntoVentaId === Number(puntoVentaId));
  const entregaSeleccionada = entregasDelPunto.find((e) => e.id === Number(entregaId));

  const handleSelectPunto = (id) => {
    setPuntoVentaId(id);
    setEntregaId('');
    setVendido({});
    setErrors({});
  };

  const handleSelectEntrega = (id) => {
    setEntregaId(id);
    setErrors({});
    if (id) {
      const ent = entregasDelPunto.find((e) => e.id === Number(id));
      if (ent) {
        const init = {};
        ent.productos.forEach((p) => { init[p.id] = p.cantidad; });
        setVendido(init);
      }
    } else {
      setVendido({});
    }
  };

  const setVendidoProducto = (id, valor) => {
    setVendido((prev) => ({ ...prev, [id]: Number(valor) }));
    setErrors((prev) => { const { [`v_${id}`]: _, ...r } = prev; return r; });
  };

  const validar = () => {
    const e = {};
    if (!puntoVentaId) e.puntoVenta = 'Seleccione un punto de venta';
    if (!entregaId) e.entrega = 'Seleccione una entrega';
    if (entregaSeleccionada) {
      entregaSeleccionada.productos.forEach((p) => {
        const v = vendido[p.id];
        if (v === undefined || v === null || String(v) === '') e[`v_${p.id}`] = 'Ingrese un valor (puede ser 0)';
        else if (v < 0) e[`v_${p.id}`] = 'No puede ser negativo';
        else if (v > p.cantidad) e[`v_${p.id}`] = `Máximo ${p.cantidad} KG`;
      });
    }
    if (ganancias === '' || ganancias === null || ganancias === undefined) e.ganancias = 'Ingrese las ganancias';
    else if (Number(ganancias) < 0) e.ganancias = 'Debe ser ≥ 0';
    if (!fecha) e.fecha = 'Seleccione una fecha';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleConfirmar = () => {
    if (!validar()) return;

    const productosRecolectados = entregaSeleccionada.productos.map((p) => ({
      id: p.id,
      nombre: p.nombre,
      entregado: p.cantidad,
      vendido: vendido[p.id] ?? 0,
      sobrante: p.cantidad - (vendido[p.id] ?? 0),
    }));

    const totalEntregado = productosRecolectados.reduce((s, p) => s + p.entregado, 0);
    const totalVendido = productosRecolectados.reduce((s, p) => s + p.vendido, 0);
    const totalSobrante = productosRecolectados.reduce((s, p) => s + p.sobrante, 0);

    onRecoger({
      puntoVentaId: Number(puntoVentaId),
      puntoVentaNombre: puntoVenta.nombre,
      entregaId: Number(entregaId),
      almacenNombre: entregaSeleccionada.almacenNombre,
      productos: productosRecolectados,
      totalEntregado,
      totalVendido,
      totalSobrante,
      ganancias: Number(ganancias),
      fecha,
      transportista,
      notas,
      estado: 'COMPLETADA',
      estadoKey: 'completada',
      fechaRegistro: new Date().toLocaleDateString('es-CR').replace(/\//g, '-'),
    });

    setExito(true);
    setTimeout(() => {
      setExito(false);
      setPuntoVentaId('');
      setEntregaId('');
      setVendido({});
      setGanancias('');
      setFecha('');
      setTransportista('');
      setNotas('');
    }, 2500);
  };

  if (exito) {
    return (
      <div className={styles.exitoContainer}>
        <div className={styles.exitoBox}>
          <div className={styles.exitoIcon}>✓</div>
          <h2 className={styles.exitoTitulo}>¡Recolección registrada!</h2>
          <p className={styles.exitoSub}>La recolección fue guardada y aparecerá en el historial.</p>
        </div>
      </div>
    );
  }

  const totalEntregado = entregaSeleccionada
    ? entregaSeleccionada.productos.reduce((s, p) => s + p.cantidad, 0)
    : 0;
  const totalVendido = entregaSeleccionada
    ? entregaSeleccionada.productos.reduce((s, p) => s + (vendido[p.id] ?? p.cantidad), 0)
    : 0;
  const totalSobrante = totalEntregado - totalVendido;

  return (
    <div className={styles.container}>
      <h2 className={styles.titulo}>REGISTRAR RECOLECCIÓN</h2>
      <p className={styles.subtitulo}>
        Seleccione la entrega, registre cuánto se vendió y las ganancias obtenidas
      </p>

      <div className={styles.formCard}>

        {/* 1. Punto de venta */}
        <div className={styles.seccion}>
          <div className={styles.seccionTitulo}>1. PUNTO DE VENTA</div>
          <div className={styles.campo}>
            <label className={styles.label}>PUNTO DE VENTA *</label>
            <select
              className={`${styles.select} ${errors.puntoVenta ? styles.inputError : ''}`}
              value={puntoVentaId}
              onChange={(e) => handleSelectPunto(e.target.value)}
            >
              <option value="">— Seleccione un punto de venta —</option>
              {puntosVenta.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
            {errors.puntoVenta && <span className={styles.errorMsg}>{errors.puntoVenta}</span>}
          </div>
        </div>

        {/* 2. Seleccionar entrega */}
        {puntoVentaId && (
          <div className={styles.seccion}>
            <div className={styles.seccionTitulo}>2. SELECCIONAR ENTREGA A RECOGER</div>
            {entregasDelPunto.length === 0 ? (
              <div className={styles.sinEntregas}>
                No hay entregas registradas para este punto de venta. Primero realice una entrega desde el tab ENTREGAR.
              </div>
            ) : (
              <div className={styles.entregasGrid}>
                {entregasDelPunto.map((e) => (
                  <div
                    key={e.id}
                    className={`${styles.entregaCard} ${entregaId === String(e.id) ? styles.entregaCardSeleccionada : ''}`}
                    onClick={() => handleSelectEntrega(String(e.id))}
                  >
                    <div className={styles.entregaCardHeader}>
                      <span className={styles.entregaFecha}>{e.fecha}</span>
                      <span className={styles.entregaAlmacen}>{e.almacenNombre}</span>
                    </div>
                    <div className={styles.entregaProductos}>
                      {e.productos.map((p) => (
                        <span key={p.id} className={styles.entregaProductoBadge}>
                          {p.nombre} {p.cantidad}KG
                        </span>
                      ))}
                    </div>
                    <div className={styles.entregaTotal}>
                      {e.productos.reduce((s, p) => s + p.cantidad, 0)} KG total entregado
                    </div>
                  </div>
                ))}
              </div>
            )}
            {errors.entrega && <span className={styles.errorMsg}>{errors.entrega}</span>}
          </div>
        )}

        {/* 3. ¿Cuánto se vendió? */}
        {entregaSeleccionada && (
          <div className={styles.seccion}>
            <div className={styles.seccionTitulo}>3. ¿CUÁNTO SE VENDIÓ?</div>
            <p className={styles.seccionHint}>
              Ingrese la cantidad vendida por producto. El sobrante se calcula automáticamente.
            </p>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>PRODUCTO</th>
                    <th>FUE ENTREGADO</th>
                    <th>CANTIDAD VENDIDA (KG)</th>
                    <th>SOBRANTE A RECOGER</th>
                  </tr>
                </thead>
                <tbody>
                  {entregaSeleccionada.productos.map((p) => {
                    const v = vendido[p.id] ?? p.cantidad;
                    const sob = p.cantidad - v;
                    return (
                      <tr key={p.id}>
                        <td className={styles.tdProducto}>{p.nombre}</td>
                        <td>{p.cantidad} KG</td>
                        <td>
                          <div className={styles.inputWrap}>
                            <input
                              type="number"
                              min={0}
                              max={p.cantidad}
                              value={v}
                              onChange={(e) => setVendidoProducto(p.id, e.target.value)}
                              className={`${styles.inputCantidad} ${errors[`v_${p.id}`] ? styles.inputError : ''}`}
                            />
                            {errors[`v_${p.id}`] && (
                              <span className={styles.errorMsg}>{errors[`v_${p.id}`]}</span>
                            )}
                          </div>
                        </td>
                        <td className={sob > 0 ? styles.sobrantePos : styles.sobranteZero}>
                          {sob} KG
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. Ganancias y fecha */}
        {entregaSeleccionada && (
          <div className={styles.seccion}>
            <div className={styles.seccionTitulo}>4. GANANCIAS Y DATOS DE RECOLECCIÓN</div>

            {/* Resumen automático */}
            <div className={styles.resumenBox}>
              <div className={styles.resumenItem}>
                <span className={styles.resumenLabel}>Total entregado</span>
                <span className={styles.resumenVal}>{totalEntregado} KG</span>
              </div>
              <div className={styles.resumenItem}>
                <span className={styles.resumenLabel}>Total vendido</span>
                <span className={`${styles.resumenVal} ${styles.resumenVendido}`}>{totalVendido} KG</span>
              </div>
              <div className={styles.resumenItem}>
                <span className={styles.resumenLabel}>Sobrante a recoger</span>
                <span className={`${styles.resumenVal} ${totalSobrante > 0 ? styles.resumenSobrante : ''}`}>
                  {totalSobrante} KG
                </span>
              </div>
              {ganancias !== '' && !isNaN(Number(ganancias)) && (
                <div className={styles.resumenItem}>
                  <span className={styles.resumenLabel}>Ganancias</span>
                  <span className={`${styles.resumenVal} ${styles.resumenGanancias}`}>
                    {fmt(Number(ganancias))}
                  </span>
                </div>
              )}
            </div>

            <div className={styles.formGrid}>
              <div className={styles.campo}>
                <label className={styles.label}>GANANCIAS EN COLONES (₡) *</label>
                <input
                  type="number"
                  min={0}
                  className={`${styles.input} ${errors.ganancias ? styles.inputError : ''}`}
                  value={ganancias}
                  onChange={(e) => { setGanancias(e.target.value); setErrors((p) => { const { ganancias: _, ...r } = p; return r; }); }}
                  placeholder="Ej: 12000"
                />
                {errors.ganancias && <span className={styles.errorMsg}>{errors.ganancias}</span>}
              </div>
              <div className={styles.campo}>
                <label className={styles.label}>FECHA DE RECOLECCIÓN *</label>
                <input
                  type="date"
                  className={`${styles.input} ${errors.fecha ? styles.inputError : ''}`}
                  value={fecha}
                  onChange={(e) => { setFecha(e.target.value); setErrors((p) => { const { fecha: _, ...r } = p; return r; }); }}
                />
                {errors.fecha && <span className={styles.errorMsg}>{errors.fecha}</span>}
              </div>
              <div className={styles.campo}>
                <label className={styles.label}>TRANSPORTISTA (OPCIONAL)</label>
                <input
                  type="text"
                  className={styles.input}
                  value={transportista}
                  onChange={(e) => setTransportista(e.target.value)}
                  placeholder="Nombre del transportista"
                />
              </div>
              <div className={`${styles.campo} ${styles.campoFull}`}>
                <label className={styles.label}>NOTAS (OPCIONAL)</label>
                <input
                  type="text"
                  className={styles.input}
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Observaciones adicionales"
                />
              </div>
            </div>
          </div>
        )}

        {entregaSeleccionada && (
          <div className={styles.botones}>
            <button className={styles.btnConfirmar} onClick={handleConfirmar}>
              REGISTRAR RECOLECCIÓN
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
