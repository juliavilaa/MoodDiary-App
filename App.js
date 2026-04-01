import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./screens/HomeScreen";
import AnalisisScreen from "./screens/AnalisisScreen";

import LoginScreen from "./screens/LoginScreen";
import SigninScreen from "./screens/SigninScreen";
import EmocionesScreen from "./screens/EmocionesScreen";
import AnalisisEmociones from "./screens/AnalisisEmociones";
import MetasScreen from "./screens/MetasScreen";
import PerfilScreen from "./screens/PerfilScreen";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider, AuthContext } from "./context/AuthContext";
import { EmocionesProvider } from "./context/EmocionesContext";
import { MetasProvider } from "./context/MetasContext";

const Stack = createNativeStackNavigator();

function Rutas() {
  const { usuario } = useContext(AuthContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {usuario ? (
        <>
          <Stack.Screen name="Inicio" component={HomeScreen} />
          <Stack.Screen name="Analisis" component={AnalisisScreen} />
          <Stack.Screen
            name="AnalisisEmociones"
            component={AnalisisEmociones}
          />
          <Stack.Screen name="Emociones" component={EmocionesScreen} />
          <Stack.Screen name="Metas" component={MetasScreen} />
          <Stack.Screen name="Perfil" component={PerfilScreen} />
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
    <SafeAreaProvider>
      <AuthProvider>
        <EmocionesProvider>
          <MetasProvider>
            <NavigationContainer>
              <Rutas />
            </NavigationContainer>
          </MetasProvider>
        </EmocionesProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
