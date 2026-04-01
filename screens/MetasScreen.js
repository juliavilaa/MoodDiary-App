import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthContext";
import { MetasContext } from "../context/MetasContext";
import MetaItem from "../components/MetaItem";
import Header from "../components/Header";

const PURPLE = "#9268b8";
const PURPLE_DARK = "#6B4F9E";

export default function MetasScreen({ navigation }) {
  const { usuario } = useContext(AuthContext);
  const {
    metas,
    progreso,
    agregarMeta,
    eliminarMeta,
    editarMeta,
    toggleCompletar,
  } = useContext(MetasContext);

  const [modalAgregar, setModalAgregar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [metaEditando, setMetaEditando] = useState(null);
  const [editNombre, setEditNombre] = useState("");

  const handleAgregar = () => {
    const ok = agregarMeta(nuevoNombre);
    if (ok) {
      setNuevoNombre("");
      setModalAgregar(false);
    }
  };

  const abrirEditar = (meta) => {
    setMetaEditando(meta);
    setEditNombre(meta.nombre);
    setModalEditar(true);
  };

  const handleEditar = () => {
    editarMeta(metaEditando.id, editNombre);
    setModalEditar(false);
  };

  const completadas = metas.filter((m) => m.completada).length;

  return (
    <LinearGradient
      colors={["#f5e0ff", "#ffffff", "#e4d2ec", "#ffffff"]}
      start={{ x: 0.3, y: 0 }}
      end={{ x: 0.7, y: 1 }}
      style={styles.background}
    >
      <SafeAreaView style={styles.safeArea}>
        
        {/* Header */}
        <Header navigation={navigation} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Título + botón agregar */}
          <View style={styles.tituloRow}>
            <Text style={styles.titulo}>Metas</Text>
            <TouchableOpacity
              style={styles.botonAgregar}
              onPress={() => setModalAgregar(true)}
            >
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.botonAgregarTexto}>Nueva</Text>
            </TouchableOpacity>
          </View>

          {/* Barra de progreso general */}
          <View style={styles.progresoCard}>
            <View style={styles.progresoHeader}>
              <Text style={styles.progresoTitulo}>Progreso general</Text>
              <Text style={styles.progresoPct}>{progreso}%</Text>
            </View>

            <View style={styles.progresoBarraFondo}>
              <View
                style={[styles.progresoBarraRelleno, { width: `${progreso}%` }]}
              />
            </View>

            <Text style={styles.progresoSub}>
              {completadas} de {metas.length} metas completadas
            </Text>
          </View>

          {/* Lista de metas */}
          <Text style={styles.seccionTitulo}>Tus metas</Text>
          <View style={styles.lista}>
            {metas.length === 0 ? (
              <Text style={styles.vacio}>
                Aún no tienes metas. ¡Agrega una!
              </Text>
            ) : (
              metas.map((meta) => (
                <MetaItem
                  key={meta.id}
                  meta={meta}
                  onEditar={abrirEditar}
                  onEliminar={eliminarMeta}
                  onToggle={toggleCompletar}
                />
              ))
            )}
          </View>
        </ScrollView>

        {/* Bottom Nav */}
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate("Inicio")}
          >
            <Ionicons name="home-outline" size={24} color={PURPLE} />
            <Text style={styles.navLabel}>HOME</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate("Analisis")}
          >
            <Ionicons name="bar-chart-outline" size={24} color={PURPLE} />
            <Text style={styles.navLabel}>ANÁLISIS</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate("Emociones")}
          >
            <Ionicons name="happy-outline" size={24} color={PURPLE} />
            <Text style={styles.navLabel}>EMOCIONES</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="flag" size={24} color={PURPLE} />
            <Text style={styles.navLabelActivo}>METAS</Text>
          </TouchableOpacity>
        </View>

        {/* Modal Agregar */}
        <Modal visible={modalAgregar} transparent animationType="slide">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalOverlay}
          >
            <View style={styles.modalCard}>
              <Text style={styles.modalTitulo}>Nueva meta</Text>
              <Text style={styles.modalLabel}>¿Cuál es tu meta?</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Ej: Meditar 10 min al día"
                placeholderTextColor="#bbb"
                value={nuevoNombre}
                onChangeText={setNuevoNombre}
              />
              <View style={styles.modalBotones}>
                <TouchableOpacity
                  style={styles.botonCancelar}
                  onPress={() => {
                    setModalAgregar(false);
                    setNuevoNombre("");
                  }}
                >
                  <Text style={styles.botonCancelarTexto}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.botonGuardar,
                    !nuevoNombre.trim() && { opacity: 0.5 },
                  ]}
                  onPress={handleAgregar}
                  disabled={!nuevoNombre.trim()}
                >
                  <Text style={styles.botonGuardarTexto}>Agregar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {/* Modal Editar */}
        <Modal visible={modalEditar} transparent animationType="slide">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalOverlay}
          >
            <View style={styles.modalCard}>
              <Text style={styles.modalTitulo}>Editar meta</Text>
              <Text style={styles.modalLabel}>Nuevo nombre</Text>
              <TextInput
                style={styles.modalInput}
                value={editNombre}
                onChangeText={setEditNombre}
              />
              <View style={styles.modalBotones}>
                <TouchableOpacity
                  style={styles.botonCancelar}
                  onPress={() => setModalEditar(false)}
                >
                  <Text style={styles.botonCancelarTexto}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.botonGuardar}
                  onPress={handleEditar}
                >
                  <Text style={styles.botonGuardarTexto}>Guardar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 28 },

  // Título
  tituloRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  titulo: { fontSize: 26, fontWeight: "800", color: "#333" },
  botonAgregar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: PURPLE,
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  botonAgregarTexto: { color: "#fff", fontWeight: "600", fontSize: 13 },

  // Progreso general
  progresoCard: {
    backgroundColor: "rgba(255,255,255,0.75)",
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    borderWidth: 0.5,
    borderColor: "rgba(180,130,220,0.25)",
    gap: 10,
  },
  progresoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progresoTitulo: { fontSize: 15, fontWeight: "700", color: "#333" },
  progresoPct: { fontSize: 22, fontWeight: "800", color: PURPLE_DARK },
  progresoBarraFondo: {
    height: 14,
    backgroundColor: "#EEE8F5",
    borderRadius: 50,
    overflow: "hidden",
  },
  progresoBarraRelleno: {
    height: "100%",
    backgroundColor: PURPLE,
    borderRadius: 50,
    minWidth: 4,
  },
  progresoSub: { fontSize: 12, color: "#888", textAlign: "right" },

  // Lista
  seccionTitulo: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  lista: { gap: 10 },
  vacio: { textAlign: "center", color: "#aaa", marginTop: 20, fontSize: 14 },

  // Bottom Nav
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderTopWidth: 0.5,
    borderTopColor: "rgba(180,130,220,0.3)",
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  navItem: { alignItems: "center", gap: 3 },
  navLabel: { fontSize: 10, color: PURPLE, fontWeight: "400" },
  navLabelActivo: { fontSize: 10, color: PURPLE, fontWeight: "700" },

  // Modales
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    gap: 12,
  },
  modalTitulo: { fontSize: 18, fontWeight: "700", color: PURPLE_DARK },
  modalLabel: { fontSize: 13, color: "#555", fontWeight: "500" },
  modalInput: {
    borderWidth: 1,
    borderColor: "rgba(180,130,220,0.4)",
    borderRadius: 14,
    padding: 12,
    fontSize: 14,
    color: "#333",
  },
  modalBotones: { flexDirection: "row", gap: 10 },
  botonCancelar: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "rgba(180,130,220,0.4)",
    alignItems: "center",
  },
  botonCancelarTexto: { color: PURPLE, fontWeight: "600", fontSize: 14 },
  botonGuardar: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 50,
    backgroundColor: PURPLE,
    alignItems: "center",
  },
  botonGuardarTexto: { color: "#fff", fontWeight: "700", fontSize: 14 },
});
