import { useState } from 'react';
import styles from './Pedidos.module.css';
import CrearPedido from './CrearPedido';
import EditarPedido from './EditarPedido';
import { usePedidos } from '../hooks/usePedidos';
import { useAlmacenes } from '../hooks/useAlmacenes';
import { useProveedores } from '../hooks/useProveedores';
import { usePuntosVenta } from '../hooks/usePuntosVenta';
import { useTransporte } from '../hooks/useTransporte';

const ESTADOS = ['EN RECOLECCION', 'EN TRANSPORTE'];

function DetalleModal({ pedido, onCerrar }) {
  const cls = {
    recibido: styles.recibido,
    cancelado: styles.cancelado,
    transporte: styles.transporte,
    recoleccion: styles.recoleccion,
  }[pedido.estadoKey] ?? styles.recoleccion;

  return (
    <div className={styles.modalOverlay} onClick={onCerrar}>
      <div className={styles.modalDetalle} onClick={(e) => e.stopPropagation()}>
        <div className={styles.detalleHeader}>
          <div>
            <h2 className={styles.detalleTitulo}>{pedido.nombre}</h2>
            <span className={`${styles.badge} ${cls}`}>{pedido.estado}</span>
          </div>
          <button className={styles.btnCerrarX} onClick={onCerrar}>✕</button>
        </div>
        <hr className={styles.modalDivider} />
        <div className={styles.detalleGrid}>
          <div className={styles.detalleItem}>
            <span className={styles.detalleLabel}>Proveedor</span>
            <span className={styles.detalleVal}>{pedido.proveedor || '—'}</span>
          </div>
          <div className={styles.detalleItem}>
            <span className={styles.detalleLabel}>Fecha de pedido</span>
            <span className={styles.detalleVal}>{pedido.fecha}</span>
          </div>
          <div className={styles.detalleItem}>
            <span className={styles.detalleLabel}>Producto</span>
            <span className={styles.detalleVal}>
              {pedido.producto ? <span className={styles.productoBadge}>{pedido.producto}</span> : '—'}
            </span>
          </div>
          <div className={styles.detalleItem}>
            <span className={styles.detalleLabel}>Cantidad</span>
            <span className={styles.detalleVal}>{pedido.cantidad || '—'}</span>
          </div>
          <div className={styles.detalleItem}>
            <span className={styles.detalleLabel}>Punto de venta</span>
            <span className={styles.detalleVal}>{pedido.puntoVenta || '—'}</span>
          </div>
          <div className={styles.detalleItem}>
            <span className={styles.detalleLabel}>Almacén destino</span>
            <span className={styles.detalleVal}>{pedido.almacen || '—'}</span>
          </div>
          <div className={styles.detalleItem}>
            <span className={styles.detalleLabel}>Transportista</span>
            <span className={styles.detalleVal}>{pedido.transportista || '—'}</span>
          </div>
          <div className={styles.detalleItem}>
            <span className={styles.detalleLabel}>Fecha de recolección</span>
            <span className={styles.detalleVal}>{pedido.fechaRecoleccion || '—'}</span>
          </div>
          {pedido.fechaEntrega && (
            <div className={styles.detalleItem}>
              <span className={styles.detalleLabel}>Fecha de entrega</span>
              <span className={styles.detalleVal}>{pedido.fechaEntrega}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Pedidos() {
  const [activeTab, setActiveTab] = useState('pedidos');
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [creando, setCreando] = useState(false);
  const [editando, setEditando] = useState(null);
  const [modalEstado, setModalEstado] = useState(null);
  const [modalCancelar, setModalCancelar] = useState(null);
  const [modalFiltros, setModalFiltros] = useState(false);
  const [filtros, setFiltros] = useState({ estado: '', proveedor: '' });
  const [filtrosTemp, setFiltrosTemp] = useState({ estado: '', proveedor: '' });

  const { pedidos, agregarPedido, actualizarEstado, editarPedido, toggleCheck, toggleAll } = usePedidos();
  const { almacenes } = useAlmacenes();
  const { proveedores } = useProveedores();
  const { puntosVenta } = usePuntosVenta();
  const { transportes } = useTransporte();

  const pedidosActivos = pedidos.filter(p => p.estado !== 'RECIBIDO' && p.estado !== 'CANCELADO');
  const pedidosHistorial = pedidos.filter(p => p.estado === 'RECIBIDO' || p.estado === 'CANCELADO');

  const pedidosActivosFiltrados = pedidosActivos.filter(p => {
    if (filtros.estado && p.estado !== filtros.estado) return false;
    if (filtros.proveedor && !p.proveedor?.toLowerCase().includes(filtros.proveedor.toLowerCase())) return false;
    return true;
  });

  const hayFiltrosActivos = filtros.estado || filtros.proveedor;
  const allChecked = pedidosActivosFiltrados.length > 0 && pedidosActivosFiltrados.every((p) => p.checked);

  const handleCrear = (nuevoPedido) => {
    agregarPedido({ ...nuevoPedido, id: pedidos.length + 1 });
    setCreando(false);
  };

  const handleCancelar = (id) => {
    actualizarEstado(id, 'CANCELADO');
    setModalCancelar(null);
  };

  if (creando) {
    return (
      <CrearPedido
        onVolver={() => setCreando(false)}
        onCrear={handleCrear}
        totalPedidos={pedidos.length}
        almacenes={almacenes}
        proveedores={proveedores}
        puntosVenta={puntosVenta}
        transportes={transportes}
      />
    );
  }

  if (editando) {
    return (
      <EditarPedido
        pedido={editando}
        onVolver={() => setEditando(null)}
        onGuardar={(p) => { editarPedido(p); setEditando(null); }}
        almacenes={almacenes}
        proveedores={proveedores}
        puntosVenta={puntosVenta}
        transportes={transportes}
      />
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>LISTA DE PEDIDOS</h1>
        <div className={styles.headerActions}>
          <button className={styles.btnPrimary} onClick={() => setCreando(true)}>CREAR</button>
        </div>
      </div>

      <div className={styles.tabs}>
        <button className={`${styles.tab} ${activeTab === 'pedidos' ? styles.tabActive : ''}`} onClick={() => setActiveTab('pedidos')}>
          PEDIDOS
        </button>
        <button className={`${styles.tab} ${activeTab === 'historial' ? styles.tabActive : ''}`} onClick={() => setActiveTab('historial')}>
          HISTORIAL DE PEDIDOS A PROVEEDORES
        </button>
      </div>

      {activeTab === 'pedidos' && (
        <div className={styles.tableWrapper}>
          <p className={styles.hint}>DE CLICK AL NOMBRE PARA CONSULTAR LA INFORMACIÓN DEL PEDIDO</p>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.thCheck}>
                  <input type="checkbox" checked={allChecked} onChange={(e) => toggleAll(e.target.checked)} className={styles.checkbox} />
                </th>
                <th>NOMBRE</th>
                <th>FECHA</th>
                <th>PROVEEDOR</th>
                <th>ESTADO</th>
                <th className={styles.thFiltros}>
                  <span
                    className={`${styles.filtrosLink} ${hayFiltrosActivos ? styles.filtrosActivos : ''}`}
                    onClick={() => { setFiltrosTemp({ ...filtros }); setModalFiltros(true); }}
                  >
                    FILTROS {hayFiltrosActivos ? '●' : ''}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {pedidosActivosFiltrados.map((pedido) => (
                <tr key={pedido.id} className={styles.row}>
                  <td className={styles.tdCheck}>
                    <input type="checkbox" checked={pedido.checked} onChange={() => toggleCheck(pedido.id)} className={styles.checkbox} />
                  </td>
                  <td className={styles.tdNombre} onClick={() => setPedidoSeleccionado(pedido)}>{pedido.nombre}</td>
                  <td>{pedido.fecha}</td>
                  <td>{pedido.proveedor}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${styles[pedido.estadoKey]} ${styles.badgeClickable}`}
                      onClick={() => setModalEstado(pedido.id)}
                      title="Cambiar estado"
                    >
                      {pedido.estado} ▾
                    </span>
                  </td>
                  <td className={styles.tdAcciones}>
                    <button className={styles.actionBtn} onClick={() => setEditando(pedido)}>EDITAR</button>
                    <button className={styles.actionBtnCancel} onClick={() => setModalCancelar(pedido.id)}>CANCELAR</button>
                  </td>
                </tr>
              ))}
              {pedidosActivosFiltrados.length === 0 && (
                <tr><td colSpan={6} className={styles.vacio}>{hayFiltrosActivos ? 'No hay pedidos con esos filtros.' : 'No hay pedidos activos.'}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'historial' && (
        <div className={styles.tableWrapper}>
          <p className={styles.hint}>PEDIDOS RECIBIDOS O CANCELADOS</p>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>NOMBRE</th>
                <th>FECHA</th>
                <th>PROVEEDOR</th>
                <th>ESTADO</th>
              </tr>
            </thead>
            <tbody>
              {pedidosHistorial.map((pedido) => (
                <tr key={pedido.id} className={styles.row}>
                  <td className={styles.tdNombre} onClick={() => setPedidoSeleccionado(pedido)}>{pedido.nombre}</td>
                  <td>{pedido.fecha}</td>
                  <td>{pedido.proveedor}</td>
                  <td><span className={`${styles.badge} ${styles[pedido.estadoKey]}`}>{pedido.estado}</span></td>
                </tr>
              ))}
              {pedidosHistorial.length === 0 && (
                <tr><td colSpan={4} className={styles.vacio}>No hay pedidos en el historial aún.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail overlay modal */}
      {pedidoSeleccionado && (
        <DetalleModal pedido={pedidoSeleccionado} onCerrar={() => setPedidoSeleccionado(null)} />
      )}

      {/* Modal cambiar estado */}
      {modalEstado && (
        <div className={styles.modalOverlay} onClick={() => setModalEstado(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitulo}>Actualizar estado</h3>
            <p className={styles.modalSub}>Selecciona el nuevo estado del pedido</p>
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

      {/* Modal filtros */}
      {modalFiltros && (
        <div className={styles.modalOverlay} onClick={() => setModalFiltros(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitulo}>FILTROS</h3>
            <div className={styles.modalFiltrosForm}>
              <div className={styles.modalFiltrosCampo}>
                <label className={styles.modalFiltrosLabel}>Estado</label>
                <select
                  className={styles.modalFiltrosSelect}
                  value={filtrosTemp.estado}
                  onChange={(e) => setFiltrosTemp({ ...filtrosTemp, estado: e.target.value })}
                >
                  <option value="">Todos</option>
                  {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div className={styles.modalFiltrosCampo}>
                <label className={styles.modalFiltrosLabel}>Proveedor</label>
                <input
                  className={styles.modalFiltrosInput}
                  type="text"
                  placeholder="Buscar proveedor..."
                  value={filtrosTemp.proveedor}
                  onChange={(e) => setFiltrosTemp({ ...filtrosTemp, proveedor: e.target.value })}
                />
              </div>
            </div>
            <div className={styles.modalOpciones}>
              <button className={styles.modalOpcion} onClick={() => { setFiltros({ ...filtrosTemp }); setModalFiltros(false); }}>
                APLICAR
              </button>
              <button className={styles.modalOpcionCancelar} onClick={() => { setFiltros({ estado: '', proveedor: '' }); setFiltrosTemp({ estado: '', proveedor: '' }); setModalFiltros(false); }}>
                LIMPIAR FILTROS
              </button>
            </div>
            <button className={styles.modalCerrar} onClick={() => setModalFiltros(false)}>Cancelar</button>
          </div>
        </div>
      )}

      {/* Modal confirmar cancelar */}
      {modalCancelar && (
        <div className={styles.modalOverlay} onClick={() => setModalCancelar(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitulo}>¿Cancelar pedido?</h3>
            <p className={styles.modalSub}>Esta acción moverá el pedido al historial como cancelado.</p>
            <div className={styles.modalOpciones}>
              <button className={styles.modalOpcionCancelar} onClick={() => handleCancelar(modalCancelar)}>SÍ, CANCELAR</button>
              <button className={styles.modalOpcion} onClick={() => setModalCancelar(null)}>NO, VOLVER</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
