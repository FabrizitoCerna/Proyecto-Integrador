import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calificarServicio } from '../service/api';

export default function Calificar() {
  const router = useRouter();
  const { solicitudId, especialistaNombre } = useLocalSearchParams();

  const [estrellas, setEstrellas] = useState(0);
  const [comentario, setComentario] = useState('');
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    const cargarUsuario = async () => {
      const data = await AsyncStorage.getItem('usuario');
      if (data) setUsuario(JSON.parse(data));
    };
    cargarUsuario();
  }, []);

  const handleCalificar = async () => {
    if (estrellas === 0) {
      Alert.alert("Error", "Selecciona al menos 1 estrella");
      return;
    }

    const res = await calificarServicio(
      Number(solicitudId),
      usuario.id,
      estrellas,
      comentario
    );

    if (res.error) {
      Alert.alert("Error", typeof res.message === 'string' ? res.message : "Error al calificar");
    } else {
      Alert.alert("¡Gracias por tu calificación! ⭐", "", [
        { text: "OK", onPress: () => router.replace('/(tabs)/home-cliente' as any) }
      ]);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.btnVolver}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Calificar servicio</Text>
      </View>

      {/* Info especialista */}
      <View style={styles.especialistaCard}>
        <Text style={styles.especialistaIcono}>👷</Text>
        <Text style={styles.especialistaNombre}>{especialistaNombre}</Text>
        <Text style={styles.especialistaSubtitulo}>¿Cómo fue el servicio?</Text>
      </View>

      {/* Estrellas */}
      <Text style={styles.label}>Calificación</Text>
      <View style={styles.estrellasContainer}>
        {[1, 2, 3, 4, 5].map((num) => (
          <TouchableOpacity key={num} onPress={() => setEstrellas(num)}>
            <Text style={[styles.estrella, num <= estrellas && styles.estrellaActiva]}>
              ★
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.estrellasLabel}>
        {estrellas === 0 && 'Toca una estrella para calificar'}
        {estrellas === 1 && 'Muy malo 😞'}
        {estrellas === 2 && 'Malo 😕'}
        {estrellas === 3 && 'Regular 😐'}
        {estrellas === 4 && 'Bueno 😊'}
        {estrellas === 5 && 'Excelente 🤩'}
      </Text>

      {/* Comentario */}
      <Text style={styles.label}>Comentario (opcional)</Text>
      <TextInput
        placeholder="Cuéntanos tu experiencia..."
        value={comentario}
        onChangeText={setComentario}
        style={[styles.input, styles.inputMultiline]}
        multiline
        numberOfLines={4}
        placeholderTextColor="#A0A0A0"
      />

      {/* Botón */}
      <TouchableOpacity
        style={[styles.btnEnviar, estrellas === 0 && styles.btnDesactivado]}
        onPress={handleCalificar}
        disabled={estrellas === 0}
      >
        <Text style={styles.btnTxt}>Enviar calificación</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#0F0F0F',
    padding: 24,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    gap: 16,
  },
  btnVolver: { fontSize: 16, color: '#1DB954', fontWeight: '600' },
  titulo: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  especialistaCard: {
    alignItems: 'center',
    marginBottom: 32,
    padding: 24,
    backgroundColor: '#181818',
    borderRadius: 16,
  },
  especialistaIcono: { fontSize: 48, marginBottom: 12 },
  especialistaNombre: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  especialistaSubtitulo: { fontSize: 14, color: '#A0A0A0' },
  label: { fontSize: 15, fontWeight: '600', color: '#f5f4f4', marginBottom: 12 },
  estrellasContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 12,
  },
  estrella: { fontSize: 48, color: '#333' },
  estrellaActiva: { color: '#FFB81C' },
  estrellasLabel: {
    textAlign: 'center',
    fontSize: 16,
    color: '#A0A0A0',
    marginBottom: 32,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#181818',
    marginBottom: 24,
    color: '#fff',
  },
  inputMultiline: {
    height: 120,
    textAlignVertical: 'top',
  },
  btnEnviar: {
    backgroundColor: '#1DB954',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnDesactivado: { backgroundColor: '#333' },
  btnTxt: { color: '#000', fontSize: 16, fontWeight: 'bold' },
});