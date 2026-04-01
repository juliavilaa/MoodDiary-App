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
import { EmocionesContext } from "../context/EmocionesContext";
import { CATALOGO_EMOCIONES } from "../data/emociones";
import EmocionItem from "../components/EmocionItem";
import Header from "../components/Header";

const PURPLE = "#9268b8";
const PURPLE_DARK = "#6B4F9E";

export default function EmocionesScreen({ navigation }) {
  const { usuario } = useContext(AuthContext);
  const { registros, agregarEmocion, eliminarEmocion, editarEmocion } =
    useContext(EmocionesContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [descripcion, setDescripcion] = useState("");
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
  const [editandoId, setEditandoId] = useState(null);
  const [editTexto, setEditTexto] = useState("");

  const handleAgregar = () => {
    if (!descripcion.trim() || !tipoSeleccionado) return;
    agregarEmocion({ descripcion, tipoEmocion: tipoSeleccionado });
    setDescripcion("");
    setTipoSeleccionado(null);
    setModalVisible(false);
  };

  const abrirEditar = (registro) => {
    setEditandoId(registro.id);
    setEditTexto(registro.descripcion);
    setEditModalVisible(true);
  };

  const handleEditar = () => {
    if (!editTexto.trim()) return;
    editarEmocion(editandoId, editTexto);
    setEditModalVisible(false);
  };

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
          {/* Saludo */}
          <Text style={styles.saludo}>
            Bienvenido/a de nuevo.{"\n"}
            Estoy aquí para escucharte,{"\n"}
            ¿Cómo te sientes hoy?
          </Text>

          {/* Botón agregar */}
          <TouchableOpacity
            style={styles.agregarCard}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add" size={30} color={PURPLE} />
            <Text style={styles.agregarTexto}>Agregar emoción</Text>
          </TouchableOpacity>

          {/* Lista de registros */}
          <View style={styles.lista}>
            {registros.map((r) => (
              <EmocionItem
                key={r.id}
                registro={r}
                onEditar={abrirEditar}
                onEliminar={eliminarEmocion}
              />
            ))}
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
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="heart" size={24} color={PURPLE} />
            <Text style={styles.navLabelActivo}>EMOCIONES</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate("Metas")}
          >
            <Ionicons name="flag-outline" size={24} color={PURPLE} />
            <Text style={styles.navLabel}>METAS</Text>
          </TouchableOpacity>
        </View>

        {/* Modal: Agregar emoción */}
        <Modal visible={modalVisible} transparent animationType="slide">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalOverlay}
          >
            <View style={styles.modalCard}>
              <Text style={styles.modalTitulo}>Nueva emoción</Text>

              {/* Selector de tipo */}
              <Text style={styles.modalLabel}>¿Cómo te sientes?</Text>
              <View style={styles.tiposRow}>
                {CATALOGO_EMOCIONES.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.tipoPill,
                      {
                        backgroundColor: cat.color + "40",
                        borderColor: cat.color,
                      },
                      tipoSeleccionado === cat.nombre && {
                        backgroundColor: cat.color,
                      },
                    ]}
                    onPress={() => setTipoSeleccionado(cat.nombre)}
                  >
                    <Ionicons
                      name={cat.icono}
                      size={14}
                      color={
                        tipoSeleccionado === cat.nombre
                          ? "#fff"
                          : cat.color === "#B8D4F0"
                            ? "#4a6fa5"
                            : cat.color
                      }
                    />
                    <Text
                      style={[
                        styles.tipoPillTexto,
                        {
                          color:
                            tipoSeleccionado === cat.nombre ? "#fff" : "#555",
                        },
                      ]}
                    >
                      {cat.nombre}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Input descripción */}
              <Text style={styles.modalLabel}>Cuéntame más</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="¿Qué está pasando?"
                placeholderTextColor="#bbb"
                value={descripcion}
                onChangeText={setDescripcion}
                multiline
                numberOfLines={3}
              />

              {/* Botones */}
              <View style={styles.modalBotones}>
                <TouchableOpacity
                  style={styles.modalBotonCancelar}
                  onPress={() => {
                    setModalVisible(false);
                    setDescripcion("");
                    setTipoSeleccionado(null);
                  }}
                >
                  <Text style={styles.modalBotonCancelarTexto}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modalBotonGuardar,
                    (!descripcion.trim() || !tipoSeleccionado) && {
                      opacity: 0.5,
                    },
                  ]}
                  onPress={handleAgregar}
                  disabled={!descripcion.trim() || !tipoSeleccionado}
                >
                  <Text style={styles.modalBotonGuardarTexto}>Guardar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {/* Modal: Editar emoción */}
        <Modal visible={editModalVisible} transparent animationType="slide">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalOverlay}
          >
            <View style={styles.modalCard}>
              <Text style={styles.modalTitulo}>Editar emoción</Text>
              <Text style={styles.modalLabel}>Descripción</Text>
              <TextInput
                style={styles.modalInput}
                value={editTexto}
                onChangeText={setEditTexto}
                multiline
                numberOfLines={3}
              />
              <View style={styles.modalBotones}>
                <TouchableOpacity
                  style={styles.modalBotonCancelar}
                  onPress={() => setEditModalVisible(false)}
                >
                  <Text style={styles.modalBotonCancelarTexto}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalBotonGuardar}
                  onPress={handleEditar}
                >
                  <Text style={styles.modalBotonGuardarTexto}>Guardar</Text>
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

  // Saludo
  saludo: {
    fontSize: 20,
    fontWeight: "700",
    color: PURPLE_DARK,
    marginTop: 8,
    marginBottom: 20,
    lineHeight: 30,
  },

  // Botón agregar
  agregarCard: {
    borderWidth: 1.5,
    borderColor: "rgba(180,130,220,0.4)",
    borderStyle: "dashed",
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.4)",
    marginBottom: 20,
    gap: 6,
  },
  agregarTexto: { fontSize: 14, color: PURPLE, fontWeight: "500" },

  // Lista
  lista: { gap: 10 },

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

  // Modal
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
  tiposRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tipoPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 50,
    borderWidth: 1,
  },
  tipoPillTexto: { fontSize: 12, fontWeight: "500" },
  modalInput: {
    borderWidth: 1,
    borderColor: "rgba(180,130,220,0.4)",
    borderRadius: 14,
    padding: 12,
    fontSize: 14,
    color: "#333",
    textAlignVertical: "top",
    minHeight: 80,
  },
  modalBotones: { flexDirection: "row", gap: 10, marginTop: 4 },
  modalBotonCancelar: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "rgba(180,130,220,0.4)",
    alignItems: "center",
  },
  modalBotonCancelarTexto: { color: PURPLE, fontWeight: "600", fontSize: 14 },
  modalBotonGuardar: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 50,
    backgroundColor: PURPLE,
    alignItems: "center",
  },
  modalBotonGuardarTexto: { color: "#fff", fontWeight: "700", fontSize: 14 },
});
