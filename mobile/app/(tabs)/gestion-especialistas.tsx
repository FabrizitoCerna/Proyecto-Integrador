import { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator, ScrollView, Modal
} from 'react-native';
import { useRouter } from 'expo-router';

const API_URL = 'http://192.168.18.163:8080';
const router = useRouter();

export default function GestionEspecialistas() {
  const [especialistas, setEspecialistas] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [msgTipo, setMsgTipo] = useState('');
  const [paso, setPaso] = useState(1);

  // Paso 1
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dni, setDni] = useState('');
  const [telefono, setTelefono] = useState('');

  // Paso 2
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [distrito, setDistrito] = useState('');
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<number[]>([]);

  // Modal editar
  const [modalVisible, setModalVisible] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editDescripcion, setEditDescripcion] = useState('');
  const [editPrecio, setEditPrecio] = useState('');
  const [editDistrito, setEditDistrito] = useState('');
  const [editDisponible, setEditDisponible] = useState(true);

  useEffect(() => {
    cargarEspecialistas();
    cargarCategorias();
  }, []);

  function mostrarMsg(texto: string, tipo: string) {
    setMsg(texto);
    setMsgTipo(tipo);
    setTimeout(() => setMsg(''), 3000);
  }

  async function cargarEspecialistas() {
    try {
      const res = await fetch(`${API_URL}/especialistas`);
      const data = await res.json() as any[];
      setEspecialistas(data);
    } catch (e) {
      mostrarMsg('Error al conectar con el servidor', 'error');
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

  function toggleCategoria(id: number) {
    if (categoriasSeleccionadas.includes(id)) {
      setCategoriasSeleccionadas(categoriasSeleccionadas.filter(c => c !== id));
    } else {
      if (categoriasSeleccionadas.length >= 2) {
        mostrarMsg('Máximo 2 categorías permitidas.', 'error');
        return;
      }
      setCategoriasSeleccionadas([...categoriasSeleccionadas, id]);
    }
  }

  async function siguientePaso() {
    if (!nombre || !email || !password || !dni || !telefono) {
      mostrarMsg('Completa todos los campos.', 'error');
      return;
    }
    if (dni.length !== 8) { mostrarMsg('El DNI debe tener 8 dígitos.', 'error'); return; }
    if (telefono.length !== 9) { mostrarMsg('El teléfono debe tener 9 dígitos.', 'error'); return; }
    if (password.length < 6) { mostrarMsg('La contraseña debe tener mínimo 6 caracteres.', 'error'); return; }
    setPaso(2);
  }

  async function registrarEspecialista() {
    if (!descripcion || !precio || !distrito) {
      mostrarMsg('Completa todos los campos.', 'error');
      return;
    }
    if (categoriasSeleccionadas.length === 0) {
      mostrarMsg('Selecciona al menos 1 categoría.', 'error');
      return;
    }
    try {
      const resUsuario = await fetch(`${API_URL}/usuarios/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password, dni, telefono, tipo: 'especialista' })
      });
      if (!resUsuario.ok) {
        const error = await resUsuario.text();
        mostrarMsg(error, 'error');
        return;
      }
      const nuevoUsuario = await resUsuario.json();
      const resEsp = await fetch(`${API_URL}/especialistas/crear/${nuevoUsuario.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descripcion, precioReferencial: parseFloat(precio), distrito, categoriaIds: categoriasSeleccionadas })
      });
      if (resEsp.ok) {
        mostrarMsg('Especialista registrado correctamente.', 'ok');
        setPaso(1);
        setNombre(''); setEmail(''); setPassword(''); setDni(''); setTelefono('');
        setDescripcion(''); setPrecio(''); setDistrito('');
        setCategoriasSeleccionadas([]);
        cargarEspecialistas();
      } else {
        const error = await resEsp.text();
        mostrarMsg(error, 'error');
      }
    } catch (e) {
      mostrarMsg('No se pudo conectar con el servidor.', 'error');
    }
  }

  function abrirEditar(e: any) {
    setEditId(e.id);
    setEditDescripcion(e.descripcion || '');
    setEditPrecio(e.precioReferencial?.toString() || '');
    setEditDistrito(e.distrito || '');
    setEditDisponible(e.disponible);
    setModalVisible(true);
  }

  async function guardarEdicion() {
    try {
      const res = await fetch(`${API_URL}/especialistas/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descripcion: editDescripcion, precioReferencial: parseFloat(editPrecio), distrito: editDistrito, disponible: editDisponible })
      });
      if (res.ok) {
        mostrarMsg('Especialista actualizado.', 'ok');
        setModalVisible(false);
        cargarEspecialistas();
      } else {
        mostrarMsg('Error al actualizar.', 'error');
      }
    } catch (e) {
      mostrarMsg('No se pudo conectar con el servidor.', 'error');
    }
  }

  async function eliminar(id: number) {
    Alert.alert('Confirmar', '¿Eliminar este especialista?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive', onPress: async () => {
          await fetch(`${API_URL}/especialistas/${id}`, { method: 'DELETE' });
          cargarEspecialistas();
        }
      }
    ]);
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.replace('/dashboard-admin')} style={styles.backBtn}>
                <Text style={styles.backText}>← Volver</Text>
            </TouchableOpacity>
          <Text style={styles.headerText}>🔧 Gestión de Especialistas</Text>
        </View>

        <View style={styles.inner}>
          {msg !== '' && (
            <View style={[styles.msg, msgTipo === 'ok' ? styles.msgOk : styles.msgError]}>
              <Text style={msgTipo === 'ok' ? styles.msgOkText : styles.msgErrorText}>{msg}</Text>
            </View>
          )}

          {/* Formulario por pasos */}
          <View style={styles.card}>
            {/* Indicador de pasos */}
            <View style={styles.pasoIndicador}>
              <View style={[styles.pasoCirculo, paso >= 1 && styles.pasoCirculoActivo]}>
                <Text style={[styles.pasoNum, paso >= 1 && styles.pasoNumActivo]}>1</Text>
              </View>
              <View style={[styles.pasoLinea, paso >= 2 && styles.pasoLineaActiva]} />
              <View style={[styles.pasoCirculo, paso >= 2 && styles.pasoCirculoActivo]}>
                <Text style={[styles.pasoNum, paso >= 2 && styles.pasoNumActivo]}>2</Text>
              </View>
            </View>
            <Text style={styles.pasoTitulo}>
              {paso === 1 ? 'Paso 1 — Datos del usuario' : 'Paso 2 — Perfil del especialista'}
            </Text>

            {paso === 1 ? (
              <>
                <TextInput style={styles.input} placeholder="Nombre completo" value={nombre} onChangeText={setNombre} />
                <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                <TextInput style={styles.input} placeholder="Contraseña (mín. 6 caracteres)" value={password} onChangeText={setPassword} secureTextEntry />
                <TextInput style={styles.input} placeholder="DNI (8 dígitos)" value={dni} onChangeText={setDni} keyboardType="numeric" maxLength={8} />
                <TextInput style={styles.input} placeholder="Teléfono (9 dígitos)" value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" maxLength={9} />
                <TouchableOpacity style={styles.btnPrimary} onPress={siguientePaso}>
                  <Text style={styles.btnText}>Siguiente →</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TextInput style={[styles.input, { height: 80, textAlignVertical: 'top' }]} placeholder="Descripción del servicio" value={descripcion} onChangeText={setDescripcion} multiline numberOfLines={3} />
                <TextInput style={styles.input} placeholder="Precio referencial (S/.)" value={precio} onChangeText={setPrecio} keyboardType="numeric" />
                <TextInput style={styles.input} placeholder="Distrito donde trabaja" value={distrito} onChangeText={setDistrito} />
                <Text style={styles.label}>Categorías (mín. 1, máx. 2):</Text>
                {categorias.length === 0 ? (
                  <Text style={styles.emptyText}>No hay categorías disponibles</Text>
                ) : (
                  <View style={styles.categoriasGrid}>
                    {categorias.map((c: any) => (
                      <TouchableOpacity
                        key={c.id}
                        style={[styles.categoriaBtn, categoriasSeleccionadas.includes(c.id) && styles.categoriaBtnActivo]}
                        onPress={() => toggleCategoria(c.id)}>
                        <Text style={[styles.categoriaTxt, categoriasSeleccionadas.includes(c.id) && styles.categoriaTxtActivo]}>
                          {c.nombre}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                <View style={styles.botonesRow}>
                  <TouchableOpacity style={[styles.btnSecondary, { flex: 1, marginRight: 8 }]} onPress={() => setPaso(1)}>
                    <Text style={styles.btnSecondaryText}>← Atrás</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.btnPrimary, { flex: 1 }]} onPress={registrarEspecialista}>
                    <Text style={styles.btnText}>Registrar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>

          {/* Lista de especialistas */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Lista de Especialistas</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#4A90E2" />
            ) : especialistas.length === 0 ? (
              <Text style={styles.emptyText}>No hay especialistas registrados</Text>
            ) : (
              especialistas.map((e: any) => (
                <View key={e.id} style={styles.especialistaCard}>
                  <Text style={styles.espNombre}>{e.usuario?.nombre || 'Sin nombre'}</Text>
                  <Text style={styles.espInfo}>📍 {e.distrito}</Text>
                  <Text style={styles.espInfo}>💰 S/ {e.precioReferencial}</Text>
                  <Text style={styles.espInfo}>📋 {e.descripcion}</Text>
                  <View style={[styles.badge, { backgroundColor: e.disponible ? '#27ae60' : '#e74c3c' }]}>
                    <Text style={styles.badgeText}>{e.disponible ? 'Disponible' : 'No disponible'}</Text>
                  </View>
                  <View style={styles.categoriasRow}>
                    {e.categorias?.map((c: any) => (
                      <View key={c.id} style={styles.categoriaTag}>
                        <Text style={styles.categoriaTagText}>{c.nombre}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={styles.actions}>
                    <TouchableOpacity style={styles.btnWarning} onPress={() => abrirEditar(e)}>
                      <Text style={styles.btnText}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnDanger} onPress={() => eliminar(e.id)}>
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
                <Text style={styles.cardTitle}>Editar Especialista</Text>
                <TextInput style={styles.input} placeholder="Descripción" value={editDescripcion} onChangeText={setEditDescripcion} />
                <TextInput style={styles.input} placeholder="Precio (S/.)" value={editPrecio} onChangeText={setEditPrecio} keyboardType="numeric" />
                <TextInput style={styles.input} placeholder="Distrito" value={editDistrito} onChangeText={setEditDistrito} />
                <Text style={styles.label}>Disponibilidad</Text>
                <View style={styles.botonesRow}>
                  {[true, false].map(op => (
                    <TouchableOpacity
                      key={op.toString()}
                      style={[styles.categoriaBtn, { flex: 1, marginRight: op ? 8 : 0 }, editDisponible === op && styles.categoriaBtnActivo]}
                      onPress={() => setEditDisponible(op)}>
                      <Text style={[styles.categoriaTxt, editDisponible === op && styles.categoriaTxtActivo]}>
                        {op ? 'Disponible' : 'No disponible'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity style={[styles.btnPrimary, { marginTop: 8 }]} onPress={guardarEdicion}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  header: { backgroundColor: '#4A90E2', padding: 20, paddingTop: 50 },
  headerText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  inner: { padding: 16 },
  msg: { padding: 12, borderRadius: 8, marginBottom: 12 },
  msgOk: { backgroundColor: '#d4edda' },
  msgError: { backgroundColor: '#f8d7da' },
  msgOkText: { color: '#155724', fontSize: 13 },
  msgErrorText: { color: '#721c24', fontSize: 13 },
  card: { backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 16, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 12 },
  pasoIndicador: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  pasoCirculo: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: '#ddd', justifyContent: 'center', alignItems: 'center' },
  pasoCirculoActivo: { backgroundColor: '#4A90E2', borderColor: '#4A90E2' },
  pasoNum: { fontSize: 14, color: '#aaa', fontWeight: 'bold' },
  pasoNumActivo: { color: 'white' },
  pasoLinea: { flex: 1, height: 2, backgroundColor: '#ddd', marginHorizontal: 8 },
  pasoLineaActiva: { backgroundColor: '#4A90E2' },
  pasoTitulo: { fontSize: 15, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 12, textAlign: 'center' },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#333' },
  input: { width: '100%', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 15, backgroundColor: '#fafafa' },
  botonesRow: { flexDirection: 'row', marginTop: 4 },
  btnPrimary: { backgroundColor: '#4A90E2', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 4 },
  btnSecondary: { backgroundColor: 'white', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 4, borderWidth: 1, borderColor: '#4A90E2' },
  btnSecondaryText: { color: '#4A90E2', fontWeight: 'bold', fontSize: 13 },
  btnWarning: { backgroundColor: '#f39c12', padding: 8, borderRadius: 8, flex: 1, alignItems: 'center', marginRight: 6 },
  btnDanger: { backgroundColor: '#e74c3c', padding: 8, borderRadius: 8, flex: 1, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 13 },
  especialistaCard: { borderWidth: 1, borderColor: '#eee', borderRadius: 10, padding: 12, marginBottom: 10 },
  espNombre: { fontSize: 15, fontWeight: 'bold', marginBottom: 4, color: '#1a1a1a' },
  espInfo: { fontSize: 13, color: '#555', marginBottom: 2 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12, marginVertical: 6 },
  badgeText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  categoriasRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  categoriaTag: { backgroundColor: '#e8f0fe', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  categoriaTagText: { fontSize: 12, color: '#4A90E2', fontWeight: '600' },
  categoriasGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  categoriaBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: '#4A90E2', backgroundColor: 'white' },
  categoriaBtnActivo: { backgroundColor: '#4A90E2' },
  categoriaTxt: { color: '#4A90E2', fontWeight: '500' },
  categoriaTxtActivo: { color: 'white' },
  actions: { flexDirection: 'row', marginTop: 8 },
  emptyText: { textAlign: 'center', color: '#888', fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center' },
  modalCard: { backgroundColor: 'white', borderRadius: 12, padding: 20, width: '90%', maxWidth: 400 },
  backBtn: { marginBottom: 8 },
  backText: { color: 'white', fontSize: 14 }
});