import { useState } from 'react';
import { useProveedores } from '../hooks/useProveedores';
import styles from './Proveedores.module.css';

const PRODUCTOS = ['Yuca', 'Piña', 'Banano', 'Papaya', 'Mango'];
const ESTADOS = ['ACTIVO', 'INACTIVO', 'SUSPENDIDO'];

const formVacio = {
  nombre: '', contacto: '', telefono: '', email: '',
  direccion: '', productosSuministrados: [], estado: 'ACTIVO', notas: '',
};

function ModalForm({ inicial, onGuardar, onCerrar, titulo }) {
  const [form, setForm] = useState(inicial);
  const [errors, setErrors] = useState({});

  const set = (k, v) => { setForm((p) => ({ ...p, [k]: v })); setErrors((p) => { const { [k]: _, ...r } = p; return r; }); };

  const toggleProducto = (p) => {
    const lista = form.productosSuministrados.includes(p)
      ? form.productosSuministrados.filter((x) => x !== p)
      : [...form.productosSuministrados, p];
    set('productosSuministrados', lista);
  };

  const validar = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = true;
    if (!form.contacto.trim()) e.contacto = true;
    if (!form.telefono.trim()) e.telefono = true;
    if (!form.direccion.trim()) e.direccion = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleGuardar = () => { if (validar()) onGuardar(form); };

  return (
    <div className={styles.overlay} onClick={onCerrar}>
      <div className={styles.modalGrande} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitulo}>{titulo}</h2>
        <hr className={styles.modalDivider} />
        <div className={styles.modalGrid}>
          <div className={styles.campo}>
            <label className={styles.label}>NOMBRE DEL PROVEEDOR *</label>
            <input className={`${styles.input} ${errors.nombre ? styles.inputError : ''}`} value={form.nombre} onChange={(e) => set('nombre', e.target.value)} placeholder="Ej: COLONO AGROPECUARIO" />
          </div>
          <div className={styles.campo}>
            <label className={styles.label}>PERSONA DE CONTACTO *</label>
            <input className={`${styles.input} ${errors.contacto ? styles.inputError : ''}`} value={form.contacto} onChange={(e) => set('contacto', e.target.value)} placeholder="Nombre completo" />
          </div>
          <div className={styles.campo}>
            <label className={styles.label}>TELÉFONO *</label>
            <input className={`${styles.input} ${errors.telefono ? styles.inputError : ''}`} value={form.telefono} onChange={(e) => set('telefono', e.target.value)} placeholder="2222-1111" />
          </div>
          <div className={styles.campo}>
            <label className={styles.label}>EMAIL</label>
            <input className={styles.input} value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="correo@empresa.cr" />
          </div>
          <div className={`${styles.campo} ${styles.campoFull}`}>
            <label className={styles.label}>DIRECCIÓN *</label>
            <input className={`${styles.input} ${errors.direccion ? styles.inputError : ''}`} value={form.direccion} onChange={(e) => set('direccion', e.target.value)} placeholder="Provincia, cantón, distrito" />
          </div>
          <div className={`${styles.campo} ${styles.campoFull}`}>
            <label className={styles.label}>PRODUCTOS QUE SUMINISTRA</label>
            <div className={styles.checkGrid}>
              {PRODUCTOS.map((p) => (
                <label key={p} className={styles.checkItem}>
                  <input type="checkbox" checked={form.productosSuministrados.includes(p)} onChange={() => toggleProducto(p)} />
                  {p}
                </label>
              ))}
            </div>
          </div>
          <div className={styles.campo}>
            <label className={styles.label}>ESTADO</label>
            <select className={styles.select} value={form.estado} onChange={(e) => set('estado', e.target.value)}>
              {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          <div className={`${styles.campo} ${styles.campoFull}`}>
            <label className={styles.label}>NOTAS</label>
            <textarea className={styles.textarea} value={form.notas} onChange={(e) => set('notas', e.target.value)} placeholder="Observaciones adicionales..." rows={2} />
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

function DetalleModal({ proveedor, onCerrar }) {
  return (
    <div className={styles.overlay} onClick={onCerrar}>
      <div className={styles.modalGrande} onClick={(e) => e.stopPropagation()}>
        <div className={styles.detalleHeader}>
          <div>
            <h2 className={styles.detalleTitulo}>{proveedor.nombre}</h2>
            <span className={`${styles.badge} ${styles[proveedor.estadoKey]}`}>{proveedor.estado}</span>
          </div>
          <button className={styles.btnCerrarX} onClick={onCerrar}>✕</button>
        </div>
        <hr className={styles.modalDivider} />
        <div className={styles.detalleGrid}>
          <div className={styles.detalleItem}><span className={styles.detalleLabel}>Contacto</span><span className={styles.detalleVal}>{proveedor.contacto}</span></div>
          <div className={styles.detalleItem}><span className={styles.detalleLabel}>Teléfono</span><span className={styles.detalleVal}>{proveedor.telefono}</span></div>
          <div className={styles.detalleItem}><span className={styles.detalleLabel}>Email</span><span className={styles.detalleVal}>{proveedor.email || '—'}</span></div>
          <div className={styles.detalleItem}><span className={styles.detalleLabel}>Dirección</span><span className={styles.detalleVal}>{proveedor.direccion}</span></div>
          <div className={`${styles.detalleItem} ${styles.campoFull}`}>
            <span className={styles.detalleLabel}>Productos suministrados</span>
            <div className={styles.productosWrap}>
              {proveedor.productosSuministrados.length > 0
                ? proveedor.productosSuministrados.map((p) => <span key={p} className={styles.productoBadge}>{p}</span>)
                : <span className={styles.sinDato}>No especificados</span>}
            </div>
          </div>
          {proveedor.notas && (
            <div className={`${styles.detalleItem} ${styles.campoFull}`}><span className={styles.detalleLabel}>Notas</span><span className={styles.detalleVal}>{proveedor.notas}</span></div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Proveedores() {
  const { proveedores, agregarProveedor, editarProveedor, eliminarProveedor, actualizarEstado, toggleCheck, toggleAll } = useProveedores();
  const [modalCrear, setModalCrear] = useState(false);
  const [editando, setEditando] = useState(null);
  const [detalle, setDetalle] = useState(null);
  const [modalEstado, setModalEstado] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [modalFiltros, setModalFiltros] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState('');

  const proveedoresFiltrados = proveedores.filter((p) => {
    if (filtroEstado && p.estado !== filtroEstado) return false;
    if (filtro && !p.nombre.toLowerCase().includes(filtro.toLowerCase()) && !p.contacto.toLowerCase().includes(filtro.toLowerCase())) return false;
    return true;
  });

  const allChecked = proveedoresFiltrados.length > 0 && proveedoresFiltrados.every((p) => p.checked);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>PROVEEDORES</h1>
        <div className={styles.headerActions}>
          <input className={styles.searchInput} placeholder="Buscar proveedor..." value={filtro} onChange={(e) => setFiltro(e.target.value)} />
          <button className={styles.btnPrimary} onClick={() => setModalCrear(true)}>+ AGREGAR</button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <div className={styles.tableHeader}>
          <h2 className={styles.subtitulo}>LISTA DE PROVEEDORES</h2>
          <span className={styles.total}>{proveedoresFiltrados.length} proveedor{proveedoresFiltrados.length !== 1 ? 'es' : ''}</span>
        </div>
        <hr className={styles.divider} />
        <p className={styles.hint}>CLICK EN EL NOMBRE PARA VER LA INFORMACIÓN COMPLETA DEL PROVEEDOR</p>

        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.thCheck}><input type="checkbox" checked={allChecked} onChange={(e) => toggleAll(e.target.checked)} className={styles.checkbox} /></th>
              <th>NOMBRE</th>
              <th>CONTACTO</th>
              <th>TELÉFONO</th>
              <th>PRODUCTOS</th>
              <th>ESTADO</th>
              <th className={styles.thFiltros}>
                <span className={`${styles.filtrosLink} ${filtroEstado ? styles.filtrosActivos : ''}`} onClick={() => setModalFiltros(true)}>
                  FILTROS {filtroEstado ? '●' : ''}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {proveedoresFiltrados.map((p) => (
              <tr key={p.id} className={styles.row}>
                <td className={styles.tdCheck}><input type="checkbox" checked={p.checked} onChange={() => toggleCheck(p.id)} className={styles.checkbox} /></td>
                <td className={styles.tdNombre} onClick={() => setDetalle(p)}>{p.nombre}</td>
                <td>{p.contacto}</td>
                <td>{p.telefono}</td>
                <td>
                  <div className={styles.productosWrapSmall}>
                    {p.productosSuministrados.length > 0
                      ? p.productosSuministrados.map((x) => <span key={x} className={styles.productoBadgeSmall}>{x}</span>)
                      : <span className={styles.sinDato}>—</span>}
                  </div>
                </td>
                <td>
                  <span className={`${styles.badge} ${styles[p.estadoKey]} ${styles.badgeClickable}`} onClick={() => setModalEstado(p.id)} title="Cambiar estado">
                    {p.estado} ▾
                  </span>
                </td>
                <td className={styles.tdAcciones}>
                  <button className={styles.actionBtn} onClick={() => setEditando(p)}>EDITAR</button>
                  <button className={styles.actionBtnEliminar} onClick={() => eliminarProveedor(p.id)}>ELIMINAR</button>
                </td>
              </tr>
            ))}
            {proveedoresFiltrados.length === 0 && (
              <tr><td colSpan={7} className={styles.vacio}>No hay proveedores registrados.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modalCrear && (
        <ModalForm
          inicial={{ ...formVacio }}
          titulo="AGREGAR PROVEEDOR"
          onGuardar={(datos) => { agregarProveedor({ ...datos, estadoKey: datos.estado === 'ACTIVO' ? 'activo' : datos.estado === 'INACTIVO' ? 'inactivo' : 'suspendido' }); setModalCrear(false); }}
          onCerrar={() => setModalCrear(false)}
        />
      )}

      {editando && (
        <ModalForm
          inicial={{ ...editando }}
          titulo="EDITAR PROVEEDOR"
          onGuardar={(datos) => { editarProveedor({ ...editando, ...datos, estadoKey: datos.estado === 'ACTIVO' ? 'activo' : datos.estado === 'INACTIVO' ? 'inactivo' : 'suspendido' }); setEditando(null); }}
          onCerrar={() => setEditando(null)}
        />
      )}

      {detalle && <DetalleModal proveedor={detalle} onCerrar={() => setDetalle(null)} />}

      {modalFiltros && (
        <div className={styles.overlay} onClick={() => setModalFiltros(false)}>
          <div className={styles.modalPequeno} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitulo}>FILTROS</h3>
            <div className={styles.campo} style={{ margin: '16px 0' }}>
              <label className={styles.label}>Estado</label>
              <select className={styles.select} value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
                <option value="">Todos</option>
                {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div className={styles.modalBotones}>
              <button className={styles.btnCancelar} onClick={() => { setFiltroEstado(''); setModalFiltros(false); }}>LIMPIAR</button>
              <button className={styles.btnGuardar} onClick={() => setModalFiltros(false)}>APLICAR</button>
            </div>
          </div>
        </div>
      )}

      {modalEstado && (
        <div className={styles.overlay} onClick={() => setModalEstado(null)}>
          <div className={styles.modalPequeno} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitulo}>Cambiar estado</h3>
            <div className={styles.estadoOpciones}>
              {ESTADOS.map((e) => (
                <button key={e} className={styles.estadoOpcion} onClick={() => { actualizarEstado(modalEstado, e); setModalEstado(null); }}>{e}</button>
              ))}
            </div>
            <button className={styles.modalCerrar} onClick={() => setModalEstado(null)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}
