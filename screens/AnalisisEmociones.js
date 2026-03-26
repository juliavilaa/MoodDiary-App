import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Rect, Circle, Text as SvgText, G } from 'react-native-svg';

const PURPLE       = '#9268b8';
const PURPLE_DARK  = '#6B4F9E';
const PURPLE_LIGHT = '#D0C4E8';
const SALMON       = '#E8857A';
const PINK         = '#F0A0B0';
const BLUE_LIGHT   = '#B8D4F0';
const GREEN_LIGHT  = '#A8D8B0';

const SCREEN_W = Dimensions.get('window').width;

// ── Datos de ejemplo ───────────────────────────────────────────────────────
const EMOCIONES = [
  { nombre: 'Triste',    pct: 35, color: PURPLE,      icono: 'sad-outline',       textColor: '#fff' },
  { nombre: 'Feliz',     pct: 30, color: PINK,        icono: 'happy-outline',     textColor: '#fff' },
  { nombre: 'Enojado',   pct: 20, color: SALMON,      icono: 'thunderstorm-outline', textColor: '#fff' },
  { nombre: 'Calmado',   pct: 10, color: BLUE_LIGHT,  icono: 'partly-sunny-outline', textColor: '#4a6fa5' },
  { nombre: 'Ansioso',   pct: 5,  color: GREEN_LIGHT, icono: 'alert-circle-outline', textColor: '#3a7a45' },
];

const SEMANA = [
  { dia: 'L', valores: { Triste: 40, Feliz: 20, Enojado: 30, Calmado: 10 } },
  { dia: 'M', valores: { Triste: 20, Feliz: 50, Enojado: 10, Calmado: 20 } },
  { dia: 'X', valores: { Triste: 30, Feliz: 30, Enojado: 25, Calmado: 15 } },
  { dia: 'J', valores: { Triste: 15, Feliz: 60, Enojado: 5,  Calmado: 20 } },
  { dia: 'V', valores: { Triste: 35, Feliz: 25, Enojado: 30, Calmado: 10 } },
  { dia: 'S', valores: { Triste: 10, Feliz: 70, Enojado: 10, Calmado: 10 } },
  { dia: 'D', valores: { Triste: 25, Feliz: 40, Enojado: 20, Calmado: 15 } },
];

const COLORES_BARRA = [PURPLE, PINK, SALMON, BLUE_LIGHT];
const EMOCION_KEYS  = ['Triste', 'Feliz', 'Enojado', 'Calmado'];

const HISTORIAL = [
  { fecha: 'Hoy',      emocion: 'Feliz',   icono: 'happy-outline',        color: PINK        },
  { fecha: 'Ayer',     emocion: 'Triste',  icono: 'sad-outline',          color: PURPLE      },
  { fecha: 'Lun',      emocion: 'Calmado', icono: 'partly-sunny-outline', color: BLUE_LIGHT  },
  { fecha: 'Dom',      emocion: 'Enojado', icono: 'thunderstorm-outline', color: SALMON      },
  { fecha: 'Sáb',      emocion: 'Feliz',   icono: 'happy-outline',        color: PINK        },
];

