import { useState } from 'react';
import 'react-native-reanimated';

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

  function handleLogout() {
    setUsuario(null);
  }

  if (!usuario) {
    return <Login onLogin={(u) => setUsuario(u)} />;
  }

  if (usuario.tipo === 'admin') {
    return <AdminScreen onLogout={handleLogout} usuario={usuario} />;
  }

  return <UsuarioScreen onLogout={handleLogout} usuario={usuario} />;
}