import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import PorRecibir from '../pages/almacenista/PorRecibir';
import InventariosVista from '../pages/almacenista/InventariosVista';
import HistorialAlm from '../pages/almacenista/HistorialAlm';
import MiCuenta from '../pages/MiCuenta';
import styles from '../App.module.css';

const navItems = [
  { label: 'POR RECIBIR', key: 'recibir' },
  { label: 'INVENTARIOS', key: 'inventarios' },
  { label: 'HISTORIAL', key: 'historial' },
];

const bottomItems = [{ label: 'MI CUENTA', key: 'cuenta' }];

export default function AlmacenLayout({ user, onLogout }) {
  const [activePage, setActivePage] = useState('recibir');

  const show = (key) => ({ display: activePage === key ? 'contents' : 'none' });

  return (
    <div className={styles.layout}>
      <Sidebar
        active={activePage}
        onNavigate={setActivePage}
        items={navItems}
        bottomItems={bottomItems}
        userLabel={user.email.toUpperCase()}
      />
      <main className={styles.main}>
        <div style={show('recibir')}><PorRecibir /></div>
        <div style={show('inventarios')}><InventariosVista /></div>
        <div style={show('historial')}><HistorialAlm /></div>
        <div style={show('cuenta')}><MiCuenta user={user} onLogout={onLogout} /></div>
      </main>
    </div>
  );
}
