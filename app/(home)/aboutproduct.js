import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ProductDetails from '../../components/ProductDetails'
import Footer from '../../components/Footer'

export default function aboutproduct() {
   return (

      <SafeAreaView style={{ backgroundColor: "#fafafa", flex: 1 }}>
         <ScrollView style={{ flex: 1 }}>
            <ProductDetails />
         </ScrollView>
         <Footer />
      </SafeAreaView>
   )
}

const styles = StyleSheet.create({})