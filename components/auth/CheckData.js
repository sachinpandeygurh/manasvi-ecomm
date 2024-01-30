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

_removeData = async () => {
  try {
    await AsyncStorage.removeItem('@MySuperStore:key');
    console.log('Data removed successfully!');
  } catch (error) {
    console.log(error);
  }
};

export default function checkData() {
  return (
    <View>
      <Text>Login</Text>
      <TouchableOpacity onPress={_storeData}>
        <Text>Set data in AsyncStorage</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={_retrieveData}>
        <Text>Get data from AsyncStorage</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={_removeData}>
        <Text>Remove/delete data from AsyncStorage</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({});
