import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { loginUser } from '../service/api';

export default function Index() {

  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const res = await loginUser(email, password);

    console.log(res);

    if (res.error) {
      Alert.alert("Error", res.message);
    } else {
      Alert.alert("Bienvenido", res.data.nombre);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        style={styles.input}
      />

      <Button title="Iniciar sesión" onPress={handleLogin} />

      {/* 👇 BOTÓN NUEVO */}
      <Button 
        title="Ir a registrarse" 
        onPress={() => router.push('/register')} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 22,
    marginBottom: 20
  },
  input: {
    width: 220,
    borderWidth: 1,
    marginBottom: 10,
    padding: 8
  }
});   