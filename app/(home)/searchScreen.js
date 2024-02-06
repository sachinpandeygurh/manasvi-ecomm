import React, { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput, // Import TextInput
  View,
  Text,
  Pressable,
  TouchableOpacity
} from "react-native";
import { EvilIcons, Feather } from "@expo/vector-icons"; // Import icons from expo-vector-icons
import { LinearGradient } from "expo-linear-gradient";
import Axios from "axios";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SearchScreen() {
  const [value, setValue] = useState("");
  const [products, setProducts] = useState([]);  
  const [cartAddedMap, setCartAddedMap] = useState({});

  useEffect(() => {
    productdata();
  }, [products]);

  const productdata = async () => {
    try {
      const result = await Axios.get(
        `https://dmart.onrender.com/api/v1/product/search/${value}`
      );
      setProducts(result?.data);
    } catch (error) {
      console.error(error);
    }
  };

  
  const navigation = useNavigation();
  const handleProductDetails =(
    productId,
    productName,
    productSlug,
    productDescription,
    productFeature,
    productPrice,
    productDiscount,
    quantity,
    pricedata,
    categoryId
  )=>{
    // console.log("handleProductDetails", productId);
    try {
      navigation.navigate('aboutproduct', {
        productId,
        productName,
        productSlug,
        productDescription,
        productFeature,
        productPrice,
        productDiscount,
        quantity,
        pricedata,
        categoryId
      });
    } catch (error) {
      console.error("Error during navigation:", error);
    }
    // await 
  }


  
  const handleAddCart = async (
    productId,
    productName,
    productSlug,
    productDescription,
    productFeature,
    productPrice,
    productDiscount,
    quantity,
    pricedata
  ) => {
    if (cartAddedMap[productId]) {
      // If the item is already added, do nothing
      return;
    }
  
    try {
      const cartString = await AsyncStorage.getItem('@cart');
      const cart = cartString ? JSON.parse(cartString) : [];
      const selectedProduct = {
        productId,
    productName,
    productSlug,
    productDescription,
    productFeature,
    productPrice,
    productDiscount,
    quantity,
    pricedata
      };
  
      const updatedCart = [...cart, selectedProduct];
      await AsyncStorage.setItem('@cart', JSON.stringify(updatedCart));
  
      console.log('Item added to cart successfully!');
      
      // Update the cartAddedMap to mark the current product as added
      setCartAddedMap((prevMap) => ({
        ...prevMap,
        [productId]: true,
      }));
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

    console.log("products", products);
  //   console.log("value", value);



  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient colors={["#7F7FD5", "#E9E4F0"]} style={{ flex: 1 }}>
        <View style={styles.containersearch}>
          <View style={styles.headerContainer}>
            <View style={styles.logoContainer}>
              <Image
                style={styles.logo}
                source={require("../../img/c_logo.png")}
              />
            </View>
            <View style={styles.searchContainer}>
              <EvilIcons name="search" size={24} color="black" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                value={value}
                onChangeText={(text) => setValue(text.toLowerCase())}
              />
              <Feather name="mic" size={24} color="black" />
            </View>
          </View>
        </View>

        <ScrollView>
          <View>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
                paddingHorizontal: 15,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 20,
                  margin: 10,
                  fontWeight: "bold",
                }}
              >
                Search results
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-around",
              }}
            >
              {Array.isArray(products) && products.length > 0 ? (products.map((p) => (
                  <TouchableOpacity
                    key={p._id}
                    onPress={() =>
                      handleProductDetails({
                        productId: p._id,
                        productName: p.name,
                        productSlug: p.slug,
                        productDescription: p.description,
                        productFeature: p.feature,
                        productPrice: p.price,
                        productDiscount: p?.discount,
                        quantity: p.quantity === 1,
                        pricedata: p.pricedata,
                        categoryId: p.category,
                      })
                    }
                    style={styles.productContainer}
                  >
                    <View style={styles.imageContainer}>
                      <Image
                        source={{
                          uri: `https://dmart.onrender.com/api/v1/product/product-photo/${p._id}`, // TODO if not image hit api again
                        }}
                        style={styles.image}
                        resizeMode="cover"
                      />
                    </View>
                    <ScrollView style={styles.productDetails}>
                      <Text style={styles.productName}>{p.name}</Text>

                      <View style={styles.detailRow}>
                        <Text
                          style={{
                            color: "gray",
                            textDecorationLine: "line-through",
                          }}
                        >
                          {Math.floor(p.price * (100 / (100 - p.discount)))}
                        </Text>
                        <Text style={styles.Price}>&#x20B9; {p.price}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailValue}>
                          {p.discount ? p.discount : "0"}% OFF
                        </Text>
                      </View>
                      {/* Display other product details as needed */}
                    </ScrollView>

                    <Pressable
                      style={{
                        padding: 10,
                        backgroundColor: cartAddedMap[p._id]
                          ? "green"
                          : "white",
                        borderWidth: 0.5,
                        borderColor: cartAddedMap[p._id] ? "" : "blue",
                        borderRadius: 5,
                        width: "80%",
                        marginHorizontal: "10%",
                        marginBottom: 20,
                        alignItems: "center",
                      }}
                      onPress={() =>
                        handleAddCart(
                          p._id,
                          p.name,
                          p.slug,
                          p.description,
                          p.feature,
                          p.price,
                          p?.discount,
                          1,
                          p.pricedata
                        )
                      }
                      disabled={cartAddedMap[p._id]}
                    >
                      <Text
                        style={{
                          color: cartAddedMap[p._id] ? "white" : "blue",
                          fontWeight: "bold",
                        }}
                      >
                        {cartAddedMap[p._id] ? "View details" : "Add to Cart"}
                      </Text>
                    </Pressable>
                  </TouchableOpacity>
                ))
              ) : (
                <Text>No search result for "{value}"</Text>
              )}
            </View>
          </View>
          
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    backgroundColor: "black",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    height: 100,
    marginTop: 40,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  containersearch: {
    backgroundColor: "white",
    // flex: 1,
       // position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 99,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
    backgroundColor: "white",
    padding: 10,
  },
  logoContainer: {
    backgroundColor: "black",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 50,
    height: 30,
    marginTop: 20,
    borderRadius: 25,
    paddingBottom: 10,
  },
  searchContainer: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 20,
    padding: 10,
    marginLeft: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
  },
  productContainer: {
    width: 180,
    // height: 350,
    margin: 8,
    borderRadius: 10,
    shadowColor: "white",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    elevation: 5,
    backgroundColor: "#f2f3f4",
  },
  imageContainer: {
    flex: 1,
    borderRadius: 10,
    height: 200,
    width: 130,
    marginHorizontal: "15%",
    marginVertical: 10,
    alignItems: "stretch",
    justifyContent: "center",

    // overflow: 'hidden',
  },
  image: {
    flex: 1,
    borderRadius: 10,
    height: 200,
    width: "auto",
    padding: 20,
    margin: "auto",
  },
  productDetails: {
    padding: 8,
  },
  productName: {
    fontWeight: "bold",
    textAlign: "center",
  },
  productDescription: {
    color: "gray",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // borderBottomWidth: 1,
    // borderColor: "gray",
    paddingBottom: 5,
    marginBottom: 5,
  },
  detailValue: {
    color: "#000000",
  },
  Price: {
    color: "green",
    fontWeight: "bold",
    textAlign: "center",
  },
});
