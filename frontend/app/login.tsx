import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator
} from 'react-native';

const API = 'http://192.168.18.163:8080/usuarios/login';

interface Props {
  onLogin: (usuario: any) => void;
}

export default function Login({ onLogin }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    if (!email || !password) {
      setError('Completa todos los campos.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const usuario = await res.json();
        onLogin(usuario);
      } else if (res.status === 404) {
        setError('Usuario no existe.');
      } else if (res.status === 401) {
        setError('Contraseña incorrecta.');
      } else {
        setError('Error al iniciar sesión.');
      }
    } catch (e) {
      setError('No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>🔧 TécnicoApp</Text>
        <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

        {error !== '' && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="ejemplo@correo.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.btnText}>Iniciar sesión</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: 'white', borderRadius: 12, padding: 24, elevation: 3, maxWidth: 400, width: '100%', alignSelf: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50', textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#888', textAlign: 'center', marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 6, padding: 10, marginBottom: 14, fontSize: 14 },
  btn: { backgroundColor: '#2c3e50', padding: 14, borderRadius: 6, alignItems: 'center', marginTop: 4 },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 15 },
  errorBox: { backgroundColor: '#f8d7da', padding: 10, borderRadius: 6, marginBottom: 12 },
  errorText: { color: '#721c24', fontSize: 13 },
});