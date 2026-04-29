import { useState } from 'react';
import styles from './CrearPedido.module.css';

const productosOpciones = ['Yuca', 'Piña', 'Banano', 'Papaya', 'Mango'];
const proveedoresOpciones = ['COLONO', 'AGROSANCARLOS', 'COOPEAGRI', 'DOS PINOS'];
const puntosVentaOpciones = ['Punto SJ', 'Punto Pital', 'Punto Liberia', 'Punto Cartago'];
const almacenesOpciones = ['Almacen San Carlos', 'Almacen Ciudad Quesada', 'Almacen Heredia'];
const transporteOpciones = ['Mario Fernandez Hernandez', 'Carlos Mora Jimenez', 'Luis Rojas Vargas'];
const unidadesOpciones = ['kg', 'lb', 'unidades', 'cajas'];

const PASOS = [
  { titulo: 'Información básica', campos: ['nombre', 'producto'] },
  { titulo: 'Cantidad y proveedor', campos: ['cantidad', 'proveedor'] },
  { titulo: 'Punto de venta y entrega', campos: ['puntoVenta', 'fechaEntrega'] },
  { titulo: 'Logística', campos: ['almacen', 'transporte', 'fechaRecoleccion'] },
];

export default function CrearPedido({ onVolver, onCrear, totalPedidos }) {
  const [paso, setPaso] = useState(0);
  const [form, setForm] = useState({
    nombre: '', producto: '', cantidad: '', unidad: 'kg',
    proveedor: '', puntoVenta: '', fechaEntrega: '',
    almacen: '', transporte: '', fechaRecoleccion: '',
  });
  const [errores, setErrores] = useState({});

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrores((prev) => ({ ...prev, [field]: false }));
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
      proveedor: form.proveedor,
      estado: 'EN RECOLECCION',
      estadoKey: 'recoleccion',
      checked: false,
      producto: form.producto,
      cantidad: `${form.cantidad} ${form.unidad}`,
      puntoVenta: form.puntoVenta,
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

      {/* Barra de progreso */}
      <div className={styles.progresoWrapper}>
        {PASOS.map((p, i) => (
          <div key={i} className={styles.pasoItem}>
            <div className={`${styles.circulo} ${i < paso ? styles.circuloHecho : ''} ${i === paso ? styles.circuloActivo : ''}`}>
              {i < paso ? '✓' : i + 1}
            </div>
            <span className={`${styles.pasoLabel} ${i === paso ? styles.pasoLabelActivo : ''}`}>
              {p.titulo}
            </span>
            {i < PASOS.length - 1 && (
              <div className={`${styles.lineaConector} ${i < paso ? styles.lineaHecha : ''}`}></div>
            )}
          </div>
        ))}
      </div>

      {/* Contenido del paso */}
      <div className={styles.pasoContenido}>
        <h2 className={styles.pasoTitulo}>
          Paso {paso + 1} — {PASOS[paso].titulo}
        </h2>

        <div className={styles.form}>

          {/* Paso 1 */}
          {paso === 0 && (
            <>
              <div className={styles.fila}>
                <label className={styles.label}>Nombre del pedido</label>
                <input
                  type="text"
                  className={`${styles.input} ${errores.nombre ? styles.inputError : ''}`}
                  value={form.nombre}
                  onChange={(e) => handleChange('nombre', e.target.value)}
                  placeholder="Ej: Pedido yuca Guanacaste"
                />
              </div>
              <div className={styles.fila}>
                <label className={styles.label}>Agregar productos</label>
                <select
                  className={`${styles.select} ${errores.producto ? styles.inputError : ''}`}
                  value={form.producto}
                  onChange={(e) => handleChange('producto', e.target.value)}
                >
                  <option value="">seleccionar producto</option>
                  {productosOpciones.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </>
          )}

          {/* Paso 2 */}
          {paso === 1 && (
            <>
              <div className={styles.fila}>
                <label className={styles.label}>Cantidad de productos</label>
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
              <div className={styles.fila}>
                <label className={styles.label}>Proveedor</label>
                <select
                  className={`${styles.select} ${errores.proveedor ? styles.inputError : ''}`}
                  value={form.proveedor}
                  onChange={(e) => handleChange('proveedor', e.target.value)}
                >
                  <option value="">seleccionar proveedor</option>
                  {proveedoresOpciones.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </>
          )}

          {/* Paso 3 */}
          {paso === 2 && (
            <>
              <div className={styles.fila}>
                <label className={styles.label}>Punto de venta</label>
                <select
                  className={`${styles.select} ${errores.puntoVenta ? styles.inputError : ''}`}
                  value={form.puntoVenta}
                  onChange={(e) => handleChange('puntoVenta', e.target.value)}
                >
                  <option value="">seleccionar punto</option>
                  {puntosVentaOpciones.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div className={styles.fila}>
                <label className={styles.label}>Fecha Entrega (Proveedor)</label>
                <input
                  type="date"
                  className={`${styles.input} ${errores.fechaEntrega ? styles.inputError : ''}`}
                  value={form.fechaEntrega}
                  onChange={(e) => handleChange('fechaEntrega', e.target.value)}
                />
              </div>
            </>
          )}

          {/* Paso 4 */}
          {paso === 3 && (
            <>
              <div className={styles.fila}>
                <label className={styles.label}>Almacén a entregar</label>
                <select
                  className={`${styles.select} ${errores.almacen ? styles.inputError : ''}`}
                  value={form.almacen}
                  onChange={(e) => handleChange('almacen', e.target.value)}
                >
                  <option value="">seleccionar almacén</option>
                  {almacenesOpciones.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div className={styles.fila}>
                <label className={styles.label}>Transporte a cargo</label>
                <select
                  className={`${styles.select} ${errores.transporte ? styles.inputError : ''}`}
                  value={form.transporte}
                  onChange={(e) => handleChange('transporte', e.target.value)}
                >
                  <option value="">seleccionar transporte</option>
                  {transporteOpciones.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div className={styles.fila}>
                <label className={styles.label}>Fecha de recoleccion de transporte</label>
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

      {/* Botones de navegación */}
      <div className={styles.botones}>
        <button className={styles.btnVolver} onClick={paso === 0 ? onVolver : handleAtras}>
          {paso === 0 ? 'VOLVER' : 'ATRÁS'}
        </button>
        {!esUltimoPaso ? (
          <button className={styles.btnSiguiente} onClick={handleSiguiente}>
            SIGUIENTE →
          </button>
        ) : (
          <button className={styles.btnCrear} onClick={handleCrear}>
            CREAR PEDIDO
          </button>
        )}
      </div>
    </div>
  );
}