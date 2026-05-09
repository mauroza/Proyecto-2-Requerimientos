import { useState } from 'react';
import styles from './Recoger.module.css';

const PRODUCTOS_BASE = ['Yuca', 'Piña', 'Banano', 'Papaya', 'Mango'];

export default function Recoger({ puntosVenta, onRecoger }) {
  const [form, setForm] = useState({
    puntoVentaId: '',
    producto: '',
    cantidad: '',
    fecha: '',
    transportista: '',
    notas: ''
  });
  const [errors, setErrors] = useState({});
  const [exito, setExito] = useState(false);

  const puntoVenta = puntosVenta.find((p) => p.id === Number(form.puntoVentaId));
  const productosDisponibles = puntoVenta?.productosNegociados?.length
    ? puntoVenta.productosNegociados
    : PRODUCTOS_BASE;

  const set = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    setErrors((prev) => { const { [campo]: _, ...resto } = prev; return resto; });
  };

  const validar = () => {
    const errs = {};
    if (!form.puntoVentaId) errs.puntoVentaId = 'Seleccione un punto de venta';
    if (!form.producto) errs.producto = 'Seleccione un producto';
    if (!form.cantidad || Number(form.cantidad) <= 0) errs.cantidad = 'Ingrese una cantidad válida';
    if (!form.fecha) errs.fecha = 'Seleccione una fecha de recolección';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validar()) return;
    onRecoger({
      puntoVentaId: Number(form.puntoVentaId),
      puntoVentaNombre: puntoVenta.nombre,
      producto: form.producto,
      cantidad: Number(form.cantidad),
      fecha: form.fecha,
      transportista: form.transportista,
      notas: form.notas,
      estado: 'PROGRAMADA',
      estadoKey: 'programada',
      fechaRegistro: new Date().toLocaleDateString('es-CR').replace(/\//g, '-')
    });
    setExito(true);
    setTimeout(() => {
      setExito(false);
      setForm({ puntoVentaId: '', producto: '', cantidad: '', fecha: '', transportista: '', notas: '' });
    }, 2500);
  };

  if (exito) {
    return (
      <div className={styles.exitoContainer}>
        <div className={styles.exitoBox}>
          <div className={styles.exitoIcon}>✓</div>
          <h2 className={styles.exitoTitulo}>¡Recolección programada!</h2>
          <p className={styles.exitoSub}>La recolección fue registrada y aparecerá en el historial.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.titulo}>PROGRAMAR RECOLECCIÓN</h2>
      <p className={styles.subtitulo}>Ingrese los datos para programar la recolección de productos desde un punto de venta</p>

      <div className={styles.formCard}>
        <div className={styles.formGrid}>
          <div className={styles.campo}>
            <label className={styles.label}>PUNTO DE VENTA *</label>
            <select
              className={`${styles.select} ${errors.puntoVentaId ? styles.inputError : ''}`}
              value={form.puntoVentaId}
              onChange={(e) => set('puntoVentaId', e.target.value)}
            >
              <option value="">— Seleccione un punto de venta —</option>
              {puntosVenta.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
            {errors.puntoVentaId && <span className={styles.errorMsg}>{errors.puntoVentaId}</span>}
          </div>

          <div className={styles.campo}>
            <label className={styles.label}>PRODUCTO A RECOLECTAR *</label>
            <select
              className={`${styles.select} ${errors.producto ? styles.inputError : ''}`}
              value={form.producto}
              onChange={(e) => set('producto', e.target.value)}
            >
              <option value="">— Seleccione un producto —</option>
              {productosDisponibles.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            {errors.producto && <span className={styles.errorMsg}>{errors.producto}</span>}
          </div>

          <div className={styles.campo}>
            <label className={styles.label}>CANTIDAD (KG) *</label>
            <input
              type="number"
              min={1}
              className={`${styles.input} ${errors.cantidad ? styles.inputError : ''}`}
              value={form.cantidad}
              onChange={(e) => set('cantidad', e.target.value)}
              placeholder="Ej: 50"
            />
            {errors.cantidad && <span className={styles.errorMsg}>{errors.cantidad}</span>}
          </div>

          <div className={styles.campo}>
            <label className={styles.label}>FECHA DE RECOLECCIÓN *</label>
            <input
              type="date"
              className={`${styles.input} ${errors.fecha ? styles.inputError : ''}`}
              value={form.fecha}
              onChange={(e) => set('fecha', e.target.value)}
            />
            {errors.fecha && <span className={styles.errorMsg}>{errors.fecha}</span>}
          </div>

          <div className={styles.campo}>
            <label className={styles.label}>TRANSPORTISTA (OPCIONAL)</label>
            <input
              type="text"
              className={styles.input}
              value={form.transportista}
              onChange={(e) => set('transportista', e.target.value)}
              placeholder="Nombre del transportista"
            />
          </div>

          <div className={styles.campo}>
            <label className={styles.label}>NOTAS (OPCIONAL)</label>
            <input
              type="text"
              className={styles.input}
              value={form.notas}
              onChange={(e) => set('notas', e.target.value)}
              placeholder="Observaciones adicionales"
            />
          </div>
        </div>

        {puntoVenta && (
          <div className={styles.infoPunto}>
            <span className={styles.infoPuntoLabel}>Punto seleccionado:</span>
            <span className={styles.infoPuntoVal}>{puntoVenta.nombre}</span>
            <span className={styles.infoPuntoDir}>{puntoVenta.direccion}</span>
            {puntoVenta.gerente && (
              <span className={styles.infoPuntoDir}>Gerente: {puntoVenta.gerente} — Tel: {puntoVenta.telefono}</span>
            )}
          </div>
        )}

        <div className={styles.botones}>
          <button className={styles.btnConfirmar} onClick={handleSubmit}>
            PROGRAMAR RECOLECCIÓN
          </button>
        </div>
      </div>
    </div>
  );
}
