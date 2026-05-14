import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function DashboardAdmin() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>🔧 Panel de Administración</Text>
        <Text style={styles.headerSub}>Bienvenido, Admin</Text>
        <TouchableOpacity onPress={() => router.replace('/')} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inner}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Gestión de Especialistas</Text>
          <Text style={styles.cardDesc}>Registrar, editar y eliminar especialistas de la plataforma.</Text>
          <TouchableOpacity style={styles.btn} onPress={() => router.push('/gestion-especialistas')}>
            <Text style={styles.btnText}>Ir a Gestión</Text>
          </TouchableOpacity>
        </View>
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
  card: { backgroundColor: 'white', borderRadius: 12, padding: 20, marginBottom: 16, elevation: 2 },
  cardTitle: { fontSize: 17, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 8 },
  cardDesc: { fontSize: 13, color: '#666', marginBottom: 16 },
  btn: { backgroundColor: '#4A90E2', padding: 12, borderRadius: 8, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  logoutBtn: { marginTop: 8, alignSelf: 'flex-end' },
logoutText: { color: 'white', fontSize: 13, fontWeight: 'bold' }
});