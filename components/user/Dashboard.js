import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Dashboard = () => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const retrieveData = async () => {
      try {
        const value = await AsyncStorage.getItem('@MySuperStore:key');
        if (value !== null) {
        
          const authData = JSON.parse(value);
          setAuth(authData);
        }
      } catch (error) {
        console.error(error);
      }
    };

    retrieveData();
  }, []);
// if(auth?.user?.role!==0){
// Alert.Alert("Sorry you are not authurise to login please download to Manasvi admin app Admin app or visit manasvi ecomm website ")

// }

  return (
    <View style={styles.container}>
      <View style={styles.column}>
        <View style={{ padding: 20 }}>
          <Text style={{ fontWeight: 'bold' , fontSize:20}}>About {auth?.user?.name}</Text>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.card}>
            <Text style={styles.heading}>User Name: {auth?.user?.name}</Text>
            <View style={styles.hr} />
            <Text style={styles.heading}>User Email: {auth?.user?.email}</Text>
            <View style={styles.hr} />
            <Text style={styles.heading}>User Number: {auth?.user?.phone}</Text>
            <View style={styles.hr} />
            <Text style={styles.heading}>User Address: {auth?.user?.address}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  column: {
    flex: 1,
    flexDirection: 'column',
    fontWeight: "bold",
    alignItems:"center",
   
  },
  sidebar: {
    flex: 1,
    marginTop: 15,
  },
  mainContent: {
    flex: 2,
    width:350
  },
  card: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  heading: {
    fontWeight: 'bold',
  },
  hr: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 8,
  },
});

export default Dashboard;
