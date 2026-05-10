import { useState } from 'react';
import { useAlmacenes } from '../hooks/useAlmacenes';
import { useInventarios } from '../hooks/useInventarios';
import { usePedidos } from '../hooks/usePedidos';
import AlmacenDetalle from './AlmacenDetalle';
import CrearAlmacen from './CrearAlmacen';
import EditarAlmacen from './EditarAlmacen';
import styles from './Almacenes.module.css';

const ESTADOS = ['ACTIVO', 'MANTENIMIENTO', 'INACTIVO'];

function calcularDisponibilidad(almacenId, capacidad, inventarios) {
  const inventario = inventarios[almacenId] || [];
  const capacidadTotal = parseInt(capacidad, 10) || 100;
  const pesoTotal = inventario.reduce((sum, item) => sum + (parseInt(item.cantidad, 10) || 0), 0);
  const porcentajeUsado = capacidadTotal ? Math.round((pesoTotal / capacidadTotal) * 100) : 0;
  return Math.max(0, Math.min(100, 100 - porcentajeUsado));
}

export default function Almacenes() {
  const [modalFiltros, setModalFiltros] = useState(false);
  const [filtros, setFiltros] = useState({ estado: '', disponibilidadMin: '', disponibilidadMax: '' });
  const [almacenSeleccionado, setAlmacenSeleccionado] = useState(null);
  const [almacenInfo, setAlmacenInfo] = useState(null);
  const [creando, setCreando] = useState(false);
  const [editando, setEditando] = useState(null);
  const [modalEstado, setModalEstado] = useState(null);

  const { almacenes, agregarAlmacen, editarAlmacen, eliminarAlmacen, actualizarEstado, toggleCheck, toggleAll } = useAlmacenes();
  const { inventarios } = useInventarios();
  const { pedidos } = usePedidos();

  const pedidosPendientesPorAlmacen = (nombreAlmacen) =>
    pedidos.filter(
      (p) =>
        (p.estado === 'EN TRANSPORTE' || p.estado === 'EN RECOLECCION') &&
        p.almacen?.toUpperCase() === nombreAlmacen?.toUpperCase()
    ).length;

  const almacenesConDisponibilidad = almacenes.map((a) => ({
    ...a,
    disponibilidad: calcularDisponibilidad(a.id, a.capacidad, inventarios)
  }));

  // Aplicar filtros
  const almacenesFiltrados = almacenesConDisponibilidad.filter((a) => {
    if (filtros.estado && a.estado !== filtros.estado) return false;
    if (filtros.disponibilidadMin && a.disponibilidad < Number(filtros.disponibilidadMin)) return false;
    if (filtros.disponibilidadMax && a.disponibilidad > Number(filtros.disponibilidadMax)) return false;
    return true;
  });

  const allChecked = almacenesFiltrados.every((a) => a.checked);

  const aplicarFiltros = (nuevosFiltros) => {
    setFiltros(nuevosFiltros);
    setModalFiltros(false);
  };

  const limpiarFiltros = () => {
    setFiltros({ estado: '', disponibilidadMin: '', disponibilidadMax: '' });
    setModalFiltros(false);
  };

  const handleCrear = (nuevoAlmacen) => {
    agregarAlmacen(nuevoAlmacen);
    setCreando(false);
  };

  if (almacenSeleccionado) {
    return <AlmacenDetalle almacen={almacenSeleccionado} onVolver={() => setAlmacenSeleccionado(null)} />;
  }

  if (creando) {
    return <CrearAlmacen onVolver={() => setCreando(false)} onCrear={handleCrear} />;
  }

  if (editando) {
    return <EditarAlmacen almacen={editando} onVolver={() => setEditando(null)} onGuardar={(a) => { editarAlmacen(a); setEditando(null); }} />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>LISTA DE ALMACENES</h1>
        <button className={styles.btnPrimary} onClick={() => setCreando(true)}>AÑADIR</button>
      </div>

      <div className={styles.tableWrapper}>
        <h2 className={styles.subtitulo}>ALMACENES</h2>
        <hr className={styles.divider} />
        <p className={styles.hint}>DE CLICK AL NOMBRE PARA CONSULTAR EL INVENTARIO DEL ALMACEN</p>

          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.thCheck}>
                  <input type="checkbox" checked={allChecked} onChange={(e) => toggleAll(e.target.checked)} className={styles.checkbox} />
                </th>
                <th>NOMBRE</th>
                <th>DIRECCION ALMACEN</th>
                <th>DISPONIBILIDAD</th>
                <th>PEDIDOS PENDIENTES</th>
                <th>ESTADO</th>
                <th className={styles.thFiltros}>
                  <span className={styles.filtrosLink} onClick={() => setModalFiltros(true)}>FILTROS</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {almacenesFiltrados.map((a) => (
                <tr key={a.id} className={styles.row}>
                  <td className={styles.tdCheck}>
                    <input type="checkbox" checked={a.checked} onChange={() => toggleCheck(a.id)} className={styles.checkbox} />
                  </td>
                  <td className={styles.tdNombre} onClick={() => setAlmacenSeleccionado(a)}>{a.nombre}</td>
                  <td>{a.direccion.length > 20 ? a.direccion.slice(0, 18) + '...' : a.direccion}</td>
                  <td>
                    <span className={`${styles.disp} ${styles[colorDisponibilidad(a.disponibilidad)]}`}>
                      {a.disponibilidad}%
                    </span>
                  </td>
                  <td>
                    {(() => {
                      const count = pedidosPendientesPorAlmacen(a.nombre);
                      return count > 0
                        ? <span className={styles.badgePendiente}>⬛ {count} por recibir</span>
                        : <span className={styles.sinPendientes}>—</span>;
                    })()}
                  </td>
                  <td>
                    <span
                      className={`${styles.badge} ${styles[a.estadoKey]} ${styles.badgeClickable}`}
                      onClick={() => setModalEstado(a.id)}
                      title="Cambiar estado"
                    >
                      {a.estado} ▾
                    </span>
                  </td>
                  <td className={styles.tdAcciones}>
                    <button className={styles.actionBtn} onClick={() => setAlmacenInfo(a)}>INFO</button>
                    <button className={styles.actionBtn} onClick={() => setEditando(a)}>EDITAR</button>
                    <button className={styles.actionBtnEliminar} onClick={() => eliminarAlmacen(a.id)}>ELIMINAR</button>
                  </td>
                </tr>
              ))}
              {almacenesFiltrados.length === 0 && (
                <tr><td colSpan={6} className={styles.vacio}>No hay almacenes registrados.</td></tr>
              )}
            </tbody>
          </table>
        </div>

      {/* Modal info almacén — estilo Proveedores */}
      {almacenInfo && (
        <AlmacenInfoModal
          almacen={almacenInfo}
          disponibilidad={calcularDisponibilidad(almacenInfo.id, almacenInfo.capacidad, inventarios)}
          pedidosPendientes={pedidosPendientesPorAlmacen(almacenInfo.nombre)}
          onCerrar={() => setAlmacenInfo(null)}
        />
      )}

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
              <div className={styles.campo}>
                <label className={styles.label}>Disponibilidad mínima (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className={styles.input}
                  value={filtros.disponibilidadMin}
                  onChange={(e) => setFiltros({ ...filtros, disponibilidadMin: e.target.value })}
                />
              </div>
              <div className={styles.campo}>
                <label className={styles.label}>Disponibilidad máxima (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className={styles.input}
                  value={filtros.disponibilidadMax}
                  onChange={(e) => setFiltros({ ...filtros, disponibilidadMax: e.target.value })}
                />
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
            <p className={styles.modalSub}>Selecciona el nuevo estado del almacén</p>
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

function colorDisponibilidad(val) {
  if (val >= 70) return 'verde';
  if (val >= 40) return 'amarillo';
  return 'rojo';
}

function AlmacenInfoModal({ almacen, disponibilidad, pedidosPendientes, onCerrar }) {
  return (
    <div className={styles.infoOverlay} onClick={onCerrar}>
      <div className={styles.infoModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.infoHeader}>
          <div>
            <h2 className={styles.infoTitulo}>{almacen.nombre}</h2>
            <span className={`${styles.badge} ${styles[almacen.estadoKey]}`}>
              {almacen.estado}
            </span>
          </div>
          <button className={styles.btnCerrarX} onClick={onCerrar}>✕</button>
        </div>
        <hr className={styles.infoDivider} />

        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Encargado</span>
            <span className={styles.infoVal}>{almacen.encargado || '—'}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Teléfono</span>
            <span className={styles.infoVal}>{almacen.telefono || '—'}</span>
          </div>
          <div className={`${styles.infoItem} ${styles.campoFull}`}>
            <span className={styles.infoLabel}>Dirección</span>
            <span className={styles.infoVal}>{almacen.direccion || '—'}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Capacidad total</span>
            <span className={styles.infoVal}>{almacen.capacidad} KG</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Disponibilidad</span>
            <span className={`${styles.infoVal} ${styles.disp} ${styles[colorDisponibilidad(disponibilidad)]}`}>
              {disponibilidad}%
            </span>
          </div>
          <div className={`${styles.infoItem} ${styles.campoFull}`}>
            <span className={styles.infoLabel}>Transporte asignado</span>
            <span className={styles.infoVal}>{almacen.transporte || '—'}</span>
          </div>
          <div className={`${styles.infoItem} ${styles.campoFull}`}>
            <span className={styles.infoLabel}>Pedidos pendientes</span>
            <span className={styles.infoVal}>
              {pedidosPendientes > 0
                ? <span className={styles.badgePendiente}>⬛ {pedidosPendientes} por recibir</span>
                : <span className={styles.sinPendientes}>Ninguno</span>}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}