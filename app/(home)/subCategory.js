import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, View, Image, ScrollView, TouchableOpacity, Pressable } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useParams } from "react-router-dom";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import styles from "../../components/SubCategoury/Style";
import { useNavigation } from "@react-navigation/native";

// TODO i will add map in category element to his sub-category to show his products to next our product element
// isse hoga ki yadi apn grocery ki bat kare to uski sub-category bhi dekhegi our product bhi sub-category ke niche product wale session me


const subCategory = () => {
  const [categories, setCategories] = useState([]);
  const [productid, setProductId] = useState('')
  const [productItem, setProductItem] = useState([])
  const route = useRoute();
  const subCategoryId = route?.params?.id;
  const subCategoryName = route?.params?.name;

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      const { data } = await axios.get(
        `https://dmart.onrender.com/api/v1/category/get-category/${subCategoryId}`
      );
      // const firstItem = data.data[0];
      // setProductId(firstItem ? firstItem._id : '')
      setCategories(data?.data);

    } catch (error) {
      console.log(error);
    }
  };
  const getallproduct = async () => {
    try {
      const { data } = await axios.get(
        `https://dmart.onrender.com/api/v1/product/product-subcategory/${productid}`
      );

      setProductItem(data?.products);
      console.log("setProductItem", data);
    } catch (error) {
      console.log(error);
    }
  };

  console.log("productitem", productItem);

  useEffect(() => {
    getallproduct();
  }, [productid]);

  const handlePress = (itemId) => {
    // console.log("itemId", itemId);
    setProductId(itemId)
    
  }
  const navigation = useNavigation();
  const Product = () => {

    return (


      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexDirection: "column" }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 10, justifyContent: "space-between" }}>
          <Text style={{ fontWeight: "bold", fontSize: 25 }}>{subCategoryName} Products</Text>
        </View>
        {productItem === null ? (
          <Text style={{ margin: 25, padding: 40 }}>
            <Text style={{ fontSize: 24, fontWeight: "bold" }}>Loading</Text>{" "}
            Please wait...
          </Text>
        ) : (
          Array.isArray(productItem) ? (
            productItem.map((item) => (
              <React.Fragment key={item._id}>
                <Pressable style={styles.card}>
                  <Image
                    style={styles.img}
                    source={{
                      uri: `https://dmart.onrender.com/api/v1/bcategory/single-photo/${item._id}`,
                    }}
                  />
                  <Text style={styles.name}>{item.name}</Text>
                </Pressable>
              </React.Fragment>
            ))
          ) : (
            <Text style={{ margin: 2, padding: 40 }}>

              Not any product avilable


            </Text>
          )
        )}

        <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 10, justifyContent: "space-between" }}>
          <Text style={{ fontWeight: "bold", fontSize: 25 }}></Text>
        </View>
      </ScrollView>

    );
  };

  return (
    <SafeAreaView
      screenOptions={{ headerShown: true }}
      style={styles.container}
    >
      <View style={{ width: "90%", flexDirection: "row", alignItems: "center", marginVertical: 10, justifyContent: "space-between" }}>
        <TouchableOpacity onPress={() => navigation.navigate('index')}><Text> <Ionicons name="arrow-back" size={24} color="black" /></Text></TouchableOpacity>
        <Text style={{ fontWeight: "bold", fontSize: 25 }}>{subCategoryName}</Text>
        <Text style={{ fontWeight: "bold", fontSize: 25 }}></Text>
      </View>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardContainer}
      >
        {categories === null ? (
          <Text style={{ margin: 25, padding: 40 }}>
            <Text style={{ fontSize: 24, fontWeight: "bold" }}>Loading</Text>{" "}
            Please wait...
          </Text>
        ) : (
          Array.isArray(categories) ? (
            categories.map((item) => (
              <React.Fragment key={item._id}>

                <Pressable onPress={()=>handlePress(item._id)} style={styles.card}>
                  <Image
                    style={styles.img}
                    source={{
                      uri: `https://dmart.onrender.com/api/v1/bcategory/single-photo/${subCategoryId}`,
                    }}
                  />
                  <Text style={styles.name}>{item.name}</Text>
                </Pressable>
              </React.Fragment>
            ))
          ) : (
            <Text style={{ margin: 25, padding: 40 }}>
              <Text style={{ fontSize: 24, fontWeight: "bold" }}>
                Error loading categories
              </Text>{" "}
              Please try again.
            </Text>
          )
        )}


       
      </ScrollView>
      {Product()}
    </SafeAreaView>
  );
};

export default subCategory;
