import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { loginUser } from '../service/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    const res = await loginUser(email, password);

    if (res.error) {
      Alert.alert("Error", typeof res.message === 'string' ? res.message : "Error al iniciar sesión");
    } else {
      await AsyncStorage.setItem('usuario', JSON.stringify(res.data));

      if (res.data.tipo === 'cliente') {
        router.replace('/(tabs)/home-cliente' as any);
      } else if (res.data.tipo === 'especialista') {
        router.replace('/(tabs)/home-especialista' as any);
      } else {
        router.replace('/(tabs)/home-admin' as any);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido 👋</Text>
      <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Contraseña"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        style={styles.input}
      />

      <TouchableOpacity style={styles.btnLogin} onPress={handleLogin}>
        <Text style={styles.btnTxt}>Iniciar sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/register' as any)}>
        <Text style={styles.linkRegistro}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a1a1a'
  },
  subtitle: {
    fontSize: 15,
    color: '#888',
    marginBottom: 32
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 15,
    backgroundColor: '#fafafa'
  },
  btnLogin: {
    width: '100%',
    backgroundColor: '#4A90E2',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8
  },
  btnTxt: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  linkRegistro: {
    marginTop: 16,
    color: '#4A90E2',
    fontSize: 14
  }
});