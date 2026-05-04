import { useState } from 'react';
import styles from './EditarAlmacen.module.css';

const transporteOpciones = ['1 CAMION', '2 CAMIONES', '3 CAMIONES', '4 CAMIONES', '5 CAMIONES'];
const estadoOpciones = ['ACTIVO', 'MANTENIMIENTO', 'INACTIVO'];

export default function EditarAlmacen({ almacen, onVolver, onGuardar }) {
  const [form, setForm] = useState({ ...almacen });
  const [errores, setErrores] = useState({});

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrores((prev) => ({ ...prev, [field]: false }));
  };

  const validar = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = true;
    if (!form.direccion.trim()) e.direccion = true;
    if (!form.transporte) e.transporte = true;
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validar()) return;
    onGuardar({
      ...form,
      estadoKey: form.estado === 'ACTIVO' ? 'activo' : form.estado === 'MANTENIMIENTO' ? 'mantenimiento' : 'inactivo'
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>EDITAR ALMACÉN</h1>
      </div>

      <div className={styles.formContainer}>
        <div className={styles.formRow}>
          <div className={styles.field}>
            <label className={styles.label}>Nombre del almacén *</label>
            <input
              className={`${styles.input} ${errores.nombre ? styles.inputError : ''}`}
              value={form.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Dirección *</label>
            <input
              className={`${styles.input} ${errores.direccion ? styles.inputError : ''}`}
              value={form.direccion}
              onChange={(e) => handleChange('direccion', e.target.value)}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.field}>
            <label className={styles.label}>Encargado</label>
            <input
              className={styles.input}
              value={form.encargado || ''}
              onChange={(e) => handleChange('encargado', e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Teléfono</label>
            <input
              className={styles.input}
              value={form.telefono || ''}
              onChange={(e) => handleChange('telefono', e.target.value)}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.field}>
            <label className={styles.label}>Capacidad</label>
            <input
              className={styles.input}
              value={form.capacidad || ''}
              onChange={(e) => handleChange('capacidad', e.target.value)}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.field}>
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
          <div className={styles.field}>
            <label className={styles.label}>Estado</label>
            <select
              className={styles.select}
              value={form.estado}
              onChange={(e) => handleChange('estado', e.target.value)}
            >
              {estadoOpciones.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.btnCancelar} onClick={onVolver}>
          CANCELAR
        </button>
        <button className={styles.btnGuardar} onClick={handleSubmit}>
          GUARDAR CAMBIOS
        </button>
      </div>
    </div>
  );
}