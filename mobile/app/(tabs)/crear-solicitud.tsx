import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { crearSolicitud } from '../service/api';

export default function CrearSolicitud() {
  const router = useRouter();
  const { categoriaId, categoriaNombre } = useLocalSearchParams();

  const [descripcion, setDescripcion] = useState('');
  const [direccion, setDireccion] = useState('');
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    const cargarUsuario = async () => {
      const data = await AsyncStorage.getItem('usuario');
      if (data) setUsuario(JSON.parse(data));
    };
    cargarUsuario();
  }, []);

  const handleEnviar = async () => {
    if (!descripcion) {
      Alert.alert("Error", "La descripción es obligatoria");
      return;
    }
    if (!direccion) {
      Alert.alert("Error", "La dirección es obligatoria");
      return;
    }

    const res = await crearSolicitud(
      usuario.id,
      Number(categoriaId),
      descripcion,
      direccion
    );

    if (res.error) {
      Alert.alert("Error", typeof res.message === 'string' ? res.message : "Error al crear solicitud");
    } else {
      Alert.alert("¡Solicitud enviada!", "Los especialistas verán tu solicitud pronto", [
        { text: "OK", onPress: () => router.replace('/(tabs)/home-cliente') }
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
        <Text style={styles.titulo}>Nueva Solicitud</Text>
      </View>

      {/* Categoría seleccionada */}
      <View style={styles.categoriaTag}>
        <Text style={styles.categoriaTxt}>📋 {categoriaNombre}</Text>
      </View>

      {/* Descripción */}
      <Text style={styles.label}>¿Qué necesitas?</Text>
      <TextInput
        placeholder="Describe el problema o servicio que necesitas..."
        value={descripcion}
        onChangeText={setDescripcion}
        style={[styles.input, styles.inputMultiline]}
        multiline
        numberOfLines={4}
        placeholderTextColor="#A0A0A0"
      />

      {/* Dirección */}
      <Text style={styles.label}>Dirección</Text>
      <TextInput
        placeholder="Ej: Av. Los Olivos 123, Miraflores"
        value={direccion}
        onChangeText={setDireccion}
        style={styles.input}
        placeholderTextColor="#A0A0A0"
      />

      {/* Botón */}
      <TouchableOpacity style={styles.btnEnviar} onPress={handleEnviar}>
        <Text style={styles.btnTxt}>Enviar solicitud</Text>
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
    marginBottom: 24,
    gap: 16,
  },
  btnVolver: {
    fontSize: 16,
    color: '#1DB954',
    fontWeight: '600',
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  categoriaTag: {
    backgroundColor: '#rgba(29,185,84,0.12)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  categoriaTxt: {
    color: '#1DB954',
    fontWeight: '600',
    fontSize: 15,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#f5f4f4',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#181818',
    color: '#fff',
    marginBottom: 20,
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
    marginTop: 8,
  },
  btnTxt: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});