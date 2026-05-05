import { useState } from 'react';
import styles from './Pedidos.module.css';
import PedidoDetalle from './Pedidodetalle';
import CrearPedido from './CrearPedido';
import EditarPedido from './EditarPedido';
import { usePedidos } from '../hooks/usePedidos';
import { useAlmacenes } from '../hooks/useAlmacenes';

const ESTADOS = ['EN RECOLECCION', 'EN TRANSPORTE', 'RECIBIDO'];

export default function Pedidos() {
  const [activeTab, setActiveTab] = useState('pedidos');
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [creando, setCreando] = useState(false);
  const [editando, setEditando] = useState(null);
  const [modalEstado, setModalEstado] = useState(null); // id del pedido
  const [modalCancelar, setModalCancelar] = useState(null); // id del pedido

  const { pedidos, agregarPedido, actualizarEstado, editarPedido, toggleCheck, toggleAll } = usePedidos();
  const { almacenes } = useAlmacenes();

  const allChecked = pedidos.filter(p => p.estado !== 'CANCELADO' && p.estado !== 'RECIBIDO').every((p) => p.checked);

  const pedidosActivos = pedidos.filter(p => p.estado !== 'RECIBIDO' && p.estado !== 'CANCELADO');
  const pedidosHistorial = pedidos.filter(p => p.estado === 'RECIBIDO' || p.estado === 'CANCELADO');

  const handleCrear = (nuevoPedido) => {
    agregarPedido({ ...nuevoPedido, id: pedidos.length + 1 });
    setCreando(false);
  };

  const handleCancelar = (id) => {
    actualizarEstado(id, 'CANCELADO');
    setModalCancelar(null);
  };

  if (pedidoSeleccionado) {
    return <PedidoDetalle pedido={pedidoSeleccionado} onVolver={() => setPedidoSeleccionado(null)} />;
  }
  if (creando) {
    return <CrearPedido onVolver={() => setCreando(false)} onCrear={handleCrear} totalPedidos={pedidos.length} almacenes={almacenes} />;
  }
  if (editando) {
    return <EditarPedido pedido={editando} onVolver={() => setEditando(null)} onGuardar={(p) => { editarPedido(p); setEditando(null); }} almacenes={almacenes} />;
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
                <th className={styles.thFiltros}><span className={styles.filtrosLink}>FILTROS</span></th>
              </tr>
            </thead>
            <tbody>
              {pedidosActivos.map((pedido) => (
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
              {pedidosActivos.length === 0 && (
                <tr><td colSpan={6} className={styles.vacio}>No hay pedidos activos.</td></tr>
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