import { useState } from 'react';
import { useTransporte } from '../hooks/useTransporte';
import styles from './Transporte.module.css';

const ESTADOS = ['DISPONIBLE', 'EN RUTA', 'MANTENIMIENTO', 'INACTIVO'];
const TIPOS = ['CHOFER', 'EMPRESA'];

const formVacio = {
  nombre: '', tipo: 'CHOFER', telefono: '', vehiculo: '',
  placa: '', capacidadKG: '', estado: 'DISPONIBLE', notas: '',
};

function ModalForm({ inicial, onGuardar, onCerrar, titulo }) {
  const [form, setForm] = useState(inicial);
  const [errors, setErrors] = useState({});

  const set = (k, v) => { setForm((p) => ({ ...p, [k]: v })); setErrors((p) => { const { [k]: _, ...r } = p; return r; }); };

  const validar = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = true;
    if (!form.telefono.trim()) e.telefono = true;
    if (!form.vehiculo.trim()) e.vehiculo = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div className={styles.overlay} onClick={onCerrar}>
      <div className={styles.modalGrande} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitulo}>{titulo}</h2>
        <hr className={styles.modalDivider} />
        <div className={styles.modalGrid}>
          <div className={styles.campo}>
            <label className={styles.label}>TIPO</label>
            <div className={styles.tipoToggle}>
              {TIPOS.map((t) => (
                <button key={t} className={`${styles.tipoBtn} ${form.tipo === t ? styles.tipoBtnActivo : ''}`} onClick={() => set('tipo', t)}>{t}</button>
              ))}
            </div>
          </div>
          <div className={styles.campo}>
            <label className={styles.label}>{form.tipo === 'CHOFER' ? 'NOMBRE DEL CHOFER *' : 'NOMBRE DE LA EMPRESA *'}</label>
            <input className={`${styles.input} ${errors.nombre ? styles.inputError : ''}`} value={form.nombre} onChange={(e) => set('nombre', e.target.value)} placeholder={form.tipo === 'CHOFER' ? 'Nombre completo' : 'Razón social'} />
          </div>
          <div className={styles.campo}>
            <label className={styles.label}>TELÉFONO *</label>
            <input className={`${styles.input} ${errors.telefono ? styles.inputError : ''}`} value={form.telefono} onChange={(e) => set('telefono', e.target.value)} placeholder="8888-1111" />
          </div>
          <div className={styles.campo}>
            <label className={styles.label}>{form.tipo === 'CHOFER' ? 'VEHÍCULO *' : 'FLOTA / VEHÍCULOS *'}</label>
            <input className={`${styles.input} ${errors.vehiculo ? styles.inputError : ''}`} value={form.vehiculo} onChange={(e) => set('vehiculo', e.target.value)} placeholder="Ej: Camión Mitsubishi Canter" />
          </div>
          <div className={styles.campo}>
            <label className={styles.label}>PLACA</label>
            <input className={styles.input} value={form.placa} onChange={(e) => set('placa', e.target.value)} placeholder="Ej: SJ-12345" />
          </div>
          <div className={styles.campo}>
            <label className={styles.label}>CAPACIDAD (KG)</label>
            <input type="number" className={styles.input} value={form.capacidadKG} onChange={(e) => set('capacidadKG', e.target.value)} placeholder="Ej: 3000" min={0} />
          </div>
          <div className={styles.campo}>
            <label className={styles.label}>ESTADO</label>
            <select className={styles.select} value={form.estado} onChange={(e) => set('estado', e.target.value)}>
              {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          <div className={`${styles.campo} ${styles.campoFull}`}>
            <label className={styles.label}>NOTAS</label>
            <textarea className={styles.textarea} value={form.notas} onChange={(e) => set('notas', e.target.value)} placeholder="Observaciones..." rows={2} />
          </div>
        </div>
        <div className={styles.modalBotones}>
          <button className={styles.btnCancelar} onClick={onCerrar}>CANCELAR</button>
          <button className={styles.btnGuardar} onClick={() => { if (validar()) onGuardar(form); }}>GUARDAR</button>
        </div>
      </div>
    </div>
  );
}

