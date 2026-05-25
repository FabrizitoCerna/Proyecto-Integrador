import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, RefreshControl } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCategorias, getSolicitudesCliente } from '../service/api';

const ICONOS: { [key: string]: string } = {
  'Gasfitería': '🔧',
  'Electricidad': '⚡',
  'Limpieza': '🧹',
  'Carpintería': '🪚',
  'Pintura': '🎨',
  'Jardinería': '🌿',
};

const ESTADO_COLORES: { [key: string]: string } = {
  buscando: '#F39C12',
  oferta_aceptada: '#4A90E2',
  en_progreso: '#9B59B6',
  finalizado: '#E67E22',
  completado: '#2ECC71',
  cancelado: '#E74C3C',
};

const ESTADO_LABELS: { [key: string]: string } = {
  buscando: '⏳ Buscando especialista',
  oferta_aceptada: '✅ Especialista aceptado',
  en_progreso: '🔧 Servicio en curso',
  finalizado: '⭐ Pendiente calificación',
  completado: '✅ Servicio completado',
  cancelado: '❌ Cancelado',
};

export default function HomeCliente() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<any>(null);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [vista, setVista] = useState<'servicios' | 'solicitudes'>('servicios');

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

    const resCat = await getCategorias();
    if (!resCat.error) setCategorias(resCat.data);

    const resSol = await getSolicitudesCliente(user.id);
    if (!resSol.error) setSolicitudes(resSol.data);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarDatos();
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

  const handleCategoria = (categoria: any) => {
    router.push(`/(tabs)/crear-solicitud?categoriaId=${categoria.id}&categoriaNombre=${encodeURIComponent(categoria.nombre)}` as any);
  };

  const handleVerOfertas = (solicitud: any) => {
    router.push(`/(tabs)/ver-ofertas?solicitudId=${solicitud.id}&descripcion=${encodeURIComponent(solicitud.descripcion)}&estadoSolicitud=${solicitud.estado}` as any);
  };

  const handleCalificar = (solicitud: any) => {
    router.push(`/(tabs)/calificar?solicitudId=${solicitud.id}&especialistaNombre=${encodeURIComponent(solicitud.especialistaGanador?.usuario?.nombre || '')}` as any);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
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

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, vista === 'servicios' && styles.tabActivo]}
          onPress={() => setVista('servicios')}
        >
          <Text style={[styles.tabTxt, vista === 'servicios' && styles.tabTxtActivo]}>Servicios</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, vista === 'solicitudes' && styles.tabActivo]}
          onPress={() => setVista('solicitudes')}
        >
          <Text style={[styles.tabTxt, vista === 'solicitudes' && styles.tabTxtActivo]}>
            Mis solicitudes {solicitudes.length > 0 ? `(${solicitudes.length})` : ''}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Vista Servicios */}
      {vista === 'servicios' && (
        <>
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
        </>
      )}

      {/* Vista Mis Solicitudes */}
      {vista === 'solicitudes' && (
        <View style={styles.lista}>
          {solicitudes.length === 0 ? (
            <View style={styles.vacio}>
              <Text style={styles.vacioIcono}>📭</Text>
              <Text style={styles.vacioTxt}>No tienes solicitudes aún</Text>
              <TouchableOpacity onPress={() => setVista('servicios')}>
                <Text style={styles.vacioLink}>Solicita un servicio</Text>
              </TouchableOpacity>
            </View>
          ) : (
            solicitudes.map((sol) => (
              <View key={sol.id} style={styles.solicitudCard}>

                {/* Header */}
                <View style={styles.solicitudHeader}>
                  <Text style={styles.solicitudCategoria}>{sol.categoria?.nombre}</Text>
                  <Text style={[styles.solicitudEstado, { color: ESTADO_COLORES[sol.estado] || '#888' }]}>
                    {ESTADO_LABELS[sol.estado] || sol.estado}
                  </Text>
                </View>

                {/* Descripción */}
                <Text style={styles.solicitudDesc}>{sol.descripcion}</Text>

                {/* Dirección */}
                {sol.direccion ? <Text style={styles.solicitudDir}>📍 {sol.direccion}</Text> : null}

                {/* Especialista ganador */}
                {sol.especialistaGanador && (
                  <Text style={styles.especialista}>
                    👷 {sol.especialistaGanador?.usuario?.nombre}
                  </Text>
                )}

                {/* Botones según estado */}
                {(sol.estado === 'buscando' || sol.estado === 'oferta_aceptada' || sol.estado === 'en_progreso') && (
                  <TouchableOpacity
                    style={styles.btnVerOfertas}
                    onPress={() => handleVerOfertas(sol)}
                  >
                    <Text style={styles.btnVerOfertasTxt}>Ver ofertas</Text>
                  </TouchableOpacity>
                )}

                {sol.estado === 'finalizado' && (
                  <TouchableOpacity
                    style={styles.btnCalificar}
                    onPress={() => handleCalificar(sol)}
                  >
                    <Text style={styles.btnCalificarTxt}>⭐ Calificar servicio</Text>
                  </TouchableOpacity>
                )}

                {sol.estado === 'completado' && (
                  <View style={styles.completadoBadge}>
                    <Text style={styles.completadoTxt}>✅ Ya calificaste este servicio</Text>
                  </View>
                )}

              </View>
            ))
          )}
        </View>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: '#4A90E2',
    padding: 24,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  saludo: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  subtitulo: { fontSize: 14, color: '#d0e8ff', marginTop: 4 },
  cerrarSesion: { color: '#fff', fontSize: 14, fontWeight: '600' },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  tabActivo: { borderBottomWidth: 2, borderBottomColor: '#4A90E2' },
  tabTxt: { fontSize: 14, color: '#888', fontWeight: '500' },
  tabTxtActivo: { color: '#4A90E2', fontWeight: '700' },
  seccionTitulo: { fontSize: 18, fontWeight: 'bold', margin: 20, color: '#1a1a1a' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 12 },
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
  cardIcono: { fontSize: 36, marginBottom: 10 },
  cardNombre: { fontSize: 14, fontWeight: '600', color: '#333', textAlign: 'center' },
  lista: { padding: 16 },
  vacio: { alignItems: 'center', marginTop: 60 },
  vacioIcono: { fontSize: 48, marginBottom: 16 },
  vacioTxt: { fontSize: 16, color: '#555', marginBottom: 12 },
  vacioLink: { color: '#4A90E2', fontWeight: '600', fontSize: 15 },
  solicitudCard: {
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
  solicitudHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  solicitudCategoria: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#4A90E2',
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  solicitudEstado: { fontSize: 12, fontWeight: '600', flexShrink: 1, textAlign: 'right' },
  solicitudDesc: { fontSize: 15, color: '#333', marginBottom: 6, lineHeight: 22 },
  solicitudDir: { fontSize: 13, color: '#666', marginBottom: 6 },
  especialista: { fontSize: 13, color: '#555', marginBottom: 12, fontWeight: '500' },
  btnVerOfertas: {
    backgroundColor: '#4A90E2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnVerOfertasTxt: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  btnCalificar: {
    backgroundColor: '#F39C12',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnCalificarTxt: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  completadoBadge: {
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#F0FFF4',
    borderRadius: 8,
  },
  completadoTxt: { color: '#2ECC71', fontWeight: '600', fontSize: 14 },
});