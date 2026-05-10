import { useState } from 'react';
import styles from './Login.module.css';

const USUARIOS = {
  'admin@distribucion.com':       { password: 'admin123',     role: 'admin',       nombre: 'Administrador',  email: 'admin@distribucion.com' },
  'transporte@distribucion.com':  { password: 'transporte123', role: 'transporte',  nombre: 'Mario Fernández (Transportista)', email: 'transporte@distribucion.com' },
  'almacen@distribucion.com':     { password: 'almacen123',   role: 'almacen',     nombre: 'Laura Mora (Almacenista)', email: 'almacen@distribucion.com' },
};

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const intentar = (correo, contra) => {
    const u = USUARIOS[correo.toLowerCase()];
    if (u && u.password === contra) {
      setError(false);
      onLogin({ role: u.role, nombre: u.nombre, email: u.email });
      return true;
    }
    setError(true);
    return false;
  };

  const handleLogin = () => intentar(email, password);

  const handleQuick = (correo) => {
    const u = USUARIOS[correo];
    setEmail(u.email);
    setPassword(u.password);
    intentar(u.email, u.password);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.topBar}></div>
        <div className={styles.body}>
          <h1 className={styles.title}>DISTRIBUCION</h1>
          <p className={styles.subtitle}>Sistema de gestión de pedidos</p>

          <div className={styles.form}>
            <div className={styles.campo}>
              <label className={styles.label}>Correo electrónico</label>
              <input
                type="email"
                className={`${styles.input} ${error ? styles.inputError : ''}`}
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(false); }}
                onKeyDown={handleKeyDown}
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div className={styles.campo}>
              <label className={styles.label}>Contraseña</label>
              <input
                type="password"
                className={`${styles.input} ${error ? styles.inputError : ''}`}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
                onKeyDown={handleKeyDown}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className={styles.errorMsg}>Correo o contraseña incorrectos.</p>
            )}

            <button className={styles.btnLogin} onClick={handleLogin}>
              INGRESAR
            </button>

            <div className={styles.rolesDivider}>
              <span>ACCESO RÁPIDO POR ROL</span>
            </div>

            <div className={styles.rolesGrid}>
              <button
                type="button"
                className={`${styles.btnRol} ${styles.btnRolAdmin}`}
                onClick={() => handleQuick('admin@distribucion.com')}
              >
                <span className={styles.rolTitulo}>ADMINISTRADOR</span>
                <span className={styles.rolDesc}>Acceso completo al sistema</span>
              </button>
              <button
                type="button"
                className={`${styles.btnRol} ${styles.btnRolTransporte}`}
                onClick={() => handleQuick('transporte@distribucion.com')}
              >
                <span className={styles.rolTitulo}>TRANSPORTISTA</span>
                <span className={styles.rolDesc}>Recoger y entregar pedidos</span>
              </button>
              <button
                type="button"
                className={`${styles.btnRol} ${styles.btnRolAlmacen}`}
                onClick={() => handleQuick('almacen@distribucion.com')}
              >
                <span className={styles.rolTitulo}>ALMACENISTA</span>
                <span className={styles.rolDesc}>Recibir y gestionar inventario</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
