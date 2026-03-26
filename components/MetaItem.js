import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PURPLE = '#9268b8';

export default function MetaItem({ meta, onEditar, onEliminar, onToggle }) {
  return (
    <View style={styles.fila}>
      {/* Checkbox */}
      <TouchableOpacity onPress={() => onToggle(meta.id)} style={styles.checkbox}>
        {meta.completada
          ? <Ionicons name="checkmark-circle" size={26} color={PURPLE} />
          : <Ionicons name="ellipse-outline"  size={26} color="#ccc" />
        }
      </TouchableOpacity>

      {/* Card */}
      <View style={[
        styles.card,
        { backgroundColor: meta.color, opacity: meta.completada ? 0.6 : 1 }
      ]}>
        <Text style={[styles.texto, meta.completada && styles.textoTachado]}>
          {meta.nombre}
        </Text>
      </View>

      {/* Acciones */}
      <View style={styles.acciones}>
        <TouchableOpacity onPress={() => onEditar(meta)}>
          <Ionicons name="pencil-outline" size={16} color="#aaa" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onEliminar(meta.id)}>
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
  checkbox: {
    padding: 2,
  },
  card: {
    flex: 1,
    borderRadius: 50,
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  texto: {
    fontSize: 13,
    fontWeight: '500',
    color: '#fff',
  },
  textoTachado: {
    textDecorationLine: 'line-through',
    opacity: 0.8,
  },
  acciones: {
    gap: 6,
    alignItems: 'center',
  },
});