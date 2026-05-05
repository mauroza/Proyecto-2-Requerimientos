import { useState } from 'react';
import styles from './CrearPuntoVenta.module.css';

const productosOpciones = ['Yuca', 'Piña', 'Banano', 'Papaya', 'Mango'];

export default function EditarPuntoVenta({ puntoVenta, onVolver, onGuardar }) {
  const [form, setForm] = useState({
    nombre: puntoVenta.nombre || '',
    direccion: puntoVenta.direccion || '',
    gerente: puntoVenta.gerente || '',
    telefono: puntoVenta.telefono || '',
    productosNegociados: puntoVenta.productosNegociados || [],
    fechaDepartamento: puntoVenta.fechaDepartamento || '',
    fechaRecogedor: puntoVenta.fechaRecogedor || '',
    estado: puntoVenta.estado || 'ACTIVO',
  });
  const [errores, setErrores] = useState({});

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrores((prev) => ({ ...prev, [field]: false }));
  };

  const handleAgregarProducto = (producto) => {
    if (!form.productosNegociados.includes(producto)) {
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

  const validar = () => {
    const nuevosErrores = {};
    if (!form.nombre || form.nombre.trim() === '') nuevosErrores.nombre = true;
    if (!form.direccion || form.direccion.trim() === '') nuevosErrores.direccion = true;
    if (!form.gerente || form.gerente.trim() === '') nuevosErrores.gerente = true;
    if (!form.telefono || form.telefono.trim() === '') nuevosErrores.telefono = true;
    if (form.productosNegociados.length === 0) nuevosErrores.productos = true;
    if (!form.fechaDepartamento) nuevosErrores.fechaDepartamento = true;
    if (!form.fechaRecogedor) nuevosErrores.fechaRecogedor = true;
    
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleGuardar = () => {
    if (!validar()) return;

    onGuardar({
      ...puntoVenta,
      nombre: form.nombre.toUpperCase(),
      direccion: form.direccion,
      gerente: form.gerente,
      telefono: form.telefono,
      productosNegociados: form.productosNegociados,
      fechaDepartamento: form.fechaDepartamento,
      fechaRecogedor: form.fechaRecogedor,
      estado: form.estado,
      estadoKey: form.estado.toLowerCase(),
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>EDITAR PUNTO DE VENTA</h1>
      </div>
      <hr className={styles.divider} />

      <div className={styles.pasoContenido}>
        <div className={styles.form}>
          <div className={styles.fila}>
            <label className={styles.label}>Nombre del punto de venta</label>
            <input
              type="text"
              className={`${styles.input} ${errores.nombre ? styles.inputError : ''}`}
              value={form.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
            />
          </div>

          <div className={styles.fila}>
            <label className={styles.label}>Dirección</label>
            <input
              type="text"
              className={`${styles.input} ${errores.direccion ? styles.inputError : ''}`}
              value={form.direccion}
              onChange={(e) => handleChange('direccion', e.target.value)}
            />
          </div>

          <div className={styles.fila}>
            <label className={styles.label}>Gerente</label>
            <input
              type="text"
              className={`${styles.input} ${errores.gerente ? styles.inputError : ''}`}
              value={form.gerente}
              onChange={(e) => handleChange('gerente', e.target.value)}
            />
          </div>

          <div className={styles.fila}>
            <label className={styles.label}>Teléfono</label>
            <input
              type="text"
              className={`${styles.input} ${errores.telefono ? styles.inputError : ''}`}
              value={form.telefono}
              onChange={(e) => handleChange('telefono', e.target.value)}
            />
          </div>

          <div className={styles.fila}>
            <label className={styles.label}>Productos negociados</label>
            <div className={styles.productosContainer}>
              <select
                className={styles.select}
                onChange={(e) => handleAgregarProducto(e.target.value)}
                value=""
              >
                <option value="">Seleccionar producto</option>
                {productosOpciones.map((p) => (
                  <option key={p} value={p} disabled={form.productosNegociados.includes(p)}>
                    {p}
                  </option>
                ))}
              </select>
              <div className={styles.productosList}>
                {form.productosNegociados.map((p) => (
                  <div key={p} className={styles.productoBadge}>
                    {p}
                    <button
                      type="button"
                      className={styles.btnRemover}
                      onClick={() => handleEliminarProducto(p)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {errores.productos && (
                  <p className={styles.errorMsg}>Selecciona al menos un producto</p>
                )}
              </div>
            </div>
          </div>

          <div className={styles.fila}>
            <label className={styles.label}>Fecha departamento</label>
            <input
              type="date"
              className={`${styles.input} ${errores.fechaDepartamento ? styles.inputError : ''}`}
              value={form.fechaDepartamento}
              onChange={(e) => handleChange('fechaDepartamento', e.target.value)}
            />
          </div>

          <div className={styles.fila}>
            <label className={styles.label}>Fecha recogedor producto</label>
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
              <option value="ACTIVO">ACTIVO</option>
              <option value="MANTENIMIENTO">MANTENIMIENTO</option>
              <option value="INACTIVO">INACTIVO</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.botones}>
        <button className={styles.btnVolver} onClick={onVolver}>
          VOLVER
        </button>
        <button className={styles.btnCrear} onClick={handleGuardar}>
          GUARDAR CAMBIOS
        </button>
      </div>
    </div>
  );
}
