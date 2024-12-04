import React, { useState } from 'react';
import { TextInput, Button, Alert, StyleSheet, View, ImageBackground } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// Importa Firestore y funciones relacionadas
import { db } from '../../FireConfig'; // Ajusta la ruta según la ubicación de tu archivo FireConfig.js
import { collection, addDoc } from 'firebase/firestore';

export default function HomeScreen() {
  const [inputValue, setInputValue] = useState('');

  const addCustomData = async () => {
    if (!inputValue.trim()) {
      Alert.alert('Error', 'Por favor ingresa un dato válido.');
      return;
    }

    try {
      // Referencia a la colección 'testCollection'
      const docRef = await addDoc(collection(db, 'testCollection'), {
        value: inputValue,
        createdAt: new Date(),
      });
      Alert.alert('Éxito', `Dato añadido con ID: ${docRef.id}`);
      setInputValue(''); // Limpiar el campo después de guardar
    } catch (e) {
      console.error('Error añadiendo el documento: ', e);
      Alert.alert('Error', 'Hubo un problema al guardar el dato.');
    }
  };

  return (
    <ImageBackground
      source={require('@/assets/images/cielon2.jpg')} // Asegúrate de tener una imagen en esta ruta
      style={styles.background}
    >
      <View style={styles.overlay}>
        <ThemedText type="title" style={styles.title}>
          Bienvenido a
        </ThemedText>
        <ThemedText type="title" style={styles.titleHighlight}>
          Ciudad Activa
        </ThemedText>

        {/* Campo de entrada */}
        <ThemedView style={styles.inputContainer}>
          <ThemedText type="subtitle" style={styles.subtitle}>
            Ingresa un dato:
          </ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Escribe algo..."
            placeholderTextColor="#ccc"
            value={inputValue}
            onChangeText={setInputValue}
          />
          <Button title="Guardar en Firestore" onPress={addCustomData} color="#FFA500" />
        </ThemedView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Oscurece el fondo para mejor legibilidad
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 32,
    color: '#FFFFFF',
    fontFamily: 'sans-serif-light', // Puedes cambiar el tipo de letra
  },
  titleHighlight: {
    fontSize: 40,
    color: '#FFA500',
    fontFamily: 'sans-serif-medium', // Puedes cambiar el tipo de letra
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'sans-serif',
  },
  inputContainer: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#FFA500',
    padding: 12,
    borderRadius: 8,
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 16,
  },
});
