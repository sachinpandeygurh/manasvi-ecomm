import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
// import Cart from '../../components/Cart';
import Footer from '../../components/Footer';
import Orders from '../../components/Orders';
import Cart from '../../components/Cart';

const cart = () => {
 

  return (
    <View style={styles.container}>
        <ScrollView>
      <Cart/>
      {/* <Orders/> */}
        </ScrollView>
        <Footer/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export default cart;
