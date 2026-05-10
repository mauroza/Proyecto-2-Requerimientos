import { useState, useRef } from 'react';
import { useConfig } from '../hooks/useConfig';
import styles from './Configuracion.module.css';

export default function Configuracion({ onLogout }) {
  const { config, actualizarPerfil, toggleDarkMode } = useConfig();
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({ nombre: config.nombre, email: config.email });
  const [modalLogout, setModalLogout] = useState(false);
  const fileRef = useRef();

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => actualizarPerfil({ foto: ev.target.result });
    reader.readAsDataURL(file);
  };

  const handleGuardar = () => {
    if (!form.nombre.trim()) return;
    actualizarPerfil({ nombre: form.nombre.trim(), email: form.email.trim() });
    setEditando(false);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>CONFIGURACIÓN</h1>

      {/* Tarjeta perfil */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>PERFIL DE USUARIO</h2>
        <div className={styles.perfilCard}>
          <div className={styles.fotoWrap}>
            <div className={styles.fotoCirculo} onClick={() => fileRef.current.click()}>
              {config.foto
                ? <img src={config.foto} alt="perfil" className={styles.fotoImg} />
                : <span className={styles.fotoInicial}>{config.nombre.charAt(0).toUpperCase()}</span>}
              <div className={styles.fotoOverlay}>CAMBIAR</div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className={styles.fileInput} onChange={handleFoto} />
            <span className={styles.fotoHint}>Click para cambiar foto</span>
          </div>

          <div className={styles.perfilInfo}>
            {editando ? (
              <div className={styles.editForm}>
                <div className={styles.campo}>
                  <label className={styles.label}>NOMBRE</label>
                  <input className={styles.input} value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
                </div>
                <div className={styles.campo}>
                  <label className={styles.label}>EMAIL</label>
                  <input className={styles.input} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className={styles.editBotones}>
                  <button className={styles.btnSecundario} onClick={() => setEditando(false)}>CANCELAR</button>
                  <button className={styles.btnPrimary} onClick={handleGuardar}>GUARDAR CAMBIOS</button>
                </div>
              </div>
            ) : (
              <>
                <div className={styles.nombreDisplay}>{config.nombre}</div>
                <div className={styles.emailDisplay}>{config.email}</div>
                <div className={styles.rolDisplay}>Administrador del sistema</div>
                <button className={styles.btnEditar} onClick={() => { setForm({ nombre: config.nombre, email: config.email }); setEditando(true); }}>
                  EDITAR PERFIL
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Apariencia */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>APARIENCIA</h2>
        <div className={styles.opcionCard}>
          <div className={styles.opcionInfo}>
            <div className={styles.opcionTitulo}>Modo Oscuro</div>
            <div className={styles.opcionDesc}>Cambia el tema de la aplicación a colores oscuros</div>
          </div>
          <button className={`${styles.toggle} ${config.darkMode ? styles.toggleOn : ''}`} onClick={toggleDarkMode} aria-label="Toggle dark mode">
            <span className={styles.toggleThumb} />
          </button>
        </div>
      </div>

      {/* Sistema */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>SISTEMA</h2>
        <div className={styles.infoCard}>
          <div className={styles.infoItem}><span className={styles.infoLabel}>Versión</span><span className={styles.infoVal}>Prototipo Visual v1.0</span></div>
          <div className={styles.infoItem}><span className={styles.infoLabel}>Sistema</span><span className={styles.infoVal}>Gestión de Distribución</span></div>
          <div className={styles.infoItem}><span className={styles.infoLabel}>Almacenamiento</span><span className={styles.infoVal}>localStorage (navegador)</span></div>
        </div>
      </div>

      {/* Cerrar sesión */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>SESIÓN</h2>
        <div className={styles.logoutCard}>
          <div>
            <div className={styles.opcionTitulo}>Cerrar Sesión</div>
            <div className={styles.opcionDesc}>Salir de la cuenta actual. Los datos guardados se conservan.</div>
          </div>
          <button className={styles.btnLogout} onClick={() => setModalLogout(true)}>CERRAR SESIÓN</button>
        </div>
      </div>

      {modalLogout && (
        <div className={styles.overlay} onClick={() => setModalLogout(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitulo}>¿Cerrar sesión?</h3>
            <p className={styles.modalSub}>Serás redirigido a la pantalla de inicio de sesión.</p>
            <div className={styles.modalBotones}>
              <button className={styles.btnSecundario} onClick={() => setModalLogout(false)}>CANCELAR</button>
              <button className={styles.btnLogout} onClick={onLogout}>SÍ, CERRAR SESIÓN</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
