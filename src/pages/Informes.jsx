import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { usePedidos } from '../hooks/usePedidos';
import { useAlmacenes } from '../hooks/useAlmacenes';
import { usePuntosVenta } from '../hooks/usePuntosVenta';
import { useEntregas } from '../hooks/useEntregas';
import { useInventarios } from '../hooks/useInventarios';
import styles from './Informes.module.css';

const COLORES = ['#1a3a8c', '#2e7d32', '#e65100', '#c0392b', '#6a1b9a', '#00838f'];
const COLORES_ESTADO = { 'EN RECOLECCION': '#00897b', 'EN TRANSPORTE': '#1565c0', 'RECIBIDO': '#2e7d32', 'CANCELADO': '#c0392b' };

const fmt = (n) => new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 }).format(n);

function TarjetaKPI({ titulo, valor, sub, color }) {
  return (
    <div className={styles.kpi} style={{ borderTop: `3px solid ${color || '#1a3a8c'}` }}>
      <div className={styles.kpiValor}>{valor}</div>
      <div className={styles.kpiTitulo}>{titulo}</div>
      {sub && <div className={styles.kpiSub}>{sub}</div>}
    </div>
  );
}

function GraficoCard({ titulo, children }) {
  return (
    <div className={styles.graficoCard}>
      <h3 className={styles.graficoTitulo}>{titulo}</h3>
      <div className={styles.graficoBody}>{children}</div>
    </div>
  );
}

