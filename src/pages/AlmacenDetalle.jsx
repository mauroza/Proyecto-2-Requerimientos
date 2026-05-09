import { useState } from 'react';
import { usePedidos } from '../hooks/usePedidos';
import { useInventarios } from '../hooks/useInventarios';
import { useEntregas } from '../hooks/useEntregas';
import PedidoDetalle from './PedidoDetalle';
import styles from './AlmacenDetalle.module.css';

// Datos quemados de inventario por almacén - se actualiza al recibir productos
const initialInventariosData = {
  1: [],
  2: [],
  3: [],
};

export default function AlmacenDetalle({ almacen, onVolver }) {
  const [tabActivo, setTabActivo] = useState('inventario');
  const [modalRecibir, setModalRecibir] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const { pedidos, actualizarEstado } = usePedidos();
  const { inventarios, agregarProducto } = useInventarios();
  const { entregas } = useEntregas();

  const entregasAlmacen = entregas.filter((e) => e.almacenId === almacen.id);
  
  // Obtener inventario del almacén
  const inventario = inventarios[almacen.id] || [];
  
  // Obtener pedidos en transporte destinados a este almacén
  const pedidosEnTransporte = pedidos.filter(
    (p) => p.estado === 'EN TRANSPORTE' && (
      p.almacen.toUpperCase().includes(almacen.nombre.split(' ')[almacen.nombre.split(' ').length - 1].toUpperCase()) || 
      p.almacen.toUpperCase() === almacen.nombre.toUpperCase()
    )
  );
  
  // Calcular disponibilidad basada en capacidad y productos ingresados
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

  if (pedidoSeleccionado) {
    return <PedidoDetalle pedido={pedidoSeleccionado} onVolver={() => setPedidoSeleccionado(null)} />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{almacen.nombre}</h1>
        <button className={styles.btnRecibir} onClick={() => setModalRecibir(true)}>RECIBIR PRODUCTO</button>
      </div>

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

      {/* Tab Inventario */}
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
                  <th>CANTIDAD DE PRODUCTO</th>
                  <th>FECHA DE INGRESO</th>
                  <th>PUNTO DE VENTA</th>
                  <th>PROVEEDOR</th>
                  <th>FECHA DE ENTREGA</th>
                  <th>ESTADO</th>
                  <th className={styles.thFiltros}>
                    <span className={styles.filtrosLink}>FILTROS</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {inventario.length > 0 ? (
                  inventario.map((item) => (
                    <tr key={item.id} className={styles.row}>
                      <td>{item.nombre}</td>
                      <td>{item.cantidad} KG</td>
                      <td>{item.fechaIngreso}</td>
                      <td>{item.puntoVenta}</td>
                      <td>{item.proveedor}</td>
                      <td>{item.fechaEntrega}</td>
                      <td>
                        <span className={`${styles.badge} ${styles[item.estadoKey]}`}>
                          {item.estado}
                        </span>
                      </td>
                      <td className={styles.tdAcciones}>
                        <button className={styles.actionBtn}>EDITAR</button>
                        <button className={styles.actionBtn}>ELIMINAR</button>
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

      {/* Tab Transporte */}
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
                          <button 
                            className={styles.btnInfo}
                            onClick={() => setPedidoSeleccionado(pedido)}
                          >
                            INFORMACIÓN
                          </button>
                          <button 
                            className={styles.btnRecibir}
                            onClick={() => handleRecibirProducto(pedido)}
                          >
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

      <button className={styles.btnVolver} onClick={onVolver}>
        VOLVER
      </button>
    </div>
  );
}