import { useState } from 'react';
import { usePedidos } from '../hooks/usePedidos';
import { useInventarios } from '../hooks/useInventarios';
import { useEntregas } from '../hooks/useEntregas';
import PedidoDetalle from './PedidoDetalle';
import styles from './AlmacenDetalle.module.css';

export default function AlmacenDetalle({ almacen, onVolver }) {
  const [tabActivo, setTabActivo] = useState('inventario');
  const [modalRecibir, setModalRecibir] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [editandoItem, setEditandoItem] = useState(null);
  const [confirmarEliminar, setConfirmarEliminar] = useState(null);
  const { pedidos, actualizarEstado } = usePedidos();
  const { inventarios, agregarProducto, eliminarProducto, editarProducto } = useInventarios();
  const { entregas } = useEntregas();

  const entregasAlmacen = entregas.filter((e) => e.almacenId === almacen.id);
  const inventario = inventarios[almacen.id] || [];

  const pedidosEnTransporte = pedidos.filter(
    (p) => p.estado === 'EN TRANSPORTE' &&
      p.almacen?.toUpperCase() === almacen.nombre?.toUpperCase()
  );

  const pedidosEnRecoleccion = pedidos.filter(
    (p) => p.estado === 'EN RECOLECCION' &&
      p.almacen?.toUpperCase() === almacen.nombre?.toUpperCase()
  );

  const capacidadTotal = parseInt(almacen.capacidad) || 100;
  const pesoTotal = inventario.reduce((sum, item) => sum + item.cantidad, 0);
  const disponibleKG = Math.max(0, capacidadTotal - pesoTotal);
  const porcentajeUsado = Math.round((pesoTotal / capacidadTotal) * 100);
  const porcentajeDisponible = Math.max(0, 100 - porcentajeUsado);

  const crearProductoRecibido = (pedido) => {
    const cantidadKG = parseInt(pedido.cantidad) || 0;
    return {
      id: `pedido-${pedido.id}`,
      nombre: pedido.producto || pedido.nombre,
      cantidad: cantidadKG,
      fechaIngreso: new Date().toLocaleDateString('es-CR').replace(/\//g, '-'),
      puntoVenta: pedido.puntoVenta || '',
      proveedor: pedido.proveedor || '',
      fechaEntrega: pedido.fechaRecoleccion || '',
      estado: 'EN ALMACEN',
      estadoKey: 'enalmacen'
    };
  };

  const handleRecibirProducto = (pedido) => {
    const nuevoProducto = crearProductoRecibido(pedido);
    agregarProducto(almacen.id, nuevoProducto);
    actualizarEstado(pedido.id, 'RECIBIDO');
    setModalRecibir(false);
  };

  const handleGuardarEdicion = (datosActualizados) => {
    editarProducto(almacen.id, editandoItem.id, datosActualizados);
    setEditandoItem(null);
  };

  const handleConfirmarEliminar = () => {
    eliminarProducto(almacen.id, confirmarEliminar.id);
    setConfirmarEliminar(null);
  };

  if (pedidoSeleccionado) {
    return <PedidoDetalle pedido={pedidoSeleccionado} onVolver={() => setPedidoSeleccionado(null)} />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{almacen.nombre}</h1>
      </div>

      {pedidosEnTransporte.length > 0 && (
        <div className={styles.alertaBanner}>
          <span className={styles.alertaTexto}>
            🚚 {pedidosEnTransporte.length} pedido{pedidosEnTransporte.length > 1 ? 's' : ''} en camino — listo{pedidosEnTransporte.length > 1 ? 's' : ''} para recibir
          </span>
          <button className={styles.btnAlerta} onClick={() => setModalRecibir(true)}>
            RECIBIR AHORA
          </button>
        </div>
      )}
      {pedidosEnRecoleccion.length > 0 && (
        <div className={styles.infoBanner}>
          <span className={styles.infoTexto}>
            📦 {pedidosEnRecoleccion.length} pedido{pedidosEnRecoleccion.length > 1 ? 's' : ''} en recolección con el proveedor
          </span>
        </div>
      )}

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tabActivo === 'inventario' ? styles.tabActivo : ''}`}
          onClick={() => setTabActivo('inventario')}
        >
          Inventario
        </button>
        <button
          className={`${styles.tab} ${tabActivo === 'transporte' ? styles.tabActivo : ''}`}
          onClick={() => setTabActivo('transporte')}
        >
          Transporte del almacen
        </button>
      </div>
      <hr className={styles.divider} />

      {tabActivo === 'inventario' && (
        <div className={styles.tabContent}>
          <div className={styles.disponibilidadBox}>
            <div className={styles.disponibilidadLabel}>DISPONIBILIDAD</div>
            <div className={styles.disponibilidadBarContainer}>
              <div className={styles.disponibilidadBar}>
                {porcentajeUsado > 0 && (
                  <div
                    className={styles.disponibilidadFill}
                    style={{ width: `${porcentajeUsado}%` }}
                  >
                    {porcentajeUsado > 5 && <span className={styles.disponibilidadText}>EN USO</span>}
                  </div>
                )}
                <div className={styles.disponibilidadRestante}>
                  {porcentajeDisponible > 5 && <span className={styles.disponibilidadText}>DISPONIBLE</span>}
                </div>
              </div>
            </div>
            <div className={styles.disponibilidadValue}>{disponibleKG} KG</div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>NOMBRE</th>
                  <th>CANTIDAD</th>
                  <th>FECHA DE INGRESO</th>
                  <th>PUNTO DE VENTA</th>
                  <th>PROVEEDOR</th>
                  <th>FECHA DE ENTREGA</th>
                  <th>ESTADO</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {inventario.length > 0 ? (
                  inventario.map((item) => (
                    <tr key={item.id} className={styles.row}>
                      <td>{item.nombre}</td>
                      <td>{item.cantidad} KG</td>
                      <td>{item.fechaIngreso}</td>
                      <td>{item.puntoVenta || '—'}</td>
                      <td>{item.proveedor || '—'}</td>
                      <td>{item.fechaEntrega || '—'}</td>
                      <td>
                        <span className={`${styles.badge} ${styles[item.estadoKey] || styles.enalmacen}`}>
                          {item.estado || 'EN ALMACEN'}
                        </span>
                      </td>
                      <td className={styles.tdAcciones}>
                        <button
                          className={styles.actionBtn}
                          onClick={() => setEditandoItem(item)}
                        >
                          EDITAR
                        </button>
                        <button
                          className={styles.actionBtnEliminar}
                          onClick={() => setConfirmarEliminar(item)}
                        >
                          ELIMINAR
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className={styles.vacio}>No hay productos en el inventario</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tabActivo === 'transporte' && (
        <div className={styles.tabContent}>
          <div className={styles.transporteGrid}>
            <div className={styles.transporteCard}>
              <div className={styles.transporteCardTitle}>INFORMACIÓN DE TRANSPORTE</div>
              <div className={styles.transporteInfoList}>
                <div className={styles.transporteItem}>
                  <span className={styles.transporteLabel}>Vehículos disponibles:</span>
                  <span className={styles.transporteVal}>{almacen.transporte}</span>
                </div>
                <div className={styles.transporteItem}>
                  <span className={styles.transporteLabel}>Encargado:</span>
                  <span className={styles.transporteVal}>{almacen.encargado}</span>
                </div>
                <div className={styles.transporteItem}>
                  <span className={styles.transporteLabel}>Teléfono de contacto:</span>
                  <span className={styles.transporteVal}>{almacen.telefono}</span>
                </div>
                <div className={styles.transporteItem}>
                  <span className={styles.transporteLabel}>Dirección:</span>
                  <span className={styles.transporteVal}>{almacen.direccion}</span>
                </div>
                <div className={styles.transporteItem}>
                  <span className={styles.transporteLabel}>Estado del almacén:</span>
                  <span className={`${styles.badge} ${styles[almacen.estadoKey]}`}>{almacen.estado}</span>
                </div>
                <div className={styles.transporteItem}>
                  <span className={styles.transporteLabel}>Capacidad total:</span>
                  <span className={styles.transporteVal}>{almacen.capacidad} KG</span>
                </div>
              </div>
            </div>
          </div>

          <h3 className={styles.sectionTitle}>ENTREGAS REALIZADAS DESDE ESTE ALMACÉN</h3>
          <p className={styles.sectionHint}>Historial de productos enviados a puntos de venta</p>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>FECHA</th>
                  <th>PUNTO DE VENTA DESTINO</th>
                  <th>PRODUCTOS</th>
                  <th>TOTAL KG</th>
                  <th>ESTADO</th>
                </tr>
              </thead>
              <tbody>
                {entregasAlmacen.length > 0 ? entregasAlmacen.map((e) => (
                  <tr key={e.id} className={styles.row}>
                    <td>{e.fecha}</td>
                    <td>{e.puntoVentaNombre}</td>
                    <td>{e.productos.map((p) => `${p.nombre} (${p.cantidad}KG)`).join(', ')}</td>
                    <td>{e.productos.reduce((s, p) => s + p.cantidad, 0)} KG</td>
                    <td><span className={`${styles.badge} ${styles.entregado}`}>{e.estado}</span></td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} className={styles.vacio}>No hay entregas registradas para este almacén</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Recibir Producto */}
      {modalRecibir && (
        <div className={styles.overlay} onClick={() => setModalRecibir(false)}>
          <div className={styles.modalRecibir} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitulo}>Recepcion de productos</h2>
            <hr className={styles.modalDivider} />
            <div className={styles.modalContent}>
              <h3 className={styles.modalSubtitulo}>SELECCIONAR PEDIDO</h3>
              <table className={styles.modalTable}>
                <thead>
                  <tr>
                    <th>NOMBRE</th>
                    <th>FECHA</th>
                    <th>PROVEEDOR</th>
                    <th>ESTADO</th>
                    <th className={styles.thAcciones}>ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidosEnTransporte.length > 0 ? (
                    pedidosEnTransporte.map((pedido) => (
                      <tr key={pedido.id}>
                        <td>{pedido.nombre}</td>
                        <td>{pedido.fecha}</td>
                        <td>{pedido.proveedor}</td>
                        <td>
                          <span className={`${styles.badge} ${styles.entransporte}`}>
                            EN TRANSPORTE
                          </span>
                        </td>
                        <td className={styles.modalTdAcciones}>
                          <button className={styles.btnInfo} onClick={() => setPedidoSeleccionado(pedido)}>
                            INFORMACIÓN
                          </button>
                          <button className={styles.btnRecibir} onClick={() => handleRecibirProducto(pedido)}>
                            RECIBIR
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className={styles.vacio}>No hay pedidos en transporte</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <button className={styles.btnVolver} onClick={() => setModalRecibir(false)}>
              VOLVER
            </button>
          </div>
        </div>
      )}

      {/* Modal Editar Producto */}
      {editandoItem && (
        <EditarItemModal
          item={editandoItem}
          onGuardar={handleGuardarEdicion}
          onCerrar={() => setEditandoItem(null)}
        />
      )}

      {/* Modal Confirmar Eliminar */}
      {confirmarEliminar && (
        <div className={styles.overlay} onClick={() => setConfirmarEliminar(null)}>
          <div className={styles.modalConfirmar} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitulo}>¿Eliminar producto?</h3>
            <p className={styles.modalSubConfirm}>
              Se eliminará <strong>{confirmarEliminar.nombre}</strong> ({confirmarEliminar.cantidad} KG) del inventario. Esta acción no se puede deshacer.
            </p>
            <div className={styles.modalBotones}>
              <button className={styles.btnCancelar} onClick={() => setConfirmarEliminar(null)}>
                CANCELAR
              </button>
              <button className={styles.btnEliminarConfirm} onClick={handleConfirmarEliminar}>
                ELIMINAR
              </button>
            </div>
          </div>
        </div>
      )}

      <button className={styles.btnVolver} onClick={onVolver}>
        VOLVER
      </button>
    </div>
  );
}

function EditarItemModal({ item, onGuardar, onCerrar }) {
  const [form, setForm] = useState({
    nombre: item.nombre || '',
    cantidad: item.cantidad || 0,
    fechaIngreso: item.fechaIngreso || '',
    proveedor: item.proveedor || '',
    puntoVenta: item.puntoVenta || '',
    fechaEntrega: item.fechaEntrega || '',
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => { const { [k]: _, ...r } = p; return r; });
  };

  const handleGuardar = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = true;
    if (!form.cantidad || Number(form.cantidad) <= 0) e.cantidad = true;
    setErrors(e);
    if (Object.keys(e).length === 0) {
      onGuardar({ ...form, cantidad: Number(form.cantidad) });
    }
  };

  return (
    <div className={styles.overlay} onClick={onCerrar}>
      <div className={styles.modalEditar} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalEditarHeader}>
          <h2 className={styles.modalTitulo}>EDITAR PRODUCTO</h2>
          <button className={styles.btnCerrarX} onClick={onCerrar}>✕</button>
        </div>
        <hr className={styles.modalDivider} />
        <div className={styles.modalGrid}>
          <div className={`${styles.campo} ${styles.campoFull}`}>
            <label className={styles.label}>NOMBRE *</label>
            <input
              className={`${styles.input} ${errors.nombre ? styles.inputError : ''}`}
              value={form.nombre}
              onChange={(e) => set('nombre', e.target.value)}
            />
          </div>
          <div className={styles.campo}>
            <label className={styles.label}>CANTIDAD (KG) *</label>
            <input
              type="number"
              min={1}
              className={`${styles.input} ${errors.cantidad ? styles.inputError : ''}`}
              value={form.cantidad}
              onChange={(e) => set('cantidad', e.target.value)}
            />
          </div>
          <div className={styles.campo}>
            <label className={styles.label}>FECHA DE INGRESO</label>
            <input
              className={styles.input}
              value={form.fechaIngreso}
              onChange={(e) => set('fechaIngreso', e.target.value)}
              placeholder="DD-MM-AAAA"
            />
          </div>
          <div className={styles.campo}>
            <label className={styles.label}>PROVEEDOR</label>
            <input
              className={styles.input}
              value={form.proveedor}
              onChange={(e) => set('proveedor', e.target.value)}
            />
          </div>
          <div className={styles.campo}>
            <label className={styles.label}>PUNTO DE VENTA</label>
            <input
              className={styles.input}
              value={form.puntoVenta}
              onChange={(e) => set('puntoVenta', e.target.value)}
            />
          </div>
          <div className={`${styles.campo} ${styles.campoFull}`}>
            <label className={styles.label}>FECHA DE ENTREGA</label>
            <input
              className={styles.input}
              value={form.fechaEntrega}
              onChange={(e) => set('fechaEntrega', e.target.value)}
              placeholder="DD-MM-AAAA"
            />
          </div>
        </div>
        <div className={styles.modalBotones}>
          <button className={styles.btnCancelar} onClick={onCerrar}>CANCELAR</button>
          <button className={styles.btnGuardar} onClick={handleGuardar}>GUARDAR</button>
        </div>
      </div>
    </div>
  );
}
