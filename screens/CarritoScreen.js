import React, { useContext } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { CarritoContext } from '../context/CarritoContext';

export default function CarritoScreen() {

  const { carrito, eliminarProducto, total } = useContext(CarritoContext);

  return (
    <View style={styles.container}>
      
      <Text style={styles.titulo}>Carrito de Compras</Text>

      {carrito.length === 0 ? (
        <Text style={styles.vacio}>El carrito está vacío</Text>
      ) : (
        <FlatList
          data={carrito}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              
              <View>
                <Text style={styles.nombre}>{item.nombre}</Text>
                <Text style={styles.precio}>${item.precio}</Text>
              </View>

              <Button
                title="Eliminar"
                onPress={() => eliminarProducto(item.id)}
              />
            </View>
          )}
        />
      )}

      <Text style={styles.total}>Total: ${total}</Text>

      <Button
        title="Comprar"
        onPress={() => alert("Compra realizada")}
        disabled={carrito.length === 0}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10
  },
  vacio: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1
  },
  nombre: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  precio: {
    fontSize: 14
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10
  }
});