import styles from '../styles/rolePages.module.css';

const ROLE_LABEL = {
  admin: 'Administrador',
  transporte: 'Transportista',
  almacen: 'Almacenista',
};

export default function MiCuenta({ user, onLogout }) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>MI CUENTA</h1>
      </div>
      <p className={styles.subtitulo}>Información de tu sesión actual</p>
      <hr className={styles.divider} />

      <div className={styles.cuentaCard}>
        <div className={styles.cuentaItem}>
          <span className={styles.cuentaLabel}>Nombre</span>
          <span className={styles.cuentaVal}>{user.nombre}</span>
        </div>
        <div className={styles.cuentaItem}>
          <span className={styles.cuentaLabel}>Correo electrónico</span>
          <span className={styles.cuentaVal}>{user.email}</span>
        </div>
        <div className={styles.cuentaItem}>
          <span className={styles.cuentaLabel}>Rol del sistema</span>
          <span className={styles.cuentaVal}>{ROLE_LABEL[user.role] || user.role}</span>
        </div>

        <button className={styles.btnLogout} onClick={onLogout}>
          CERRAR SESIÓN
        </button>
      </div>
    </div>
  );
}
