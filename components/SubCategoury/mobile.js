import { Image, ScrollView, Text, View } from 'react-native'
import { AntDesign } from "@expo/vector-icons";
import styles from './Style'
import React from 'react'

export default function Mobile() {
    const categoryItems = [
        { id: 1, img: require("../../img/mobile_catg.jpg"), name: "Mobile" },
        { id: 8, img: require("../../img/sport.jpg"), name: "Sports" },
        { id: 2, img: require("../../img/electronics.jpg"), name: "Electronics" },
        { id: 5, img: require("../../img/fashion.jpeg"), name: "Fashion" },
        { id: 3, img: require("../../img/HomeDecor.jpg"), name: "Home & Decor" },
        { id: 5, img: require("../../img/HealthBeauty.jpg"), name: "Health & Beauty" },
        { id: 6, img: require("../../img/Appliances.jpg"), name: "Appliances" },
        { id: 100, img: require("../../img/home-category-48.png"), name: "All Categories"},
      ];
  return (
    <View style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.customText}>Mobile</Text>
      <Text style={styles.customText}>
        <AntDesign name="down" size={24} color="black" />
      </Text>
    </View>
    <ScrollView
    horizontal={true}
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.cardContainer}
  >
    {categoryItems.map((item) => (
      <View key={item._id} style={styles.card}>
        <Image style={styles.img} source={item.img} />
        <Text style={styles.name}>{item.name}</Text>
      </View>
    ))}

  </ScrollView>
  </View>
  )
}

// const styles = StyleSheet.create({
    
  // container: {
  //   backgroundColor: "#fff",
  //   paddingVertical: 15,
  //   flex: 1,
  //   flexDirection: "column",
  //   alignItems: "center",
  //   justifyContent: "space-between",
  //   marginVertical: 20,
    
//   },
//   header: {
//     width: 300,
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   customText: {
//     fontWeight: "bold",
//     fontSize: 15,
//   },
//   cardContainer: {
//     flexDirection: "row",
//     justifyContent: "flex-start",
//     flexWrap: "wrap",
//     marginVerticalr: 20,
//   },
//   card: {
//     width: 89,
//     height: 90,
//     alignItems: "center",
//   },
//   img: {
//     width: 50,
//     height: 50,
//     borderRadius: 15,
//   },
//   name: {
//     fontSize: 12,
//     color: "#6A6A6A",
//     marginTop: 5,
//   },
// })