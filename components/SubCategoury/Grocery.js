import React, { useEffect, useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { AntDesign } from "@expo/vector-icons";
import axios from 'axios';
import styles from './Style';

export default function Grocery() {
  const [Category, setCategory] = useState([]);

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
// console.log("Category", Category);
  useEffect(() => {
    getSubCat();
  }, [Category]);  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.customText}>Grocery</Text>
        <Text style={styles.customText}>
          <AntDesign name="down" size={24} color="black" />
        </Text>
      </View>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardContainer}
      >
        {!Category?(<Text style={{margin:25 , padding:40}}><Text style={{fontSize: 24 , fontWeight: "bold"}}>Loading</Text>  Please wait...</Text>): Category.map((item) => (
          <View key={item._id} style={styles.card}>
             <Image
              style={styles.img}
              source={{ uri: `https://dmart.onrender.com/api/v1/bcategory/single-photo/65ae2ba170cae3e36c601415` }}
            />
            <Text style={styles.name}>{item.name}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
