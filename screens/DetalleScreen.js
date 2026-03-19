import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet, Alert, Image } from 'react-native';
import { CarritoContext } from '../context/CarritoContext';

export default function DetalleScreen({ route, navigation }) {

  const { producto } = route.params;
  const { agregarProducto } = useContext(CarritoContext);

  const agregar = () => {
    agregarProducto(producto);
    Alert.alert("Producto agregado", "Se añadió al carrito");
  };

  return (
    <View style={styles.container}>

      <Image 
        source={{ uri: producto.imagen }} 
        style={styles.imagen} 
      />

      <Text style={styles.nombre}>{producto.nombre}</Text>

      <Text style={styles.precio}>${producto.precio}</Text>

      <Text style={styles.descripcion}>
        {producto.descripcion}
      </Text>

      <View style={styles.boton}>
        <Button
          title="Agregar al carrito"
          onPress={agregar}
        />
      </View>

      <View style={styles.boton}>
        <Button
          title="Ir al carrito"
          onPress={() => navigation.navigate("Carrito")}
        />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  nombre: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
  },
  precio: {
    fontSize: 20,
    color: 'green',
    marginBottom: 10
  },
  descripcion: {
    fontSize: 16,
    marginBottom: 20
  },
  boton: {
    marginVertical: 5
  },
  imagen: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15
  }
});