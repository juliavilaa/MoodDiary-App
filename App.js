import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import AnalisisScreen from './screens/AnalisisScreen';
import DetalleScreen from './screens/DetalleScreen';
import CarritoScreen from './screens/CarritoScreen';
import LoginScreen from './screens/LoginScreen';
import SigninScreen from './screens/SigninScreen';

import { CarritoProvider } from './context/CarritoContext';
import { AuthProvider, AuthContext } from './context/AuthContext';
import AnalisisEmociones from './screens/AnalisisEmociones';

const Stack = createNativeStackNavigator();

function Rutas() {
  const { usuario } = useContext(AuthContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {usuario ? (
        <>
          <Stack.Screen name="Inicio" component={HomeScreen} />
          <Stack.Screen name="Analisis" component={AnalisisScreen} />
          <Stack.Screen name="AnalisisEmociones" component={AnalisisEmociones} />
          <Stack.Screen name="Detalle" component={DetalleScreen} />
          <Stack.Screen name="Carrito" component={CarritoScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={SigninScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CarritoProvider>
        <NavigationContainer>
          <Rutas />
        </NavigationContainer>
      </CarritoProvider>
    </AuthProvider>
  );
}