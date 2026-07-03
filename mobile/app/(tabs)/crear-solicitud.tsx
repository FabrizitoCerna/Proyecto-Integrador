
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
      Alert.alert(
        "Error",
        typeof res.message === 'string'
          ? res.message
          : "Error al crear solicitud"
      );
    } else {
      Alert.alert(
        "¡Solicitud enviada!",
        "Los especialistas verán tu solicitud pronto",
        [
          {
            text: "OK",
            onPress: () => router.replace('/(tabs)/home-cliente')
          }
        ]
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity  onPress={() => router.push('/(tabs)/home-cliente')}>
          <Text style={styles.btnVolver}>← Volver</Text>
        </TouchableOpacity>

        <Text style={styles.titulo}>Nueva Solicitud</Text>
      </View>

      <View style={styles.categoriaTag}>
        <Text style={styles.categoriaTxt}>
          📋 {categoriaNombre}
        </Text>
      </View>

      <Text style={styles.label}>¿Qué necesitas?</Text>

      <TextInput
        placeholder="Describe el problema o servicio que necesitas..."
        placeholderTextColor="#727272"
        value={descripcion}
        onChangeText={setDescripcion}
        style={[styles.input, styles.inputMultiline]}
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>Dirección</Text>

      <TextInput
        placeholder="Ej: Av. Los Olivos 123, Miraflores"
        placeholderTextColor="#727272"
        value={direccion}
        onChangeText={setDireccion}
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.btnEnviar}
        onPress={handleEnviar}
      >
        <Text style={styles.btnTxt}>
          Enviar solicitud
        </Text>
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
    marginBottom: 28,
    gap: 16,
  },

  btnVolver: {
    fontSize: 15,
    color: '#1DB954',
    fontWeight: '700',
  },

  titulo: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },

  categoriaTag: {
    backgroundColor: '#181818',
    borderRadius: 16,
    padding: 18,
    marginBottom: 28,
    borderLeftWidth: 5,
    borderLeftColor: '#1DB954',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 3,
  },

  categoriaTxt: {
    color: '#1DB954',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 0.5,
  },

  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1DB954',
    marginBottom: 10,
    marginLeft: 2,
  },

  input: {
    backgroundColor: '#181818',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    padding: 15,
    fontSize: 15,
    color: '#FFFFFF',
    marginBottom: 20,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 2,
  },

  inputMultiline: {
    height: 120,
    textAlignVertical: 'top',
  },

  btnEnviar: {
    backgroundColor: '#1DB954',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,

    shadowColor: '#1DB954',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },

  btnTxt: {
    color: '#000',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});

