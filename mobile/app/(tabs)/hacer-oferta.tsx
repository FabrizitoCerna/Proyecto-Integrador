import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { crearOferta } from '../service/api';

export default function HacerOferta() {
  const router = useRouter();
  const { solicitudId, descripcion, direccion, categoria } = useLocalSearchParams();

  const [precio, setPrecio] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    const cargarUsuario = async () => {
      const data = await AsyncStorage.getItem('usuario');
      if (data) setUsuario(JSON.parse(data));
    };
    cargarUsuario();
  }, []);

  const handleEnviar = async () => {
    if (!precio) {
      Alert.alert("Error", "El precio es obligatorio");
      return;
    }
    if (parseFloat(precio) <= 0) {
      Alert.alert("Error", "El precio debe ser mayor a 0");
      return;
    }

    const res = await crearOferta(
      Number(solicitudId),
      usuario.id,
      parseFloat(precio),
      mensaje
    );

    if (res.error) {
      Alert.alert("Error", typeof res.message === 'string' ? res.message : "Error al enviar oferta");
    } else {
      Alert.alert("¡Oferta enviada!", "El cliente verá tu oferta pronto", [
        { text: "OK", onPress: () => router.replace('/(tabs)/home-especialista' as any) }
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
        <Text style={styles.titulo}>Hacer Oferta</Text>
      </View>

      {/* Info de la solicitud */}
      <View style={styles.solicitudCard}>
        <Text style={styles.categoriaTag}>📋 {categoria}</Text>
        <Text style={styles.solicitudDescripcion}>{descripcion}</Text>
        {direccion ? <Text style={styles.solicitudDireccion}>📍 {direccion}</Text> : null}
      </View>

      {/* Precio */}
      <Text style={styles.label}>Tu precio (S/.)</Text>
      <TextInput
        placeholder="Ej: 150.00"
        value={precio}
        onChangeText={setPrecio}
        style={styles.input}
        keyboardType="numeric"
      />

      {/* Mensaje */}
      <Text style={styles.label}>Mensaje al cliente (opcional)</Text>
      <TextInput
        placeholder="Describe tu experiencia o propuesta..."
        value={mensaje}
        onChangeText={setMensaje}
        style={[styles.input, styles.inputMultiline]}
        multiline
        numberOfLines={4}
      />

      {/* Botón */}
      <TouchableOpacity style={styles.btnEnviar} onPress={handleEnviar}>
        <Text style={styles.btnTxt}>Enviar oferta</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 24,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 16,
  },
  btnVolver: {
    fontSize: 16,
    color: '#2ECC71',
    fontWeight: '600',
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  solicitudCard: {
    backgroundColor: '#f0fff4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#2ECC71',
  },
  categoriaTag: {
    color: '#2ECC71',
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 8,
  },
  solicitudDescripcion: {
    fontSize: 15,
    color: '#333',
    marginBottom: 6,
    lineHeight: 22,
  },
  solicitudDireccion: {
    fontSize: 13,
    color: '#666',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#fafafa',
    marginBottom: 20,
  },
  inputMultiline: {
    height: 120,
    textAlignVertical: 'top',
  },
  btnEnviar: {
    backgroundColor: '#2ECC71',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  btnTxt: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});