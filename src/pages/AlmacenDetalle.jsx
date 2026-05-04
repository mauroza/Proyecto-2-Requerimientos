import { useState } from 'react';
import { usePedidos } from '../hooks/usePedidos';
import styles from './AlmacenDetalle.module.css';

// Datos quemados de inventario por almacén - se actualiza al recibir productos
const initialInventariosData = {
  1: [],
  2: [],
  3: [],
};

export default function AlmacenDetalle({ almacen, onVolver }) {
  const [tabActivo, setTabActivo] = useState('inventario');
  const [inventarios, setInventarios] = useState(initialInventariosData);
  const [modalRecibir, setModalRecibir] = useState(false);
  const { pedidos, actualizarEstado } = usePedidos();
  
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

    setInventarios((prev) => ({
      ...prev,
      [almacen.id]: [...(prev[almacen.id] || []), nuevoProducto]
    }));

    actualizarEstado(pedido.id, 'RECIBIDO');
    setModalRecibir(false);
  };

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
          <p>Información de transporte del almacén: {almacen.transporte}</p>
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
                            onClick={() => alert(`Producto: ${pedido.producto}\nCantidad: ${pedido.cantidad}`)}
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