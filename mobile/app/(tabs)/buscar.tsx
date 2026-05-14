import { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, ActivityIndicator, ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';

const API_URL = 'http://192.168.18.163:8080';
const router = useRouter();

export default function BuscarEspecialistas() {
  const [especialistas, setEspecialistas] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState(0);

  useEffect(() => {
    cargarEspecialistas();
    cargarCategorias();
  }, []);

  async function cargarEspecialistas() {
    try {
      const res = await fetch(`${API_URL}/especialistas`);
      const data = await res.json() as any[];
      const disponibles = data.filter((e: any) => e.disponible === true);
      setEspecialistas(disponibles);
    } catch (e) {
      console.error('Error al cargar especialistas');
    } finally {
      setLoading(false);
    }
  }

  async function cargarCategorias() {
    try {
      const res = await fetch(`${API_URL}/especialistas/categorias`);
      const data = await res.json() as any[];
      setCategorias(data);
    } catch (e) {
      console.error('Error al cargar categorías');
    }
  }

  const especialistasFiltrados = filtro === 0
    ? especialistas
    : especialistas.filter((e: any) =>
        e.categorias?.some((c: any) => c.id === filtro)
      );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>🔍 Encuentra tu Especialista</Text>
        <Text style={styles.headerSub}>Especialistas disponibles cerca de ti</Text>
        <TouchableOpacity onPress={() => router.replace('/')} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inner}>
        {/* Filtros por categoría */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtrosRow}>
          <TouchableOpacity
            style={[styles.filtroBtn, filtro === 0 && styles.filtroBtnActive]}
            onPress={() => setFiltro(0)}>
            <Text style={[styles.filtroText, filtro === 0 && styles.filtroTextActive]}>Todos</Text>
          </TouchableOpacity>
          {categorias.map((c: any) => (
            <TouchableOpacity
              key={c.id}
              style={[styles.filtroBtn, filtro === c.id && styles.filtroBtnActive]}
              onPress={() => setFiltro(c.id)}>
              <Text style={[styles.filtroText, filtro === c.id && styles.filtroTextActive]}>
                {c.nombre}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Lista */}
        {loading ? (
          <ActivityIndicator size="large" color="#4A90E2" style={{ marginTop: 40 }} />
        ) : especialistasFiltrados.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No hay especialistas disponibles</Text>
          </View>
        ) : (
          especialistasFiltrados.map((e: any) => (
            <View key={e.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {e.usuario?.nombre?.charAt(0).toUpperCase() || '?'}
                  </Text>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.nombre}>{e.usuario?.nombre || 'Sin nombre'}</Text>
                  <Text style={styles.info}>📍 {e.distrito}</Text>
                  <Text style={styles.info}>⭐ {e.calificacionPromedio?.toFixed(1) || '0.0'}</Text>
                  <View style={styles.badgeDisponible}>
                    <Text style={styles.badgeText}>✓ Disponible</Text>
                  </View>
                </View>
              </View>

              {/* Categorías */}
              <View style={styles.categoriasRow}>
                {e.categorias?.map((c: any) => (
                  <View key={c.id} style={styles.categoriaTag}>
                    <Text style={styles.categoriaTagText}>{c.nombre}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.divider} />
              <View style={styles.cardFooter}>
                <Text style={styles.precio}>💰 Desde S/ {e.precioReferencial}</Text>
                <TouchableOpacity style={styles.btnContactar}>
                  <Text style={styles.btnContactarText}>Contactar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  header: { backgroundColor: '#4A90E2', padding: 20, paddingTop: 50 },
  headerText: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  headerSub: { color: '#d0e8ff', fontSize: 13, marginTop: 4 },
  inner: { padding: 16 },
  filtrosRow: { marginBottom: 16 },
  filtroBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#4A90E2', marginRight: 8, backgroundColor: 'white' },
  filtroBtnActive: { backgroundColor: '#4A90E2', borderColor: '#4A90E2' },
  filtroText: { fontSize: 13, color: '#4A90E2' },
  filtroTextActive: { color: 'white', fontWeight: 'bold' },
  card: { backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#4A90E2', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  cardInfo: { flex: 1 },
  nombre: { fontSize: 16, fontWeight: 'bold', color: '#1a1a1a' },
  info: { fontSize: 13, color: '#555', marginTop: 2 },
  badgeDisponible: { alignSelf: 'flex-start', backgroundColor: '#27ae60', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, marginTop: 4 },
  badgeText: { color: 'white', fontSize: 11, fontWeight: 'bold' },
  categoriasRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  categoriaTag: { backgroundColor: '#e8f0fe', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  categoriaTagText: { fontSize: 12, color: '#4A90E2', fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  precio: { fontSize: 14, color: '#1a1a1a', fontWeight: 'bold' },
  btnContactar: { backgroundColor: '#4A90E2', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  btnContactarText: { color: 'white', fontWeight: 'bold', fontSize: 13 },
  emptyBox: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: '#888', fontSize: 15 },
  logoutBtn: { marginTop: 8, alignSelf: 'flex-end' },
  logoutText: { color: 'white', fontSize: 13, fontWeight: 'bold' }
});