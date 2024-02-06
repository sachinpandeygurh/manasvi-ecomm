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

const Products = () => {
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
          checked,
          radio,
          radios,
          sub,
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
        // console.log(data);
        setSubCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      console.log("Something went wrong in getting catgeory");
    }
  };

  const handleFilter = (isChecked, categoryId) => {
    console.log(`handleFilter called with isChecked: ${isChecked}, categoryId: ${categoryId}`);
    // Your logic for handling category filter
  };
  
  const handleSubFilter = (isChecked, subcategoryId) => {
    console.log(`handleSubFilter called with isChecked: ${isChecked}, subcategoryId: ${subcategoryId}`);
    // Your logic for handling subcategory filter
  };
  
  // const setCategories = (newCategories) => {
  //   console.log(`setCategories called with newCategories:`, newCategories);
  //   // Your logic for setting categories
  // };
  
  // const setDiscount = (newDiscount) => {
  //   console.log(`setDiscount called with newDiscount:`, newDiscount);
  //   // Your logic for setting discount
  // };
  
  // const setPrices = (newPrices) => {
  //   console.log(`setPrices called with newPrices:`, newPrices);
  //   // Your logic for setting prices
  // };
  
  // const setSubCategories = (newSubCategories) => {
  //   console.log(`setSubCategories called with newSubCategories:`, newSubCategories);
  //   // Your logic for setting subcategories
  // };

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

      // Update the cartAddedMap to mark the current product as added
      setCartAddedMap((prevMap) => ({
        ...prevMap,
        [productId]: true,
      }));
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };
  console.log("products", products);

  const Checkbox = ({ label, checked, onChange }) => {
    return (
      <TouchableOpacity style={{marginVertical:5}}  onPress={onChange}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 5,
              borderWidth: 2,
              borderColor: "black",
              backgroundColor: checked ? "blue" : "white",
              marginRight: 10,
            }}
          />
          <Text>{label}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const filtermodel = () => {
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <ScrollView>
          <View style={{ margin: 15 }}>
            <Text
              style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
            >
              Filter By Category
            </Text>
            <View style={{ flexDirection: "column" }}>
              {categories?.map((c) => (
                <Checkbox
                  key={c._id}
                  onChange={(isChecked) => handleFilter(isChecked, c.array)} 
                  label={c.name}
                />
              ))}
            </View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginTop: 15,
                marginBottom: 10,
              }}
            >
              Filter By SubCategory
            </Text>
            <View style={{ flexDirection: "column" }}>
              {subcategories?.map((c) => (
                <Checkbox style={{marginVertical:10}}
                  key={c._id}
                  onChange={(isChecked) => handleSubFilter(isChecked, c._id)}
                  label={`${c.name}`}
                />
              ))}
            </View>
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: "black",
                marginVertical: 15,
              }}
            />
            <Text
              style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
            >
              Filter By Price
            </Text>
            <View style={{ flexDirection: "column" }}>
              {Prices?.map((p) => (
                <Checkbox
                  key={p._id}
                  onChange={(isChecked) => handleSubFilter(isChecked, p._id)}
                  label={`${p.name}`}
                />
              ))}
            </View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginTop: 15,
                marginBottom: 10,
              }}
            >
              Filter By Discount
            </Text>
            <View style={{ flexDirection: "column" }}>
              {Discount?.map((p) => (
                <Checkbox
                  key={p._id}
                  onChange={(isChecked) => handleSubFilter(isChecked, p._id)}
                  label={`${p.name}`}
                />
              ))}
            </View>
            <View style={{ flexDirection: "column", marginTop: 15 }}>
              <TouchableOpacity
                onPress={() => {
                  setCategories([]);
                  setDiscount([]);
                  setPrices([]);
                  setSubCategories([]);
                }}
                style={{
                  backgroundColor: "green",
                  padding: 10,
                  borderRadius: 5,
                }}
              >
                <Text style={{ color: "white", textAlign: "center" }}>
                  RESET FILTERS
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
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
              All Products List
            </Text>
            <Pressable
              onPress={() => setFilterModalVisible(!isFilterModalVisible)}
              style={{ textAlign: "center", fontSize: 20, margin: 10 }}
            >
              <Text style={{color:!isFilterModalVisible?"green":"red"}}>{isFilterModalVisible? "Hide filter": "Show filter"}</Text>
            </Pressable>
          </View> 
          {isFilterModalVisible && filtermodel()}
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
                    backgroundColor: cartAddedMap[p._id] ? "green" : "white",
                    borderWidth: 0.5,
                    borderColor: cartAddedMap[p._id] ? "" : "blue",
                    borderRadius: 5,
                    width: "80%",
                    marginHorizontal: "10%",
                    marginBottom: 20,
                  }}
                  onPress={() =>
                    handleAddCart(
                      (productId = p._id),
                      (productName = p.name),
                      (productSlug = p.slug),
                      (productDescription = p.description),
                      (productFeature = p.feature),
                      (productPrice = p.price),
                      (productDiscount = p?.discount),
                      1,
                      p.pricedata
                    )
                  }
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
        {/* <View style={{ margin: 8, alignItems: "center" }}>
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
        </View> */}
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

export default Products;
