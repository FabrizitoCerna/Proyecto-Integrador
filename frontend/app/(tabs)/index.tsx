import { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator, ScrollView, Modal
} from 'react-native';

const API = 'http://192.168.18.163:8080/tecnicos';

export default function HomeScreen() {
  const [tecnicos, setTecnicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [telefono, setTelefono] = useState('');
  const [estado, setEstado] = useState('pendiente');
  const [msg, setMsg] = useState('');
  const [msgTipo, setMsgTipo] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editNombre, setEditNombre] = useState('');
  const [editEspecialidad, setEditEspecialidad] = useState('');
  const [editTelefono, setEditTelefono] = useState('');
  const [editEstado, setEditEstado] = useState('pendiente');

  useEffect(() => { cargarTecnicos(); }, []);

  function mostrarMsg(texto: string, tipo: string) {
    setMsg(texto);
    setMsgTipo(tipo);
    setTimeout(() => setMsg(''), 3000);
  }

  async function cargarTecnicos() {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setTecnicos(data);
    } catch (e) {
      mostrarMsg('Error al conectar con el servidor', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function registrarTecnico() {
    if (!nombre || !especialidad || !telefono) {
      mostrarMsg('Por favor completa todos los campos.', 'error');
      return;
    }
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, especialidad, telefono, estado, activo: true })
      });
      if (res.ok) {
        mostrarMsg('Técnico registrado correctamente.', 'ok');
        setNombre(''); setEspecialidad(''); setTelefono(''); setEstado('pendiente');
        cargarTecnicos();
      } else {
        mostrarMsg('Error al registrar el técnico.', 'error');
      }
    } catch (e) {
      mostrarMsg('No se pudo conectar con el servidor.', 'error');
    }
  }

  function abrirEditar(t: any) {
    setEditId(t.id);
    setEditNombre(t.nombre);
    setEditEspecialidad(t.especialidad);
    setEditTelefono(t.telefono);
    setEditEstado(t.estado);
    setModalVisible(true);
  }

  async function guardarEdicion() {
    if (!editNombre || !editEspecialidad || !editTelefono) {
      mostrarMsg('Completa todos los campos.', 'error');
      return;
    }
    try {
      const res = await fetch(`${API}/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: editNombre, especialidad: editEspecialidad, telefono: editTelefono, estado: editEstado, activo: true })
      });
      if (res.ok) {
        mostrarMsg('Técnico actualizado correctamente.', 'ok');
        setModalVisible(false);
        cargarTecnicos();
      } else {
        mostrarMsg('Error al actualizar.', 'error');
      }
    } catch (e) {
      mostrarMsg('No se pudo conectar con el servidor.', 'error');
    }
  }

  async function verificar(id: number) {
    try {
      await fetch(`${API}/${id}/estado?estado=verificado`, { method: 'PUT' });
      cargarTecnicos();
    } catch (e) {
      mostrarMsg('Error al actualizar estado.', 'error');
    }
  }

  async function eliminar(id: number) {
    if (typeof window !== 'undefined') {
      // Web: usar confirm del navegador
      const confirmado = window.confirm('¿Eliminar este técnico?');
      if (!confirmado) return;
      await fetch(`${API}/${id}`, { method: 'DELETE' });
      cargarTecnicos();
    } else {
      // Móvil: usar Alert de React Native
      Alert.alert('Confirmar', '¿Eliminar este técnico?', [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar', style: 'destructive', onPress: async () => {
            await fetch(`${API}/${id}`, { method: 'DELETE' });
            cargarTecnicos();
          }
        }
      ]);
    }
  }

  const badgeColor = (e: string) => {
    if (e === 'verificado') return '#27ae60';
    if (e === 'suspendido') return '#e74c3c';
    return '#f39c12';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>🔧 Formalización y Seguimiento de Técnicos</Text>
      </View>

      <View style={styles.inner}>
        {msg !== '' && (
          <View style={[styles.msg, msgTipo === 'ok' ? styles.msgOk : styles.msgError]}>
            <Text style={msgTipo === 'ok' ? styles.msgOkText : styles.msgErrorText}>{msg}</Text>
          </View>
        )}

        {/* Formulario */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Registrar Técnico</Text>
          <Text style={styles.label}>Nombre</Text>
          <TextInput style={styles.input} placeholder="Nombre completo" value={nombre} onChangeText={setNombre} />
          <Text style={styles.label}>Especialidad</Text>
          <TextInput style={styles.input} placeholder="Ej: Electricista, Gasfitero, Limpieza" value={especialidad} onChangeText={setEspecialidad} />
          <Text style={styles.label}>Teléfono</Text>
          <TextInput style={styles.input} placeholder="Ej: 987654321" value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" />
          <Text style={styles.label}>Estado</Text>
          <View style={styles.estadoRow}>
            {['pendiente','verificado','suspendido'].map(op => (
              <TouchableOpacity
                key={op}
                style={[styles.estadoBtn, estado === op && styles.estadoBtnActive]}
                onPress={() => setEstado(op)}>
                <Text style={[styles.estadoBtnText, estado === op && styles.estadoBtnTextActive]}>
                  {op.charAt(0).toUpperCase() + op.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.btnPrimary} onPress={registrarTecnico}>
            <Text style={styles.btnText}>Registrar Técnico</Text>
          </TouchableOpacity>
        </View>

        {/* Lista */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Lista de Técnicos</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#2c3e50" />
          ) : tecnicos.length === 0 ? (
            <Text style={styles.emptyText}>No hay técnicos registrados</Text>
          ) : (
            tecnicos.map((t: any) => (
              <View key={t.id} style={styles.tecnicoCard}>
                <Text style={styles.tecNombre}>{t.nombre}</Text>
                <Text style={styles.tecInfo}>📋 {t.especialidad}</Text>
                <Text style={styles.tecInfo}>📞 {t.telefono}</Text>
                <View style={[styles.badge, { backgroundColor: badgeColor(t.estado) }]}>
                  <Text style={styles.badgeText}>{t.estado}</Text>
                </View>
                <View style={styles.actions}>
                  <TouchableOpacity style={styles.btnSuccess} onPress={() => verificar(t.id)}>
                    <Text style={styles.btnText}>Verificar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnWarning} onPress={() => abrirEditar(t)}>
                    <Text style={styles.btnText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnDanger} onPress={() => eliminar(t.id)}>
                    <Text style={styles.btnText}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </View>

      {/* Modal Editar */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <ScrollView style={{ width: '100%' }} contentContainerStyle={{ alignItems: 'center', padding: 20 }}>
            <View style={styles.modalCard}>
              <Text style={styles.cardTitle}>Editar Técnico</Text>
              <Text style={styles.label}>Nombre</Text>
              <TextInput style={styles.input} value={editNombre} onChangeText={setEditNombre} />
              <Text style={styles.label}>Especialidad</Text>
              <TextInput style={styles.input} value={editEspecialidad} onChangeText={setEditEspecialidad} />
              <Text style={styles.label}>Teléfono</Text>
              <TextInput style={styles.input} value={editTelefono} onChangeText={setEditTelefono} keyboardType="phone-pad" />
              <Text style={styles.label}>Estado</Text>
              <View style={styles.estadoRow}>
                {['pendiente','verificado','suspendido'].map(op => (
                  <TouchableOpacity
                    key={op}
                    style={[styles.estadoBtn, editEstado === op && styles.estadoBtnActive]}
                    onPress={() => setEditEstado(op)}>
                    <Text style={[styles.estadoBtnText, editEstado === op && styles.estadoBtnTextActive]}>
                      {op.charAt(0).toUpperCase() + op.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity style={styles.btnPrimary} onPress={guardarEdicion}>
                <Text style={styles.btnText}>Guardar cambios</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btnDanger, { marginTop: 8 }]} onPress={() => setModalVisible(false)}>
                <Text style={styles.btnText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9' },
  header: { backgroundColor: '#2c3e50', padding: 20, paddingTop: 50 },
  headerText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  inner: { padding: 16 },
  msg: { padding: 12, borderRadius: 6, marginBottom: 12 },
  msgOk: { backgroundColor: '#d4edda' },
  msgError: { backgroundColor: '#f8d7da' },
  msgOkText: { color: '#155724', fontSize: 13 },
  msgErrorText: { color: '#721c24', fontSize: 13 },
  card: { backgroundColor: 'white', borderRadius: 10, padding: 16, marginBottom: 16, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50', marginBottom: 12 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 4, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 6, padding: 10, marginBottom: 12, fontSize: 14 },
  estadoRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  estadoBtn: { flex: 1, padding: 8, borderRadius: 6, borderWidth: 1, borderColor: '#ddd', alignItems: 'center' },
  estadoBtnActive: { backgroundColor: '#2c3e50', borderColor: '#2c3e50' },
  estadoBtnText: { fontSize: 12, color: '#555' },
  estadoBtnTextActive: { color: 'white', fontWeight: 'bold' },
  btnPrimary: { backgroundColor: '#2c3e50', padding: 14, borderRadius: 6, alignItems: 'center', marginTop: 4 },
  btnSuccess: { backgroundColor: '#27ae60', padding: 8, borderRadius: 6, flex: 1, alignItems: 'center', marginRight: 6 },
  btnWarning: { backgroundColor: '#f39c12', padding: 8, borderRadius: 6, flex: 1, alignItems: 'center', marginRight: 6 },
  btnDanger: { backgroundColor: '#e74c3c', padding: 8, borderRadius: 6, flex: 1, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 13 },
  tecnicoCard: { borderWidth: 1, borderColor: '#eee', borderRadius: 8, padding: 12, marginBottom: 10 },
  tecNombre: { fontSize: 15, fontWeight: 'bold', marginBottom: 4, color: '#333' },
  tecInfo: { fontSize: 13, color: '#555', marginBottom: 2 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12, marginVertical: 6 },
  badgeText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  actions: { flexDirection: 'row', marginTop: 8 },
  emptyText: { textAlign: 'center', color: '#888', fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center' },
  modalCard: { backgroundColor: 'white', borderRadius: 10, padding: 20, width: '90%', maxWidth: 400 },
});