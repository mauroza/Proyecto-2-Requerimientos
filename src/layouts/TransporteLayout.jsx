import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import PorRecoger from '../pages/transportista/PorRecoger';
import EnRuta from '../pages/transportista/EnRuta';
import HistorialTrans from '../pages/transportista/HistorialTrans';
import MiCuenta from '../pages/MiCuenta';
import styles from '../App.module.css';

const navItems = [
  { label: 'POR RECOGER', key: 'recoger' },
  { label: 'EN RUTA', key: 'ruta' },
  { label: 'HISTORIAL', key: 'historial' },
];

const bottomItems = [{ label: 'MI CUENTA', key: 'cuenta' }];

export default function TransporteLayout({ user, onLogout }) {
  const [activePage, setActivePage] = useState('recoger');

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
        <div style={show('recoger')}><PorRecoger /></div>
        <div style={show('ruta')}><EnRuta /></div>
        <div style={show('historial')}><HistorialTrans /></div>
        <div style={show('cuenta')}><MiCuenta user={user} onLogout={onLogout} /></div>
      </main>
    </div>
  );
}
