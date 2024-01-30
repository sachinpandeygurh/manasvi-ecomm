import React, { useState } from "react";
import axios from "axios";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  // form function
  const handleSubmit = async () => {
    try {
      const res = await axios.post("https://dmart.onrender.com/api/v1/auth/login", {
        email,
        password,
      });

      if (res && res.data.success) {
        // Save data to AsyncStorage
        await AsyncStorage.setItem("@MySuperStore:key", JSON.stringify(res.data));
        console.log("Data stored successfully!");

        // Fetch user data and cart items
        const userData = await axios.get(
          `https://dmart.onrender.com/api/v1/cart/get-cart-item/${res.data.user._id}`,
          {
            headers: {
              Authorization: `${res.data.token}`,
            },
          }
        );

        if (userData?.data?.getItems?.cartItems) {
          const existingCart = JSON.parse(await AsyncStorage.getItem("cart")) || [];
          const newCartItems = userData.data.getItems.cartItems;

          newCartItems.forEach((newCartItem) => {
            const existingItemIndex = existingCart.findIndex(
              (existingItem) => existingItem._id === newCartItem._id
            );
            if (existingItemIndex !== -1) {
              existingCart[existingItemIndex].customQuantity += newCartItem.customQuantity;
            } else {
              existingCart.push(newCartItem);
            }
          });

          await AsyncStorage.setItem("cart", JSON.stringify(existingCart));
        }

        navigation.navigate("index");
        console.log("Navigation successful!");
      } else {
        Alert.alert("Error", res.data.message);
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        value={email}
        onChangeText={(text) => setEmail(text)}
        placeholder="Enter Your Email"
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={(text) => setPassword(text)}
        placeholder="Enter Your Password"
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>

      <View  style={{flexDirection:"row" , alignContent:"center", justifyContent:"space-between", width:"90%", marginTop:10}} >
        <TouchableOpacity style={{flexDirection:"row" , alignContent:"center", justifyContent:"space-between"}} onPress={() =>  navigation.navigate('signup')}>
          <Text>New Customer? </Text>
          <Text style={styles.linkText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.forgotPassword}>Forgot Password</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.policyText}>
        <TouchableOpacity style={styles.policytxt} onPress={() => navigation.navigate("Policy")}>
          <Text style={styles.linkText}>Terms of Use</Text>
        </TouchableOpacity>
     
        <TouchableOpacity style={styles.policytxt} onPress={() => navigation.navigate("Policy")}>
          <Text style={styles.linkText}>Privacy Policy</Text>
        </TouchableOpacity>
      
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        // marginTop:100,
    //   flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
    },
    input: {
        height:35,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      padding: 10,
      marginBottom: 20,
      width: "100%",
    },
    button: {
      backgroundColor: '#ffa502',
      borderRadius: 80,
      padding: 15,
      width: "100%",
      alignItems: "center",
    },
    buttonText: {
      color: 'black',
      fontWeight: 'bold',
      // fontSize: 50, // Uncomment if you want to increase the font size
    },
    linkText: {
      textDecorationLine: 'underline',
      color: 'blue',
      letterSpacing: 1, // There's a typo here. It should be 'letterSpacing', not 'tEXTspace'
    //   paddingVertical: 10,
    },
    forgotPassword: {
      color: 'blue',
      textDecorationLine: 'underline',
      marginBottom: 10,
    },
    policyText: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    //   marginTop: 10,
    },
    policytxt: {
      padding: 20,
    },
  });
  
export default Login;
