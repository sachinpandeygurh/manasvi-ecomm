import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const Signup = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [answer, setAnswer] = useState('');
  const route = useRouter();

  const handleSubmit = async () => {
    try {
      const res = await axios.post('https://your-api-url/api/v1/auth/register', {
        name,
        email,
        password,
        phone,
        address,
        answer,
      });

      if (res && res.data.success) {
        Alert.alert('Success', res.data.message);
        await AsyncStorage.setItem('@MySuperStore:key', JSON.stringify(res?.data?.user?._id));
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', res.data.message);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>REGISTER FORM</Text>

      <TextInput
        value={name}
        onChangeText={(text) => setName(text)}
        style={styles.input}
        placeholder="Your Name"
      />

      <TextInput
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={styles.input}
        placeholder="Enter Your Email"
      />

      <TextInput
        value={password}
        onChangeText={(text) => setPassword(text)}
        style={styles.input}
        placeholder="Your Password"
        secureTextEntry
      />

      <TextInput
        value={phone}
        onChangeText={(text) => setPhone(text)}
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="numeric"
      />

      <TextInput
        value={address}
        onChangeText={(text) => setAddress(text)}
        style={styles.input}
        placeholder="Address"
      />

      <TextInput
        value={answer}
        onChangeText={(text) => setAnswer(text)}
        style={styles.input}
        placeholder="Favorite sports"
      />

      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>REGISTER</Text>
      </TouchableOpacity>

       <Text>
        Existing User?{' '}
        <Text
          style={styles.linkText}
          onPress={() =>   route.push('login')}
        >
          Log in
        </Text>
      </Text>

      <Text>
        <Text style={styles.linkText} onPress={() => Linking.openURL('https://manasvimart.in/policy')}>
          Terms of Use
        </Text>{' '}
        and{' '}
        <Text style={styles.linkText} onPress={() => Linking.openURL('https://manasvimart.in/policy')}>
          Privacy Policy
        </Text>
        .
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    width: '100%',
  },
  button: {
    backgroundColor: '#ffa502',
    borderRadius: 80,
    padding: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  linkText: {
    textDecorationLine: 'underline',
    color: 'blue',
  },
});

export default Signup;
