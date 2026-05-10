import { useState } from 'react';
import styles from './CrearPedido.module.css';

const unidadesOpciones = ['kg', 'lb', 'unidades', 'cajas'];

const PASOS = [
  { titulo: 'Proveedor y nombre', campos: ['nombre', 'proveedorId'] },
  { titulo: 'Producto y cantidad', campos: ['producto', 'cantidad'] },
  { titulo: 'Punto de venta y entrega', campos: ['puntoVenta', 'fechaEntrega'] },
  { titulo: 'Logística', campos: ['almacen', 'transporte', 'fechaRecoleccion'] },
];

export default function CrearPedido({ onVolver, onCrear, totalPedidos, almacenes = [], proveedores = [], puntosVenta = [], transportes = [] }) {
  const [paso, setPaso] = useState(0);
  const [form, setForm] = useState({
    nombre: '', proveedorId: '', producto: '',
    cantidad: '', unidad: 'kg',
    puntoVenta: '', fechaEntrega: '',
    almacen: '', transporte: '', fechaRecoleccion: '',
  });
  const [errores, setErrores] = useState({});

  const proveedorActual = proveedores.find((p) => p.id === Number(form.proveedorId));
  const productosDisponibles = proveedorActual?.productosSuministrados ?? [];

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrores((prev) => ({ ...prev, [field]: false }));
  };

  const handleProveedorChange = (id) => {
    setForm((prev) => ({ ...prev, proveedorId: id, producto: '' }));
    setErrores((prev) => ({ ...prev, proveedorId: false, producto: false }));
  };

  const validarPaso = () => {
    const camposPaso = PASOS[paso].campos;
    const nuevosErrores = {};
    camposPaso.forEach((key) => {
      if (!form[key] || form[key].toString().trim() === '') {
        nuevosErrores[key] = true;
      }
    });
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSiguiente = () => {
    if (!validarPaso()) return;
    setPaso((p) => p + 1);
  };

  const handleAtras = () => {
    setErrores({});
    setPaso((p) => p - 1);
  };

  const handleCrear = () => {
    if (!validarPaso()) return;
    const nuevoPedido = {
      id: totalPedidos + 1,
      nombre: form.nombre.toUpperCase(),
      fecha: new Date().toLocaleDateString('es-CR').replace(/\//g, '-'),
      proveedor: proveedorActual?.nombre ?? form.proveedorId,
      estado: 'EN RECOLECCION',
      estadoKey: 'recoleccion',
      checked: false,
      producto: form.producto,
      cantidad: `${form.cantidad} ${form.unidad}`,
      puntoVenta: form.puntoVenta,
      fechaEntrega: form.fechaEntrega,
      transportista: form.transporte,
      fechaRecoleccion: form.fechaRecoleccion,
      almacen: form.almacen,
      estadoTexto: 'En recoleccion',
    };
    onCrear(nuevoPedido);
  };

  const esUltimoPaso = paso === PASOS.length - 1;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>CREAR PEDIDO AL PROVEEDOR</h1>
      </div>
      <hr className={styles.divider} />

      <div className={styles.progresoWrapper}>
        {PASOS.map((p, i) => (
          <div key={i} className={styles.pasoItem}>
            <div className={`${styles.circulo} ${i < paso ? styles.circuloHecho : ''} ${i === paso ? styles.circuloActivo : ''}`}>
              {i < paso ? '✓' : i + 1}
            </div>
            <span className={`${styles.pasoLabel} ${i === paso ? styles.pasoLabelActivo : ''}`}>{p.titulo}</span>
            {i < PASOS.length - 1 && (
              <div className={`${styles.lineaConector} ${i < paso ? styles.lineaHecha : ''}`} />
            )}
          </div>
        ))}
      </div>

      <div className={styles.pasoContenido}>
        <h2 className={styles.pasoTitulo}>Paso {paso + 1} — {PASOS[paso].titulo}</h2>
        <div className={styles.form}>

          {/* Paso 1: Nombre y proveedor */}
          {paso === 0 && (
            <>
              <div className={styles.fila}>
                <label className={styles.label}>Nombre del pedido *</label>
                <input
                  type="text"
                  className={`${styles.input} ${errores.nombre ? styles.inputError : ''}`}
                  value={form.nombre}
                  onChange={(e) => handleChange('nombre', e.target.value)}
                  placeholder="Ej: Pedido yuca Guanacaste"
                />
              </div>
              <div className={styles.fila}>
                <label className={styles.label}>Proveedor *</label>
                <select
                  className={`${styles.select} ${errores.proveedorId ? styles.inputError : ''}`}
                  value={form.proveedorId}
                  onChange={(e) => handleProveedorChange(e.target.value)}
                >
                  <option value="">— Seleccionar proveedor —</option>
                  {proveedores.map((p) => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </select>
                {proveedorActual && (
                  <p className={styles.infoProveedor}>
                    Contacto: {proveedorActual.contacto} · {proveedorActual.telefono}
                    {proveedorActual.productosSuministrados.length > 0
                      ? ` · Productos: ${proveedorActual.productosSuministrados.join(', ')}`
                      : ' · Sin productos registrados'}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Paso 2: Producto y cantidad */}
          {paso === 1 && (
            <>
              <div className={styles.fila}>
                <label className={styles.label}>Producto *</label>
                {productosDisponibles.length > 0 ? (
                  <select
                    className={`${styles.select} ${errores.producto ? styles.inputError : ''}`}
                    value={form.producto}
                    onChange={(e) => handleChange('producto', e.target.value)}
                  >
                    <option value="">— Seleccionar producto —</option>
                    {productosDisponibles.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                ) : (
                  <p className={styles.sinProductos}>
                    El proveedor seleccionado no tiene productos registrados. Edítelo en el módulo Proveedores.
                  </p>
                )}
              </div>
              <div className={styles.fila}>
                <label className={styles.label}>Cantidad *</label>
                <div className={styles.cantidadGroup}>
                  <input
                    type="number"
                    min="0"
                    className={`${styles.inputCantidad} ${errores.cantidad ? styles.inputError : ''}`}
                    value={form.cantidad}
                    onChange={(e) => handleChange('cantidad', e.target.value)}
                    placeholder="0"
                  />
                  <select
                    className={styles.selectUnidad}
                    value={form.unidad}
                    onChange={(e) => handleChange('unidad', e.target.value)}
                  >
                    {unidadesOpciones.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Paso 3: Punto de venta */}
          {paso === 2 && (
            <>
              <div className={styles.fila}>
                <label className={styles.label}>Punto de venta *</label>
                <select
                  className={`${styles.select} ${errores.puntoVenta ? styles.inputError : ''}`}
                  value={form.puntoVenta}
                  onChange={(e) => handleChange('puntoVenta', e.target.value)}
                >
                  <option value="">— Seleccionar punto de venta —</option>
                  {puntosVenta.map((p) => (
                    <option key={p.id} value={p.nombre}>{p.nombre}</option>
                  ))}
                </select>
              </div>
              <div className={styles.fila}>
                <label className={styles.label}>Fecha de entrega (proveedor) *</label>
                <input
                  type="date"
                  className={`${styles.input} ${errores.fechaEntrega ? styles.inputError : ''}`}
                  value={form.fechaEntrega}
                  onChange={(e) => handleChange('fechaEntrega', e.target.value)}
                />
              </div>
            </>
          )}

          {/* Paso 4: Logística */}
          {paso === 3 && (
            <>
              <div className={styles.fila}>
                <label className={styles.label}>Almacén a entregar *</label>
                <select
                  className={`${styles.select} ${errores.almacen ? styles.inputError : ''}`}
                  value={form.almacen}
                  onChange={(e) => handleChange('almacen', e.target.value)}
                >
                  <option value="">— Seleccionar almacén —</option>
                  {almacenes.map((a) => <option key={a.id} value={a.nombre}>{a.nombre}</option>)}
                </select>
              </div>
              <div className={styles.fila}>
                <label className={styles.label}>Transporte a cargo *</label>
                <select
                  className={`${styles.select} ${errores.transporte ? styles.inputError : ''}`}
                  value={form.transporte}
                  onChange={(e) => handleChange('transporte', e.target.value)}
                >
                  <option value="">— Seleccionar transporte —</option>
                  {transportes.map((t) => (
                    <option key={t.id} value={t.nombre}>{t.nombre} ({t.tipo})</option>
                  ))}
                </select>
              </div>
              <div className={styles.fila}>
                <label className={styles.label}>Fecha de recolección *</label>
                <input
                  type="date"
                  className={`${styles.input} ${errores.fechaRecoleccion ? styles.inputError : ''}`}
                  value={form.fechaRecoleccion}
                  onChange={(e) => handleChange('fechaRecoleccion', e.target.value)}
                />
              </div>
            </>
          )}

        </div>
      </div>

      <div className={styles.botones}>
        <button className={styles.btnVolver} onClick={paso === 0 ? onVolver : handleAtras}>
          {paso === 0 ? 'VOLVER' : 'ATRÁS'}
        </button>
        {!esUltimoPaso ? (
          <button className={styles.btnSiguiente} onClick={handleSiguiente}>SIGUIENTE →</button>
        ) : (
          <button className={styles.btnCrear} onClick={handleCrear}>CREAR PEDIDO</button>
        )}
      </div>
    </div>
  );
}
