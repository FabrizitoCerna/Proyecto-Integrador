import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { registerCliente, registerEspecialista, getCategorias } from '../service/api';
import { useRouter } from 'expo-router';

export default function Register() {
  const router = useRouter();

  const [tipo, setTipo] = useState<'cliente' | 'especialista'>('cliente');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dni, setDni] = useState('');
  const [telefono, setTelefono] = useState('');

  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [distrito, setDistrito] = useState('');
  const [categorias, setCategorias] = useState<{ id: number; nombre: string }[]>([]);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<number[]>([]);

  useEffect(() => {
    const cargarCategorias = async () => {
      const res = await getCategorias();
      if (!res.error) setCategorias(res.data);
    };
    cargarCategorias();
  }, []);

  const toggleCategoria = (id: number) => {
    if (categoriasSeleccionadas.includes(id)) {
      setCategoriasSeleccionadas(categoriasSeleccionadas.filter(c => c !== id));
    } else {
      if (categoriasSeleccionadas.length >= 2) {
        Alert.alert("Límite", "Solo puedes seleccionar máximo 2 categorías");
        return;
      }
      setCategoriasSeleccionadas([...categoriasSeleccionadas, id]);
    }
  };

  const handleRegister = async () => {
    if (!nombre || !email || !password || !dni || !telefono) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }
    if (dni.length !== 8) {
      Alert.alert("Error", "El DNI debe tener 8 dígitos");
      return;
    }
    if (telefono.length !== 9) {
      Alert.alert("Error", "El teléfono debe tener 9 dígitos");
      return;
    }

    if (tipo === 'cliente') {
      const res = await registerCliente(nombre, email, password, dni, telefono);
      if (res.error) {
        Alert.alert("Error", typeof res.message === 'string' ? res.message : "Error al registrar");
      } else {
        Alert.alert("¡Registro exitoso!", "Ya puedes iniciar sesión");
        router.push('/');
      }
    } else {
      if (!descripcion || !precio || !distrito) {
        Alert.alert("Error", "Completa todos los campos del especialista");
        return;
      }
      if (categoriasSeleccionadas.length === 0) {
        Alert.alert("Error", "Selecciona al menos 1 categoría");
        return;
      }

      const res = await registerEspecialista(
        nombre, email, password, dni, telefono,
        descripcion, parseFloat(precio), distrito,
        categoriasSeleccionadas
      );

      if (res.error) {
        Alert.alert("Error", typeof res.message === 'string' ? res.message : "Error al registrar");
      } else {
        Alert.alert("¡Registro exitoso!", "Ya puedes iniciar sesión");
        router.push('/');
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registro</Text>

      <View style={styles.tipoContainer}>
        <TouchableOpacity
          style={[styles.tipoBtn, tipo === 'cliente' && styles.tipoBtnActivo]}
          onPress={() => setTipo('cliente')}
        >
          <Text style={[styles.tipoTxt, tipo === 'cliente' && styles.tipoTxtActivo]}>Cliente</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tipoBtn, tipo === 'especialista' && styles.tipoBtnActivo]}
          onPress={() => setTipo('especialista')}
        >
          <Text style={[styles.tipoTxt, tipo === 'especialista' && styles.tipoTxtActivo]}>Especialista</Text>
        </TouchableOpacity>
      </View>

      <TextInput placeholder="Nombre completo" placeholderTextColor="#727272" value={nombre} onChangeText={setNombre} style={styles.input} />
      <TextInput placeholder="Email" placeholderTextColor="#727272" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Contraseña" placeholderTextColor="#727272" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
      <TextInput placeholder="DNI (8 dígitos)" placeholderTextColor="#727272" value={dni} onChangeText={setDni} style={styles.input} keyboardType="numeric" maxLength={8} />
      <TextInput placeholder="Teléfono (9 dígitos)" placeholderTextColor="#727272" value={telefono} onChangeText={setTelefono} style={styles.input} keyboardType="numeric" maxLength={9} />

      {tipo === 'especialista' && (
        <>
          <TextInput placeholder="Descripción de tu servicio" placeholderTextColor="#727272" value={descripcion} onChangeText={setDescripcion} style={styles.input} multiline />
          <TextInput placeholder="Precio referencial (S/.)" placeholderTextColor="#727272" value={precio} onChangeText={setPrecio} style={styles.input} keyboardType="numeric" />
          <TextInput placeholder="Distrito donde trabajas" placeholderTextColor="#727272" value={distrito} onChangeText={setDistrito} style={styles.input} />

          <Text style={styles.label}>Categorías</Text>

          <View style={styles.categoriasContainer}>
            {categorias.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoriaBtn,
                  categoriasSeleccionadas.includes(cat.id) && styles.categoriaBtnActivo
                ]}
                onPress={() => toggleCategoria(cat.id)}
              >
                <Text style={[
                  styles.categoriaTxt,
                  categoriasSeleccionadas.includes(cat.id) && styles.categoriaTxtActivo
                ]}>
                  {cat.nombre}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      <TouchableOpacity style={styles.btnRegistrar} onPress={handleRegister}>
        <Text style={styles.btnTxt}>Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/')}>
        <Text style={styles.linkLogin}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#0F0F0F',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 24
  },

  tipoContainer: {
    flexDirection: 'row',
    backgroundColor: '#181818',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden'
  },

  tipoBtn: {
    paddingVertical: 10,
    paddingHorizontal: 30
  },

  tipoBtnActivo: {
    backgroundColor: '#1DB954'
  },

  tipoTxt: {
    color: '#aaa',
    fontWeight: '700'
  },

  tipoTxtActivo: {
    color: '#000'
  },

  input: {
    width: '100%',
    backgroundColor: '#181818',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#2a2a2a'
  },

  label: {
    color: '#1DB954',
    fontWeight: '700',
    alignSelf: 'flex-start',
    marginBottom: 10
  },

  categoriasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
    width: '100%'
  },

  categoriaBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1DB954',
    backgroundColor: '#181818'
  },

  categoriaBtnActivo: {
    backgroundColor: '#1DB954'
  },

  categoriaTxt: {
    color: '#1DB954'
  },

  categoriaTxtActivo: {
    color: '#000',
    fontWeight: '700'
  },

  btnRegistrar: {
    width: '100%',
    backgroundColor: '#1DB954',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10
  },

  btnTxt: {
    color: '#000',
    fontWeight: '800'
  },

  linkLogin: {
    marginTop: 15,
    color: '#1DB954',
    fontWeight: '700'
  }
});