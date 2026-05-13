import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCategorias } from '../service/api';

const ICONOS: { [key: string]: string } = {
  'Gasfitería': '🔧',
  'Electricidad': '⚡',
  'Limpieza': '🧹',
  'Carpintería': '🪚',
  'Pintura': '🎨',
  'Jardinería': '🌿',
};

export default function HomeCliente() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<any>(null);
  const [categorias, setCategorias] = useState<any[]>([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    // Cargar usuario de sesión
    const data = await AsyncStorage.getItem('usuario');
    if (!data) {
      router.replace('/');
      return;
    }
    setUsuario(JSON.parse(data));

    // Cargar categorías
    const res = await getCategorias();
    if (!res.error) setCategorias(res.data);
  };

  const handleCerrarSesion = async () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, salir",
          onPress: async () => {
            await AsyncStorage.removeItem('usuario');
            router.replace('/');
          }
        }
      ]
    );
  };

  const handleCategoria = (categoria: any) => {
    // Aquí después navegaremos a crear solicitud
    Alert.alert("Categoría seleccionada", `Seleccionaste: ${categoria.nombre}`);
  };

  return (
    <ScrollView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.saludo}>Hola, {usuario?.nombre} 👋</Text>
          <Text style={styles.subtitulo}>¿Qué servicio necesitas hoy?</Text>
        </View>
        <TouchableOpacity onPress={handleCerrarSesion}>
          <Text style={styles.cerrarSesion}>Salir</Text>
        </TouchableOpacity>
      </View>

      {/* Categorías */}
      <Text style={styles.seccionTitulo}>Nuestros servicios</Text>

      <View style={styles.grid}>
        {categorias.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={styles.card}
            onPress={() => handleCategoria(cat)}
          >
            <Text style={styles.cardIcono}>{ICONOS[cat.nombre] || '🔨'}</Text>
            <Text style={styles.cardNombre}>{cat.nombre}</Text>
          </TouchableOpacity>
        ))}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4A90E2',
    padding: 24,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  saludo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitulo: {
    fontSize: 14,
    color: '#d0e8ff',
    marginTop: 4,
  },
  cerrarSesion: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  seccionTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 20,
    color: '#1a1a1a',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 12,
  },
  card: {
    width: '45%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  cardIcono: {
    fontSize: 36,
    marginBottom: 10,
  },
  cardNombre: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});