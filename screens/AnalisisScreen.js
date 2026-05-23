import React, { useState, useContext } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../context/AuthContext";
import { EmocionesContext } from "../context/EmocionesContext";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Rect, Circle, Text as SvgText, G } from "react-native-svg";
import Header from "../components/Header";
import { generarYCompartirPDF } from "../utils/generarPDF";

const PURPLE = "#9268b8";
const PURPLE_DARK = "#6B4F9E";
const PURPLE_LIGHT = "#D0C4E8";
const SALMON = "#E8857A";
const PINK = "#F0A0B0";

function DonutDinamico({ emociones }) {
  const cx = 110, cy = 110, r = 85, stroke = 28;
  const circum = 2 * Math.PI * r;
  let acumulado = 0;
  const arcos = emociones.map((e) => {
    const offset = circum * (1 - acumulado);
    const dasharray = `${circum * (e.pct / 100)} ${circum * (1 - e.pct / 100)}`;
    acumulado += e.pct / 100;
    return { ...e, offset, dasharray };
  });
  return (
    <Svg width={220} height={220} viewBox="0 0 220 220">
      {arcos.map((arco, i) => (
        <Circle key={i} cx={cx} cy={cy} r={r} fill="none"
          stroke={arco.color} strokeWidth={stroke}
          strokeDasharray={arco.dasharray} strokeDashoffset={arco.offset}
          rotation="-90" origin={`${cx}, ${cy}`} />
      ))}
      <Circle cx={cx} cy={cy} r={r - stroke / 2 - 4} fill="white" />
      <SvgText x={cx} y={cy - 10} textAnchor="middle" fontSize={13} fill="#888" fontWeight="500">TOTAL</SvgText>
      <SvgText x={cx} y={cy + 12} textAnchor="middle" fontSize={22} fill={PURPLE_DARK} fontWeight="bold">100%</SvgText>
    </Svg>
  );
}

function BarrasDinamicas({ registrosPorDia }) {
  const dias = ["L", "M", "X", "J", "V", "S", "D"];
  const barW = 28, gap = 18, h = 130;
  const svgW = dias.length * (barW + gap);
  return (
    <Svg width="100%" height={h + 24} viewBox={`0 0 ${svgW} ${h + 24}`}>
      {dias.map((dia, i) => {
        const totalDia = registrosPorDia[dia] || 0;
        const x = i * (barW + gap) + 4;
        if (totalDia === 0) {
          return (
            <G key={i}>
              <Rect x={x} y={h - 4} width={barW} height={4} fill={PURPLE_LIGHT} rx={4} />
              <SvgText x={x + barW / 2} y={h + 16} textAnchor="middle" fontSize={11} fill="#888">{dia}</SvgText>
            </G>
          );
        }
        const barH = Math.min((totalDia / 5) * h, h);
        return (
          <G key={i}>
            <Rect x={x} y={h - barH} width={barW} height={barH} fill={PURPLE} rx={6} />
            <SvgText x={x + barW / 2} y={h + 16} textAnchor="middle" fontSize={11} fill="#888">{dia}</SvgText>
          </G>
        );
      })}
    </Svg>
  );
}

