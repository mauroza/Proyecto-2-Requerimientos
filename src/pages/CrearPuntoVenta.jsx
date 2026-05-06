import { useState } from 'react';
import styles from './CrearAlmacen.module.css';

const productosOpciones = ['Yuca', 'Piña', 'Banano', 'Papaya', 'Mango'];
const estadoOpciones = ['ACTIVO', 'MANTENIMIENTO', 'INACTIVO'];

const PASOS = [
  { titulo: 'Información básica', campos: ['nombre', 'direccion'] },
  { titulo: 'Contacto', campos: ['gerente', 'telefono'] },
  { titulo: 'Productos negociados', campos: ['productosNegociados'] },
  { titulo: 'Fechas y estado', campos: ['fechaDepartamento', 'fechaRecogedor', 'estado'] },
];

export default function CrearPuntoVenta({ onVolver, onCrear }) {
  const [paso, setPaso] = useState(0);
  const [form, setForm] = useState({
    nombre: '',
    direccion: '',
    gerente: '',
    telefono: '',
    productosNegociados: [],
    fechaDepartamento: '',
    fechaRecogedor: '',
    estado: 'ACTIVO',
  });
  const [errores, setErrores] = useState({});

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrores((prev) => ({ ...prev, [field]: false }));
  };

  const handleAgregarProducto = (producto) => {
    if (!form.productosNegociados.includes(producto) && producto) {
      setForm((prev) => ({
        ...prev,
        productosNegociados: [...prev.productosNegociados, producto]
      }));
    }
  };

  const handleEliminarProducto = (producto) => {
    setForm((prev) => ({
      ...prev,
      productosNegociados: prev.productosNegociados.filter((p) => p !== producto)
    }));
  };

  const validarPaso = () => {
    const camposPaso = PASOS[paso].campos;
    const nuevosErrores = {};

    camposPaso.forEach((key) => {
      if (key === 'productosNegociados') {
        if (form.productosNegociados.length === 0) nuevosErrores[key] = true;
        return;
      }
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
    setPaso((p) => Math.max(0, p - 1));
  };

  const handleCrear = () => {
    if (!validarPaso()) return;

    onCrear({
      ...form,
      id: Date.now(),
      estadoKey: form.estado === 'ACTIVO' ? 'activo' : form.estado === 'MANTENIMIENTO' ? 'mantenimiento' : 'inactivo',
      checked: false
    });
  };

  const esUltimoPaso = paso === PASOS.length - 1;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>CREAR PUNTO DE VENTA</h1>
      </div>
      <hr className={styles.divider} />

      <div className={styles.progresoWrapper}>
        {PASOS.map((item, index) => (
          <div key={item.titulo} className={styles.pasoItem}>
            <div className={`${styles.circulo} ${index < paso ? styles.circuloHecho : ''} ${index === paso ? styles.circuloActivo : ''}`}>
              {index < paso ? '✓' : index + 1}
            </div>
            <span className={`${styles.pasoLabel} ${index === paso ? styles.pasoLabelActivo : ''}`}>
              {item.titulo}
            </span>
            {index < PASOS.length - 1 && (
              <div className={`${styles.lineaConector} ${index < paso ? styles.lineaHecha : ''}`} />
            )}
          </div>
        ))}
      </div>

      <div className={styles.pasoContenido}>
        <h2 className={styles.pasoTitulo}>
          Paso {paso + 1} — {PASOS[paso].titulo}
        </h2>

        <div className={styles.form}>
          {paso === 0 && (
            <>
              <div className={styles.fila}>
                <label className={styles.label}>Nombre del punto de venta *</label>
                <input
                  type="text"
                  className={`${styles.input} ${errores.nombre ? styles.inputError : ''}`}
                  value={form.nombre}
                  onChange={(e) => handleChange('nombre', e.target.value)}
                  placeholder="Ej: PUNTO DE VENTA SAN JOSÉ"
                />
              </div>
              <div className={styles.fila}>
                <label className={styles.label}>Dirección *</label>
                <input
                  type="text"
                  className={`${styles.input} ${errores.direccion ? styles.inputError : ''}`}
                  value={form.direccion}
                  onChange={(e) => handleChange('direccion', e.target.value)}
                  placeholder="Ej: Barrio Escalante, San José"
                />
              </div>
            </>
          )}

          {paso === 1 && (
            <>
              <div className={styles.fila}>
                <label className={styles.label}>Gerente *</label>
                <input
                  type="text"
                  className={`${styles.input} ${errores.gerente ? styles.inputError : ''}`}
                  value={form.gerente}
                  onChange={(e) => handleChange('gerente', e.target.value)}
                  placeholder="Ej: Juan Pérez"
                />
              </div>
              <div className={styles.fila}>
                <label className={styles.label}>Teléfono *</label>
                <input
                  type="text"
                  className={`${styles.input} ${errores.telefono ? styles.inputError : ''}`}
                  value={form.telefono}
                  onChange={(e) => handleChange('telefono', e.target.value)}
                  placeholder="Ej: 2222-1111"
                />
              </div>
            </>
          )}

          {paso === 2 && (
            <>
              <div className={styles.fila}>
                <label className={styles.label}>Productos negociados *</label>
                <div>
                  <select
                    className={`${styles.select} ${errores.productosNegociados ? styles.inputError : ''}`}
                    value=""
                    onChange={(e) => handleAgregarProducto(e.target.value)}
                  >
                    <option value="">Seleccionar producto</option>
                    {productosOpciones.map((producto) => (
                      <option key={producto} value={producto} disabled={form.productosNegociados.includes(producto)}>
                        {producto}
                      </option>
                    ))}
                  </select>
                  <div className={styles.productosList}>
                    {form.productosNegociados.map((producto) => (
                      <div key={producto} className={styles.productoBadge}>
                        {producto}
                        <button
                          type="button"
                          className={styles.btnRemover}
                          onClick={() => handleEliminarProducto(producto)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  {errores.productosNegociados && (
                    <p className={styles.errorMsg}>Selecciona al menos un producto</p>
                  )}
                </div>
              </div>
            </>
          )}

          {paso === 3 && (
            <>
              <div className={styles.fila}>
                <label className={styles.label}>Fecha departamento *</label>
                <input
                  type="date"
                  className={`${styles.input} ${errores.fechaDepartamento ? styles.inputError : ''}`}
                  value={form.fechaDepartamento}
                  onChange={(e) => handleChange('fechaDepartamento', e.target.value)}
                />
              </div>
              <div className={styles.fila}>
                <label className={styles.label}>Fecha recogedor producto *</label>
                <input
                  type="date"
                  className={`${styles.input} ${errores.fechaRecogedor ? styles.inputError : ''}`}
                  value={form.fechaRecogedor}
                  onChange={(e) => handleChange('fechaRecogedor', e.target.value)}
                />
              </div>
              <div className={styles.fila}>
                <label className={styles.label}>Estado</label>
                <select
                  className={styles.select}
                  value={form.estado}
                  onChange={(e) => handleChange('estado', e.target.value)}
                >
                  {estadoOpciones.map((estado) => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </select>
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
          <button className={styles.btnSiguiente} onClick={handleSiguiente}>
            SIGUIENTE →
          </button>
        ) : (
          <button className={styles.btnCrear} onClick={handleCrear}>
            CREAR PUNTO DE VENTA
          </button>
        )}
      </div>
    </div>
  );
}
