import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Login' }} />
      <Tabs.Screen name="register" options={{ title: 'Registro' }} />
      <Tabs.Screen name="home-cliente" options={{ title: 'Home' }} />
      <Tabs.Screen name="crear-solicitud" options={{ title: 'Crear Solicitud' }} />
      <Tabs.Screen name="home-especialista" options={{ title: 'Home Especialista' }} />
      <Tabs.Screen name="hacer-oferta" options={{ title: 'Hacer Oferta' }} />  {/* ← nuevo */}
      <Tabs.Screen name="ver-ofertas" options={{ title: 'Ver Ofertas' }} />  {/* ← nuevo */}
      <Tabs.Screen name="calificar" options={{ title: 'Calificar' }} />  {/* ← nuevo */}
    </Tabs>
  );
}