import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { ToastAndroid } from 'react-native'; // ToastAndroid for Android-specific toasts

const Orders = () => {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [auth, setAuth] = useState(null);
  const [cart, setCart] = useCart();
  const [setOtp_gen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [varified, setVerified] = useState(false);

  const navigation = useNavigation();

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
    fetchOrderId();
  }, [cart]);

  // ... (Other functions remain unchanged)

  const handleCashOnDelivery = () => {
    setShowOtpInput(true);
    cash_data();
  };

  const handleSubmit = async () => {
    let otp_local = localStorage.getItem("OTP");
    if (otp_local === inputValue) {
      localStorage.removeItem("OTP");
      setVerified(true);
      showToast("OTP verified Successfully!");
      await axios.post("https://dmart.onrender.com/api/v1/payment/create-order-COD", {
        isPaid: true,
        paymentMode: false,
        amount: parsedValue,
        products: cart,
        buyer: auth?.user?._id,
        razorpay: {
          orderId: orderId,
        },
      });
      localStorage.removeItem("cart");
      setCart([]);
    //   navigation.navigate('/dashboard/user/orders');
      showToast("Order Placed Successfully!");
    } else {
      showToast("Incorrect OTP entered.");
    }
  };

  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
      // Reload is not recommended in React Native
    } catch (error) {
      console.log(error);
    }
  };

  const showToast = (message) => {
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* ... (Other JSX remains unchanged) */}
      <View style={styles.cartSummary}>
        {/* ... (Cart summary content remains unchanged) */}
        <TouchableOpacity
          style={styles.payOnlineButton}
          onPress={loadRazorpay}
          disabled={loading || !auth?.user?.shipping_address}
        >
          <Text style={styles.buttonText}>{loading ? "Processing ...." : "Pay Online"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cashOnDeliveryButton}
          onPress={handleCashOnDelivery}
          disabled={!auth?.user?.address || showOtpInput}
        >
          <Text style={styles.buttonText}>Cash On Delivery</Text>
        </TouchableOpacity>

        {showOtpInput && !varified && (
          <View style={styles.otpInputContainer}>
            <Text>Enter OTP</Text>
            <TextInput
              style={styles.otpInput}
              value={inputValue}
              onChangeText={(text) => setInputValue(text)}
            />
            <TouchableOpacity style={styles.verifyOtpButton} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Verify OTP via Call</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      backgroundColor: '#fff',
    },
    cartItemContainer: {
      flexDirection: 'row',
      marginVertical: 10,
      padding: 10,
      backgroundColor: '#f0f0f0',
      borderRadius: 5,
    },
    productImage: {
      width: 100,
      height: 100,
      marginRight: 10,
    },
    productDetailsContainer: {
      flex: 1,
    },
    productName: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    productPrice: {
      fontSize: 16,
      marginBottom: 5,
    },
    removeButton: {
      backgroundColor: 'red',
      padding: 5,
      borderRadius: 5,
      alignSelf: 'flex-end',
    },
    removeButtonText: {
      color: 'white',
    },
    cartSummary: {
      backgroundColor: '#f0f0f0',
      padding: 10,
      borderRadius: 5,
      marginVertical: 10,
    },
    summaryText: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    amountDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 5,
    },
    totalAmount: {
      fontWeight: 'bold',
    },
    payOnlineButton: {
      backgroundColor: 'green',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      marginBottom: 10,
    },
    cashOnDeliveryButton: {
      backgroundColor: 'blue',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    otpInputContainer: {
      marginTop: 10,
    },
    otpInput: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      marginBottom: 10,
      paddingHorizontal: 10,
    },
    verifyOtpButton: {
      backgroundColor: 'purple',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
  });

export default Orders;
