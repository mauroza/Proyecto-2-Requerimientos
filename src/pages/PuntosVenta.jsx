import { useState } from 'react';
import { usePuntosVenta } from '../hooks/usePuntosVenta';
import PuntoVentaDetalle from './PuntoVentaDetalle';
import CrearPuntoVenta from './CrearPuntoVenta';
import EditarPuntoVenta from './EditarPuntoVenta';
import styles from './PuntosVenta.module.css';

const ESTADOS = ['ACTIVO', 'MANTENIMIENTO', 'INACTIVO'];

export default function PuntosVenta() {
  const [modalFiltros, setModalFiltros] = useState(false);
  const [filtros, setFiltros] = useState({ estado: '' });
  const [puntoVentaSeleccionado, setPuntoVentaSeleccionado] = useState(null);
  const [creando, setCreando] = useState(false);
  const [editando, setEditando] = useState(null);
  const [modalEstado, setModalEstado] = useState(null);

  const { puntosVenta, agregarPuntoVenta, editarPuntoVenta, eliminarPuntoVenta, actualizarEstado, toggleCheck, toggleAll } = usePuntosVenta();

  // Aplicar filtros
  const puntosVentaFiltrados = puntosVenta.filter((p) => {
    if (filtros.estado && p.estado !== filtros.estado) return false;
    return true;
  });

  const allChecked = puntosVentaFiltrados.every((p) => p.checked);

  const aplicarFiltros = (nuevosFiltros) => {
    setFiltros(nuevosFiltros);
    setModalFiltros(false);
  };

  const limpiarFiltros = () => {
    setFiltros({ estado: '' });
    setModalFiltros(false);
  };

  const handleCrear = (nuevoPuntoVenta) => {
    agregarPuntoVenta(nuevoPuntoVenta);
    setCreando(false);
  };

  if (puntoVentaSeleccionado) {
    return <PuntoVentaDetalle puntoVenta={puntoVentaSeleccionado} onVolver={() => setPuntoVentaSeleccionado(null)} />;
  }

  if (creando) {
    return <CrearPuntoVenta onVolver={() => setCreando(false)} onCrear={handleCrear} />;
  }

  if (editando) {
    return <EditarPuntoVenta puntoVenta={editando} onVolver={() => setEditando(null)} onGuardar={(p) => { editarPuntoVenta(p); setEditando(null); }} />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>LISTA DE PUNTOS DE VENTA</h1>
        <button className={styles.btnPrimary} onClick={() => setCreando(true)}>AÑADIR</button>
      </div>

      <div className={styles.tableWrapper}>
        <h2 className={styles.subtitulo}>PUNTOS DE VENTA</h2>
        <hr className={styles.divider} />
        <p className={styles.hint}>DE CLICK AL NOMBRE PARA CONSULTAR LA INFORMACIÓN DEL PUNTO DE VENTA</p>

        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.thCheck}>
                <input type="checkbox" checked={allChecked} onChange={(e) => toggleAll(e.target.checked)} className={styles.checkbox} />
              </th>
              <th>NOMBRE</th>
              <th>DIRECCION PTDO DE VENTA</th>
              <th>PRODUCTOS NEGOCIADOS</th>
              <th>FECHA DEPARTAMENTO</th>
              <th>FECHA RECOGEDOR PRODUCTO</th>
              <th>ESTADO</th>
              <th className={styles.thFiltros}>
                <span className={styles.filtrosLink} onClick={() => setModalFiltros(true)}>FILTROS</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {puntosVentaFiltrados.map((p) => (
              <tr key={p.id} className={styles.row}>
                <td className={styles.tdCheck}>
                  <input type="checkbox" checked={p.checked} onChange={() => toggleCheck(p.id)} className={styles.checkbox} />
                </td>
                <td className={styles.tdNombre} onClick={() => setPuntoVentaSeleccionado(p)}>{p.nombre}</td>
                <td>{p.direccion.length > 25 ? p.direccion.slice(0, 23) + '...' : p.direccion}</td>
                <td>{p.productosNegociados.length > 0 ? p.productosNegociados.join(', ') : 'Sin productos'}</td>
                <td>{p.fechaDepartamento}</td>
                <td>{p.fechaRecogedor}</td>
                <td>
                  <span
                    className={`${styles.badge} ${styles[p.estadoKey]} ${styles.badgeClickable}`}
                    onClick={() => setModalEstado(p.id)}
                    title="Cambiar estado"
                  >
                    {p.estado} ▾
                  </span>
                </td>
                <td className={styles.tdAcciones}>
                  <button className={styles.actionBtn} onClick={() => setEditando(p)}>EDITAR</button>
                  <button className={styles.actionBtnEliminar} onClick={() => eliminarPuntoVenta(p.id)}>ELIMINAR</button>
                </td>
              </tr>
            ))}
            {puntosVentaFiltrados.length === 0 && (
              <tr><td colSpan={8} className={styles.vacio}>No hay puntos de venta registrados.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de filtros */}
      {modalFiltros && (
        <div className={styles.overlay} onClick={() => setModalFiltros(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitulo}>FILTROS</h3>
            <div className={styles.modalForm}>
              <div className={styles.campo}>
                <label className={styles.label}>Estado</label>
                <select
                  className={styles.select}
                  value={filtros.estado}
                  onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
                >
                  <option value="">Todos</option>
                  {ESTADOS.map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.modalBotones}>
              <button className={styles.btnCancelar} onClick={limpiarFiltros}>LIMPIAR</button>
              <button className={styles.btnGuardar} onClick={() => aplicarFiltros(filtros)}>APLICAR</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal cambiar estado */}
      {modalEstado && (
        <div className={styles.overlay} onClick={() => setModalEstado(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitulo}>Actualizar estado</h3>
            <p className={styles.modalSub}>Selecciona el nuevo estado del punto de venta</p>
            <div className={styles.modalOpciones}>
              {ESTADOS.map((estado) => (
                <button
                  key={estado}
                  className={styles.modalOpcion}
                  onClick={() => { actualizarEstado(modalEstado, estado); setModalEstado(null); }}
                >
                  {estado}
                </button>
              ))}
            </div>
            <button className={styles.modalCerrar} onClick={() => setModalEstado(null)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}
