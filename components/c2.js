import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    _retrieveData();
  }, []);

  const _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('@cart');
      if (value !== null) {
        const cartData = JSON.parse(value);
        setCartItems(cartData);
        calculateTotal(cartData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const calculateTotal = (items) => {
    const total = items.reduce((acc, item) => acc + item.price, 0);
    setTotalAmount(total);
  };

  const handleRemove = async (productId) => {
    try {
      const cartString = await AsyncStorage.getItem('@cart');
      if (!cartString) {
        return;
      }

      let cart = JSON.parse(cartString);
      cart = cart.filter((product) => product.product_id !== productId);
      await AsyncStorage.setItem('@cart', JSON.stringify(cart));

      console.log(`Product with productId ${productId} removed from cart successfully!`);
      _retrieveData(); // Update the cart items after removal
    } catch (error) {
      console.error('Error removing product from cart:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Text style={styles.itemName}>{item.productname}</Text>
      <Text style={styles.itemPrice}>${item.price}</Text>
    
    </View>
  );

  return (
    <>
    <View style={styles.container}>
      <Text style={styles.header}>Shopping Cart</Text>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total:</Text>
        <Text style={styles.totalAmount}>${totalAmount}</Text>
      </View>
      <TouchableOpacity style={styles.checkoutButton} onPress={_removeData}>
        <Text style={styles.checkoutButtonText}>Checkout</Text>
      </TouchableOpacity>
    </View>

    <View style={styles.productContainer}>
      {cartItems.map((p) => (
        <TouchableOpacity key={p._id} style={styles.productItem}>
          {/* ... Your existing product UI */}
          <Image
        source={{
          uri: `https://dmart.onrender.com/api/v1/product/product-photo/${p.product_id}`,
        }}
        style={styles.image}
        resizeMode="cover"
      />
          <Pressable
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(p._id, p.quentity - 1)}
            disabled={p.quentity === 1}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </Pressable>
          <Text style={styles.quantity}>{p.quentity}</Text>
          <Pressable
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(p._id, p.quentity + 1)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </Pressable>
          <Pressable style={styles.removeButton} onPress={() => handleRemove(p._id)}>
            <Text style={styles.removeButtonText}>Remove</Text>
          </Pressable>
        </TouchableOpacity>
      ))}
    </View>
    </>
  );

};

      const styles = StyleSheet.create({
        container: {
        flex: 1,
      padding: 16,
  },
      header: {
        fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
  },
      cartItem: {
        flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
      padding: 8,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
  },
      itemName: {
        fontSize: 18,
  },
      itemPrice: {
        fontSize: 16,
      fontWeight: 'bold',
  },
      removeButton: {
        backgroundColor: 'red',
      padding: 8,
      borderRadius: 5,
  },
      removeButtonText: {
        color: 'white',
      fontWeight: 'bold',
  },
      totalContainer: {
        flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 16,
      borderTopWidth: 1,
      paddingTop: 8,
  },
      totalText: {
        fontSize: 18,
      fontWeight: 'bold',
  },
      totalAmount: {
        fontSize: 18,
  },
      checkoutButton: {
        backgroundColor: '#3498db',
      padding: 16,
      borderRadius: 8,
      marginTop: 16,
      alignItems: 'center',
  },
      checkoutButtonText: {
        color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
  },
});

      export default Cart;

      {product.map((item , index)=>(
        <View style={{ margin: 16 }}>

          <Text style={{ textAlign: 'center', fontSize: 24 }}>{item.name}</Text>
          <View style={{ borderBottomWidth: 1, borderBottomColor: 'grey', marginVertical: 8 }} />

          <View style={{ marginVertical: 8 }}>
            <Text>Available quantities</Text>
            <Picker
              selectedValue={selectedQuantity}
              onValueChange={(itemValue) => handleQuantityChange(itemValue)}
            >
              <Picker.Item label="Please select an option" value="" />
              {siPi.map((item) => (
                <Picker.Item key={item.quantity} label={item.quantity} value={item.quantity} />
              ))}
            </Picker>
            <Text>Selected quantity: {selectedQuantity}</Text>
          </View>

          {nprice && selectedSize ? (
            <>
              <Text>
                Updated Price: {Math.round(nprice).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
              </Text>
              {/* Include other details related to the selected size */}
            </>
          ) : (
            <Text>No pricing information available for the selected option.</Text>
          )}

          {/* Other product details */}
          {/* ... */}

          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              borderRadius: 8,
              paddingVertical: 12,
              marginVertical: 16,
              alignItems: 'center',
                borderWidth: 1,
                    borderColor: "blue",
            }}
            onPress={() => handleAddCart( product_id, 
              productname,
              slug,
              description,
              feature,
              price,
              discount ,
              quentity)}
          >
            <Text style={{ color: 'blue', fontWeight: 'bold' }}>ADD TO CART</Text>
          </TouchableOpacity>
        </View>
          ))}


          


  function generateUniqueId(length) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let id = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      id += characters.charAt(randomIndex);
    }

    return id;
  }

  //for uuid
  async function fetchOrderId() {
    try {

      const orderid = "order_CD" + generateUniqueId(12);

      setOrderId(orderid);
    } catch (error) {
      console.error("Error fetching order ID:", error);
    }
  }

  const totalPrice = () => {
    try {
      let amount = 0;

      // for accessing pricecartdata
      cart.forEach((item) => {
        const selectedSize = item.selectedSize;

        const quantity = selectedSize.quantity;
        const price = selectedSize.price;
        const itemTotal = Math.round(
          (price - (price * item.discount) / 100) * item.customQuantity
        );
        amount += itemTotal;
      });
      console.log(cart, "cart");

      if (amount <= 499) {
        amount += 0;
      } else if (amount >= 500 && amount <= 999) {
        amount += 30;
      } else if (amount >= 1000) {
        amount += 60;
      }

      localStorage.setItem("amount", JSON.stringify(amount));

      return amount;
    } catch (error) {
      console.log(error);
    }
  };

  const totalAmount = () => {
    try {
      let amount = 0;

      cart?.forEach((item) => {
        // /start
        const selectedSize = item.selectedSize;

        const quantity = selectedSize.quantity;
        const price = selectedSize.price;
        //end

        const itemTotal = Math.round(price * item.customQuantity);
        amount += itemTotal;
      });

      return amount;
    } catch (error) {
      console.log(error);
    }
  };
  const discountamt = () => {
    try {
      let amount = 0;

      cart?.forEach((item) => {
        // /start
        const selectedSize = item.selectedSize;

        const quantity = selectedSize.quantity;
        const price = selectedSize.price;
        //end

        const itemTotal = Math.round(
          ((price * item.discount) / 100) * item.customQuantity
        );
        amount += itemTotal;
      });

      return amount;
    } catch (error) {
      console.log(error);
    }
  };

  var retrievedValue = localStorage.getItem("amount");
  var parsedValue = JSON.parse(retrievedValue);

  function loadRazorpay() {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onerror = () => {
      alert("Razorpay SDK failed to load. Are you online?");
    };
    script.onload = async () => {
      try {
        setLoading(true);
        const result = await axios.post("https://dmart.onrender.com/api/v1/payment/create-order", {
          cart,
          amount: parsedValue * 100,
        });
        console.log(result, "result");
        const { amount, id: order_id, currency } = result.data;
        const {
          data: { key: razorpayKey },
        } = await axios.get("/api/v1/payment/get-razorpay-key");
        // console.log(cart);
        const options = {
          key: razorpayKey,
          amount: amount,
          currency: currency,
          name: "manasvi technologies",
          description: "transction to manasvi",
          order_id: order_id,
          handler: async function (response) {
            await axios.post("https://dmart.onrender.com/api/v1/payment/pay-order", {
              paymentMode: true,
              amount: amount,
              products: cart,
              razorpay: {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              },
              buyer: auth?.user?._id,
            });
            // alert(result.data.msg);
            // fetchOrders();
            localStorage.removeItem("cart");
            setCart([]);
            navigate(`/dashboard/user/orders`);
            toast.success("Payment Completed Successfully ");
          },
          prefill: {
            name: "Manasvi technologies",
            email: "manasvi@gmail.com",
            contact: "1111111111",
          },
          notes: {
            address: "30, minaal residency bhopal",
          },
          theme: {
            color: "#80c0f0",
          },
        };

        setLoading(false);
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } catch (err) {
        alert(err);
        setLoading(false);
      }
    };
    document.body.appendChild(script);
  }

  //another cod method

  // Cash on delivery testing
  let phone = "+91" + auth?.user?.phone;
  // Cash on delivery testing

  const cash_data = async () => {
    try {
      setLoading(true);
      //below code for otp
      const apiKey = "d85e660e-4d4d-11ee-addf-0200cd936042";
      const mobileNumber = phone;

      const min = 100000;
      const max = 999999;
      OTP1 = Math.floor(Math.random() * (max - min + 1)) + min;
      localStorage.setItem("OTP", JSON.stringify(OTP1));
      // console.log(OTP1);
      const url = `https://2factor.in/API/V1/${apiKey}/SMS/${mobileNumber}/${OTP1}`;
      toast.success("OTP send successfully! ");
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: url,
        headers: {},
      };

      axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data.Status));
          if (response.data.Status) {
            setOtp_gen(true);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      setLoading(false);
      //end
    } catch (err) {
      alert(err);
      setLoading(false);
    }
  };

  //total price

  //cash on delivery
  var OTP1 = 0;

  const handleCashOnDelivery = () => {
    setShowOtpInput(true);
    cash_data();
    // Show the OTP input field
  };

  //for otp input form
  const handleSubmit = async () => {
    let otp_local = localStorage.getItem("OTP");
    if (otp_local === inputValue) {
      localStorage.removeItem("OTP");
      setVerified(true); // Assuming you have a 'verified' state to track OTP verification
      toast.success("OTP verified Successfully!");
      await axios.post("/api/v1/payment/create-order-COD", {
        isPaid: true,
        paymentMode: false,
        amount: parsedValue,
        products: cart,
        buyer: auth?.user?._id,
        razorpay: {
          orderId: orderId,
        },
      });
      // const { amount, id: _id } = result.data;
      localStorage.removeItem("cart");
      setCart([]);
      navigate(`/dashboard/user/orders`);
      toast.success("Order Placed Successfully! ");
      // You can call the order generation function here
    } else {
      toast.error("Incorrect OTP entered.");
    }
  };


  // rager pay
    // const result = await fetch("https://dmart.onrender.com/api/v1/payment/create-order", {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     cart, // cart data from asyncstroage
      //     amount: parsedValue * 100,
      //   }),
      // });

    //   const resultData = await result.json();
    //   const { amount, id: order_id, currency } = resultData;
    //   const razorpayKeyResult = await fetch("https://dmart.onrender.com/api/v1/payment/get-razorpay-key");
    //   const razorpayKeyData = await razorpayKeyResult.json();
    //   const { key: razorpayKey } = razorpayKeyData;

    //   const options = {
    //     key: razorpayKey,
    //     amount: amount,
    //     currency: currency,
    //     name: "manasvi technologies",
    //     description: "transaction to manasvi",
    //     order_id: order_id,
    //     handler: async function (response) {
    //       await fetch("https://dmart.onrender.com/api/v1/payment/pay-order", {
    //         method: 'POST',
    //         headers: {
    //           'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //           paymentMode: true,
    //           amount: amount,
    //           products: cart,
    //           razorpay: {
    //             orderId: response.razorpay_order_id,
    //             paymentId: response.razorpay_payment_id,
    //             signature: response.razorpay_signature,
    //           },
    //           buyer: auth?.user?._id,
    //         }),
    //       });

    //       Alert.alert("Payment Completed Successfully ");
    //     },
    //     prefill: {
    //       name: "Manasvi technologies",
    //       email: "manasvi@gmail.com",
    //       contact: "1111111111",
    //     },
    //     notes: {
    //       address: "30, minaal residency bhopal",
    //     },
    //     theme: {
    //       color: "#80c0f0",
    //     },
    //   };

    //   setLoading(false);
    //   const paymentObject = new Razorpay(options);
    //   paymentObject.open();
    // } catch (error) {
    //   console.error(error);
    //   setLoading(false);

    // ======================== electronics ================================================

