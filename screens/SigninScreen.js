import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../context/AuthContext";
import { Ionicons } from '@expo/vector-icons';

export default function SigninScreen({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [edad, setEdad] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useContext(AuthContext);
  const [registroExitoso, setRegistroExitoso] = useState(false);

  const manejarRegistro = async () => {
    if (!nombre.trim() || !password.trim() || !email.trim() || !edad.trim()) {
      Alert.alert("Error", "Por favor completa todos los campos.");
      return;
    }
    if (loading) return;

    setLoading(true);
    try {
      const ok = await register({ nombre, email, password, edad });
      if (ok) {
        setRegistroExitoso(true);
      } else {
        Alert.alert("Error", "Este correo ya está registrado.");
      }
    } catch (e) {
      Alert.alert("Error", "Algo salió mal. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#f5e0ff", "#ffffff", "#e4d2ec", "#ffffff"]}
      start={{ x: 0.3, y: 0 }}
      end={{ x: 0.7, y: 1 }}
      style={styles.background}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.titulo}>Crea tu cuenta</Text>
              <View style={styles.loginContainer}>
                <Text style={styles.loginTexto}>¿Ya estás registrado? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <Text style={styles.loginLink}>Ingresa aquí</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Inputs */}
            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Ingresa tu nombre</Text>
                <TextInput
                  placeholder=""
                  style={styles.input}
                  value={nombre}
                  onChangeText={setNombre}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Ingresa tu contraseña</Text>
                <TextInput
                  placeholder=""
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Ingresa tu correo</Text>
                <TextInput
                  placeholder=""
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Ingresa tu edad</Text>
                <TextInput
                  placeholder=""
                  style={styles.input}
                  value={edad}
                  onChangeText={setEdad}
                  keyboardType="numeric"
                  maxLength={3}
                />
              </View>
            </View>

            {/* Button */}
            <TouchableOpacity
              style={[styles.boton, loading && styles.botonDesactivado]}
              onPress={manejarRegistro}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.botonTexto}>Regístrate</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Modal visible={registroExitoso} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Ionicons
              name="checkmark-circle-outline"
              size={44}
              color={PURPLE}
            />

            <Text style={styles.modalTitulo}>¡Registro exitoso!</Text>
            <Text style={styles.modalSubtitulo}>
              Tu cuenta fue creada{"\n"}correctamente
            </Text>

            <TouchableOpacity
              style={styles.modalBoton}
              onPress={() => {
                setRegistroExitoso(false);
                navigation.navigate("Login"); // ya está logueado por el register
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.modalBotonTexto}>CONTINUAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const PURPLE = "#9268b8";

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 48,
    gap: 28,
  },

  // Header
  header: {
    alignItems: "center",
    marginBottom: 4,
  },
  titulo: {
    fontSize: 32,
    fontWeight: "800",
    color: PURPLE,
    letterSpacing: 0.3,
    textAlign: "center",
  },
  loginContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  loginTexto: {
    color: "#555",
    fontSize: 13,
  },
  loginLink: {
    color: PURPLE,
    fontWeight: "700",
    fontSize: 13,
    textDecorationLine: "underline",
  },

  // Form
  formContainer: {
    width: "100%",
    gap: 18,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    color: "#555",
    fontWeight: "500",
    paddingLeft: 4,
  },
  input: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.60)",
    borderRadius: 50,
    paddingVertical: 14,
    paddingHorizontal: 22,
    fontSize: 15,
    color: "#333",
    borderWidth: 1,
    borderColor: "rgba(180,130,220,0.35)",
  },

  // Button
  boton: {
    width: "60%",
    alignSelf: "center",
    backgroundColor: PURPLE,
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: "center",
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
    marginTop: 8,
  },
  botonDesactivado: {
    opacity: 0.7,
  },
  botonTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(160,140,180,0.55)",
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingVertical: 40,
    paddingHorizontal: 32,
    alignItems: "center",
    width: "80%",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: "800",
    color: "#6B4F9E",
    textAlign: "center",
  },
  modalSubtitulo: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 8,
  },
  modalBoton: {
    backgroundColor: PURPLE,
    borderRadius: 50,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginTop: 8,
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  modalBotonTexto: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1,
  },
});
