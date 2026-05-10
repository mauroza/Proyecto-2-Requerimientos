import styles from './Sidebar.module.css';

const defaultItems = [
  { label: 'PEDIDOS', key: 'pedidos' },
  { label: 'ALMACENES', key: 'almacenes' },
  { label: 'PUNTOS DE VENTA', key: 'puntos' },
  { label: 'PROVEEDORES', key: 'proveedores' },
  { label: 'TRANSPORTE', key: 'transporte' },
  { label: 'INFORMES', key: 'informes' },
];

const defaultBottom = [{ label: 'CONFIGURACION', key: 'configuracion' }];

export default function Sidebar({
  active,
  onNavigate,
  items = defaultItems,
  bottomItems = defaultBottom,
  userLabel = 'ADMIN@DISTRIBUCION.COM',
}) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.userEmail}>{userLabel}</div>
      <nav className={styles.nav}>
        {items.map((item) => (
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
        {bottomItems.map((item) => (
          <button
            key={item.key}
            className={`${styles.navItem} ${active === item.key ? styles.navItemActive : ''}`}
            onClick={() => onNavigate(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </aside>
  );
}
