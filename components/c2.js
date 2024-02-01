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
