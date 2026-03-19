import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import Svg, { G, Path, Circle } from 'react-native-svg';

const PURPLE = '#9268b8';
const PURPLE_DARK = '#6B4F9E';
const SALMON = '#E8857A';
const PINK = '#F0A0B0';

// Donut chart manual con SVG
function DonutChart() {
  const cx = 90, cy = 90, r = 65, stroke = 22;
  const circum = 2 * Math.PI * r;

  // Segmentos: triste 35%, feliz 30%, enojado 20%, otro 15%
  const segmentos = [
    { pct: 0.35, color: PURPLE },
    { pct: 0.30, color: PINK },
    { pct: 0.20, color: SALMON },
    { pct: 0.15, color: '#D0C4E8' },
  ];

  let acumulado = 0;
  const arcos = segmentos.map((seg) => {
    const offset = circum * (1 - acumulado);
    const dasharray = `${circum * seg.pct} ${circum * (1 - seg.pct)}`;
    acumulado += seg.pct;
    return { ...seg, offset, dasharray };
  });

  return (
    <Svg width={180} height={180} viewBox="0 0 180 180">
      {arcos.map((arco, i) => (
        <Circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={arco.color}
          strokeWidth={stroke}
          strokeDasharray={arco.dasharray}
          strokeDashoffset={arco.offset}
          rotation="-90"
          origin={`${cx}, ${cy}`}
        />
      ))}
      <Circle cx={cx} cy={cy} r={r - stroke / 2 - 2} fill="white" />
    </Svg>
  );
}

export default function AnalisisScreen({ navigation }) {
  const { usuario } = useContext(AuthContext);

  const emociones = [
    { nombre: 'Enojado', pct: '5%',  color: SALMON,     icono: 'sad-outline',     textColor: '#fff' },
    { nombre: 'Triste',  pct: '35%', color: PURPLE_DARK, icono: 'sad-outline',     textColor: '#fff' },
    { nombre: 'Feliz',   pct: '30%', color: PINK,        icono: 'happy-outline',   textColor: '#fff' },
    { nombre: 'Calmado', pct: '10%', color: '#B8D4F0',   icono: 'happy-outline',   textColor: '#4a6fa5' },
  ];

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
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Título sección */}
          <Text style={styles.tituloSeccion}>Análisis</Text>
          <Text style={styles.subtituloSeccion}>Resumen de tu bienestar semanal</Text>

          {/* Card Donut */}
          <View style={styles.card}>
            <View style={styles.donutWrapper}>
              <DonutChart />
              <View style={styles.donutLabel}>
                <Text style={styles.donutTotal}>TOTAL 100%</Text>
              </View>
            </View>

            {/* Leyenda */}
            <View style={styles.leyenda}>
              <View style={styles.leyendaItem}>
                <Text style={styles.leyendaPct}>35%</Text>
                <Text style={styles.leyendaNombre}>TRISTE</Text>
              </View>
              <View style={styles.leyendaItem}>
                <Text style={styles.leyendaPct}>30%</Text>
                <Text style={styles.leyendaNombre}>FELIZ</Text>
              </View>
              <View style={styles.leyendaItem}>
                <Text style={styles.leyendaPct}>20%</Text>
                <Text style={styles.leyendaNombre}>ENOJADO</Text>
              </View>
            </View>
          </View>

          {/* Detalle Emociones */}
          <Text style={styles.detalleTitle}>Detalle de Emociones</Text>
          <View style={styles.emocionesRow}>
            {emociones.map((e, i) => (
              <View key={i} style={[styles.emocionCard, { backgroundColor: e.color }]}>
                <Ionicons name={e.icono} size={22} color={e.textColor} />
                <Text style={[styles.emocionPct, { color: e.textColor }]}>{e.pct}</Text>
              </View>
            ))}
          </View>

          {/* Botones de acción */}
          <View style={styles.botonesContainer}>
            <TouchableOpacity style={styles.boton}>
              <Text style={styles.botonTexto}>analizar metas  ›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.boton}>
              <Ionicons name="download-outline" size={16} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.botonTexto}>descargar PDF</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.boton}>
              <Text style={styles.botonTexto}>analizar emociones  ›</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>

        {/* Bottom Nav */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Inicio')}>
            <Ionicons name="home-outline" size={24} color={PURPLE} />
            <Text style={styles.navLabel}>HOME</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="bar-chart" size={24} color={PURPLE} />
            <Text style={styles.navLabelActivo}>ANÁLISIS</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="happy-outline" size={24} color={PURPLE} />
            <Text style={styles.navLabel}>EMOCIONES</Text>
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
  background: { flex: 1 },
  safeArea: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starIcon: {
    borderWidth: 1.5,
    borderColor: PURPLE,
    borderRadius: 50,
    padding: 2,
  },
  nombreUsuario: {
    fontSize: 18,
    fontWeight: '700',
    color: PURPLE,
  },

  // Títulos
  tituloSeccion: {
    fontSize: 26,
    fontWeight: '800',
    color: '#333',
    marginTop: 8,
  },
  subtituloSeccion: {
    fontSize: 13,
    color: '#888',
    marginBottom: 16,
    marginTop: 2,
  },

  // Card donut
  card: {
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(180,130,220,0.25)',
  },
  donutWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  donutLabel: {
    position: 'absolute',
    alignItems: 'center',
  },
  donutTotal: {
    fontSize: 11,
    fontWeight: '600',
    color: '#888',
    textAlign: 'center',
  },
  leyenda: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  leyendaItem: {
    alignItems: 'center',
    gap: 2,
  },
  leyendaPct: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  leyendaNombre: {
    fontSize: 11,
    color: '#888',
    letterSpacing: 0.5,
  },

  // Detalle emociones
  detalleTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  emocionesRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  emocionCard: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    gap: 8,
  },
  emocionPct: {
    fontSize: 14,
    fontWeight: '700',
  },

  // Botones
  botonesContainer: {
    gap: 12,
  },
  boton: {
    backgroundColor: PURPLE,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  botonTexto: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.3,
  },

  // Bottom Nav
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(180,130,220,0.3)',
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  navItem: {
    alignItems: 'center',
    gap: 3,
  },
  navLabel: {
    fontSize: 10,
    color: PURPLE,
    fontWeight: '400',
  },
  navLabelActivo: {
    fontSize: 10,
    color: PURPLE,
    fontWeight: '700',
  },
});