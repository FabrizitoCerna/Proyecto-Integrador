import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useState } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import Login from './login';
import AdminScreen from './(tabs)/index';
import UsuarioScreen from './(tabs)/usuario';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [usuario, setUsuario] = useState<any>(null);

  if (!usuario) {
    return <Login onLogin={(u) => setUsuario(u)} />;
  }

  if (usuario.tipo === 'admin') {
    return <AdminScreen />;
  }

  return <UsuarioScreen />;
}