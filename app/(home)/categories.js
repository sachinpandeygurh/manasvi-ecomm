import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Category from '../../components/Categoury'
import Footer from '../../components/Footer'
import Products from '../../components/Products'

export default function categories() {
  return (
    <SafeAreaView style={{backgroundColor:"#fafafa", flex:1 }}>
     <ScrollView style={{ flex:1 }}>
     <Category/>
<Products/>
     </ScrollView>
     <Footer/>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})