import React, { useContext } from 'react';
import {
  View, Text, StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';

const PURPLE      = '#9268b8';
const PURPLE_DARK = '#6B4F9E';
const SALMON      = '#E8857A';

export default function PerfilScreen({ navigation }) {
  const { usuario, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    // React Navigation cambia automáticamente al stack no autenticado
  };

  return (
    <LinearGradient
      colors={['#f5e0ff', '#ffffff', '#e4d2ec', '#ffffff']}
      start={{ x: 0.3, y: 0 }}
      end={{ x: 0.7, y: 1 }}
      style={styles.background}
    >
      <SafeAreaView style={styles.safeArea}>

        {/* Header con back */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={PURPLE} />
          </TouchableOpacity>
          <Text style={styles.headerTitulo}>Perfil</Text>
          <View style={{ width: 32 }} />
        </View>

        {/* Avatar grande */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarGrande}>
            <Text style={styles.avatarLetra}>
              {usuario?.nombre?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={styles.nombre}>{usuario?.nombre || 'Usuario'}</Text>
          <Text style={styles.email}>{usuario?.email || ''}</Text>
        </View>

        {/* Info cards */}
        <View style={styles.infoContainer}>

          <View style={styles.infoCard}>
            <Ionicons name="person-outline" size={20} color={PURPLE} />
            <View style={styles.infoTextos}>
              <Text style={styles.infoLabel}>Nombre</Text>
              <Text style={styles.infoValor}>{usuario?.nombre || '—'}</Text>
            </View>
          </View>

          <View style={styles.separador} />

          <View style={styles.infoCard}>
            <Ionicons name="mail-outline" size={20} color={PURPLE} />
            <View style={styles.infoTextos}>
              <Text style={styles.infoLabel}>Correo</Text>
              <Text style={styles.infoValor}>{usuario?.email || '—'}</Text>
            </View>
          </View>

          <View style={styles.separador} />

          <View style={styles.infoCard}>
            <Ionicons name="calendar-outline" size={20} color={PURPLE} />
            <View style={styles.infoTextos}>
              <Text style={styles.infoLabel}>Edad</Text>
              <Text style={styles.infoValor}>{usuario?.edad || '—'}</Text>
            </View>
          </View>

        </View>

        {/* Botón cerrar sesión */}
        <TouchableOpacity
          style={styles.botonLogout}
          onPress={handleLogout}
          activeOpacity={0.85}
        >
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.botonLogoutTexto}>Cerrar sesión</Text>
        </TouchableOpacity>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea:   { flex: 1 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backBtn:       { width: 32, alignItems: 'flex-start' },
  headerTitulo:  { fontSize: 18, fontWeight: '700', color: PURPLE_DARK },

  // Avatar
  avatarContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  avatarGrande: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: PURPLE + '20',
    borderWidth: 3, borderColor: PURPLE,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  avatarLetra: {
    fontSize: 36,
    fontWeight: '800',
    color: PURPLE,
  },
  nombre: {
    fontSize: 22,
    fontWeight: '800',
    color: PURPLE_DARK,
  },
  email: {
    fontSize: 14,
    color: '#888',
  },

  // Info
  infoContainer: {
    marginHorizontal: 24,
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(180,130,220,0.25)',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
  },
  infoTextos: { flex: 1 },
  infoLabel:  { fontSize: 11, color: '#aaa', fontWeight: '500' },
  infoValor:  { fontSize: 15, color: '#333', fontWeight: '600', marginTop: 2 },
  separador: {
    height: 0.5,
    backgroundColor: 'rgba(180,130,220,0.25)',
  },

  // Logout
  botonLogout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 24,
    marginTop: 32,
    backgroundColor: SALMON,
    borderRadius: 50,
    paddingVertical: 16,
    shadowColor: SALMON,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  botonLogoutTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});