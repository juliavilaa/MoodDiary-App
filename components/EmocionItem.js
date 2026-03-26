import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function EmocionItem({ registro, onEditar, onEliminar }) {
  return (
    <View style={styles.fila}>
      <View style={[styles.card, { backgroundColor: registro.color }]}>
        <Ionicons
          name={registro.icono}
          size={18}
          color={registro.textColor}
          style={{ marginRight: 10 }}
        />
        <Text
          style={[styles.texto, { color: registro.textColor }]}
          numberOfLines={2}
        >
          {registro.descripcion}
        </Text>
      </View>

      <View style={styles.acciones}>
        <TouchableOpacity onPress={() => onEditar(registro)}>
          <Ionicons name="pencil-outline" size={16} color="#aaa" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onEliminar(registro.id)}>
          <Ionicons name="close" size={16} color="#aaa" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 50,
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  texto: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  acciones: {
    gap: 6,
    alignItems: 'center',
  },
});