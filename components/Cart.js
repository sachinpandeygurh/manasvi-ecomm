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
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import checkData from './auth/CheckData';
const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [products, setProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);


  useEffect(() => {
    _retrieveData();
    _retrieveData()
    // _removeData()
  }, []);


  const fetchData = async () => {
    try {
      const { data } = await axios.get(`https://dmart.onrender.com/api/v1/product/get-product/${productId}`);
      setProduct(data?.product);
      getSimilarProduct(data?.product?._id, data?.product?.category?._id);
      getProductAllPhoto(data?.product?._id);

      const pd = data?.product?.pricedata;
      const pdata = pd ? JSON.parse(pd) : {};

      for (const propertyName in pdata) {
        if (pdata.hasOwnProperty(propertyName) && Array.isArray(pdata[propertyName])) {
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
      setSiPi(qandp);
    } catch (error) {
      console.log(error);
    }
  };



  const _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('@cart');
      if (value !== null) {
        const cartData = JSON.parse(value);
        console.log("cartData", cartData);
        setProducts(cartData)
        setCartItems(cartData);
        calculateTotal(cartData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const calculateTotal = (items) => {
    const total = items.reduce((acc, item) => {
      const itemPrice = typeof item.feature === 'number' ? item.feature : 0;
      return acc + itemPrice;
    }, 0);
    setTotalAmount(total);
  };

  const _removeData = async () => {
    try {
      await AsyncStorage.removeItem('@cart');
      console.log('Data removed successfully!');
    } catch (error) {
      console.log(error);
    }
  };
  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      const cartString = await AsyncStorage.getItem('@cart');
      if (!cartString) {
        return;
      }

      let cart = JSON.parse(cartString);
      const updatedCart = cart.map((product) => {
        if (product.product_id === productId) {
          return { ...product, quentity: newQuantity };
        }
        return product;
      });

      await AsyncStorage.setItem('@cart', JSON.stringify(updatedCart));

      console.log(`Quantity for product with productId ${productId} updated successfully!`);
      _retrieveData();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
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
      <Text style={styles.itemPrice}>&#x20B9;{item.feature}</Text>
    </View>
  );

  const cartModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalHeader}>Shopping Cart</Text>
          <ScrollView style={{ height: 300 }}>

            <FlatList
              data={cartItems}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
            />
          </ScrollView>
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total:</Text>
            <Text style={styles.totalAmount}>&#x20B9; {totalAmount}</Text>
          </View>
          <TouchableOpacity style={styles.checkoutButton} onPress={_removeData}>
            <Text style={styles.checkoutButtonText}>Checkout</Text>
          </TouchableOpacity>
          <Pressable
            style={styles.closeButton}
            onPress={() => setModalVisible(!modalVisible)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );

  return (
    <React.Fragment>


      <View style={styles.productContainer}>
        {products?.map((p) => (
          <TouchableOpacity
            key={p.product_id}

            style={styles.productItem}
          >
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: `https://dmart.onrender.com/api/v1/product/product-photo/${p.product_id}`,
                }}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
            <ScrollView style={styles.productDetails}>
              <Text style={styles.productName}>{p.productname}</Text>
              <View style={styles.detailRow}>
                <Text style={{ color: 'gray', textDecorationLine: 'line-through' }}>

                  {p.discount ? (Math.floor(p.feature * (100 / (100 - p.discount)))) : ""}
                </Text>
                <Text style={styles.price}>&#x20B9; {p.feature}</Text>
              </View>
              <View style={styles.detailRow}>
                {
                  p.discount ? (<Text style={styles.detailValue}>{p.discount}% OFF</Text>) : ""
                }
              </View>
            </ScrollView>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Pressable
                style={styles.quantityButton}
                onPress={() => handleQuantityChange(p._id, p.quentity - 1)}
                disabled={p.quentity === 1}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </Pressable >
              <View style={styles.quantityparent}>

                <Text style={styles.quantity}>{p.quentity}</Text>
              </View>
              <Pressable
                style={styles.quantityButton}
                onPress={() => handleQuantityChange(p._id, p.quentity + 1)}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </Pressable>
            </View>
            <Pressable style={styles.removeButton} onPress={() => handleRemove(p._id)}>
              <Text style={styles.removeButtonText}>Remove</Text>
            </Pressable>
          </TouchableOpacity>
        ))}
      </View>
      <Pressable
        onPress={() => setModalVisible(!modalVisible)} // TODO fixed this button position 
        style={styles.fixedButton}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Proseed →</Text>
      </Pressable>
      {cartModal()}

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
    marginTop: 8, // Added margin top
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
  productContainer: {
    marginTop: 16,

  },
  productItem: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 16,
    backgroundColor: "white"
  },
  imageContainer: {
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  productDetails: {
    marginBottom: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailValue: {
    fontSize: 16,
    color: 'green',
  },
  quantityButton: {
    padding: 8,
    backgroundColor: 'blue',
    borderRadius: 5,
    marginRight: 8,
    width: "30%"
  },
  quantityButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: "center",
    fontSize: 25
  },
  quantityparent: {
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 5,
    marginRight: 8,
    width: "35%"
  },
  quantity: {

    color: 'green',
    fontWeight: 'bold',
    textAlign: "center",
    fontSize: 25
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    width: '80%',
  },
  modalHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  closeButton: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 5,
    marginTop: 16,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  fixedButton: {
    position: 'absolute',
    paddingVertical: 8,
    width: 90,
    backgroundColor: 'green',
    borderRadius: 5,
    bottom: 35,
    right: 0,
    alignItems: 'center',
  },
});


export default Cart;