// ── Donut grande ───────────────────────────────────────────────────────────
function DonutGrande() {
  const cx = 110, cy = 110, r = 85, stroke = 28;
  const circum = 2 * Math.PI * r;
  const colores = [PURPLE, PINK, SALMON, BLUE_LIGHT, GREEN_LIGHT];

  let acumulado = 0;
  const arcos = EMOCIONES.map((e, i) => {
    const offset    = circum * (1 - acumulado);
    const dasharray = `${circum * (e.pct / 100)} ${circum * (1 - e.pct / 100)}`;
    acumulado += e.pct / 100;
    return { ...e, offset, dasharray, color: colores[i] };
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

// ── Barras apiladas semanales ──────────────────────────────────────────────
function BarrasApiladas() {
  const barW  = 28;
  const gap   = 18;
  const h     = 130;
  const total = SEMANA.length;
  const svgW  = total * (barW + gap);

  return (
    <Svg width="100%" height={h + 24} viewBox={`0 0 ${svgW} ${h + 24}`}>
      {SEMANA.map((dia, i) => {
        let yAcum = h;
        const x   = i * (barW + gap) + 4;
        return (
          <G key={i}>
            {EMOCION_KEYS.map((key, j) => {
              const barH = (dia.valores[key] / 100) * h;
              yAcum -= barH;
              return (
                <Rect
                  key={j}
                  x={x} y={yAcum}
                  width={barW} height={barH}
                  fill={COLORES_BARRA[j]}
                  rx={j === 0 ? 6 : 0}
                />
              );
            })}
            <SvgText
              x={x + barW / 2} y={h + 16}
              textAnchor="middle" fontSize={11} fill="#888"
            >
              {dia.dia}
            </SvgText>
          </G>
        );
      })}
    </Svg>
  );
}

// ── Filtro de período ──────────────────────────────────────────────────────
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
  const { usuario }    = useContext(AuthContext);
  const [periodo, setPeriodo] = useState('Semana');

  const emocionTop = EMOCIONES.reduce((a, b) => a.pct > b.pct ? a : b);

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

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Back + título */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backRow}>
            <Ionicons name="chevron-back" size={20} color={PURPLE} />
            <Text style={styles.backTexto}>Análisis</Text>
          </TouchableOpacity>
          <Text style={styles.tituloSeccion}>Análisis de Emociones</Text>
          <Text style={styles.subtituloSeccion}>Tu estado emocional de la semana</Text>

          {/* Filtro */}
          <FiltroPeriodo activo={periodo} onChange={setPeriodo} />

          {/* Tarjetas rápidas */}
          <View style={styles.tarjetasRow}>
            <View style={[styles.tarjetaRapida, { backgroundColor: PURPLE + '18' }]}>
              <Ionicons name="analytics-outline" size={22} color={PURPLE_DARK} />
              <Text style={styles.tarjetaNum}>5</Text>
              <Text style={styles.tarjetaLabel}>Emociones{'\n'}registradas</Text>
            </View>
            <View style={[styles.tarjetaRapida, { backgroundColor: PINK + '40' }]}>
              <Ionicons name={emocionTop.icono} size={22} color={PURPLE_DARK} />
              <Text style={styles.tarjetaNum}>{emocionTop.pct}%</Text>
              <Text style={styles.tarjetaLabel}>Emoción{'\n'}dominante</Text>
            </View>
            <View style={[styles.tarjetaRapida, { backgroundColor: SALMON + '20' }]}>
              <Ionicons name="calendar-outline" size={22} color={SALMON} />
              <Text style={[styles.tarjetaNum, { color: SALMON }]}>7</Text>
              <Text style={styles.tarjetaLabel}>Días{'\n'}registrados</Text>
            </View>
          </View>

          {/* Donut grande */}
          <View style={styles.card}>
            <Text style={styles.cardTitulo}>Distribución de emociones</Text>
            <View style={styles.donutContainer}>
              <DonutGrande />
              <View style={styles.donutLeyenda}>
                {EMOCIONES.map((e, i) => (
                  <View key={i} style={styles.leyendaFila}>
                    <View style={[styles.leyendaDot, { backgroundColor: e.color }]} />
                    <Text style={styles.leyendaTexto}>{e.nombre}</Text>
                    <Text style={styles.leyendaPct}>{e.pct}%</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Barras apiladas */}
          <View style={styles.card}>
            <Text style={styles.cardTitulo}>Evolución semanal</Text>
            <BarrasApiladas />
            <View style={styles.barrasLeyenda}>
              {EMOCION_KEYS.map((key, i) => (
                <View key={i} style={styles.leyendaFila}>
                  <View style={[styles.leyendaDot, { backgroundColor: COLORES_BARRA[i] }]} />
                  <Text style={styles.leyendaTexto}>{key}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Cards emociones individuales */}
          <Text style={styles.cardTitulo}>Detalle por emoción</Text>
          <View style={styles.emocionesGrid}>
            {EMOCIONES.map((e, i) => (
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
              {HISTORIAL.map((h, i) => (
                <View key={i} style={styles.historialItem}>
                  <View style={[styles.historialIconoBg, { backgroundColor: h.color + '30' }]}>
                    <Ionicons name={h.icono} size={18}
                      color={h.color === BLUE_LIGHT ? '#4a6fa5' : h.color} />
                  </View>
                  <View style={styles.historialInfo}>
                    <Text style={styles.historialEmocion}>{h.emocion}</Text>
                    <Text style={styles.historialFecha}>{h.fecha}</Text>
                  </View>
                  <View style={[styles.historialPill, { backgroundColor: h.color + '30' }]}>
                    <Text style={[styles.historialPillTexto, {
                      color: h.color === BLUE_LIGHT ? '#4a6fa5' : h.color
                    }]}>
                      registrado
                    </Text>
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
            <Ionicons name="bar-chart-outline" size={24} color={PURPLE} />
            <Text style={styles.navLabel}>ANÁLISIS</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="happy" size={24} color={PURPLE} />
            <Text style={styles.navLabelActivo}>EMOCIONES</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
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