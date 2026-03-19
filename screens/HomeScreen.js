import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const FRASES = [
  '"Solo un pequeño pensamiento positivo por la mañana puede cambiar todo tu día"',
  '"Cada día es una nueva oportunidad para ser mejor"',
  '"Tu bienestar mental importa más que cualquier cosa"',
  '"Respira. Estás haciendo mejor de lo que crees"',
];

export default function HomeScreen({ navigation }) {
  const { usuario } = useContext(AuthContext);

  const fraseAleatoria = FRASES[Math.floor(Math.random() * FRASES.length)];

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
            <Text style={styles.nombreUsuario}>
              {usuario?.nombre || 'Usuario'}
            </Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={26} color={PURPLE} />
          </TouchableOpacity>
        </View>

        {/* Frase del día */}
        <View style={styles.fraseContainer}>
          <Text style={styles.frase}>{fraseAleatoria}</Text>
          <Ionicons name="heart-outline" size={32} color={PURPLE} style={styles.heartIcon} />
        </View>

        {/* Bottom Nav */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="home" size={24} color={PURPLE} />
            <Text style={styles.navLabelActivo}>HOME</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Analisis')}>
            <Ionicons name="bar-chart-outline" size={24} color={PURPLE} />
            <Text style={styles.navLabel}>ANÁLISIS</Text>
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

const PURPLE = '#9268b8';

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
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

  // Frase
  fraseContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 36,
    gap: 24,
  },
  frase: {
    fontSize: 24,
    fontWeight: '700',
    color: PURPLE,
    textAlign: 'center',
    lineHeight: 36,
  },
  heartIcon: {
    marginTop: 8,
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