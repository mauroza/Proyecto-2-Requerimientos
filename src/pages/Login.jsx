import { useState } from 'react';
import styles from './Login.module.css';

const USUARIO = 'admin@distribucion.com';
const PASSWORD = 'admin123';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = () => {
    if (email.toLowerCase() === USUARIO && password === PASSWORD) {
      setError(false);
      onLogin();
    } else {
      setError(true);
    }
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

            <p className={styles.hint}>
              Usuario: admin@distribucion.com &nbsp;|&nbsp; Contraseña: admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}