import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, RefreshControl, Modal, Image } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getOfertasSolicitud, aceptarOferta, getResenasEspecialista } from '../service/api';

export default function VerOfertas() {
  const router = useRouter();
  const { solicitudId, descripcion, estadoSolicitud } = useLocalSearchParams();

  const [ofertas, setOfertas] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const [perfilVisible, setPerfilVisible] = useState(false);
  const [perfilEspecialista, setPerfilEspecialista] = useState<any>(null);
  const [resenas, setResenas] = useState<any[]>([]);
  const [cargandoResenas, setCargandoResenas] = useState(false);

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

  const handleVerPerfil = async (oferta: any) => {
    setPerfilEspecialista(oferta.especialista);
    setResenas([]);
    setPerfilVisible(true);

    const usuarioId = oferta.especialista?.usuario?.id;
    if (!usuarioId) return;

    setCargandoResenas(true);
    const res = await getResenasEspecialista(usuarioId);
    setResenas(res.error ? [] : res.data);
    setCargandoResenas(false);
  };

  return (
    <>
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

              {/* Ver perfil del especialista */}
              <TouchableOpacity
                style={styles.btnVerPerfil}
                onPress={() => handleVerPerfil(oferta)}
              >
                <Text style={styles.btnVerPerfilTxt}>👤 Ver perfil</Text>
              </TouchableOpacity>

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
                  {estadoSolicitud === 'finalizado' && (
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

    {/* Modal: Perfil del especialista */}
    <Modal
      visible={perfilVisible}
      animationType="slide"
      transparent
      onRequestClose={() => setPerfilVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitulo}>Perfil del especialista</Text>
            <TouchableOpacity onPress={() => setPerfilVisible(false)}>
              <Text style={styles.btnCerrar}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView>
            {/* Foto + nombre + calificación */}
            <View style={styles.perfilCabecera}>
              {perfilEspecialista?.usuario?.fotoUrl ? (
                <Image source={{ uri: perfilEspecialista.usuario.fotoUrl }} style={styles.perfilFoto} />
              ) : (
                <View style={styles.perfilFotoPlaceholder}>
                  <Text style={styles.perfilFotoIcono}>👷</Text>
                </View>
              )}
              <Text style={styles.perfilNombre}>{perfilEspecialista?.usuario?.nombre}</Text>
              <Text style={styles.perfilCalificacion}>
                ⭐ {(perfilEspecialista?.calificacionPromedio ?? 0).toFixed(1)} ({resenas.length} {resenas.length === 1 ? 'reseña' : 'reseñas'})
              </Text>
            </View>

            {/* Descripción */}
            {perfilEspecialista?.descripcion ? (
              <View style={styles.perfilSeccion}>
                <Text style={styles.perfilSeccionTitulo}>Sobre mí</Text>
                <Text style={styles.perfilTexto}>{perfilEspecialista.descripcion}</Text>
              </View>
            ) : null}

            {/* Detalles */}
            <View style={styles.perfilSeccion}>
              <Text style={styles.perfilSeccionTitulo}>Detalles</Text>
              {perfilEspecialista?.distrito ? (
                <Text style={styles.perfilDato}>📍 {perfilEspecialista.distrito}</Text>
              ) : null}
              {perfilEspecialista?.precioReferencial ? (
                <Text style={styles.perfilDato}>💰 Precio referencial: S/. {perfilEspecialista.precioReferencial}</Text>
              ) : null}
              {perfilEspecialista?.categorias?.length ? (
                <Text style={styles.perfilDato}>
                  🏷️ {perfilEspecialista.categorias.map((c: any) => c.nombre).join(', ')}
                </Text>
              ) : null}
            </View>

            {/* Reseñas */}
            <View style={styles.perfilSeccion}>
              <Text style={styles.perfilSeccionTitulo}>Reseñas</Text>
              {cargandoResenas ? (
                <Text style={styles.perfilTexto}>Cargando reseñas...</Text>
              ) : resenas.length === 0 ? (
                <Text style={styles.perfilTexto}>Aún no tiene reseñas</Text>
              ) : (
                resenas.map((r: any) => (
                  <View key={r.id} style={styles.resenaCard}>
                    <View style={styles.resenaHeader}>
                      <Text style={styles.resenaCliente}>{r.cliente?.nombre}</Text>
                      <Text style={styles.resenaEstrellas}>{'⭐'.repeat(r.estrellas)}</Text>
                    </View>
                    {r.comentario ? <Text style={styles.resenaComentario}>"{r.comentario}"</Text> : null}
                  </View>
                ))
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: '#4A90E2',
    padding: 24,
    paddingTop: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  btnVolver: { color: '#fff', fontSize: 16, fontWeight: '600' },
  titulo: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  solicitudCard: {
    backgroundColor: '#EBF4FF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },
  solicitudLabel: { fontSize: 13, color: '#4A90E2', fontWeight: '600', marginBottom: 6 },
  solicitudDesc: { fontSize: 15, color: '#333', lineHeight: 22 },
  lista: { paddingHorizontal: 16, paddingBottom: 32 },
  vacio: { alignItems: 'center', marginTop: 60 },
  vacioIcono: { fontSize: 48, marginBottom: 16 },
  vacioTxt: { fontSize: 18, fontWeight: '600', color: '#555' },
  vacioSub: { fontSize: 14, color: '#999', marginTop: 8 },
  ofertaCard: {
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
  ofertaAceptada: { borderLeftWidth: 4, borderLeftColor: '#2ECC71' },
  ofertaRechazada: { borderLeftWidth: 4, borderLeftColor: '#E74C3C', opacity: 0.6 },
  ofertaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  especialistaNombre: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  ofertaPrecio: { fontSize: 18, fontWeight: 'bold', color: '#2ECC71' },
  ofertaMensaje: { fontSize: 14, color: '#666', fontStyle: 'italic', marginBottom: 12, lineHeight: 20 },
  btnAceptar: {
    backgroundColor: '#2ECC71',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnAceptarTxt: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  estadoBadge: { padding: 10, alignItems: 'center' },
  estadoAceptadaTxt: { color: '#2ECC71', fontWeight: '700', fontSize: 15 },
  estadoRechazadaTxt: { color: '#E74C3C', fontWeight: '700', fontSize: 15 },
  btnCalificar: {
    backgroundColor: '#F39C12',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  btnCalificarTxt: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  btnVerPerfil: {
    backgroundColor: '#EBF4FF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  btnVerPerfilTxt: { color: '#4A90E2', fontWeight: '600', fontSize: 14 },

  // Modal perfil
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitulo: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  btnCerrar: { fontSize: 20, color: '#999', padding: 4 },
  perfilCabecera: { alignItems: 'center', marginBottom: 20 },
  perfilFoto: { width: 80, height: 80, borderRadius: 40, marginBottom: 12 },
  perfilFotoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EBF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  perfilFotoIcono: { fontSize: 36 },
  perfilNombre: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  perfilCalificacion: { fontSize: 15, color: '#F39C12', fontWeight: '600' },
  perfilSeccion: { marginBottom: 16 },
  perfilSeccionTitulo: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4A90E2',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  perfilTexto: { fontSize: 14, color: '#555', lineHeight: 20 },
  perfilDato: { fontSize: 14, color: '#555', marginBottom: 4 },
  resenaCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  resenaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  resenaCliente: { fontSize: 14, fontWeight: '600', color: '#333' },
  resenaEstrellas: { fontSize: 13 },
  resenaComentario: { fontSize: 13, color: '#666', fontStyle: 'italic' },
});