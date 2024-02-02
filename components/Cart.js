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
    fetchData()
  }, []);


  const fetchData = async () => {
    try {
      const { data } = await axios.get(`https://dmart.onrender.com/api/v1/product/get-product/${products}`);
      setProducts(data?.product);
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


  console.log("Products", products);
  const _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('@cart');
      if (value !== null) {
        const cartData = JSON.parse(value);
        // console.log("cartData", cartData);
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
      const itemPrice = typeof item.productPrice === 'number' ? item.productPrice : 0;
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
        if (product.productId === productId) {
          return { ...product, quantity: newQuantity }; // Corrected property name to "quantity"
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

      console.log("productId", productId);

      let cart = JSON.parse(cartString);
      // Filter out the product to be removed
      cart = cart.filter((product) => product.productId !== productId);

      await AsyncStorage.setItem('@cart', JSON.stringify(cart));

      console.log(`Product with productId ${productId} removed from cart successfully!`);
      _retrieveData(); // Update the cart items after removal
    } catch (error) {
      console.error('Error removing product from cart:', error);
    }
  };
  console.log("CartItems", cartItems);

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Text style={styles.itemName}>{item.productName}</Text>
      <Text style={styles.itemPrice}>&#x20B9;{item.productPrice}</Text>
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
      {cartItems?.map((p) => (
  <TouchableOpacity key={p.productId} style={styles.productItem}>
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
        <Text style={{ color: 'gray', textDecorationLine: 'line-through' }}>
          {p.productDiscount
            ? Math.floor((p.productPrice * p.quantity) * (100 / (100 - p.productDiscount)))
            : ""}
        </Text>
        <Text style={styles.price}>&#x20B9; {p.productPrice * p.quantity}</Text>
      </View>
      <View style={styles.detailRow}>
        {p.productDiscount ? <Text style={styles.detailValue}>{p.productDiscount}% OFF</Text> : ""}
      </View>
    </ScrollView>
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
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
    <Pressable style={styles.removeButton} onPress={() => handleRemove(p.productId)}>
      <Text style={styles.removeButtonText}>Remove</Text>
    </Pressable>
  </TouchableOpacity>
))}

      </View>

      {cartModal()}
      {totalAmount !== 0 && (<Pressable
        onPress={() => setModalVisible(!modalVisible)} // TODO fixed this button position 
        style={styles.fixedButton}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Proseed →</Text>
      </Pressable>)}

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
    height: 50,
    borderRadius: 8,
    paddingVertical:250
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
    bottom: 40,
    right: 0,
    height: 40,
    alignItems: 'center',
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'gray',
  },
});


export default Cart;
