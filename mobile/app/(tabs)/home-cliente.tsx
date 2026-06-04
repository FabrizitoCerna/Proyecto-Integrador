import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, RefreshControl } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCategorias, getSolicitudesCliente } from '../service/api';
import { useWebSocket } from '../../hooks/useWebsocket';

const ICONOS: { [key: string]: string } = {
  'Gasfitería': '🔧',
  'Electricidad': '⚡',
  'Limpieza': '🧹',
  'Carpintería': '🪚',
  'Pintura': '🎨',
  'Jardinería': '🌿',
};

const ESTADO_COLORES: { [key: string]: string } = {
  buscando: '#FFB81C',
  oferta_aceptada: '#1DB954',
  en_progreso: '#1ed760',
  finalizado: '#FFB81C',
  completado: '#1DB954',
  cancelado: '#FF4444',
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
        <View style={{ flex: 1 }}>
          <Text style={styles.saludo}>Hola, {usuario?.nombre?.split(' ')[0]}</Text>
          <Text style={styles.subtitulo}>Encuentra el servicio que necesitas</Text>
        </View>
        <TouchableOpacity onPress={handleCerrarSesion} style={{ paddingLeft: 12 }}>
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
          <Text style={styles.seccionTitulo}>Categorías disponibles</Text>
          <View style={styles.grid}>
            {categorias.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={styles.card}
                onPress={() => handleCategoria(cat)}
                activeOpacity={0.85}
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
                  <Text style={[styles.solicitudEstado, { color: ESTADO_COLORES[sol.estado] || '#A0A0A0' }]}>
                    {ESTADO_LABELS[sol.estado] || sol.estado}
                  </Text>
                </View>

                {/* Descripción */}
                <Text style={styles.solicitudDesc} numberOfLines={2}>{sol.descripcion}</Text>

                {/* Dirección */}
                {sol.direccion ? <Text style={styles.solicitudDir}>📍 {sol.direccion}</Text> : null}

                {/* Especialista ganador */}
                {sol.especialistaGanador && (
                  <Text style={styles.especialista}>
                    🔧 {sol.especialistaGanador?.usuario?.nombre}
                  </Text>
                )}

                {/* Botones según estado */}
                {(sol.estado === 'buscando' || sol.estado === 'oferta_aceptada' || sol.estado === 'en_progreso') && (
                  <TouchableOpacity
                    style={styles.btnVerOfertas}
                    onPress={() => handleVerOfertas(sol)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.btnVerOfertasTxt}>Ver ofertas</Text>
                  </TouchableOpacity>
                )}

                {sol.estado === 'finalizado' && (
                  <TouchableOpacity
                    style={styles.btnCalificar}
                    onPress={() => handleCalificar(sol)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.btnCalificarTxt}>⭐ Calificar servicio</Text>
                  </TouchableOpacity>
                )}

                {sol.estado === 'completado' && (
                  <View style={styles.completadoBadge}>
                    <Text style={styles.completadoTxt}>✅ Servicio calificado</Text>
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
  container: { flex: 1, backgroundColor: '#0F0F0F' },
  header: {
    backgroundColor: '#0F0F0F',
    padding: 24,
    paddingTop: 60,
    paddingBottom: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  saludo: { fontSize: 28, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  subtitulo: { fontSize: 15, color: '#A0A0A0', marginTop: 8, fontWeight: '400' },
  cerrarSesion: {
    color: '#1DB954',
    fontSize: 13,
    fontWeight: '600',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(29, 185, 84, 0.12)',
    borderRadius: 20,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#0F0F0F',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  tab: { flex: 1, paddingVertical: 16, alignItems: 'center' },
  tabActivo: { borderBottomWidth: 3, borderBottomColor: '#1DB954' },
  tabTxt: { fontSize: 13, color: '#727272', fontWeight: '600', letterSpacing: 0.3 },
  tabTxtActivo: { color: '#fff', fontWeight: '700' },
  seccionTitulo: { fontSize: 22, fontWeight: '800', paddingHorizontal: 20, paddingTop: 28, paddingBottom: 16, color: '#fff', letterSpacing: -0.5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 10, marginBottom: 24 },
  card: {
    width: '48%',
    backgroundColor: '#1DB954',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 160,
    shadowColor: '#1DB954',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  cardIcono: { fontSize: 44, marginBottom: 12 },
  cardNombre: { fontSize: 14, fontWeight: '700', color: '#000', textAlign: 'center', letterSpacing: 0.2 },
  lista: { padding: 16 },
  vacio: { alignItems: 'center', marginTop: 80 },
  vacioIcono: { fontSize: 56, marginBottom: 20 },
  vacioTxt: { fontSize: 17, color: '#A0A0A0', marginBottom: 20, fontWeight: '500' },
  vacioLink: { color: '#1DB954', fontWeight: '700', fontSize: 14, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: 'rgba(29, 185, 84, 0.12)', borderRadius: 24 },
  solicitudCard: {
    backgroundColor: '#181818',
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    borderLeftWidth: 5,
    borderLeftColor: '#1DB954',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  solicitudHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  solicitudCategoria: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1DB954',
    backgroundColor: 'rgba(29, 185, 84, 0.18)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  solicitudEstado: { fontSize: 12, fontWeight: '700', flexShrink: 1, textAlign: 'right', color: '#fff' },
  solicitudDesc: { fontSize: 14, color: '#fff', marginBottom: 10, lineHeight: 20, fontWeight: '500' },
  solicitudDir: { fontSize: 12, color: '#A0A0A0', marginBottom: 10, fontWeight: '400' },
  especialista: { fontSize: 12, color: '#1DB954', marginBottom: 14, fontWeight: '700' },
  btnVerOfertas: {
    backgroundColor: '#1DB954',
    padding: 14,
    borderRadius: 26,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#1DB954',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnVerOfertasTxt: { color: '#000', fontWeight: '800', fontSize: 13, letterSpacing: 0.3 },
  btnCalificar: {
    backgroundColor: '#1DB954',
    padding: 14,
    borderRadius: 26,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#1DB954',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnCalificarTxt: { color: '#000', fontWeight: '800', fontSize: 13, letterSpacing: 0.3 },
  completadoBadge: {
    padding: 14,
    alignItems: 'center',
    backgroundColor: 'rgba(29, 185, 84, 0.15)',
    borderRadius: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#1DB954',
    marginTop: 10,

  },
  completadoTxt: { color: '#1DB954', fontWeight: '700', fontSize: 13, letterSpacing: 0.2 },
});