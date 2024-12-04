import React, { useEffect, useState } from 'react';
import { Button, ActivityIndicator, Alert, StyleSheet, View, ImageBackground } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// Importaciones para autenticación y Firestore
import { auth, db } from '../../FireConfig';
import { User, onAuthStateChanged, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import * as Linking from 'expo-linking';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

export default function HomeScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'https',
    path: 'auth',

  });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: '134101858396-0vokoc6kflfcpacflj5s45lao6ecqgms.apps.googleusercontent.com',
      redirectUri,
      scopes: ['profile', 'email'],
    },
    discovery
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authenticatedUser) => {
      setUser(authenticatedUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);

      signInWithCredential(auth, credential)
        .then(async (userCredential) => {
          const loggedUser = userCredential.user;
          const userDocRef = doc(db, 'users', loggedUser.uid);
          await setDoc(userDocRef, {
            displayName: loggedUser.displayName || 'Usuario desconocido',
            email: loggedUser.email || 'Sin email',
            photoURL: loggedUser.photoURL || null,
            lastLogin: new Date().toISOString(),
          });
          setUser(loggedUser);
          Alert.alert('Éxito', 'Inicio de sesión exitoso');
        })
        .catch((error) => {
          console.error('Error en el inicio de sesión: ', error);
          Alert.alert('Error', 'Hubo un problema al iniciar sesión.');
        });
    }
  }, [response]);

  // Listener para manejar enlaces profundos
  useEffect(() => {
    const handleDeepLink = (event: Linking.EventType) => {
      const data = Linking.parse(event.url);
      console.log('Deep link data:', data);
    };

    const linkingEvent = Linking.addEventListener('url', handleDeepLink);

    return () => {
      linkingEvent.remove();
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FFA500" />
        <ThemedText style={{ marginTop: 10, color: '#FFF' }}>Verificando sesión...</ThemedText>
      </View>
    );
  }

  if (!user) {
    return (
      <ImageBackground
        source={require('@/assets/images/cielon2.jpg')}
        style={styles.background}
      >
        <View style={styles.overlay}>
          <ThemedText type="title" style={styles.title}>Bienvenido a</ThemedText>
          <ThemedText type="title" style={styles.titleHighlight}>Ciudad Activa</ThemedText>
          <ThemedView style={styles.buttonContainer}>
            <Button
              title="Iniciar sesión con Google"
              onPress={() => promptAsync()}
              color="#FFA500"
              disabled={!request}
            />
          </ThemedView>
        </View>
      </ImageBackground>
    );
  }

  return (
    <View style={styles.centered}>
      <ThemedText style={{ color: '#FFF', fontSize: 24 }}>Hola, {user.displayName || 'Usuario'}</ThemedText>
      <ThemedText style={{ color: '#FFF', fontSize: 18 }}>Email: {user.email}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: 'cover' },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: { fontSize: 32, color: '#FFFFFF', fontFamily: 'sans-serif-light' },
  titleHighlight: { fontSize: 40, color: '#FFA500', fontFamily: 'sans-serif-medium', marginBottom: 40 },
  buttonContainer: { width: '80%', marginTop: 20 },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
});
