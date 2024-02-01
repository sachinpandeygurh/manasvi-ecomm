import React, { useEffect, useState } from "react";
import { Text, StyleSheet, View, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import { AntDesign, Feather, EvilIcons, FontAwesome5 } from "@expo/vector-icons";

const Footer = () => {
  const router = useRouter();
  const [auth, setAuth] = useState(null);
  const [cartSize, setCartSize] = useState(0);
  const [cartArray, setCartArray] = useState([])

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


  const retrieveCart = async () => {
    try {
      const storedValue = await AsyncStorage.getItem('@cart') 
      console.log("storedValue", storedValue);
      setCartArray(storedValue)
      if (storedValue !== null) {
        const cartData = storedValue ? JSON.parse(storedValue) : [];
        setCartSize(cartData.length);
      }
    } catch (error) {
      console.log(error);
    }
  };
console.log("cartSize", cartSize);
  useEffect(() => {
    retrieveData();
    retrieveCart();
  }, [auth?.user, cartArray]);

  const handleHome = () => {
    router.push('(home)');
  };

  const handleCategory = () => {
    router.push('categories');
  };

  const handleNotifications = () => {
    router.push('notifications');
  };

  const handleAccount = () => {
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
    router.push('cart');
  };

  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity onPress={handleHome} style={styles.iconContainer}>
        <AntDesign name="home" size={24} color="black" />
        <Text style={styles.iconText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleCategory} style={styles.iconContainer}>
        <AntDesign name="dropbox" size={24} color="black" />
        <Text style={styles.iconText}>Categories</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleNotifications} style={styles.iconContainer}>
        <Feather name="bell" size={24} color="black" />
        <View style={styles.notificationContainer}>
          <Text style={styles.notificationCount}>01</Text>
        </View>
        <Text style={styles.iconText}>Notifications</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleAccount} style={styles.iconContainer}>
        <FontAwesome5 name="user-circle" size={24} color="black" />
        <Text style={styles.iconText}>Account</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleCart} style={styles.iconContainer}>
        <EvilIcons name="cart" size={24} color="black" />
        <View style={styles.notificationContainer}>
          <Text style={styles.Cart}>{cartSize}</Text>
        </View>
        <Text style={styles.iconText}>Cart</Text>
      </TouchableOpacity>
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
    fontSize: 11,
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