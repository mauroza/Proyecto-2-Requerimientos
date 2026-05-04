import { useState } from 'react';
import styles from './CrearAlmacen.module.css';

const transporteOpciones = ['1 CAMION', '2 CAMIONES', '3 CAMIONES', '4 CAMIONES', '5 CAMIONES'];
const estadoOpciones = ['ACTIVO', 'MANTENIMIENTO', 'INACTIVO'];

const PASOS = [
  { titulo: 'Información básica', campos: ['nombre', 'direccion'] },
  { titulo: 'Contacto', campos: ['encargado', 'telefono'] },
  { titulo: 'Capacidad y disponibilidad', campos: ['capacidad', 'disponibilidad'] },
  { titulo: 'Transporte y estado', campos: ['transporte', 'estado'] },
];

export default function CrearAlmacen({ onVolver, onCrear }) {
  const [paso, setPaso] = useState(0);
  const [form, setForm] = useState({
    nombre: '',
    direccion: '',
    encargado: '',
    telefono: '',
    capacidad: '',
    disponibilidad: '',
    transporte: '',
    estado: 'ACTIVO'
  });
  const [errores, setErrores] = useState({});

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrores((prev) => ({ ...prev, [field]: false }));
  };

  const validarPaso = () => {
    const camposPaso = PASOS[paso].campos.filter(c => c !== 'disponibilidad');
    const nuevosErrores = {};
    
    camposPaso.forEach((key) => {
      if (key === 'transporte') {
        if (!form[key]) {
          nuevosErrores[key] = true;
        }
      } else {
        if (!form[key] || form[key].toString().trim() === '') {
          nuevosErrores[key] = true;
        }
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
    onCrear({
      ...form,
      id: Date.now(),
      disponibilidad: 100,
      estadoKey: form.estado === 'ACTIVO' ? 'activo' : form.estado === 'MANTENIMIENTO' ? 'mantenimiento' : 'inactivo',
      checked: false
    });
  };

  const esUltimoPaso = paso === PASOS.length - 1;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>CREAR ALMACÉN</h1>
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

          {/* Paso 1: Información básica */}
          {paso === 0 && (
            <>
              <div className={styles.fila}>
                <label className={styles.label}>Nombre del almacén *</label>
                <input
                  type="text"
                  className={`${styles.input} ${errores.nombre ? styles.inputError : ''}`}
                  value={form.nombre}
                  onChange={(e) => handleChange('nombre', e.target.value)}
                  placeholder="Ej: ALMACEN HEREDIA"
                />
              </div>
              <div className={styles.fila}>
                <label className={styles.label}>Dirección *</label>
                <input
                  type="text"
                  className={`${styles.input} ${errores.direccion ? styles.inputError : ''}`}
                  value={form.direccion}
                  onChange={(e) => handleChange('direccion', e.target.value)}
                  placeholder="Ej: Heredia centro"
                />
              </div>
            </>
          )}

          {/* Paso 2: Contacto */}
          {paso === 1 && (
            <>
              <div className={styles.fila}>
                <label className={styles.label}>Encargado</label>
                <input
                  type="text"
                  className={`${styles.input} ${errores.encargado ? styles.inputError : ''}`}
                  value={form.encargado}
                  onChange={(e) => handleChange('encargado', e.target.value)}
                  placeholder="Nombre del encargado"
                />
              </div>
              <div className={styles.fila}>
                <label className={styles.label}>Teléfono</label>
                <input
                  type="text"
                  className={`${styles.input} ${errores.telefono ? styles.inputError : ''}`}
                  value={form.telefono}
                  onChange={(e) => handleChange('telefono', e.target.value)}
                  placeholder="Ej: 2476-1234"
                />
              </div>
            </>
          )}

          {/* Paso 3: Capacidad y disponibilidad */}
          {paso === 2 && (
            <>
              <div className={styles.fila}>
                <label className={styles.label}>Capacidad (KG) *</label>
                <input
                  type="number"
                  min="0"
                  className={`${styles.input} ${errores.capacidad ? styles.inputError : ''}`}
                  value={form.capacidad}
                  onChange={(e) => handleChange('capacidad', e.target.value)}
                  placeholder="Ej: 100"
                />
              </div>
            </>
          )}

          {/* Paso 4: Transporte y estado */}
          {paso === 3 && (
            <>
              <div className={styles.fila}>
                <label className={styles.label}>Transporte asignado *</label>
                <select
                  className={`${styles.select} ${errores.transporte ? styles.inputError : ''}`}
                  value={form.transporte}
                  onChange={(e) => handleChange('transporte', e.target.value)}
                >
                  <option value="">Seleccionar</option>
                  {transporteOpciones.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className={styles.fila}>
                <label className={styles.label}>Estado</label>
                <select
                  className={`${styles.select} ${errores.estado ? styles.inputError : ''}`}
                  value={form.estado}
                  onChange={(e) => handleChange('estado', e.target.value)}
                >
                  {estadoOpciones.map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
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
            CREAR ALMACÉN
          </button>
        )}
      </div>
    </div>
  );
}