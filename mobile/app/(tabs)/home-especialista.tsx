import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, RefreshControl } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSolicitudesEspecialista, iniciarServicio, finalizarServicio } from '../service/api';
import { useWebSocket } from '../../hooks/useWebsocket';

export default function HomeEspecialista() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<any>(null);
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const data = await AsyncStorage.getItem('usuario');
    if (!data) {  
      router.replace('/');
      return;
    }
    const user = JSON.parse(data);
    setUsuario(user);
    await cargarSolicitudes(user.id);
  };

  const cargarSolicitudes = async (usuarioId: number) => {
    const res = await getSolicitudesEspecialista(usuarioId);
    if (!res.error) setSolicitudes(res.data);
  };

  // WebSocket — escuchar notificaciones en tiempo real
  useWebSocket(usuario?.id, (mensaje) => {
    if (mensaje.tipo === 'NUEVA_SOLICITUD') {
      cargarSolicitudes(usuario.id);
      Alert.alert('🔔 Nueva solicitud', 'Un cliente necesita tu servicio');
    }
    if (mensaje.tipo === 'OFERTA_ACEPTADA') {
      cargarSolicitudes(usuario.id);
      Alert.alert('🎉 Oferta aceptada', '¡El cliente aceptó tu oferta!');
    }
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarSolicitudes(usuario.id);
    setRefreshing(false);
  };

  const handleCerrarSesion = async () => {
    Alert.alert(
      "Cerrar sesión", "¿Estás seguro?",
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

  const handleOferta = (solicitud: any) => {
    router.push(`/(tabs)/hacer-oferta?solicitudId=${solicitud.id}&descripcion=${encodeURIComponent(solicitud.descripcion)}&direccion=${encodeURIComponent(solicitud.direccion || '')}&categoria=${encodeURIComponent(solicitud.categoria.nombre)}` as any);
  };

  const handleIniciar = async (solicitudId: number) => {
    Alert.alert("Iniciar servicio", "¿Confirmas que vas a iniciar el servicio?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sí, iniciar",
        onPress: async () => {
          const res = await iniciarServicio(solicitudId, usuario.id);
          if (res.error) {
            Alert.alert("Error", typeof res.message === 'string' ? res.message : "Error");
          } else {
            Alert.alert("✅ Servicio iniciado");
            await cargarSolicitudes(usuario.id);
          }
        }
      }
    ]);
  };

  const handleFinalizar = async (solicitudId: number) => {
    Alert.alert("Finalizar servicio", "¿Confirmas que terminaste el servicio?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sí, finalizar",
        onPress: async () => {
          const res = await finalizarServicio(solicitudId, usuario.id);
          if (res.error) {
            Alert.alert("Error", typeof res.message === 'string' ? res.message : "Error");
          } else {
            Alert.alert("✅ Servicio finalizado", "El cliente podrá calificarte");
            await cargarSolicitudes(usuario.id);
          }
        }
      }
    ]);
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'buscando': return '#F39C12';
      case 'oferta_aceptada': return '#4A90E2';
      case 'en_progreso': return '#9B59B6';
      case 'finalizado': return '#2ECC71';
      case 'completado': return '#27AE60';
      case 'cancelado': return '#E74C3C';
      default: return '#888';
    }
  };

  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case 'buscando': return '⏳ Buscando especialista';
      case 'oferta_aceptada': return '✅ Oferta aceptada';
      case 'en_progreso': return '🔧 En progreso';
      case 'finalizado': return '🏁 Finalizado';
      case 'completado': return '⭐ Completado';
      case 'cancelado': return '❌ Cancelado';
      default: return estado;
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.saludo}>Hola, {usuario?.nombre} 👷</Text>
          <Text style={styles.subtitulo}>Solicitudes disponibles para ti</Text>
        </View>
        <TouchableOpacity onPress={handleCerrarSesion}>
          <Text style={styles.cerrarSesion}>Salir</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.lista}>
        {solicitudes.length === 0 ? (
          <View style={styles.vacio}>
            <Text style={styles.vacioIcono}>📭</Text>
            <Text style={styles.vacioTxt}>No hay solicitudes disponibles</Text>
            <Text style={styles.vacioSub}>Desliza hacia abajo para actualizar</Text>
          </View>
        ) : (
          solicitudes.map((sol) => (
            <View key={sol.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.categoria}>{sol.categoria?.nombre}</Text>
                <Text style={[styles.estado, { color: getEstadoColor(sol.estado) }]}>
                  {getEstadoLabel(sol.estado)}
                </Text>
              </View>
              <Text style={styles.descripcion}>{sol.descripcion}</Text>
              {sol.direccion ? <Text style={styles.direccion}>📍 {sol.direccion}</Text> : null}
              <Text style={styles.cliente}>👤 {sol.cliente?.nombre}</Text>

              {sol.estado === 'buscando' && (
                <TouchableOpacity style={styles.btnOferta} onPress={() => handleOferta(sol)}>
                  <Text style={styles.btnTxt}>💼 Hacer oferta</Text>
                </TouchableOpacity>
              )}
              {sol.estado === 'oferta_aceptada' && (
                <TouchableOpacity style={styles.btnIniciar} onPress={() => handleIniciar(sol.id)}>
                  <Text style={styles.btnTxt}>▶ Iniciar servicio</Text>
                </TouchableOpacity>
              )}
              {sol.estado === 'en_progreso' && (
                <TouchableOpacity style={styles.btnFinalizar} onPress={() => handleFinalizar(sol.id)}>
                  <Text style={styles.btnTxt}>✓ Finalizar servicio</Text>
                </TouchableOpacity>
              )}
              {sol.estado === 'finalizado' && (
                <View style={styles.esperandoBadge}>
                  <Text style={styles.esperandoTxt}>⏳ Esperando calificación del cliente</Text>
                </View>
              )}
              {sol.estado === 'completado' && (
                <View style={styles.completadaBadge}>
                  <Text style={styles.completadaTxt}>⭐ Servicio completado y calificado</Text>
                </View>
              )}
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: '#2ECC71',
    padding: 24,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  saludo: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  subtitulo: { fontSize: 14, color: '#d5f5e3', marginTop: 4 },
  cerrarSesion: { color: '#fff', fontSize: 14, fontWeight: '600' },
  lista: { padding: 16 },
  vacio: { alignItems: 'center', marginTop: 80 },
  vacioIcono: { fontSize: 48, marginBottom: 16 },
  vacioTxt: { fontSize: 18, fontWeight: '600', color: '#555' },
  vacioSub: { fontSize: 14, color: '#999', marginTop: 8 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoria: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A90E2',
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  estado: { fontSize: 13, fontWeight: '600' },
  descripcion: { fontSize: 15, color: '#333', marginBottom: 8, lineHeight: 22 },
  direccion: { fontSize: 13, color: '#666', marginBottom: 6 },
  cliente: { fontSize: 13, color: '#888', marginBottom: 12 },
  btnOferta: { backgroundColor: '#2ECC71', padding: 12, borderRadius: 8, alignItems: 'center' },
  btnIniciar: { backgroundColor: '#F39C12', padding: 12, borderRadius: 8, alignItems: 'center' },
  btnFinalizar: { backgroundColor: '#E74C3C', padding: 12, borderRadius: 8, alignItems: 'center' },
  btnTxt: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  esperandoBadge: { padding: 10, alignItems: 'center', backgroundColor: '#FFF9E6', borderRadius: 8 },
  esperandoTxt: { color: '#F39C12', fontWeight: '600', fontSize: 14 },
  completadaBadge: { padding: 10, alignItems: 'center', backgroundColor: '#F0FFF4', borderRadius: 8 },
  completadaTxt: { color: '#2ECC71', fontWeight: '700', fontSize: 15 },
});