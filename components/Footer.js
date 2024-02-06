import React, { useEffect, useState } from "react";
import { Text, StyleSheet, View, TouchableOpacity, Alert, Reload } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import { AntDesign, Feather, EvilIcons, FontAwesome5 } from "@expo/vector-icons";

const Footer = () => {
  const router = useRouter();
  const [auth, setAuth] = useState(null);
  const [cartArray, setCartArray] = useState([]);
  const [cartSize, setCartSize] = useState(0);
  
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
      const storedValue = await AsyncStorage.getItem('@cart');
      if (storedValue !== null) {
        const cartData = JSON.parse(storedValue);
        const updatedCartWithoutEmpty = cartData.filter((item) => Object.keys(item).length !== 0);
  
        setCartSize(cartData.length);
        setCartArray(updatedCartWithoutEmpty);
      } else {
        setCartSize(0);
        setCartArray([]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const removetocart = async () => {
    try {
      const storedValue = await AsyncStorage.getItem('@cart');
      const cartData = storedValue ? JSON.parse(storedValue) : [];
  
      const uniqueProductIds = [];
      const filteredCart = cartData.filter((item) => {
        if (Object.keys(item).length !== 0) {
          if (!uniqueProductIds.includes(item.productId)) {
            uniqueProductIds.push(item.productId);
            return true; // Include the first occurrence of each product ID
          }
        }
        return false; // Exclude non-duplicate items
      });
  
      await AsyncStorage.setItem('@cart', JSON.stringify(filteredCart));
      // console.log("filteredCart", filteredCart);
  
      if (filteredCart.length === 0) {
        await AsyncStorage.removeItem('@cart');
      }
  
      retrieveCart();
    } catch (error) {
      console.error('Error removing duplicate items:', error);
    }
  };
  
  
  useEffect(() => {
    removetocart();
    retrieveData();
    retrieveCart();
  }, [cartArray]);
  
  const handleHome = () => {
    router.push('(home)');
    // Reload.reload();
  };

  const handleCategory = () => {
    router.push('categories');
  };

  const handleNotifications = () => {
    router.push('notifications');
  };
// console.log("auth", auth); // auth {"message": "login successfully", "success": true, "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWI3NGI0YzJkZjRiZDI0ODE4OTE2YjEiLCJpYXQiOjE3MDcwODEyNDgsImV4cCI6MTcwNzY4NjA0OH0.iwkVBsZuw0uh2fwX4vnf30XzKKsqlmogb9opdTTZCsA", "user": {"_id": "65b74b4c2df4bd24818916b1", "address": "panchsheel nagar", "alternate_phone": "9200549668", "city_district_town": "bhopal", "email": "sachinmernstack@gmail.com", "landmark": "mata mandir", "locality": "bhopal", "name": "Sachin", "phone": "8319697083", "pincode": "461999", "role": 0, "shipping_address": "366 bhopal mp"}}
const handleAccount = () => {
  if (auth === null || auth?.user === undefined || auth?.user === null) {
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