import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Picker } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Link } from '@react-navigation/native';
// import { FaFileInvoiceDollar } from 'react-icons/fa';

const Orders = () => {
  const [status] = useState(['Not Process', 'Processing', 'Shipped', 'delivered', 'cancel']);
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useState(null);

  const getOrders = async () => {
    try {
      const { data } = await axios.get('https://manasvimart.in/api/v1/auth/all-orders');
      setOrders(data);
      console.log(data, 'orders');
    } catch (error) {
      console.log(error);
    }
  };

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
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const handleChange = async (orderId, value) => {
    try {
      await axios.put(`https://manasvimart.in/api/v1/auth/order-status/${orderId}`, {
        status: value,
      });
      getOrders();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>All Orders</Text>
      {orders?.map((o, i) => (
        <View style={styles.orderContainer} key={i}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderId}>{o?.razorpay?.orderId}</Text>
            <Text style={styles.orderStatus}>{o?.status}</Text>
          </View>
          <View style={styles.orderDetails}>
            <Text>{o?.buyer?.address}</Text>
            <Text>{new Date(o?.createdAt).toLocaleDateString()}</Text>
            <Text>{o?.isPaid?.true ? 'Failed' : 'Success'}</Text>
            <Text>{o?.paymentMode ? 'Online' : 'Cash'}</Text>
            <Text>{o?.products?.length} Items</Text>
            <Link to={`https://manasvimart.in/dashboard/admin/allInvoice?orderId=${o?.razorpay?.orderId}`}>
              {/* <FaFileInvoiceDollar /> */}
            </Link>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {o?.products?.map((p, j) => (
              <View style={styles.productCard} key={j}>
                <Image
                  source={{ uri: `/api/v1/product/product-photo/${p._id}` }}
                  style={styles.productImage}
                />
                <View style={styles.productInfo}>
                  <Text>{p.name}</Text>
                  <Text>{p.description.substring(0, 30)}</Text>
                  <Text>
                    Price: {Math.round(o.amount - (o.amount * p.discount) / 100).toLocaleString('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                    })}
                  </Text>
                  <Text>Quantity: {p.customQuantity}</Text>
                  {p.selectedSize && (
                    <Text>
                      Details/Qty: <br />
                      Price {p.selectedSize.price} for {p.selectedSize.quantity} {p.unit}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>
          <Picker
            selectedValue={o?.status}
            onValueChange={(value) => handleChange(o._id, value)}
            style={styles.statusPicker}
          >
            {status.map((s, index) => (
              <Picker.Item key={index} label={s} value={s} />
            ))}
          </Picker>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  orderContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderId: {
    fontWeight: 'bold',
  },
  orderStatus: {
    color: 'blue',
  },
  orderDetails: {
    marginBottom: 8,
  },
  productCard: {
    flexDirection: 'row',
    marginRight: 8,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  productInfo: {
    marginLeft: 8,
  },
  statusPicker: {
    marginVertical: 8,
  },
});

export default Orders;
