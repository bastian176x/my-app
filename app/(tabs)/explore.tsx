import { Tabs } from 'expo-router';
import React, { useState } from 'react';
import { Platform, View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Importar Firestore
import { db } from '../../FireConfig';
import { collection, addDoc } from 'firebase/firestore';

export default function TabTwoScreen() {
  const colorScheme = useColorScheme();
  const [text, setText] = useState('');

  // Función para manejar el envío del reporte
  const handleSendReport = async () => {
    try {
      if (!text.trim()) {
        Alert.alert('Error', 'El campo de texto está vacío. Por favor, escribe algo.');
        return;
      }

      // Guardar en Firestore
      await addDoc(collection(db, 'reports'), {
        reportText: text,
        createdAt: new Date().toISOString(),
      });

      Alert.alert('Éxito', 'Reporte enviado exitosamente');
      setText(''); // Limpiar el campo de texto
    } catch (error) {
      console.error('Error al guardar el reporte en Firestore:', error);
      Alert.alert('Error', 'Hubo un problema al enviar el reporte. Intenta nuevamente.');
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Reporta un problema</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Escribe tu reporte aquí..."
          value={text}
          onChangeText={setText}
          placeholderTextColor="#aaa"
          multiline
        />
        <TouchableOpacity style={styles.button} onPress={handleSendReport}>
          <Text style={styles.buttonText}>Enviar Reporte</Text>
        </TouchableOpacity>
      </View>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: 'absolute',
            },
            default: {},
          }),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 16,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
    height: 120,
    textAlignVertical: 'top',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Para sombras en Android
  },
  button: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
