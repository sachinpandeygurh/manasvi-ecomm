// login 
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

_storeData = async () => {
  try {
    await AsyncStorage.setItem(
      '@MySuperStore:key',
      'I like to save it.',
    );
    console.log('Data stored successfully!');
  } catch (error) {
    console.log(error);
  }
};

_retrieveData = async () => {
  try {
    const value = await AsyncStorage.getItem('@MySuperStore:key');
    if (value !== null) {
      console.log(value);
    }
  } catch (error) {
    console.log(error);
  }
};

_retrieveCart = async () => {
  try {
    const value = await AsyncStorage.getItem('@cart');
    if (value !== null) {
      console.log(value);
    }
  } catch (error) {
    console.log(error);
  }
};

_removeData = async () => {
  try {
    await AsyncStorage.removeItem('@MySuperStore:key');
    console.log('Data removed successfully!');
  } catch (error) {
    console.log(error);
  }
};
_removeCart = async () => {
  try {
    await AsyncStorage.removeItem('@cart');
    console.log('Data removed successfully!');
  } catch (error) {
    console.log(error);
  }
};

export default function checkData() {
  return (
    <View style={styles.container}>
    <Text style={styles.heading}>Login</Text>
    <TouchableOpacity style={styles.button} onPress={_storeData}>
      <Text style={styles.buttonText}>Set data in AsyncStorage</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button} onPress={_retrieveData}>
      <Text style={styles.buttonText}>Get data from AsyncStorage</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button} onPress={_retrieveCart}>
      <Text style={styles.buttonText}>Get data from Cart</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button} onPress={_removeData}>
      <Text style={styles.buttonText}>Remove/delete data from AsyncStorage</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button} onPress={_removeCart}>
      <Text style={styles.buttonText}>Remove/delete data from Cart</Text>
    </TouchableOpacity>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
