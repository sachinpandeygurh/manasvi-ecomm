import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import { AntDesign } from "@expo/vector-icons";
import styles from './Style'
import React, { useEffect, useState } from 'react'

export default function HomenDecor() {
  const [Category, setCategory] = useState([]);

  useEffect(()=>{
    const getSubCat = async () => {
      try {
        const { data } = await axios.get(
          `https://dmart.onrender.com/api/v1/subcategory/get-sub-category/65ae2f6470cae3e36c601489`
        );
        setCategory(data.data);
      } catch (error) {
        console.log(error);
      }
    };
  },[Category])
 
  return (
    
    <View style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.customText}>Home and Decor</Text>
      <Text style={styles.customText}>
        <AntDesign name="down" size={24} color="black" />
      </Text>
    </View>
    <ScrollView
    horizontal={true}
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.cardContainer}
  >
    {!Category?(<Text style={{margin:25 , padding:40}}><Text style={{fontSize: 24 , fontWeight: "bold"}}>Loading</Text>  Please wait...</Text>):Category.map((item) => (
      <View key={item.id} style={styles.card}>
         <Image
              style={styles.img}
              source={{ uri: `https://dmart.onrender.com/api/v1/bcategory/single-photo/65ae2f1d70cae3e36c601461` }}
            />
        <Text style={styles.name}>{item.name}</Text>
      </View>
    ))}

  </ScrollView>
  </View>
  )
}

// const styles = StyleSheet.create({
    
//   container: {
//     backgroundColor: "#fff",
//     paddingVertical: 15,
//     flex: 1,
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "space-between",
//     // marginVertical: 20,
    
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