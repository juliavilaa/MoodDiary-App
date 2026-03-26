import React, { useState, useContext } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, ScrollView, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext }      from '../context/AuthContext';
import { EmocionesContext } from '../context/EmocionesContext'; // 👈
import { Ionicons } from '@expo/vector-icons';
import Svg, { Rect, Circle, Text as SvgText, G } from 'react-native-svg';

const PURPLE       = '#9268b8';
const PURPLE_DARK  = '#6B4F9E';
const PURPLE_LIGHT = '#D0C4E8';
const SALMON       = '#E8857A';
const PINK         = '#F0A0B0';
const BLUE_LIGHT   = '#B8D4F0';
const GREEN_LIGHT  = '#A8D8B0';

// ── Donut dinámico ─────────────────────────────────────────────────────────
function DonutDinamico({ emociones }) {
  const cx = 110, cy = 110, r = 85, stroke = 28;
  const circum = 2 * Math.PI * r;

  let acumulado = 0;
  const arcos = emociones.map((e) => {
    const offset    = circum * (1 - acumulado);
    const dasharray = `${circum * (e.pct / 100)} ${circum * (1 - e.pct / 100)}`;
    acumulado += e.pct / 100;
    return { ...e, offset, dasharray };
  });

  return (
    <Svg width={220} height={220} viewBox="0 0 220 220">
      {arcos.map((arco, i) => (
        <Circle
          key={i}
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={arco.color}
          strokeWidth={stroke}
          strokeDasharray={arco.dasharray}
          strokeDashoffset={arco.offset}
          rotation="-90"
          origin={`${cx}, ${cy}`}
        />
      ))}
      <Circle cx={cx} cy={cy} r={r - stroke / 2 - 4} fill="white" />
      <SvgText x={cx} y={cy - 10} textAnchor="middle" fontSize={13} fill="#888" fontWeight="500">
        TOTAL
      </SvgText>
      <SvgText x={cx} y={cy + 12} textAnchor="middle" fontSize={22} fill={PURPLE_DARK} fontWeight="bold">
        100%
      </SvgText>
    </Svg>
  );
}

// ── Barras por día de la semana ────────────────────────────────────────────
function BarrasDinamicas({ registrosPorDia, emocionesUnicas }) {
  const dias   = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const barW   = 28, gap = 18, h = 130;
  const svgW   = dias.length * (barW + gap);

  return (
    <Svg width="100%" height={h + 24} viewBox={`0 0 ${svgW} ${h + 24}`}>
      {dias.map((dia, i) => {
        const totalDia = registrosPorDia[dia] || 0;
        const x = i * (barW + gap) + 4;

        // Si no hay registros ese día, dibuja barra vacía
        if (totalDia === 0) {
          return (
            <G key={i}>
              <Rect x={x} y={h - 4} width={barW} height={4} fill={PURPLE_LIGHT} rx={4} />
              <SvgText x={x + barW / 2} y={h + 16} textAnchor="middle" fontSize={11} fill="#888">
                {dia}
              </SvgText>
            </G>
          );
        }

        const barH = Math.min((totalDia / 5) * h, h); // escala: max 5 registros = barra llena
        return (
          <G key={i}>
            <Rect x={x} y={h - barH} width={barW} height={barH} fill={PURPLE} rx={6} />
            <SvgText x={x + barW / 2} y={h + 16} textAnchor="middle" fontSize={11} fill="#888">
              {dia}
            </SvgText>
          </G>
        );
      })}
    </Svg>
  );
}

