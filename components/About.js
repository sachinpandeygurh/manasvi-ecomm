import React, { useState } from 'react';
import { View, Text, TextInput,  TouchableOpacity, StyleSheet } from 'react-native';
import { Picker as RNPicker } from '@react-native-picker/picker';

const About = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('rewa');

  const handleSubmit = () => {
    console.log('Form submitted:', { name, age, location });
    // Additional logic for form submission
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>About EV Company</Text>
      <Text style={styles.description}>
        Welcome to our EV company! Learn more about our commitment to sustainable transportation.
      </Text>

      {/* <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Age"
          keyboardType="numeric"
          value={age}
          onChangeText={(text) => setAge(text)}
        />
        <RNPicker
          selectedValue={location}
          onValueChange={(itemValue) => setLocation(itemValue)}
          style={styles.picker}
        >
          <RNPicker.Item label="Rewa" value="rewa" />
          <RNPicker.Item label="Bhopal" value="bhopal" />
          <RNPicker.Item label="Indore" value="indore" />
          <RNPicker.Item label="Other City" value="other" />
        </RNPicker>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    //   backgroundColor: '#fff',
    color: 'white',
    marginTop: 40
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
    //   marginBottom: 10,
    color:"#fff"
    },
    description: {
      fontSize: 16,
      marginBottom: 20,
      color: '#555',
    },
    formContainer: {
    //   backgroundColor: '#f5f5f5',
    color: '#fff',
      padding: 20,
      borderRadius: 10,
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 15,
      paddingLeft: 10,
    },
    picker: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 15,
    },
    submitButton: {
      backgroundColor: '#4CAF50',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    submitButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
  });

export default About;
