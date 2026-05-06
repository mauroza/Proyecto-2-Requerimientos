import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Pedidos from './pages/Pedidos';
import Almacenes from './pages/Almacenes';
import PuntosVenta from './pages/PuntosVenta';
import Login from './pages/Login';
import './index.css';
import styles from './App.module.css';

function renderPage(page) {
  switch (page) {
    case 'pedidos': return <Pedidos />;
    case 'almacenes': return <Almacenes />;
    case 'puntos': return <PuntosVenta />;
    default:
      return (
        <div className={styles.placeholder}>
          <p>Sección <strong>{page.toUpperCase()}</strong> en construcción</p>
        </div>
      );
  }
}

export default function App() {
  const [logueado, setLogueado] = useState(false);
  const [activePage, setActivePage] = useState('pedidos');

  if (!logueado) return <Login onLogin={() => setLogueado(true)} />;

  return (
    <div className={styles.layout}>
      <Sidebar active={activePage} onNavigate={setActivePage} />
      <main className={styles.main}>
        {renderPage(activePage)}
      </main>
    </div>
  );
}