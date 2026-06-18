import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getHistorialEspecialista } from '../service/api';

export default function HistorialEspecialista() {
  const router = useRouter();
  const [totalGanancias, setTotalGanancias] = useState(0);
  const [servicios, setServicios] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    cargarHistorial();
  }, []);

  const cargarHistorial = async () => {
    const data = await AsyncStorage.getItem('usuario');
    if (!data) {
      router.replace('/');
      return;
    }
    const usuario = JSON.parse(data);

    const res = await getHistorialEspecialista(usuario.id);
    if (!res.error) {
      setTotalGanancias(res.data.totalGanancias ?? 0);
      setServicios(res.data.servicios ?? []);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarHistorial();
    setRefreshing(false);
  };

  const formatearFecha = (fecha: string) => {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-PE');
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.btnVolver}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Historial</Text>
      </View>

      <View style={styles.gananciasCard}>
        <Text style={styles.gananciasLabel}>Ganancias totales</Text>
        <Text style={styles.gananciasMonto}>S/. {totalGanancias.toFixed(2)}</Text>
        <Text style={styles.gananciasSub}>
          {servicios.length} {servicios.length === 1 ? 'servicio completado' : 'servicios completados'}
        </Text>
      </View>

      <View style={styles.lista}>
        {servicios.length === 0 ? (
          <View style={styles.vacio}>
            <Text style={styles.vacioIcono}>📭</Text>
            <Text style={styles.vacioTxt}>Aún no tienes servicios completados</Text>
          </View>
        ) : (
          servicios.map((s) => (
            <View key={s.solicitudId} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.categoria}>{s.categoria}</Text>
                <Text style={styles.precio}>S/. {Number(s.precio).toFixed(2)}</Text>
              </View>
              <Text style={styles.descripcion}>{s.descripcion}</Text>
              <Text style={styles.cliente}>👤 {s.cliente}</Text>
              <Text style={styles.fecha}>📅 {formatearFecha(s.fechaFin)}</Text>

              {s.estrellas ? (
                <View style={styles.resenaBox}>
                  <Text style={styles.resenaEstrellas}>{'⭐'.repeat(s.estrellas)}</Text>
                  {s.comentario ? <Text style={styles.resenaComentario}>&quot;{s.comentario}&quot;</Text> : null}
                </View>
              ) : null}
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
    alignItems: 'center',
    gap: 16,
  },
  btnVolver: { color: '#fff', fontSize: 16, fontWeight: '600' },
  titulo: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  gananciasCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  gananciasLabel: { fontSize: 13, color: '#888', fontWeight: '600', textTransform: 'uppercase', marginBottom: 8 },
  gananciasMonto: { fontSize: 36, fontWeight: 'bold', color: '#2ECC71', marginBottom: 6 },
  gananciasSub: { fontSize: 13, color: '#999' },
  lista: { paddingHorizontal: 16, paddingBottom: 32 },
  vacio: { alignItems: 'center', marginTop: 60 },
  vacioIcono: { fontSize: 48, marginBottom: 16 },
  vacioTxt: { fontSize: 16, fontWeight: '600', color: '#555' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
    marginBottom: 8,
  },
  categoria: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2ECC71',
    backgroundColor: '#F0FFF4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  precio: { fontSize: 18, fontWeight: 'bold', color: '#27AE60' },
  descripcion: { fontSize: 15, color: '#333', marginBottom: 8, lineHeight: 22 },
  cliente: { fontSize: 13, color: '#888', marginBottom: 4 },
  fecha: { fontSize: 13, color: '#888' },
  resenaBox: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  resenaEstrellas: { fontSize: 14, marginBottom: 4 },
  resenaComentario: { fontSize: 13, color: '#666', fontStyle: 'italic' },
});
