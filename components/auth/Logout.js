import React from 'react';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";

export default function Logout() {
    const router = useRouter();
  const _removeData = async () => {
    try {
      await AsyncStorage.removeItem('@MySuperStore:key');
      Alert.alert('User Logout successfully!');
      router.push('(home)');
    } catch (error) {
      console.error(error);
    }

  };

  return (
    <Pressable style={styles.logoutButton} onPress={_removeData}>
      <Text style={styles.buttonText}>Logout</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