export default function Transporte() {
  const { transportes, agregarTransporte, editarTransporte, eliminarTransporte, actualizarEstado, toggleCheck, toggleAll } = useTransporte();
  const [modalCrear, setModalCrear] = useState(false);
  const [editando, setEditando] = useState(null);
  const [modalEstado, setModalEstado] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [modalFiltros, setModalFiltros] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  const lista = transportes.filter((t) => {
    if (filtroTipo && t.tipo !== filtroTipo) return false;
    if (filtroEstado && t.estado !== filtroEstado) return false;
    if (busqueda && !t.nombre.toLowerCase().includes(busqueda.toLowerCase())) return false;
    return true;
  });

  const allChecked = lista.length > 0 && lista.every((t) => t.checked);
  const hayFiltros = filtroTipo || filtroEstado;
  const disponibles = transportes.filter((t) => t.estado === 'DISPONIBLE').length;
  const enRuta = transportes.filter((t) => t.estado === 'EN RUTA').length;

  const estadoKeyMap = { DISPONIBLE: 'disponible', 'EN RUTA': 'enruta', MANTENIMIENTO: 'mantenimiento', INACTIVO: 'inactivo' };

  const handleGuardar = (datos, base) => {
    const obj = { ...(base || {}), ...datos, estadoKey: estadoKeyMap[datos.estado] ?? 'disponible', capacidadKG: Number(datos.capacidadKG) || 0 };
    base ? editarTransporte(obj) : agregarTransporte(obj);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>TRANSPORTE</h1>
        <div className={styles.headerActions}>
          <input className={styles.searchInput} placeholder="Buscar..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
          <button className={styles.btnPrimary} onClick={() => setModalCrear(true)}>+ AGREGAR</button>
        </div>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statCard}><span className={styles.statNum}>{transportes.length}</span><span className={styles.statLabel}>Total</span></div>
        <div className={styles.statCard}><span className={`${styles.statNum} ${styles.verde}`}>{disponibles}</span><span className={styles.statLabel}>Disponibles</span></div>
        <div className={styles.statCard}><span className={`${styles.statNum} ${styles.azul}`}>{enRuta}</span><span className={styles.statLabel}>En ruta</span></div>
        <div className={styles.statCard}><span className={styles.statNum}>{transportes.filter((t) => t.tipo === 'CHOFER').length}</span><span className={styles.statLabel}>Choferes</span></div>
        <div className={styles.statCard}><span className={styles.statNum}>{transportes.filter((t) => t.tipo === 'EMPRESA').length}</span><span className={styles.statLabel}>Empresas</span></div>
      </div>

      <div className={styles.tableWrapper}>
        <h2 className={styles.subtitulo}>LISTA DE TRANSPORTISTAS</h2>
        <hr className={styles.divider} />
        <p className={styles.hint}>CONTROL DE CHOFERES Y EMPRESAS DE TRANSPORTE</p>

        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.thCheck}><input type="checkbox" checked={allChecked} onChange={(e) => toggleAll(e.target.checked)} className={styles.checkbox} /></th>
              <th>TIPO</th>
              <th>NOMBRE</th>
              <th>TELÉFONO</th>
              <th>VEHÍCULO</th>
              <th>PLACA</th>
              <th>CAPACIDAD</th>
              <th>ESTADO</th>
              <th className={styles.thFiltros}>
                <span className={`${styles.filtrosLink} ${hayFiltros ? styles.filtrosActivos : ''}`} onClick={() => setModalFiltros(true)}>
                  FILTROS {hayFiltros ? '●' : ''}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {lista.map((t) => (
              <tr key={t.id} className={styles.row}>
                <td className={styles.tdCheck}><input type="checkbox" checked={t.checked} onChange={() => toggleCheck(t.id)} className={styles.checkbox} /></td>
                <td><span className={`${styles.tipoBadge} ${t.tipo === 'CHOFER' ? styles.tipoChofer : styles.tipoEmpresa}`}>{t.tipo}</span></td>
                <td className={styles.tdNombre}>{t.nombre}</td>
                <td>{t.telefono}</td>
                <td>{t.vehiculo}</td>
                <td>{t.placa || '—'}</td>
                <td>{t.capacidadKG ? `${Number(t.capacidadKG).toLocaleString()} KG` : '—'}</td>
                <td>
                  <span className={`${styles.badge} ${styles[t.estadoKey]} ${styles.badgeClickable}`} onClick={() => setModalEstado(t.id)} title="Cambiar estado">
                    {t.estado} ▾
                  </span>
                </td>
                <td className={styles.tdAcciones}>
                  <button className={styles.actionBtn} onClick={() => setEditando(t)}>EDITAR</button>
                  <button className={styles.actionBtnEliminar} onClick={() => eliminarTransporte(t.id)}>ELIMINAR</button>
                </td>
              </tr>
            ))}
            {lista.length === 0 && <tr><td colSpan={9} className={styles.vacio}>No hay transportistas registrados.</td></tr>}
          </tbody>
        </table>
      </div>

      {modalCrear && <ModalForm inicial={{ ...formVacio }} titulo="AGREGAR TRANSPORTISTA" onGuardar={(d) => { handleGuardar(d, null); setModalCrear(false); }} onCerrar={() => setModalCrear(false)} />}
      {editando && <ModalForm inicial={{ ...editando }} titulo="EDITAR TRANSPORTISTA" onGuardar={(d) => { handleGuardar(d, editando); setEditando(null); }} onCerrar={() => setEditando(null)} />}

      {modalFiltros && (
        <div className={styles.overlay} onClick={() => setModalFiltros(false)}>
          <div className={styles.modalPequeno} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitulo}>FILTROS</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, margin: '16px 0' }}>
              <div className={styles.campo}>
                <label className={styles.label}>Tipo</label>
                <select className={styles.select} value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
                  <option value="">Todos</option>
                  {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className={styles.campo}>
                <label className={styles.label}>Estado</label>
                <select className={styles.select} value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
                  <option value="">Todos</option>
                  {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
            </div>
            <div className={styles.modalBotones}>
              <button className={styles.btnCancelar} onClick={() => { setFiltroTipo(''); setFiltroEstado(''); setModalFiltros(false); }}>LIMPIAR</button>
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