//     import { Image, ScrollView, Text, View } from 'react-native'
// import { AntDesign } from "@expo/vector-icons";
// import styles from './Style'
// import React, { useEffect, useState } from 'react'

// export default function Electronics() {


//   const [Category, setCategory] = useState([]);

//   useEffect(()=>{
//     getSubCat()
//   },[Category])

//   const getSubCat = async () => {
//     try {
//       const { data } = await axios.get(
//         `https://dmart.onrender.com/api/v1/subcategory/get-sub-category/65ae2f6470cae3e36c601489`
//       );
//       setCategory(data.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   return (
//     <View style={styles.container}>
//     <View style={styles.header}>
//       <Text style={styles.customText}>Electronics</Text>
//       <Text style={styles.customText}>
//         <AntDesign name="down" size={24} color="black" />
//       </Text>
//     </View>
//     <ScrollView
//     horizontal={true}
//     showsHorizontalScrollIndicator={false}
//     contentContainerStyle={styles.cardContainer}
//   >
//     {!Category?(<Text style={{margin:25 , padding:40}}><Text style={{fontSize: 24 , fontWeight: "bold"}}>Loading</Text>  Please wait...</Text>):Category.map((item) => (
//       <View key={item.id} style={styles.card}>
//          <Image
//               style={styles.img}
//               source={{ uri: `https://dmart.onrender.com/api/v1/bcategory/single-photo/65ae2e8070cae3e36c601457` }}
//             />
//         <Text style={styles.name}>{item.name}</Text>
//       </View>
//     ))}

//   </ScrollView>
//   </View>
//   )
// }
