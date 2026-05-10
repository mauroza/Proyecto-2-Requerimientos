import { useState } from 'react';
import styles from './CrearPedido.module.css';

const unidadesOpciones = ['kg', 'lb', 'unidades', 'cajas'];

export default function EditarPedido({ pedido, onVolver, onGuardar, almacenes = [], proveedores = [], puntosVenta = [], transportes = [] }) {
  const [form, setForm] = useState({
    nombre: pedido.nombre || '',
    proveedor: pedido.proveedor || '',
    producto: pedido.producto || '',
    cantidad: pedido.cantidad?.split(' ')[0] || '',
    unidad: pedido.cantidad?.split(' ')[1] || 'kg',
    puntoVenta: pedido.puntoVenta || '',
    fechaEntrega: pedido.fechaEntrega || '',
    almacen: pedido.almacen || '',
    transporte: pedido.transportista || '',
    fechaRecoleccion: pedido.fechaRecoleccion || '',
  });
  const [errores, setErrores] = useState({});

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrores((prev) => ({ ...prev, [field]: false }));
  };

  const handleProveedorChange = (nombre) => {
    setForm((prev) => ({ ...prev, proveedor: nombre, producto: '' }));
    setErrores((prev) => ({ ...prev, proveedor: false, producto: false }));
  };

  const proveedorActual = proveedores.find((p) => p.nombre === form.proveedor);
  const productosDisponibles = proveedorActual?.productosSuministrados ?? [];

  const validar = () => {
    const nuevosErrores = {};
    ['nombre', 'proveedor', 'producto', 'cantidad', 'puntoVenta', 'almacen', 'transporte'].forEach((key) => {
      if (!form[key] || form[key].toString().trim() === '') nuevosErrores[key] = true;
    });
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleGuardar = () => {
    if (!validar()) return;
    onGuardar({
      ...pedido,
      nombre: form.nombre.toUpperCase(),
      proveedor: form.proveedor,
      producto: form.producto,
      cantidad: `${form.cantidad} ${form.unidad}`,
      puntoVenta: form.puntoVenta,
      fechaEntrega: form.fechaEntrega,
      almacen: form.almacen,
      transportista: form.transporte,
      fechaRecoleccion: form.fechaRecoleccion,
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>EDITAR PEDIDO</h1>
      </div>
      <hr className={styles.divider} />
      <div className={styles.pasoContenido}>
        <div className={styles.form}>

          <div className={styles.fila}>
            <label className={styles.label}>Nombre del pedido *</label>
            <input
              type="text"
              className={`${styles.input} ${errores.nombre ? styles.inputError : ''}`}
              value={form.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
            />
          </div>

          <div className={styles.fila}>
            <label className={styles.label}>Proveedor *</label>
            <select
              className={`${styles.select} ${errores.proveedor ? styles.inputError : ''}`}
              value={form.proveedor}
              onChange={(e) => handleProveedorChange(e.target.value)}
            >
              <option value="">— Seleccionar proveedor —</option>
              {proveedores.map((p) => (
                <option key={p.id} value={p.nombre}>{p.nombre}</option>
              ))}
            </select>
          </div>

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
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  className={`${styles.input} ${errores.producto ? styles.inputError : ''}`}
                  value={form.producto}
                  onChange={(e) => handleChange('producto', e.target.value)}
                  placeholder={form.proveedor ? 'Proveedor sin productos — escríbalo' : 'Seleccione un proveedor primero'}
                />
              </div>
            )}
          </div>

          <div className={styles.fila}>
            <label className={styles.label}>Cantidad *</label>
            <div className={styles.cantidadGroup}>
              <input
                type="number"
                className={`${styles.inputCantidad} ${errores.cantidad ? styles.inputError : ''}`}
                value={form.cantidad}
                onChange={(e) => handleChange('cantidad', e.target.value)}
              />
              <select className={styles.selectUnidad} value={form.unidad} onChange={(e) => handleChange('unidad', e.target.value)}>
                {unidadesOpciones.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

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
            <label className={styles.label}>Fecha de entrega (proveedor)</label>
            <input
              type="date"
              className={styles.input}
              value={form.fechaEntrega}
              onChange={(e) => handleChange('fechaEntrega', e.target.value)}
            />
          </div>

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
            <label className={styles.label}>Fecha de recolección</label>
            <input
              type="date"
              className={styles.input}
              value={form.fechaRecoleccion}
              onChange={(e) => handleChange('fechaRecoleccion', e.target.value)}
            />
          </div>

        </div>
      </div>
      <div className={styles.botones}>
        <button className={styles.btnVolver} onClick={onVolver}>VOLVER</button>
        <button className={styles.btnSiguiente} onClick={handleGuardar}>GUARDAR CAMBIOS</button>
      </div>
    </div>
  );
}
