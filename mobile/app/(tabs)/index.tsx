import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';

import { useRouter } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import { loginUser } from '../service/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function Index() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }

    setIsLoading(true);
    const res = await loginUser(email, password);
    setIsLoading(false);

    if (res.error) {
      Alert.alert(
        'Error',
        typeof res.message === 'string'
          ? res.message
          : 'Error al iniciar sesión'
      );
    } else {
      await AsyncStorage.setItem('usuario', JSON.stringify(res.data));

      if (res.data.tipo === 'cliente') {
        router.replace('/(tabs)/home-cliente' as any);
      } else if (res.data.tipo === 'especialista') {
        router.replace('/(tabs)/home-especialista' as any);
      } else {
        router.replace('/(tabs)/home-admin' as any);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.header}>
          <View style={styles.logo}>
            <View style={styles.logoBg} />
            <Text style={styles.logoText}>H</Text>
          </View>
          <Text style={styles.appName}>HomeServices</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Bienvenido</Text>
          <Text style={styles.subtitle}>
            Accede a tu cuenta para continuar
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={[styles.inputWrapper, emailFocused && styles.inputFocused]}>
            <Text style={styles.inputLabel}>Correo electrónico</Text>
            <TextInput
              placeholder="tu@email.com"
              placeholderTextColor="#A0A0A0"
              value={email}
              onChangeText={setEmail}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />
          </View>

          <View style={[styles.inputWrapper, passwordFocused && styles.inputFocused]}>
            <Text style={styles.inputLabel}>Contraseña</Text>
            <TextInput
              placeholder="••••••••"
              placeholderTextColor="#A0A0A0"
              value={password}
              secureTextEntry
              onChangeText={setPassword}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              style={styles.input}
              editable={!isLoading}
            />
          </View>

          <TouchableOpacity
            style={[styles.btnLogin, isLoading && styles.btnLoginDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Text style={styles.btnTxt}>
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>¿No tienes cuenta?</Text>
          <TouchableOpacity
            onPress={() => router.push('/register' as any)}
            disabled={isLoading}
          >
            <Text style={styles.linkRegistro}>Regístrate aquí</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  content: {
    width: '100%',
  },

  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },

  logo: {
    width: 90,
    height: 90,
    borderRadius: 24,
    backgroundColor: '#1DB954',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,

    shadowColor: '#1DB954',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },

  logoBg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 24,
    backgroundColor: '#ffffff',
    opacity: 0.08,
  },

  logoText: {
    fontSize: 40,
    fontWeight: '800',
    color: '#000',
  },

  appName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },

  section: {
    marginBottom: 34,
  },

  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 10,
    letterSpacing: -1,
  },

  subtitle: {
    fontSize: 15,
    color: '#A0A0A0',
    fontWeight: '400',
    lineHeight: 22,
  },

  formContainer: {
    marginBottom: 30,
  },

  inputWrapper: {
    marginBottom: 18,
    borderRadius: 16,
    backgroundColor: '#181818',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },

  inputFocused: {
    borderColor: '#1DB954',

    shadowColor: '#1DB954',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },

  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1DB954',
    paddingHorizontal: 16,
    paddingTop: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '500',
  },

  btnLogin: {
    backgroundColor: '#1DB954',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,

    shadowColor: '#1DB954',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },

  btnLoginDisabled: {
    opacity: 0.7,
  },

  btnTxt: {
    color: '#000',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },

  footerText: {
    fontSize: 14,
    color: '#A0A0A0',
    fontWeight: '500',
  },

  linkRegistro: {
    fontSize: 14,
    color: '#1DB954',
    fontWeight: '700',
  },
});
