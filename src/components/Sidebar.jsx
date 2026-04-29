import styles from './Sidebar.module.css';

const navItems = [
  { label: 'PEDIDOS', key: 'pedidos' },
  { label: 'ALMACENES', key: 'almacenes' },
  { label: 'PUNTOS DE VENTA', key: 'puntos' },
  { label: 'PROVEDORES', key: 'provedores' },
  { label: 'TRANSPORTE', key: 'transporte' },
  { label: 'REPORTES', key: 'reportes' },
];

export default function Sidebar({ active, onNavigate }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.userEmail}>ADMIN@DISTRIBUCION.COM</div>
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <button
            key={item.key}
            className={`${styles.navItem} ${active === item.key ? styles.navItemActive : ''}`}
            onClick={() => onNavigate(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <div className={styles.bottomNav}>
        <button
          className={`${styles.navItem} ${active === 'configuracion' ? styles.navItemActive : ''}`}
          onClick={() => onNavigate('configuracion')}
        >
          CONFIGURACION
        </button>
      </div>
    </aside>
  );
}