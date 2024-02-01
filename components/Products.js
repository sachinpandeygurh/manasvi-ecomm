import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";
import axios from "axios";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [CartAdded, setCartAdded] = useState(false);
  const [cartAddedMap, setCartAddedMap] = useState({});
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

  useEffect(() => {
    getAllProducts();
    getTotal();
    handleAddCart()
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

  // Load more
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `https://dmart.onrender.com/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const navigation = useNavigation();
  const handleProductDetails =(productId,  categoryId)=>{
    // console.log("handleProductDetails", productId);
    try {
      navigation.navigate('aboutproduct', {
        id: productId,
        categoryId
      });
    } catch (error) {
      console.error("Error during navigation:", error);
    }
    // await 
  }
  const handleAddCart = async (
    product_id,
    productid,
    productname,
    slug,
    description,
    feature,
    price,
    baseCategory
  ) => {
    if (cartAddedMap[product_id]) {
      // If the item is already added, do nothing
      return;
    }
  
    try {
      const cartString = await AsyncStorage.getItem('@cart');
      const cart = cartString ? JSON.parse(cartString) : [];
      const selectedProduct = {
        product_id, 
        productname,
        slug,
        description,
        feature,
        price,
        discount ,
        quentity
      };
  
      const updatedCart = [...cart, selectedProduct];
      await AsyncStorage.setItem('@cart', JSON.stringify(updatedCart));
  
      console.log('Item added to cart successfully!');
      
      // Update the cartAddedMap to mark the current product as added
      setCartAddedMap((prevMap) => ({
        ...prevMap,
        [product_id]: true,
      }));
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };
  
  return (
    <View>
      <ScrollView>
        <View>
        <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
              paddingHorizontal:15
            }}
          >
          <Text style={{ textAlign: "center", fontSize: 20, margin: 10, fontWeight:"bold" }}>
            All Products List
          </Text>
          <Text onPress={{// TODO intregate filter here
          }} style={{ textAlign: "center", fontSize: 20, margin: 10 }}>
          Filter
          </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-around",
            }}
          >
            {products?.map((p) => (
              <TouchableOpacity 
                key={p._id}
                onPress={() => handleProductDetails(p._id, p.category)}
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
                
                    <Text style={{color:"gray", textDecorationLine: "line-through"}}>{Math.floor(p.price * (100/(100-p.discount)))}</Text>
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
              backgroundColor: cartAddedMap[p._id] ? "green" : "white",
              borderWidth: 0.5,
              borderColor: cartAddedMap[p._id] ? "" : "blue",
              borderRadius: 5,
              width: "80%",
              marginHorizontal: "10%",
              marginBottom: 20
            }}
            onPress={() => handleAddCart(
              p._id ,
              productname=p.name,
              category=p.slug,
              p.description,
              p.feature,
              p.price,
              discount=p?.discount ,
              quentity=1
              )}
            disabled={cartAddedMap[p._id]} 
          >
            <Text
              style={{
                textAlign: "center",
                color: cartAddedMap[p._id] ? "white" : "blue",
                fontWeight: "bold",
              }}
            >
              {cartAddedMap[p._id] ? "View details" : "Add to Cart"}
            </Text>
          </Pressable>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={{ margin: 8, alignItems: "center" }}>
          {products && products.length < total && (
            <TouchableOpacity
              style={{ padding: 10, backgroundColor: "blue", borderRadius: 5 }}
              onPress={() => setPage(page + 1) && loadMore()}
              // TODO : disable button when complete product add plus button and set loder
            >
              <Text style={{ color: "white" }}>
                {loading ? "Loading..." : "See More"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
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
    textAlign:"center"
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
    textAlign:"center"
  },
});

export default Products;
