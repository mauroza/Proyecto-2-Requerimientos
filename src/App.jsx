import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Pedidos from './pages/Pedidos';
import Almacenes from './pages/Almacenes';
import PuntosVenta from './pages/PuntosVenta';
import Proveedores from './pages/Proveedores';
import Transporte from './pages/Transporte';
import Informes from './pages/Informes';
import Configuracion from './pages/Configuracion';
import Login from './pages/Login';
import TransporteLayout from './layouts/TransporteLayout';
import AlmacenLayout from './layouts/AlmacenLayout';
import './index.css';
import styles from './App.module.css';

export default function App() {
  const [user, setUser] = useState(null); // { role, nombre, email }
  const [activePage, setActivePage] = useState('pedidos');

  const handleLogout = () => {
    setUser(null);
    setActivePage('pedidos');
  };

  if (!user) return <Login onLogin={setUser} />;

  if (user.role === 'transporte') {
    return <TransporteLayout user={user} onLogout={handleLogout} />;
  }

  if (user.role === 'almacen') {
    return <AlmacenLayout user={user} onLogout={handleLogout} />;
  }

  // Admin layout (default)
  const show = (key) => ({ display: activePage === key ? 'contents' : 'none' });

  return (
    <div className={styles.layout}>
      <Sidebar
        active={activePage}
        onNavigate={setActivePage}
        userLabel={user.email.toUpperCase()}
      />
      <main className={styles.main}>
        <div style={show('pedidos')}><Pedidos /></div>
        <div style={show('almacenes')}><Almacenes /></div>
        <div style={show('puntos')}><PuntosVenta /></div>
        <div style={show('proveedores')}><Proveedores /></div>
        <div style={show('transporte')}><Transporte /></div>
        <div style={show('informes')}><Informes /></div>
        <div style={show('configuracion')}><Configuracion user={user} onLogout={handleLogout} /></div>
      </main>
    </div>
  );
}