export default function Informes() {
  const { pedidos } = usePedidos();
  const { almacenes } = useAlmacenes();
  const { puntosVenta } = usePuntosVenta();
  const { entregas, recolecciones } = useEntregas();
  const { inventarios } = useInventarios();

  // KPIs
  const totalPedidos = pedidos.length;
  const pedidosActivos = pedidos.filter((p) => p.estado !== 'CANCELADO' && p.estado !== 'RECIBIDO').length;
  const pedidosRecibidos = pedidos.filter((p) => p.estado === 'RECIBIDO').length;
  const pedidosCancelados = pedidos.filter((p) => p.estado === 'CANCELADO').length;
  const efectividad = totalPedidos > 0 ? Math.round((pedidosRecibidos / totalPedidos) * 100) : 0;
  const totalEntregas = entregas.length;
  const totalKgEntregados = entregas.reduce((s, e) => s + e.productos.reduce((a, p) => a + p.cantidad, 0), 0);
  const totalGanancias = puntosVenta.reduce((s, p) => s + (Number(p.ganancias) || 0), 0);
  const pvActivos = puntosVenta.filter((p) => p.estado === 'ACTIVO').length;

  // Gráfico 1: Pedidos por estado (Pie)
  const pedidosPorEstado = useMemo(() => {
    const map = {};
    pedidos.forEach((p) => { map[p.estado] = (map[p.estado] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [pedidos]);

  // Gráfico 2: Pedidos por mes (Bar)
  const pedidosPorMes = useMemo(() => {
    const map = {};
    pedidos.forEach((p) => {
      const partes = p.fecha ? p.fecha.split('-') : [];
      const mes = partes.length >= 2 ? `${partes[1]}/${partes[2] || partes[0]}` : p.fecha;
      map[mes] = (map[mes] || 0) + 1;
    });
    return Object.entries(map).map(([mes, total]) => ({ mes, total }));
  }, [pedidos]);

  // Gráfico 3: KG entregados por almacén (Bar)
  const kgPorAlmacen = useMemo(() => {
    const map = {};
    entregas.forEach((e) => {
      const kg = e.productos.reduce((s, p) => s + p.cantidad, 0);
      map[e.almacenNombre] = (map[e.almacenNombre] || 0) + kg;
    });
    return Object.entries(map).map(([almacen, kg]) => ({ almacen: almacen.replace('ALMACEN ', ''), kg }));
  }, [entregas]);

  // Gráfico 4: Disponibilidad almacenes (Bar)
  const disponibilidadAlmacenes = useMemo(() => {
    return almacenes.map((a) => {
      const inv = inventarios[a.id] || [];
      const pesoUsado = inv.reduce((s, i) => s + i.cantidad, 0);
      const cap = parseInt(a.capacidad) || 100;
      const disp = Math.max(0, Math.round(((cap - pesoUsado) / cap) * 100));
      return { nombre: a.nombre.replace('ALMACEN ', ''), disponible: disp, usado: 100 - disp };
    });
  }, [almacenes, inventarios]);

  // Gráfico 5: Ganancias por punto de venta (Bar)
  const gananciasPorPV = useMemo(() => {
    return puntosVenta
      .filter((p) => Number(p.ganancias) > 0)
      .map((p) => ({ nombre: p.nombre.replace('PUNTO DE VENTA ', ''), ganancias: Number(p.ganancias) || 0 }));
  }, [puntosVenta]);

  // Gráfico 6: Estado puntos de venta (Pie)
  const pvPorEstado = useMemo(() => {
    const map = {};
    puntosVenta.forEach((p) => { map[p.estado] = (map[p.estado] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [puntosVenta]);

  // Gráfico 7: Entregas por mes (Line)
  const entregasPorMes = useMemo(() => {
    const map = {};
    entregas.forEach((e) => {
      const partes = e.fecha ? e.fecha.split('-') : [];
      const mes = partes.length >= 2 ? `${partes[1]}/${partes[0]}` : e.fecha;
      map[mes] = (map[mes] || 0) + 1;
    });
    return Object.entries(map).map(([mes, total]) => ({ mes, total }));
  }, [entregas]);

  // Gráfico 8: Productos más entregados (Bar)
  const productosMasEntregados = useMemo(() => {
    const map = {};
    entregas.forEach((e) => e.productos.forEach((p) => { map[p.nombre] = (map[p.nombre] || 0) + p.cantidad; }));
    return Object.entries(map).map(([producto, kg]) => ({ producto, kg })).sort((a, b) => b.kg - a.kg);
  }, [entregas]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>INFORMES Y ESTADÍSTICAS</h1>
        <span className={styles.fecha}>Generado: {new Date().toLocaleDateString('es-CR')}</span>
      </div>

      {/* KPIs */}
      <div className={styles.kpiRow}>
        <TarjetaKPI titulo="TOTAL PEDIDOS" valor={totalPedidos} sub={`${pedidosActivos} activos`} color="#1a3a8c" />
        <TarjetaKPI titulo="EFECTIVIDAD" valor={`${efectividad}%`} sub={`${pedidosRecibidos} recibidos`} color="#2e7d32" />
        <TarjetaKPI titulo="CANCELADOS" valor={pedidosCancelados} sub="pedidos cancelados" color="#c0392b" />
        <TarjetaKPI titulo="ENTREGAS" valor={totalEntregas} sub={`${totalKgEntregados.toLocaleString()} KG totales`} color="#00838f" />
        <TarjetaKPI titulo="PUNTOS ACTIVOS" valor={pvActivos} sub={`de ${puntosVenta.length} totales`} color="#e65100" />
        <TarjetaKPI titulo="GANANCIAS TOTALES" valor={fmt(totalGanancias)} sub="suma de puntos de venta" color="#6a1b9a" />
      </div>

      {/* Gráficos fila 1 */}
      <div className={styles.graficosGrid2}>
        <GraficoCard titulo="PEDIDOS POR ESTADO">
          {pedidosPorEstado.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pedidosPorEstado} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                  {pedidosPorEstado.map((entry, i) => (
                    <Cell key={i} fill={COLORES_ESTADO[entry.name] || COLORES[i % COLORES.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className={styles.sinDatos}>Sin datos aún</div>}
        </GraficoCard>

        <GraficoCard titulo="PEDIDOS POR MES">
          {pedidosPorMes.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={pedidosPorMes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="total" name="Pedidos" fill="#1a3a8c" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className={styles.sinDatos}>Sin datos aún</div>}
        </GraficoCard>
      </div>

      {/* Gráficos fila 2 */}
      <div className={styles.graficosGrid2}>
        <GraficoCard titulo="DISPONIBILIDAD DE ALMACENES (%)">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={disponibilidadAlmacenes} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="nombre" tick={{ fontSize: 10 }} width={90} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Legend />
              <Bar dataKey="disponible" name="Disponible" fill="#2e7d32" stackId="a" radius={[0, 2, 2, 0]} />
              <Bar dataKey="usado" name="En uso" fill="#e0e0e0" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </GraficoCard>

        <GraficoCard titulo="ESTADO PUNTOS DE VENTA">
          {pvPorEstado.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pvPorEstado} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {pvPorEstado.map((_, i) => <Cell key={i} fill={COLORES[i % COLORES.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className={styles.sinDatos}>Sin datos aún</div>}
        </GraficoCard>
      </div>

      {/* Gráficos fila 3 */}
      <div className={styles.graficosGrid2}>
        <GraficoCard titulo="KG ENTREGADOS POR ALMACÉN">
          {kgPorAlmacen.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={kgPorAlmacen}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="almacen" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => `${v} KG`} />
                <Bar dataKey="kg" name="KG entregados" fill="#00838f" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className={styles.sinDatos}>Realice entregas para ver datos</div>}
        </GraficoCard>

        <GraficoCard titulo="PRODUCTOS MÁS ENTREGADOS (KG)">
          {productosMasEntregados.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={productosMasEntregados}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="producto" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => `${v} KG`} />
                <Bar dataKey="kg" name="KG" fill="#e65100" radius={[2, 2, 0, 0]}>
                  {productosMasEntregados.map((_, i) => <Cell key={i} fill={COLORES[i % COLORES.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <div className={styles.sinDatos}>Realice entregas para ver datos</div>}
        </GraficoCard>
      </div>

      {/* Gráficos fila 4 */}
      <div className={styles.graficosGrid2}>
        <GraficoCard titulo="TENDENCIA DE ENTREGAS POR MES">
          {entregasPorMes.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={entregasPorMes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="total" name="Entregas" stroke="#2e7d32" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : <div className={styles.sinDatos}>Realice entregas para ver datos</div>}
        </GraficoCard>

        <GraficoCard titulo="GANANCIAS POR PUNTO DE VENTA (₡)">
          {gananciasPorPV.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={gananciasPorPV}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="nombre" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `₡${(v/1000).toFixed(0)}K`} />
                <Tooltip formatter={(v) => fmt(v)} />
                <Bar dataKey="ganancias" name="Ganancias" fill="#6a1b9a" radius={[2, 2, 0, 0]}>
                  {gananciasPorPV.map((_, i) => <Cell key={i} fill={COLORES[i % COLORES.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <div className={styles.sinDatos}>Agregue ganancias en puntos de venta</div>}
        </GraficoCard>
      </div>

      {/* Resumen tabla */}
      <div className={styles.resumenTabla}>
        <h3 className={styles.graficoTitulo}>RESUMEN DE EFICIENCIA</h3>
        <table className={styles.tabla}>
          <thead>
            <tr>
              <th>INDICADOR</th>
              <th>VALOR</th>
              <th>OBSERVACIÓN</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Tasa de efectividad de pedidos</td><td className={styles.verde}>{efectividad}%</td><td>{efectividad >= 80 ? '✅ Excelente' : efectividad >= 50 ? '⚠️ Aceptable' : '❌ Mejorar'}</td></tr>
            <tr><td>Pedidos en tránsito activos</td><td>{pedidosActivos}</td><td>{pedidosActivos === 0 ? 'Sin pedidos activos' : `${pedidosActivos} pendientes`}</td></tr>
            <tr><td>Total KG entregados</td><td>{totalKgEntregados.toLocaleString()} KG</td><td>{totalEntregas} entregas realizadas</td></tr>
            <tr><td>Recolecciones programadas</td><td>{recolecciones.length}</td><td>—</td></tr>
            <tr><td>Almacenes operativos</td><td>{almacenes.filter((a) => a.estado === 'ACTIVO').length} / {almacenes.length}</td><td>—</td></tr>
            <tr><td>Puntos de venta activos</td><td>{pvActivos} / {puntosVenta.length}</td><td>—</td></tr>
            <tr><td>Ganancias totales registradas</td><td className={styles.morado}>{fmt(totalGanancias)}</td><td>Suma de todos los puntos de venta</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
