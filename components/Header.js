import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';

const PURPLE = '#9268b8';

export default function Header({ navigation }) {
  const { usuario } = useContext(AuthContext);

  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.headerLeft}
        onPress={() => navigation.navigate('Perfil')}
        activeOpacity={0.7}
      >
        <View style={styles.avatarBg}>
          <Text style={styles.avatarLetra}>
            {usuario?.nombre?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        <Text style={styles.nombreUsuario}>{usuario?.nombre || 'Usuario'}</Text>
        <Ionicons name="chevron-forward" size={14} color={PURPLE} />
      </TouchableOpacity>

      <TouchableOpacity>
        <Ionicons name="notifications-outline" size={26} color={PURPLE} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
  avatarBg: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: PURPLE + '25',
    borderWidth: 1.5, borderColor: PURPLE,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarLetra: {
    fontSize: 14,
    fontWeight: '700',
    color: PURPLE,
  },
  nombreUsuario: {
    fontSize: 18,
    fontWeight: '700',
    color: PURPLE,
  },
});