export default function AnalisisScreen({ navigation }) {
  const { usuario } = useContext(AuthContext);
  const { registros } = useContext(EmocionesContext);

  const handleDescargarPDF = async () => {
    try {
      await generarYCompartirPDF({ registros, usuario });
    } catch (e) {
      Alert.alert("Error", "No se pudo generar el PDF.");
    }
  };

  const conteo = {};
  registros.forEach((r) => { conteo[r.emocion] = (conteo[r.emocion] || 0) + 1; });
  const total = registros.length;

  const emocionesCalculadas = Object.entries(conteo).map(([nombre, cant]) => {
    const registro = registros.find((r) => r.emocion === nombre);
    return {
      nombre, cant,
      pct: total > 0 ? Math.round((cant / total) * 100) : 0,
      color: registro?.color || PURPLE,
      icono: registro?.icono || "help-outline",
      textColor: registro?.textColor || "#fff",
    };
  }).sort((a, b) => b.pct - a.pct);

  const emocionTop = emocionesCalculadas[0] || null;

  const DIAS_MAP = { Hoy: "D", Ayer: "S", Lun: "L", Mar: "M", Mié: "X", Jue: "J", Vie: "V", Sáb: "S", Dom: "D" };
  const registrosPorDia = {};
  registros.forEach((r) => {
    const dia = DIAS_MAP[r.fecha] || "D";
    registrosPorDia[dia] = (registrosPorDia[dia] || 0) + 1;
  });

  const historialReciente = registros.slice(0, 5);

  if (total === 0) {
    return (
      <LinearGradient colors={["#f5e0ff", "#ffffff", "#e4d2ec", "#ffffff"]} start={{ x: 0.3, y: 0 }} end={{ x: 0.7, y: 1 }} style={styles.background}>
        <SafeAreaView style={styles.safeArea}>
          <Header navigation={navigation} />
          <View style={styles.vacioCentrado}>
            <Ionicons name="happy-outline" size={60} color={PURPLE_LIGHT} />
            <Text style={styles.vacioTitulo}>Aún no hay datos</Text>
            <Text style={styles.vacioSub}>Registra tus primeras emociones para ver el análisis aquí.</Text>
            <TouchableOpacity style={styles.vacioBoton} onPress={() => navigation.navigate("Emociones")}>
              <Text style={styles.vacioBotonTexto}>Ir a Emociones</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#f5e0ff", "#ffffff", "#e4d2ec", "#ffffff"]} start={{ x: 0.3, y: 0 }} end={{ x: 0.7, y: 1 }} style={styles.background}>
      <SafeAreaView style={styles.safeArea}>
        <Header navigation={navigation} />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.tituloSeccion}>Análisis</Text>
          <Text style={styles.subtituloSeccion}>Basado en {total} registros</Text>

          <View style={styles.tarjetasRow}>
            <View style={[styles.tarjetaRapida, { backgroundColor: PURPLE + "18" }]}>
              <Ionicons name="analytics-outline" size={22} color={PURPLE_DARK} />
              <Text style={styles.tarjetaNum}>{emocionesCalculadas.length}</Text>
              <Text style={styles.tarjetaLabel}>Tipos de{"\n"}emoción</Text>
            </View>
            <View style={[styles.tarjetaRapida, { backgroundColor: PINK + "40" }]}>
              <Ionicons name={emocionTop?.icono || "help-outline"} size={22} color={PURPLE_DARK} />
              <Text style={styles.tarjetaNum}>{emocionTop?.pct || 0}%</Text>
              <Text style={styles.tarjetaLabel}>Emoción{"\n"}dominante</Text>
            </View>
            <View style={[styles.tarjetaRapida, { backgroundColor: SALMON + "20" }]}>
              <Ionicons name="list-outline" size={22} color={SALMON} />
              <Text style={[styles.tarjetaNum, { color: SALMON }]}>{total}</Text>
              <Text style={styles.tarjetaLabel}>Total{"\n"}registros</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitulo}>Distribución de emociones</Text>
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
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitulo}>Registros por día</Text>
            <BarrasDinamicas registrosPorDia={registrosPorDia} />
          </View>

          <Text style={styles.cardTitulo}>Detalle por emoción</Text>
          <View style={styles.emocionesGrid}>
            {emocionesCalculadas.map((e, i) => (
              <View key={i} style={[styles.emocionCard, { backgroundColor: e.color }]}>
                <Ionicons name={e.icono} size={26} color={e.textColor} />
                <Text style={[styles.emocionNombre, { color: e.textColor }]}>{e.nombre}</Text>
                <Text style={[styles.emocionPct, { color: e.textColor }]}>{e.pct}%</Text>
                <View style={styles.emocionBarra}>
                  <View style={[styles.emocionBarraRelleno, { width: `${e.pct}%`, backgroundColor: e.textColor === "#fff" ? "rgba(255,255,255,0.6)" : "rgba(74,111,165,0.5)" }]} />
                </View>
              </View>
            ))}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitulo}>Historial reciente</Text>
            <View style={styles.historialLista}>
              {historialReciente.map((h, i) => (
                <View key={i} style={styles.historialItem}>
                  <View style={[styles.historialIconoBg, { backgroundColor: h.color + "30" }]}>
                    <Ionicons name={h.icono} size={18} color={h.color} />
                  </View>
                  <View style={styles.historialInfo}>
                    <Text style={styles.historialEmocion}>{h.emocion}</Text>
                    <Text style={styles.historialFecha} numberOfLines={1}>{h.descripcion}</Text>
                  </View>
                  <View style={[styles.historialPill, { backgroundColor: h.color + "30" }]}>
                    <Text style={[styles.historialPillTexto, { color: h.color }]}>{h.fecha}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.botonPDF} onPress={handleDescargarPDF}>
            <Ionicons name="download-outline" size={16} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.botonTexto}>Descargar PDF</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Inicio")}>
            <Ionicons name="home-outline" size={24} color={PURPLE} />
            <Text style={styles.navLabel}>HOME</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="bar-chart" size={24} color={PURPLE} />
            <Text style={styles.navLabelActivo}>ANÁLISIS</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Emociones")}>
            <Ionicons name="happy-outline" size={24} color={PURPLE} />
            <Text style={styles.navLabel}>EMOCIONES</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Metas")}>
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
  scrollContent: { paddingHorizontal: 20, paddingBottom: 28 },
  tituloSeccion: { fontSize: 26, fontWeight: "800", color: "#333", marginTop: 12, marginBottom: 4 },
  subtituloSeccion: { fontSize: 13, color: "#888", marginBottom: 16 },
  tarjetasRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  tarjetaRapida: { flex: 1, borderRadius: 16, padding: 12, alignItems: "center", gap: 4, borderWidth: 0.5, borderColor: "rgba(180,130,220,0.2)" },
  tarjetaNum: { fontSize: 20, fontWeight: "800", color: PURPLE_DARK },
  tarjetaLabel: { fontSize: 10, color: "#888", textAlign: "center", lineHeight: 14 },
  card: { backgroundColor: "rgba(255,255,255,0.75)", borderRadius: 20, padding: 18, marginBottom: 16, borderWidth: 0.5, borderColor: "rgba(180,130,220,0.25)" },
  cardTitulo: { fontSize: 15, fontWeight: "700", color: "#333", marginBottom: 14 },
  donutContainer: { alignItems: "center", gap: 16 },
  donutLeyenda: { width: "100%", gap: 8 },
  leyendaFila: { flexDirection: "row", alignItems: "center", gap: 8 },
  leyendaDot: { width: 10, height: 10, borderRadius: 5 },
  leyendaTexto: { fontSize: 13, color: "#555", flex: 1 },
  leyendaPct: { fontSize: 13, fontWeight: "700", color: "#333" },
  emocionesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 16 },
  emocionCard: { width: "47%", borderRadius: 16, padding: 14, gap: 6 },
  emocionNombre: { fontSize: 13, fontWeight: "600" },
  emocionPct: { fontSize: 22, fontWeight: "800" },
  emocionBarra: { height: 5, backgroundColor: "rgba(255,255,255,0.3)", borderRadius: 50, overflow: "hidden" },
  emocionBarraRelleno: { height: "100%", borderRadius: 50 },
  historialLista: { gap: 12 },
  historialItem: { flexDirection: "row", alignItems: "center", gap: 12 },
  historialIconoBg: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  historialInfo: { flex: 1 },
  historialEmocion: { fontSize: 14, fontWeight: "600", color: "#333" },
  historialFecha: { fontSize: 12, color: "#888" },
  historialPill: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 50 },
  historialPillTexto: { fontSize: 11, fontWeight: "600" },
  botonPDF: { backgroundColor: PURPLE, borderRadius: 14, paddingVertical: 16, paddingHorizontal: 20, flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 8 },
  botonTexto: { color: "#fff", fontSize: 14, fontWeight: "500" },
  vacioCentrado: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 32, gap: 16 },
  vacioTitulo: { fontSize: 20, fontWeight: "700", color: PURPLE_DARK },
  vacioSub: { fontSize: 14, color: "#888", textAlign: "center" },
  vacioBoton: { backgroundColor: PURPLE, borderRadius: 50, paddingVertical: 12, paddingHorizontal: 32 },
  vacioBotonTexto: { color: "#fff", fontWeight: "700" },
  bottomNav: { flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingVertical: 12, paddingHorizontal: 8, borderTopWidth: 0.5, borderTopColor: "rgba(180,130,220,0.3)", backgroundColor: "rgba(255,255,255,0.6)" },
  navItem: { alignItems: "center", gap: 3 },
  navLabel: { fontSize: 10, color: PURPLE, fontWeight: "400" },
  navLabelActivo: { fontSize: 10, color: PURPLE, fontWeight: "700" },
});