import React, { useEffect, useState } from "react";
import { Text, StyleSheet, View, TouchableOpacity, Alert } from "react-native";
import { AsyncStorage } from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import { AntDesign, Feather, EvilIcons, FontAwesome5 } from "@expo/vector-icons";

const Footer = () => {
  const router = useRouter();
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
  }, [auth?.user]);

  const handleHome = () => {
    router.push('(home)');
  };

  const handleCategory = () => {
    router.push('categories');
  };

  const handleNotifications = () => {
  
   router.push(`notifications`)
  };

  const handleAccount = async () => {
    if (auth?.user?.role === 0) {
      Alert.alert(
        "Unauthorized",
        "Sorry, you are not authorized to log in. Please download the Manasvi admin app or visit the Manasvi Ecomm website."
      );
      router.push('(home)');
    } else if (auth?.user === null) {
      router.push('login');
    } else {
      router.push('account');
    }
  };

  const handleCart = () => {
    // Handle navigation logic for Cart
    router.push('cart');
  };

  return (
    <View style={styles.footerContainer}>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={handleHome} style={styles.iconWrapper}>
          <AntDesign name="home" size={24} color="black" />
          <Text style={styles.iconText}>Home</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={handleCategory} style={styles.iconWrapper}>
          <AntDesign name="dropbox" size={24} color="black" />
          <Text style={styles.iconText}>Categories</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={handleNotifications} style={styles.iconWrapper}>
          <Feather name="bell" size={24} color="black" />
          <View style={styles.notificationContainer}>
            <Text style={styles.notificationCount}>01</Text>
          </View>
          <Text style={styles.iconText}>Notifications</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={handleAccount} style={styles.iconWrapper}>
          <FontAwesome5 name="user-circle" size={24} color="black" />
          <Text style={styles.iconText}>Account</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={handleCart} style={styles.iconWrapper}>
          <EvilIcons name="cart" size={24} color="black" />
          <View style={styles.notificationContainer}>
            <Text style={styles.Cart}>100</Text>
          </View>
          <Text style={styles.iconText}>Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    width: "100%",
    backgroundColor: "white",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    bottom: -10,
    zIndex:99
  },
  iconContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  iconWrapper: {
    alignItems: "center",
  },
  notificationContainer: {
    position: "relative",
  },
  notificationCount: {
    fontSize: 9,
    padding: 3,
    fontWeight:"900",
    backgroundColor: "red",
    color: "white",
    borderRadius: 10,
    position: "absolute",
    top: -30,
    right: -20,
  },
  Cart: {
    fontSize: 9,
    padding: 3,
    fontWeight:"bold",
    backgroundColor: "blue",
    color: "white",
    borderRadius: 10,
    position: "absolute",
    top: -30,
    right: -20,
  },
  iconText: {
    fontSize: 9,
    fontWeight: "bold",
  },
});

export default Footer;
