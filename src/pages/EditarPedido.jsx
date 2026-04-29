import { useState } from 'react';
import styles from './CrearPedido.module.css';

const productosOpciones = ['Yuca', 'Piña', 'Banano', 'Papaya', 'Mango'];
const proveedoresOpciones = ['COLONO', 'AGROSANCARLOS', 'COOPEAGRI', 'DOS PINOS'];
const puntosVentaOpciones = ['Punto SJ', 'Punto Pital', 'Punto Liberia', 'Punto Cartago'];
const almacenesOpciones = ['Almacen San Carlos', 'Almacen Ciudad Quesada', 'Almacen Heredia'];
const transporteOpciones = ['Mario Fernandez Hernandez', 'Carlos Mora Jimenez', 'Luis Rojas Vargas'];

export default function EditarPedido({ pedido, onVolver, onGuardar }) {
  const [form, setForm] = useState({
    nombre: pedido.nombre || '',
    producto: pedido.producto || '',
    cantidad: pedido.cantidad?.split(' ')[0] || '',
    unidad: pedido.cantidad?.split(' ')[1] || 'kg',
    proveedor: pedido.proveedor || '',
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

  const validar = () => {
    const nuevosErrores = {};
    ['nombre', 'producto', 'cantidad', 'proveedor', 'puntoVenta', 'almacen', 'transporte'].forEach((key) => {
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
      producto: form.producto,
      cantidad: `${form.cantidad} ${form.unidad}`,
      proveedor: form.proveedor,
      puntoVenta: form.puntoVenta,
      fechaEntrega: form.fechaEntrega,
      almacen: form.almacen,
      transportista: form.transporte,
      fechaRecoleccion: form.fechaRecoleccion,
    });
  };

  const campo = (label, field, tipo = 'input') => (
    <div className={styles.fila}>
      <label className={styles.label}>{label}</label>
      <input
        type={tipo === 'date' ? 'date' : 'text'}
        className={`${styles.input} ${errores[field] ? styles.inputError : ''}`}
        value={form[field]}
        onChange={(e) => handleChange(field, e.target.value)}
      />
    </div>
  );

  const select = (label, field, opciones) => (
    <div className={styles.fila}>
      <label className={styles.label}>{label}</label>
      <select
        className={`${styles.select} ${errores[field] ? styles.inputError : ''}`}
        value={form[field]}
        onChange={(e) => handleChange(field, e.target.value)}
      >
        <option value="">seleccionar</option>
        {opciones.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>EDITAR PEDIDO</h1>
      </div>
      <hr className={styles.divider} />
      <div className={styles.pasoContenido}>
        <div className={styles.form}>
          {campo('Nombre del pedido', 'nombre')}
          {select('Producto', 'producto', productosOpciones)}
          <div className={styles.fila}>
            <label className={styles.label}>Cantidad de productos</label>
            <div className={styles.cantidadGroup}>
              <input
                type="number"
                className={`${styles.inputCantidad} ${errores.cantidad ? styles.inputError : ''}`}
                value={form.cantidad}
                onChange={(e) => handleChange('cantidad', e.target.value)}
              />
              <select className={styles.selectUnidad} value={form.unidad} onChange={(e) => handleChange('unidad', e.target.value)}>
                {['kg', 'lb', 'unidades', 'cajas'].map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
          {select('Proveedor', 'proveedor', proveedoresOpciones)}
          {select('Punto de venta', 'puntoVenta', puntosVentaOpciones)}
          {campo('Fecha Entrega (Proveedor)', 'fechaEntrega', 'date')}
          {select('Almacén a entregar', 'almacen', almacenesOpciones)}
          {select('Transporte a cargo', 'transporte', transporteOpciones)}
          {campo('Fecha de recoleccion de transporte', 'fechaRecoleccion', 'date')}
        </div>
      </div>
      <div className={styles.botones}>
        <button className={styles.btnVolver} onClick={onVolver}>VOLVER</button>
        <button className={styles.btnSiguiente} onClick={handleGuardar}>GUARDAR CAMBIOS</button>
      </div>
    </div>
  );
}