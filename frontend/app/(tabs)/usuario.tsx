import { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, ActivityIndicator, ScrollView, Modal
} from 'react-native';

const API = 'http://192.168.18.163:8080/tecnicos';

interface Props {
  onLogout?: () => void;
  usuario?: any;
}

export default function UsuarioScreen({ onLogout, usuario }: Props) {
  const [tecnicos, setTecnicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todos');
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => { cargarTecnicos(); }, []);

  async function cargarTecnicos() {
    try {
      const res = await fetch(API);
      const data = await res.json();
      const verificados = data.filter((t: any) => t.estado === 'verificado');
      setTecnicos(verificados);
    } catch (e) {
      console.error('Error al cargar técnicos');
    } finally {
      setLoading(false);
    }
  }

  const especialidades = ['todos', ...Array.from(new Set(tecnicos.map((t: any) => t.especialidad)))];

  const tecnicosFiltrados = filtro === 'todos'
    ? tecnicos
    : tecnicos.filter((t: any) => t.especialidad === filtro);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerText}>🔍 Encuentra tu Técnico</Text>
              <Text style={styles.headerSub}>Técnicos verificados cerca de ti</Text>
            </View>
            <TouchableOpacity onPress={() => setMenuVisible(true)}>
              <Text style={styles.menuIcon}>☰</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inner}>
          {/* Filtros */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtrosRow}>
            {especialidades.map(esp => (
              <TouchableOpacity
                key={esp}
                style={[styles.filtroBtn, filtro === esp && styles.filtroBtnActive]}
                onPress={() => setFiltro(esp)}>
                <Text style={[styles.filtroText, filtro === esp && styles.filtroTextActive]}>
                  {esp.charAt(0).toUpperCase() + esp.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Lista */}
          {loading ? (
            <ActivityIndicator size="large" color="#2c3e50" style={{ marginTop: 40 }} />
          ) : tecnicosFiltrados.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>No hay técnicos disponibles</Text>
            </View>
          ) : (
            tecnicosFiltrados.map((t: any) => (
              <View key={t.id} style={styles.tecnicoCard}>
                <View style={styles.tecnicoHeader}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{t.nombre.charAt(0).toUpperCase()}</Text>
                  </View>
                  <View style={styles.tecnicoInfo}>
                    <Text style={styles.tecNombre}>{t.nombre}</Text>
                    <Text style={styles.tecEspecialidad}>📋 {t.especialidad}</Text>
                    <View style={styles.badgeVerificado}>
                      <Text style={styles.badgeText}>✓ Verificado</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.divider} />
                <View style={styles.tecnicoFooter}>
                  <Text style={styles.tecTelefono}>📞 {t.telefono}</Text>
                  <TouchableOpacity style={styles.btnContactar}>
                    <Text style={styles.btnContactarText}>Contactar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Menú lateral */}
      <Modal visible={menuVisible} transparent animationType="slide">
        <View style={styles.drawerOverlay}>
          <View style={styles.drawer}>
            <TouchableOpacity onPress={() => setMenuVisible(false)} style={styles.drawerClose}>
              <Text style={styles.drawerCloseText}>←</Text>
            </TouchableOpacity>
            <View style={styles.drawerUser}>
              <Text style={styles.drawerUserText}>
                👤 ¡Hola, {usuario?.nombre || 'Usuario'}!
              </Text>
            </View>
            <TouchableOpacity style={styles.drawerLogout} onPress={() => {
              setMenuVisible(false);
              if (onLogout) onLogout();
            }}>
              <Text style={styles.drawerLogoutText}>⎋ Cerrar sesión</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.drawerBg} onPress={() => setMenuVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9' },
  header: { backgroundColor: '#2c3e50', padding: 20, paddingTop: 50 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerText: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  headerSub: { color: '#a0b4c0', fontSize: 13, marginTop: 4 },
  menuIcon: { color: 'white', fontSize: 24, paddingLeft: 12 },
  inner: { padding: 16 },
  filtrosRow: { marginBottom: 16 },
  filtroBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#ddd', marginRight: 8, backgroundColor: 'white' },
  filtroBtnActive: { backgroundColor: '#2c3e50', borderColor: '#2c3e50' },
  filtroText: { fontSize: 13, color: '#555' },
  filtroTextActive: { color: 'white', fontWeight: 'bold' },
  tecnicoCard: { backgroundColor: 'white', borderRadius: 10, padding: 16, marginBottom: 12, elevation: 2 },
  tecnicoHeader: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#2c3e50', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  tecnicoInfo: { flex: 1 },
  tecNombre: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  tecEspecialidad: { fontSize: 13, color: '#555', marginTop: 2 },
  badgeVerificado: { alignSelf: 'flex-start', backgroundColor: '#27ae60', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, marginTop: 4 },
  badgeText: { color: 'white', fontSize: 11, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 12 },
  tecnicoFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tecTelefono: { fontSize: 13, color: '#555' },
  btnContactar: { backgroundColor: '#2c3e50', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  btnContactarText: { color: 'white', fontWeight: 'bold', fontSize: 13 },
  emptyBox: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: '#888', fontSize: 15 },
  drawerOverlay: { flex: 1, flexDirection: 'row' },
  drawer: { width: 260, backgroundColor: '#1a252f', paddingTop: 50, padding: 20 },
  drawerClose: { marginBottom: 24 },
  drawerCloseText: { color: 'white', fontSize: 24 },
  drawerUser: { marginBottom: 32 },
  drawerUserText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  drawerLogout: { paddingVertical: 12 },
  drawerLogoutText: { color: '#e74c3c', fontSize: 15, fontWeight: 'bold' },
  drawerBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
});