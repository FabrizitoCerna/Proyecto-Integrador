import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' }, // ← oculta la barra inferior
      }}>
      <Tabs.Screen name="index" options={{ title: 'Login' }} />
      <Tabs.Screen name="register" options={{ title: 'Registro' }} />
      <Tabs.Screen name="home-cliente" options={{ title: 'Home' }} />
      <Tabs.Screen name="home-admin" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="gestion-especialistas" options={{ title: 'Gestión' }} />
    </Tabs>
  );
}