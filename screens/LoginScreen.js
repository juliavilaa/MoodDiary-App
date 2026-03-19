import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';

import { LinearGradient } from 'expo-linear-gradient';



export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext  );

  const manejarLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }
    if (loading) return;

    setLoading(true);
    try {
      const ok = await login(email, password);
      if (!ok) Alert.alert('Error', 'Credenciales incorrectas');
    } catch (e) {
      Alert.alert('Error', 'Algo salió mal. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#f5e0ff', '#ffffff', '#e4d2ec', '#ffffff']}
      start={{ x: 0.3, y: 0 }}
      end={{ x: 0.7, y: 1 }}
      style={styles.background}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.container}>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.titulo}>MoodDiary</Text>
            <Text style={styles.subtitulo}>Inicio de Sesión</Text>
          </View>

          {/* Inputs */}
          <View style={styles.formContainer}>
            <TextInput
              placeholder="Correo"
              placeholderTextColor="#b388d6"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TextInput
              placeholder="Contraseña"
              placeholderTextColor="#b388d6"
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            {/* Forgot password */}
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.olvidaste}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
          </View>

          {/* Button */}
          <TouchableOpacity
            style={[styles.boton, loading && styles.botonDesactivado]}
            onPress={manejarLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.botonTexto}>Ingresar</Text>
            }
          </TouchableOpacity>

          {/* Register */}
          <View style={styles.registroContainer}>
            <Text style={styles.registroTexto}>¿Aún no tienes cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registroLink}>Regístrate</Text>
            </TouchableOpacity>
          </View>

        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const PURPLE = '#9268b8';
const PURPLE_LIGHT = '#ffffff';

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 24,
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: 8,
  },
  titulo: {
    fontSize: 42,
    fontWeight: '800',
    color: PURPLE,
    letterSpacing: 0.5,
  },
  subtitulo: {
    fontSize: 16,
    color: '#555',
    marginTop: 2,
  },

  // Form
  formContainer: {
    width: '100%',
    gap: 14,
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderRadius: 50,
    paddingVertical: 14,
    paddingHorizontal: 22,
    fontSize: 15,
    color: '#333',
    borderWidth: 1,
    borderColor: 'rgba(180,130,220,0.4)',
  },
  olvidaste: {
    textAlign: 'center',
    color: PURPLE,
    fontWeight: '600',
    fontSize: 13,
    textDecorationLine: 'underline',
    marginTop: 4,
  },

  // Button
  boton: {
    width: '65%',
    backgroundColor: PURPLE,
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: 'center',
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
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Register
  registroContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  registroTexto: {
    color: '#555',
    fontSize: 13,
  },
  registroLink: {
    color: PURPLE,
    fontWeight: '700',
    fontSize: 13,
    textDecorationLine: 'underline',
  },
});