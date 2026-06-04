import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, RefreshControl } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getOfertasSolicitud, aceptarOferta } from '../service/api';

export default function VerOfertas() {
  const router = useRouter();
  const { solicitudId, descripcion, estadoSolicitud } = useLocalSearchParams();

  const [ofertas, setOfertas] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    cargarOfertas();
  }, []);

  const cargarOfertas = async () => {
    const res = await getOfertasSolicitud(Number(solicitudId));
    if (!res.error) setOfertas(res.data);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarOfertas();
    setRefreshing(false);
  };

  const handleAceptar = (oferta: any) => {
    Alert.alert(
      "Aceptar oferta",
      `¿Aceptas la oferta de ${oferta.especialista?.usuario?.nombre} por S/. ${oferta.precio}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, aceptar",
          onPress: async () => {
            const res = await aceptarOferta(oferta.id);
            if (res.error) {
              Alert.alert("Error", typeof res.message === 'string' ? res.message : "Error al aceptar oferta");
            } else {
              Alert.alert("¡Oferta aceptada!", "El especialista fue notificado", [
                { text: "OK", onPress: () => router.replace('/(tabs)/home-cliente' as any) }
              ]);
            }
          }
        }
      ]
    );
  };

  const handleCalificar = (oferta: any) => {
    router.push(`/(tabs)/calificar?solicitudId=${solicitudId}&especialistaNombre=${encodeURIComponent(oferta.especialista?.usuario?.nombre)}` as any);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.btnVolver}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Ofertas recibidas</Text>
      </View>

      {/* Descripción solicitud */}
      <View style={styles.solicitudCard}>
        <Text style={styles.solicitudLabel}>Tu solicitud:</Text>
        <Text style={styles.solicitudDesc}>{descripcion}</Text>
      </View>

      {/* Lista de ofertas */}
      <View style={styles.lista}>
        {ofertas.length === 0 ? (
          <View style={styles.vacio}>
            <Text style={styles.vacioIcono}>⏳</Text>
            <Text style={styles.vacioTxt}>Aún no hay ofertas</Text>
            <Text style={styles.vacioSub}>Desliza hacia abajo para actualizar</Text>
          </View>
        ) : (
          ofertas.map((oferta) => (
            <View key={oferta.id} style={[
              styles.ofertaCard,
              oferta.estado === 'aceptada' && styles.ofertaAceptada,
              oferta.estado === 'rechazada' && styles.ofertaRechazada,
            ]}>

              {/* Especialista */}
              <View style={styles.ofertaHeader}>
                <Text style={styles.especialistaNombre}>
                  👷 {oferta.especialista?.usuario?.nombre}
                </Text>
                <Text style={styles.ofertaPrecio}>S/. {oferta.precio}</Text>
              </View>

              {/* Mensaje */}
              {oferta.mensaje ? (
                <Text style={styles.ofertaMensaje}>"{oferta.mensaje}"</Text>
              ) : null}

              {/* Estado pendiente → botón aceptar */}
              {oferta.estado === 'pendiente' && (
                <TouchableOpacity
                  style={styles.btnAceptar}
                  onPress={() => handleAceptar(oferta)}
                >
                  <Text style={styles.btnAceptarTxt}>✓ Aceptar oferta</Text>
                </TouchableOpacity>
              )}

              {/* Estado aceptada → mostrar badge y botón calificar si completada */}
              {oferta.estado === 'aceptada' && (
                <View>
                  <View style={styles.estadoBadge}>
                    <Text style={styles.estadoAceptadaTxt}>✅ Oferta aceptada</Text>
                  </View>

                  {/* Botón calificar solo si el servicio está completado */}
                  {estadoSolicitud === 'completada' && (
                    <TouchableOpacity
                      style={styles.btnCalificar}
                      onPress={() => handleCalificar(oferta)}
                    >
                      <Text style={styles.btnCalificarTxt}>⭐ Calificar servicio</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {/* Estado rechazada */}
              {oferta.estado === 'rechazada' && (
                <View style={styles.estadoBadge}>
                  <Text style={styles.estadoRechazadaTxt}>❌ No seleccionada</Text>
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
  container: { flex: 1, backgroundColor: '#0F0F0F' },
  header: {
    backgroundColor: '#0F0F0F',
    padding: 24,
    paddingTop: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  btnVolver: { color: '#1DB954', fontSize: 16, fontWeight: '600' },
  titulo: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  solicitudCard: {
    backgroundColor: '#181818',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#1DB954',
  },
  solicitudLabel: { fontSize: 13, color: '#1DB954', fontWeight: '600', marginBottom: 6 },
  solicitudDesc: { fontSize: 15, color: '#fff', lineHeight: 22 },
  lista: { paddingHorizontal: 16, paddingBottom: 32 },
  vacio: { alignItems: 'center', marginTop: 60 },
  vacioIcono: { fontSize: 48, marginBottom: 16 },
  vacioTxt: { fontSize: 18, fontWeight: '600', color: '#A0A0A0' },
  vacioSub: { fontSize: 14, color: '#555', marginTop: 8 },
  ofertaCard: {
    backgroundColor: '#2e2d2d',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  ofertaAceptada: { borderLeftWidth: 4, borderLeftColor: '#1DB954' },
  ofertaRechazada: { borderLeftWidth: 4, borderLeftColor: '#FF4444', opacity: 0.6 },
  ofertaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  especialistaNombre: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  ofertaPrecio: { fontSize: 18, fontWeight: 'bold', color: '#2ECC71' },
  ofertaMensaje: { fontSize: 14, color: '#ebe1e1', fontStyle: 'italic', marginBottom: 12, lineHeight: 20 },
  btnAceptar: {
    backgroundColor: '#1DB954',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnAceptarTxt: { color: '#000', fontWeight: 'bold', fontSize: 15 },
  estadoBadge: { padding: 10, alignItems: 'center' },
  estadoAceptadaTxt: { color: '#1DB954', fontWeight: '700', fontSize: 15 },
  estadoRechazadaTxt: { color: '#FF4444', fontWeight: '700', fontSize: 15 },
  btnCalificar: {
    backgroundColor: '#FFB81C',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  btnCalificarTxt: { color: '#000', fontWeight: 'bold', fontSize: 15 },
});