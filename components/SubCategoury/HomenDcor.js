import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomenDecor = () => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [CartAdded, setCartAdded] = useState(false);
  const [cartAddedMap, setCartAddedMap] = useState({});
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [radios, setRadios] = useState([]);
  const [sub, setSub] = useState([]);
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [Discount, setDiscount] = useState([]);
  const [Prices, setPrices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  // Get all products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `https://dmart.onrender.com/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const filterProduct = async () => {
    try {
      const { data } = await axios.post(
        "https://dmart.onrender.com/api/v1/product/product-filters",
        {
          checked: ["65ae302a70cae3e36c6014e3"],
          radio:[],
          radios: [],
          sub: []
        }
      );
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllProducts();
    getTotal();
    handleAddCart();
    getAllSubCategory();
    getAllCategory();
    filterProduct();
  }, [page, cartAddedMap]);

  // Get total count
  const getTotal = async () => {
    try {
      const { data } = await axios.get(
        "https://dmart.onrender.com/api/v1/product/product-count"
      );
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        "https://dmart.onrender.com/api/v1/category/get-category"
      );
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getAllSubCategory = async () => {
    try {
      const { data } = await axios.get(
        "https://dmart.onrender.com/api/v1/subcategory/get-sub-category"
      );
      if (data?.success) {
        console.log(data);
        setSubCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      console.log("Something went wrong in getting catgeory");
    }
  };

  // Load more
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `https://dmart.onrender.com/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      // setProducts([...products, ...data?.products]);
      setPrices([...products, ...data?.products.price]);
      setDiscount([...products, ...data?.products.discount]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const navigation = useNavigation();
  const handleProductDetails = (
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
  ) => {
    // console.log("handleProductDetails", productId);
    try {
      navigation.navigate("aboutproduct", {
        productId,
        productName,
        productSlug,
        productDescription,
        productFeature,
        productPrice,
        productDiscount,
        quantity,
        pricedata,
        categoryId,
      });
    } catch (error) {
      console.error("Error during navigation:", error);
    }
    // await
  };

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
      const cartString = await AsyncStorage.getItem("@cart");
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
        pricedata,
      };

      const updatedCart = [...cart, selectedProduct];
      await AsyncStorage.setItem("@cart", JSON.stringify(updatedCart));

      console.log(`${productName} added to cart successfully!`);
      setCartAddedMap((prevMap) => ({
        ...prevMap,
        [productId]: true,
      }));
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const getFirstWords = (text, numWords) => {
    const words = text.split(' ');
    const truncatedText = words.slice(0, numWords).join(' ');
    return truncatedText + (words.length > numWords ? '...' : '');
  };
  

  return (
    <View style={{backgroundColor: '#d3d3d3', marginVertical:5}}>
      <View>
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
          Home and Decors
            </Text>
            
          </View> 
        
          <ScrollView
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              
            }}
            horizontal={true}
          >
            {products?.map((p) => (
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
                    productDiscount: p.discount,
                    quantity: p.quentity === 1,
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
                <Text style={styles.productName}>{getFirstWords(p.name, 2)}</Text>
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
               
                </ScrollView>
               
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
       
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  productContainer: {
    // width: 100,
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
    height: 50,
    width: "90%",
    // marginHorizontal: "15%",
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    },
  image: {
    flex: 1,
    borderRadius: 10,
    // height: 150,
    width: 20,
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

export default HomenDecor;
