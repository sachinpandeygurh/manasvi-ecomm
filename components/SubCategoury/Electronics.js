import { Image, ScrollView, Text, View } from 'react-native'
import { AntDesign } from "@expo/vector-icons";
import styles from './Style'
import React, { useEffect, useState } from 'react'

export default function Electronics() {


  const [Category, setCategory] = useState([]);

  useEffect(()=>{
    getSubCat()
  },[Category])

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
  return (
    <View style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.customText}>Electronics</Text>
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
              source={{ uri: `https://dmart.onrender.com/api/v1/bcategory/single-photo/65ae2e8070cae3e36c601457` }}
            />
        <Text style={styles.name}>{item.name}</Text>
      </View>
    ))}

  </ScrollView>
  </View>
  )
}
