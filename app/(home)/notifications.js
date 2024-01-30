import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import Footer from '../../components/Footer';

const Notifications = () => {
  const router = useRouter();
  const offers = [
    'New Offer! Get 20% off on selected items.',
    'Your order has been shipped.',
    // Add more offers as needed
  ];
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('(home)')}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Notifications</Text>
      </View>
      <View style={styles.notificationList}>
        {offers.map((offer, index) => (
          <Pressable  onPress={() => router.push('(home)')} key={index} style={styles.notificationItem}>
          <Text style={{color: "white"}}> {offer}
            </Text>  
            {/* <Text >Get</Text> */}
          </Pressable>
        ))}
      </View>
      <Footer/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  notificationList: {
    flex: 1,
  },
  notificationItem: {
    fontSize: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    backgroundColor:"gray",
    borderRadius:10,
  },
 
  
});

export default Notifications;