// ── Filtro ─────────────────────────────────────────────────────────────────
function FiltroPeriodo({ activo, onChange }) {
  const opciones = ['Semana', 'Mes', 'Año'];
  return (
    <View style={styles.filtroRow}>
      {opciones.map((op) => (
        <TouchableOpacity
          key={op}
          style={[styles.filtroPill, activo === op && styles.filtroPillActivo]}
          onPress={() => onChange(op)}
        >
          <Text style={[styles.filtroTexto, activo === op && styles.filtroTextoActivo]}>
            {op}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ── Pantalla principal ─────────────────────────────────────────────────────
export default function AnalisisEmociones({ navigation }) {
  const { usuario }   = useContext(AuthContext);
  const { registros } = useContext(EmocionesContext); // 👈 datos reales
  const [periodo, setPeriodo] = useState('Semana');

  // 1. Contar cuántas veces aparece cada emoción
  const conteo = {};
  registros.forEach(r => {
    conteo[r.emocion] = (conteo[r.emocion] || 0) + 1;
  });

  // 2. Construir array de emociones con porcentaje real
  const total = registros.length;
  const emocionesCalculadas = Object.entries(conteo).map(([nombre, cant]) => {
    const registro = registros.find(r => r.emocion === nombre);
    return {
      nombre,
      cant,
      pct: total > 0 ? Math.round((cant / total) * 100) : 0,
      color: registro?.color || PURPLE,
      icono: registro?.icono || 'help-outline',
      textColor: registro?.textColor || '#fff',
    };
  }).sort((a, b) => b.pct - a.pct); // ordenar de mayor a menor

  // 3. Emoción dominante
  const emocionTop = emocionesCalculadas[0] || null;

  // 4. Registros por día de la semana (para la gráfica)
  const DIAS_MAP = { 'Hoy': 'D', 'Ayer': 'S', 'Lun': 'L', 'Mar': 'M', 'Mié': 'X', 'Jue': 'J', 'Vie': 'V', 'Sáb': 'S', 'Dom': 'D' };
  const registrosPorDia = {};
  registros.forEach(r => {
    const dia = DIAS_MAP[r.fecha] || 'D';
    registrosPorDia[dia] = (registrosPorDia[dia] || 0) + 1;
  });

  // 5. Historial reciente (últimos 5)
  const historialReciente = registros.slice(0, 5);

  if (total === 0) {
    return (
      <LinearGradient
        colors={['#f5e0ff', '#ffffff', '#e4d2ec', '#ffffff']}
        start={{ x: 0.3, y: 0 }} end={{ x: 0.7, y: 1 }}
        style={styles.background}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Ionicons name="star-outline" size={26} color={PURPLE} style={styles.starIcon} />
              <Text style={styles.nombreUsuario}>{usuario?.nombre || 'Usuario'}</Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="notifications-outline" size={26} color={PURPLE} />
            </TouchableOpacity>
          </View>
          <View style={styles.vacioCentrado}>
            <Ionicons name="happy-outline" size={60} color={PURPLE_LIGHT} />
            <Text style={styles.vacioTitulo}>Aún no hay datos</Text>
            <Text style={styles.vacioSub}>Registra tus primeras emociones para ver el análisis aquí.</Text>
            <TouchableOpacity style={styles.vacioBoton} onPress={() => navigation.navigate('Emociones')}>
              <Text style={styles.vacioBotonTexto}>Ir a Emociones</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#f5e0ff', '#ffffff', '#e4d2ec', '#ffffff']}
      start={{ x: 0.3, y: 0 }}
      end={{ x: 0.7, y: 1 }}
      style={styles.background}
    >
      <SafeAreaView style={styles.safeArea}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="star-outline" size={26} color={PURPLE} style={styles.starIcon} />
            <Text style={styles.nombreUsuario}>{usuario?.nombre || 'Usuario'}</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={26} color={PURPLE} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* Back + título */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backRow}>
            <Ionicons name="chevron-back" size={20} color={PURPLE} />
            <Text style={styles.backTexto}>Análisis</Text>
          </TouchableOpacity>
          <Text style={styles.tituloSeccion}>Análisis de Emociones</Text>
          <Text style={styles.subtituloSeccion}>Basado en {total} registros</Text>

          {/* Filtro */}
          <FiltroPeriodo activo={periodo} onChange={setPeriodo} />

          {/* Tarjetas rápidas */}
          <View style={styles.tarjetasRow}>
            <View style={[styles.tarjetaRapida, { backgroundColor: PURPLE + '18' }]}>
              <Ionicons name="analytics-outline" size={22} color={PURPLE_DARK} />
              <Text style={styles.tarjetaNum}>{emocionesCalculadas.length}</Text>
              <Text style={styles.tarjetaLabel}>Tipos de{'\n'}emoción</Text>
            </View>

            <View style={[styles.tarjetaRapida, { backgroundColor: PINK + '40' }]}>
              <Ionicons name={emocionTop?.icono || 'help-outline'} size={22} color={PURPLE_DARK} />
              <Text style={styles.tarjetaNum}>{emocionTop?.pct || 0}%</Text>
              <Text style={styles.tarjetaLabel}>Emoción{'\n'}dominante</Text>
            </View>

            <View style={[styles.tarjetaRapida, { backgroundColor: SALMON + '20' }]}>
              <Ionicons name="list-outline" size={22} color={SALMON} />
              <Text style={[styles.tarjetaNum, { color: SALMON }]}>{total}</Text>
              <Text style={styles.tarjetaLabel}>Total{'\n'}registros</Text>
            </View>
          </View>

          {/* Donut */}
          <View style={styles.card}>
            <Text style={styles.cardTitulo}>Distribución de emociones</Text>
            {emocionesCalculadas.length > 0 && (
              <View style={styles.donutContainer}>
                <DonutDinamico emociones={emocionesCalculadas} />
                <View style={styles.donutLeyenda}>
                  {emocionesCalculadas.map((e, i) => (
                    <View key={i} style={styles.leyendaFila}>
                      <View style={[styles.leyendaDot, { backgroundColor: e.color }]} />
                      <Text style={styles.leyendaTexto}>{e.nombre}</Text>
                      <Text style={styles.leyendaPct}>{e.pct}% ({e.cant})</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Barras por día */}
          <View style={styles.card}>
            <Text style={styles.cardTitulo}>Registros por día</Text>
            <BarrasDinamicas registrosPorDia={registrosPorDia} />
          </View>

          {/* Grid emociones */}
          <Text style={styles.cardTitulo}>Detalle por emoción</Text>
          <View style={styles.emocionesGrid}>
            {emocionesCalculadas.map((e, i) => (
              <View key={i} style={[styles.emocionCard, { backgroundColor: e.color }]}>
                <Ionicons name={e.icono} size={26} color={e.textColor} />
                <Text style={[styles.emocionNombre, { color: e.textColor }]}>{e.nombre}</Text>
                <Text style={[styles.emocionPct, { color: e.textColor }]}>{e.pct}%</Text>
                <View style={styles.emocionBarra}>
                  <View style={[styles.emocionBarraRelleno, {
                    width: `${e.pct}%`,
                    backgroundColor: e.textColor === '#fff' ? 'rgba(255,255,255,0.6)' : 'rgba(74,111,165,0.5)',
                  }]} />
                </View>
              </View>
            ))}
          </View>

          {/* Historial reciente */}
          <View style={styles.card}>
            <Text style={styles.cardTitulo}>Historial reciente</Text>
            <View style={styles.historialLista}>
              {historialReciente.map((h, i) => (
                <View key={i} style={styles.historialItem}>
                  <View style={[styles.historialIconoBg, { backgroundColor: h.color + '30' }]}>
                    <Ionicons name={h.icono} size={18} color={h.color} />
                  </View>
                  <View style={styles.historialInfo}>
                    <Text style={styles.historialEmocion}>{h.emocion}</Text>
                    <Text style={styles.historialFecha} numberOfLines={1}>{h.descripcion}</Text>
                  </View>
                  <View style={[styles.historialPill, { backgroundColor: h.color + '30' }]}>
                    <Text style={[styles.historialPillTexto, { color: h.color }]}>{h.fecha}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

        </ScrollView>

        {/* Bottom Nav */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Inicio')}>
            <Ionicons name="home-outline" size={24} color={PURPLE} />
            <Text style={styles.navLabel}>HOME</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Analisis')}>
            <Ionicons name="bar-chart" size={24} color={PURPLE} />
            <Text style={styles.navLabelActivo}>ANÁLISIS</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Emociones')}>
            <Ionicons name="happy-outline" size={24} color={PURPLE} />
            <Text style={styles.navLabel}>EMOCIONES</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Metas')}>
            <Ionicons name="flag-outline" size={24} color={PURPLE} />
            <Text style={styles.navLabel}>METAS</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  background:    { flex: 1 },
  safeArea:      { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 28 },

  // Header
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 20,
    paddingTop: 12, paddingBottom: 8,
  },
  headerLeft:    { flexDirection: 'row', alignItems: 'center', gap: 8 },
  starIcon:      { borderWidth: 1.5, borderColor: PURPLE, borderRadius: 50, padding: 2 },
  nombreUsuario: { fontSize: 18, fontWeight: '700', color: PURPLE },

  // Back
  backRow:   { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 4, marginBottom: 2 },
  backTexto: { fontSize: 13, color: PURPLE, fontWeight: '500' },

  // Títulos
  tituloSeccion:    { fontSize: 26, fontWeight: '800', color: '#333', marginTop: 2 },
  subtituloSeccion: { fontSize: 13, color: '#888', marginBottom: 12, marginTop: 2 },

  // Filtro
  filtroRow: {
    flexDirection: 'row', gap: 8,
    marginBottom: 16,
  },
  filtroPill: {
    paddingVertical: 6, paddingHorizontal: 16,
    borderRadius: 50, borderWidth: 1,
    borderColor: 'rgba(180,130,220,0.4)',
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  filtroPillActivo: {
    backgroundColor: PURPLE,
    borderColor: PURPLE,
  },
  filtroTexto:       { fontSize: 13, color: PURPLE, fontWeight: '500' },
  filtroTextoActivo: { color: '#fff' },

  // Tarjetas rápidas
  tarjetasRow:   { flexDirection: 'row', gap: 10, marginBottom: 16 },
  tarjetaRapida: {
    flex: 1, borderRadius: 16, padding: 12,
    alignItems: 'center', gap: 4,
    borderWidth: 0.5, borderColor: 'rgba(180,130,220,0.2)',
  },
  tarjetaNum:   { fontSize: 20, fontWeight: '800', color: PURPLE_DARK },
  tarjetaLabel: { fontSize: 10, color: '#888', textAlign: 'center', lineHeight: 14 },

  // Card genérica
  card: {
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: 20, padding: 18, marginBottom: 16,
    borderWidth: 0.5, borderColor: 'rgba(180,130,220,0.25)',
  },
  cardTitulo: { fontSize: 15, fontWeight: '700', color: '#333', marginBottom: 14 },

  // Donut
  donutContainer: { alignItems: 'center', gap: 16 },
  donutLeyenda:   { width: '100%', gap: 8 },
  leyendaFila:    { flexDirection: 'row', alignItems: 'center', gap: 8 },
  leyendaDot:     { width: 10, height: 10, borderRadius: 5 },
  leyendaTexto:   { fontSize: 13, color: '#555', flex: 1 },
  leyendaPct:     { fontSize: 13, fontWeight: '700', color: '#333' },

  // Barras apiladas
  barrasLeyenda: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 },

  // Grid emociones
  emocionesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  emocionCard: {
    width: '47%', borderRadius: 16,
    padding: 14, gap: 6,
  },
  emocionNombre:       { fontSize: 13, fontWeight: '600' },
  emocionPct:          { fontSize: 22, fontWeight: '800' },
  emocionBarra:        { height: 5, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 50, overflow: 'hidden' },
  emocionBarraRelleno: { height: '100%', borderRadius: 50 },

  // Historial
  historialLista: { gap: 12 },
  historialItem:  { flexDirection: 'row', alignItems: 'center', gap: 12 },
  historialIconoBg: {
    width: 38, height: 38, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  historialInfo:       { flex: 1 },
  historialEmocion:    { fontSize: 14, fontWeight: '600', color: '#333' },
  historialFecha:      { fontSize: 12, color: '#888' },
  historialPill:       { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 50 },
  historialPillTexto:  { fontSize: 11, fontWeight: '600' },

  // Bottom Nav
  bottomNav: {
    flexDirection: 'row', justifyContent: 'space-around',
    alignItems: 'center', paddingVertical: 12, paddingHorizontal: 8,
    borderTopWidth: 0.5, borderTopColor: 'rgba(180,130,220,0.3)',
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  navItem:        { alignItems: 'center', gap: 3 },
  navLabel:       { fontSize: 10, color: PURPLE, fontWeight: '400' },
  navLabelActivo: { fontSize: 10, color: PURPLE, fontWeight: '700' },
});