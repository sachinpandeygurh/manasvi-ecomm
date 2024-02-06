import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  Modal,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [products, setProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    _retrieveData();
    fetchData();
  }, [products]);

  const fetchOrderId = async () => {
    try {
      const orderid = "order_CD" + generateUniqueId(12);
      setOrderId(orderid);
    } catch (error) {
      console.error("Error fetching order ID:", error);
    }
  };

  const totalPrice = () => {
    try {
      let amount = 0;

      cart.forEach((item) => {
        const selectedSize = item.selectedSize;
        const quantity = selectedSize.quantity;
        const price = selectedSize.price;
        const itemTotal = Math.round(
          (price - (price * item.discount) / 100) * item.customQuantity
        );
        amount += itemTotal;
      });

      if (amount <= 499) {
        amount += 0;
      } else if (amount >= 500 && amount <= 999) {
        amount += 30;
      } else if (amount >= 1000) {
        amount += 60;
      }

      AsyncStorage.setItem("amount", JSON.stringify(amount));
      return amount;
    } catch (error) {
      console.log(error);
    }
  };

  const calculateTotalAmount = () => {
    let amount = 0;
    cart?.forEach((item) => {
      const selectedSize = item.selectedSize;
      const quantity = selectedSize.quantity;
      const price = selectedSize.price;
      const itemTotal = Math.round(price * item.customQuantity);
      amount += itemTotal;
    });
    return amount;
  };

  const discountamt = () => {
    try {
      let amount = 0;

      cart?.forEach((item) => {
        const selectedSize = item.selectedSize;
        const quantity = selectedSize.quantity;
        const price = selectedSize.price;

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

  // console.log("cart",cart);

  const _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem("@cart");
      if (value !== null) {
        const cartData = JSON.parse(value);
        // console.log("cartData", cartData);
        setProducts(cartData);
        setCartItems(cartData);
        calculateTotal(cartData);
        setCart(cartData);
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log("cartItems", cartItems);
  console.log("totalAmount", totalAmount);

  const loadRazorpay = async () => {
    try {
      const result = await fetch(
        "https://dmart.onrender.com/api/v1/payment/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cart: cartItems.filter((item) => Object.keys(item).length !== 0),
            amount: totalAmount,
           
          }),
        }
      );
      const data = await result.json();
      const { amount, id: order_id, currency } = data;

      const razorpayKeyResult = await fetch(
        "https://dmart.onrender.com/api/v1/payment/get-razorpay-key"
      );
      const razorpayKeyData = await razorpayKeyResult.json();
      const razorpayKey = razorpayKeyData.data.key;

      const options = {
        description: "Transaction to Manasvi",
        image: "https://example.com/your_logo.png",
        currency: currency,
        key: razorpayKey,
        amount: amount * 100, // Razorpay expects amount in paisa
        name: "Manasvi Technologies",
        prefill: {
          email: "manasvi@gmail.com",
          contact: "1111111111",
          name: "Manasvi Technologies",
        },
        theme: { color: "#80c0f0" },
      };

      RazorpayCheckout.open(options)
        .then(async (response) => {
          // Handle success
          await fetch("https://dmart.onrender.com/api/v1/payment/pay-order", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              paymentMode: true,
              amount: amount,
              products: cartItems,
              razorpay: {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              },
              buyer: auth?.user?._id || "65b8daf785afa34463099f72",
            }),
          });

          // Clear the cart
          setCart([]);
          router.push("account");
        })
        .catch((error) => {
          // Handle error
          console.log("Error:", error);
        });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchData = async () => {
    try {
      const { data } = await axios.get(
        `https://dmart.onrender.com/api/v1/product/get-product/${products}`
      );
      setProducts(data?.product);
      // getProductAllPhoto(data?.product?._id);

      const pd = data?.product?.pricedata;
      const pdata = pd ? JSON.parse(pd) : {};

      for (const propertyName in pdata) {
        if (
          pdata.hasOwnProperty(propertyName) &&
          Array.isArray(pdata[propertyName])
        ) {
          const u = propertyName;
          setUnit(u);
        }
      }

      const qandp =
        pdata.kg ||
        pdata.gm ||
        pdata.liter ||
        pdata.ml ||
        pdata.meter ||
        pdata.cm ||
        pdata.pcs ||
        pdata.size ||
        [];
      // setSiPi(qandp);
    } catch (error) {
      console.log("fetchData",error);
    }
  };

  // console.log("Products", products);

  const calculateTotal = (items) => {
    const total = items.reduce((acc, item) => {
      const itemPrice =
        typeof item.productPrice === "number" ? item.productPrice : 0;
      return acc + itemPrice;
    }, 0);
    setTotalAmount(total);
  };

  const _removeData = async () => {
    try {
      await AsyncStorage.removeItem("@cart");
      console.log("Data removed successfully!");
    } catch (error) {
      console.log(error);
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      const cartString = await AsyncStorage.getItem("@cart");
      if (!cartString) {
        return;
      }
  
      let cart = JSON.parse(cartString);
      const updatedCart = cart.map((product) => {
        if (product.productId === productId) {
          return { ...product, quantity: newQuantity };
        }
        return product;
      });
  
      await AsyncStorage.setItem("@cart", JSON.stringify(updatedCart));
  
      console.log(`Quantity for product with productId ${productId} updated successfully!`);
      _retrieveData(); // Assuming _retrieveData is used to update the UI with the latest data
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };
  
  const handleRemove = async (productId) => {
    try {
      const cartString = await AsyncStorage.getItem("@cart");
      if (!cartString) {
        return;
      }
  
      let cart = JSON.parse(cartString);
      // Filter out the product to be removed
      const updatedCart = cart.filter((product) => product.productId !== productId);
  
      await AsyncStorage.setItem("@cart", JSON.stringify(updatedCart));
  
      console.log(`Product with productId ${productId} removed from cart successfully!`);
      _retrieveData(); // Assuming _retrieveData is used to update the UI with the latest data
    } catch (error) {
      console.error("Error removing product from cart:", error);
    }
  };
  
  

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Text style={styles.itemName}>{item.productName}</Text>
      <Text style={styles.itemPrice}>&#x20B9;{item.productPrice}</Text>
    </View>
  );

  const addressCheckout = () => {
    return (
      <View>
        {auth?.user?.address ? (
          <>
            <View style={styles.mb3TextCenterTextLeft}>
              <View style={styles.hr} />
              <Text>
                <Text style={styles.bold}>Current Address</Text>
              </Text>
              <Text>{auth?.user?.address}</Text>
              <View style={styles.hr} />
              <Text>
                <Text style={styles.bold}>Shipping Address</Text>
              </Text>
              <Text>
                {auth?.user?.shipping_address} {auth?.user?.pincode}{" "}
                {auth?.user?.landmark} {auth?.user?.altername_phone}{" "}
                {auth?.user?.city_district_town}
              </Text>
              <TouchableOpacity
                style={styles.btnOutlineWarning}
                onPress={() => router.push("(account)")}
              >
                <Text>Update Address</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.mb3}>
            {auth?.token ? (
              <TouchableOpacity
                style={styles.btnOutlineWarning}
                onPress={() => router.push("(account)")}
              >
                <Text>Update Address</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.btnOutlineWarning}
                onPress={() => router.push("(login)", { state: "/cart" })}
              >
                <Text>Please Login to checkout</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        <View style={styles.mt2}>
          {!auth?.token || !cart?.length ? (
            <></>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.btnSuccess, { width: 150 }]}
                onPress={loadRazorpay}
                disabled={loading || !auth?.user?.shipping_address}
              >
                <Text>{loading ? "Processing ...." : "Pay Online"}</Text>
              </TouchableOpacity>
              {/* COD payment */}
              <TouchableOpacity
                style={[styles.btnSuccess, styles.m2]}
                onPress={handleCashOnDelivery}
                disabled={!auth?.user?.address || showOtpInput}
              >
                <Text>Cash On Delivery</Text>
              </TouchableOpacity>

              {showOtpInput && !verified && (
                // Show OTP input only when 'showOtpInput' is true and OTP is not verified
                <View>
                  <Text>Enter OTP</Text>
                  <TextInput
                    style={styles.input}
                    value={inputValue}
                    onChangeText={(text) => setInputValue(text)}
                  />
                  <TouchableOpacity onPress={handleSubmit}>
                    <Text>Verify OTP via Call</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </View>
      </View>
    );
  };

  return (
    <React.Fragment>
      <View style={styles.productContainer}>
        {cartItems
          .filter((item) => Object.keys(item).length !== 0)
          .map((p) => (
            <TouchableOpacity key={p.productId + 3} style={styles.productItem}>
              <View style={styles.imageContainer}>
                <Image
                  source={{
                    uri: `https://dmart.onrender.com/api/v1/product/product-photo/${p.productId}`,
                  }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
              <ScrollView style={styles.productDetails}>
                <Text style={styles.productName}>{p.productName}</Text>
                <View style={styles.detailRow}>
                  <Text
                    style={{
                      color: "gray",
                      textDecorationLine: "line-through",
                    }}
                  >
                    {p.productDiscount
                      ? Math.floor(
                          p.productPrice *
                            p.quantity *
                            (100 / (100 - p.productDiscount))
                        )
                      : ""}
                  </Text>
                  <Text style={styles.price}>
                    &#x20B9; {p.productPrice * p.quantity}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  {p.productDiscount ? (
                    <Text style={styles.detailValue}>
                      {p.productDiscount}% OFF
                    </Text>
                  ) : (
                    ""
                  )}
                </View>
              </ScrollView>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Pressable
                  style={styles.quantityButton}
                  onPress={() => {
                    handleQuantityChange(p.productId, p.quantity - 1);
                    console.log(p.quantity - 1);
                  }}
                  disabled={p.quantity === 1}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </Pressable>
                <View style={styles.quantityparent}>
                  <Text style={styles.quantity}>{p.quantity}</Text>
                </View>
                <Pressable
                  style={styles.quantityButton}
                  onPress={() => {
                    handleQuantityChange(p.productId, p.quantity + 1);
                    console.log(p.quantity + 1);
                  }}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </Pressable>
              </View>
              <Pressable
                style={styles.removeButton}
                onPress={() => handleRemove(p.productId)}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </Pressable>
            </TouchableOpacity>
          ))}
        {totalAmount !== 0 && (
          <View>
            <FlatList
              data={cartItems.filter((item) => Object.keys(item).length !== 0)}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString() + 1}
            />
            <Text style={styles.detailValue}>Total Amount: <Text style={styles.detailValue}>&#x20B9;{totalAmount}</Text></Text>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={loadRazorpay}
            >
              <Text style={styles.checkoutButtonText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {totalAmount === 0 && (
        <View style={styles.emptyCartContainer}>
          <Text style={styles.emptyCartText}>Hello Guest</Text>
          <Text style={styles.emptyCartText}>Your Cart Is Empty</Text>
        </View>
      )}
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  itemName: {
    fontSize: 18,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
  },
  removeButton: {
    backgroundColor: "red",
    padding: 8,
    borderRadius: 5,
    marginTop: 8, // Added margin top
  },
  removeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    borderTopWidth: 1,
    paddingTop: 8,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalAmount: {
    fontSize: 18,
  },
  checkoutButton: {
    backgroundColor: "#3498db",
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  productContainer: {
    marginTop: 16,
    marginBottom:20,
    // paddingBottom:300
  },
  productItem: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 16,
    backgroundColor: "white",
  },
  imageContainer: {
    marginBottom: 8,
  },
  image: {
    width: "100%",
    height: 50,
    borderRadius: 8,
    paddingVertical: 250,
  },
  productDetails: {
    marginBottom: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
  },
  detailValue: {
    fontSize: 16,
    color: "green",
  },
  quantityButton: {
    padding: 8,
    backgroundColor: "blue",
    borderRadius: 5,
    marginRight: 8,
    width: "30%",
  },
  quantityButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 25,
  },
  quantityparent: {
    padding: 8,
    backgroundColor: "white",
    borderRadius: 5,
    marginRight: 8,
    width: "35%",
  },
  quantity: {
    color: "green",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 25,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    width: "80%",
  },
  modalHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  closeButton: {
    backgroundColor: "red",
    padding: 8,
    borderRadius: 5,
    marginTop: 16,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  fixedButton: {
    position: "absolute",
    paddingVertical: 8,
    width: 90,
    backgroundColor: "green",
    borderRadius: 5,
    bottom: 40,
    right: 0,
    height: 40,
    alignItems: "center",
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyCartText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "gray",
  },
});

export default Cart;
