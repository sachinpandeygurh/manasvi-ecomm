import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import axios from "axios";
import { Pressable } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";

const ProductDetails = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const route = useRoute();

  const [cart, setCart] = useState([]);
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [productPhotos, setProductPhotos] = useState([]);
  const [siPi, setSiPi] = useState([]);
  const [unit, setUnit] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState("");
  const [nprice, setNPrice] = useState("");
  const [cartAddedMap, setCartAddedMap] = useState({});
  const [imgnum, setImgnum] = useState(1);
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const qandp = () => {
    pdata.kg ||
      pdata.gm ||
      pdata.liter ||
      pdata.ml ||
      pdata.meter ||
      pdata.cm ||
      pdata.pcs ||
      pdata.size ||
      [];
    setSiPi(qandp);
  };
  // i write this way because it is work on this way
  const {
    productId = productId.productId,
    productName = productId.productName,
    productSlug = productId.productSlug,
    productDescription = productId.productDescription,
    productFeature = productId.productFeature,
    productPrice = productId.productPrice,
    productDiscount = productId.productDiscount,
    quantity = productId.quantity,
    pricedata = productId.pricedata,
    categoryId = productId.categoryId,
  } = route.params;

  const [productNewPrice, setProductNewPrice] = useState(productPrice);

  console.log("product", product);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `https://manasvimart.in/api/v1/product/get-product/${productId}`
        );
        setProduct(data);
        getSimilarProduct(data?.product?._id, data?.product?.category?._id);
        getProductAllPhoto(data?.product?._id);

        const pd = data?.product?.pricedata;
        const pdata = pd ? JSON.parse(pd) : {};

        for (const propertyName in pdata) {
          if (
            pdata.hasOwnProperty(propertyName) &&
            Array.isArray(pdata[propertyName])
          ) {
            const u = propertyName;
            setUnit(u);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    const pdata = pricedata ? JSON.parse(pricedata) : {};
    const qandp =
      pdata.kg ||
      pdata.gm ||
      pdata.liter ||
      pdata.ml ||
      pdata.meter ||
      pdata.cm ||
      pdata.pcs ||
      pdata.size ||
      [];

    for (const propertyName in pdata) {
      if (
        pdata.hasOwnProperty(propertyName) &&
        Array.isArray(pdata[propertyName])
      ) {
        const u = propertyName;
        console.log(u, "unit");
        setUnit(u);
      }
    }

    setSiPi(qandp);

    fetchData();
  }, [route.params.slug]);

  useEffect(() => {
    if (selectedQuantity) {
      const selectedSize = siPi.find(
        (item) => item.quantity === selectedQuantity
      );
      if (selectedSize) {
        setNPrice(selectedSize.price);
      }
    }
  }, [selectedQuantity, siPi]);

  const getProductAllPhoto = async () => {
    try {
      // console.log("productId2", productId);
      const { data } = await axios.get(
        `https://manasvimart.in/api/v1/product/product-allphoto/${productId?.productId}`
      );
      // console.log("data", data);
      if (data) {
        setProductPhotos(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getSimilarProduct = async () => {
    try {
      const { data } = await axios.get(
        `https://manasvimart.in/api/v1/product/related-product/${productId}/${categoryId}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  const changeMainImage = (index) => {
    setImgnum(index);
  };

  const handleQuantityChange = (value) => {
    setSelectedQuantity(value);
  };
  const handleQuantityPrice = (value, price) => {
    setSelectedQuantity(value), setProductNewPrice(price);
  };

  const handleAddCart = async ( productId,
    productName,
    productSlug,
    productDescription,
    productFeature,
    productPrice,
    productDiscount,
    quantity,
    pricedata
    ) => {
     
    try {
      if (!productId || !productName || !productPrice || !quantity || !pricedata) {
        Alert.alert("Invalid product data");
        return;
      }
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
        pricedata
      };

      const updatedCart = [...cart, selectedProduct];
      await AsyncStorage.setItem("@cart", JSON.stringify(updatedCart));

      console.log("Item added to cart successfully!");
      Alert.alert(`${productName} added to cart successfully!`, "", [
        { text: "OK", style: "default" },
      ]);      
      setCartAddedMap((prevMap) => ({
        ...prevMap,
        [productId]: true,
      }));
      router.push("cart");
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };
  // console.log("pricedata", pricedata);

  return (
    <>
      <ScrollView>
        <View style={{ margin: 16 }}>
          <View style={{ alignItems: "center" }}>
            <Image
              source={{
                uri: `data:${productPhotos[0]?.contentType};base64,${productPhotos[imgnum]?.data}`,
              }}
              style={{ width: 300, height: 300 }}
              resizeMode="cover"
            />
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ flexDirection: "row" }}
          >
            {productPhotos.map((photo, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => changeMainImage(index)}
              >
                <Image
                  source={{
                    uri: `data:${photo.contentType};base64,${photo?.data}`,
                  }}
                  style={{ width: 60, height: 60, margin: 4 }}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.productContainer}>
          <ScrollView style={styles.productDetailsContainer}>
            <Text style={styles.productName}>{productName}</Text>
            <View style={styles.productDescription}>
              <Text style={styles.productDetails}>{productDescription}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text
                style={{ color: "gray", textDecorationLine: "line-through" }}
              >
                {Math.floor(productNewPrice * (100 / (100 - productDiscount)))}
              </Text>
              <Text style={styles.Price}>&#x20B9; {productNewPrice}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailValue}>
                {productDiscount ? productDiscount : "0"}% OFF
              </Text>
            </View>
            <View>
              <Text>Available values</Text>
              <View
                style={{
                  borderColor: "gray",
                  borderWidth: 1,
                  borderRadius: 20,
                  width: "100%",
                  overflow: "hidden",
                }}
              >
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    flexDirection: "row",
                    alignItems: "center",
                    // paddingVertical: 10,
                    backgroundColor: "gray",
                  }}
                >
                  {siPi.map((item, index) => (
                    <TouchableOpacity
                      style={{
                        flexDirection: "column",
                        alignItems: "center",
                        padding: 10,
                        marginHorizontal: 5,
                        backgroundColor: "white",
                      }}
                      key={`${item.quantity}-${index}`}
                      onPress={() =>
                        handleQuantityPrice(item.quantity, item.price)
                      }
                    >
                      <Text
                        style={{
                          color: "black",
                          fontWeight: "900",
                          marginBottom: 5,
                        }}
                      >
                        {item.quantity}
                      </Text>
                      <Text style={styles.Price}>&#x20B9; {item.price}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <Text>Selected value: {selectedQuantity}</Text>
            </View>
          </ScrollView>

          {/*  TODO implement this logic
          <View>
              <Text>Available quantities</Text>
              <Text
                style={{ color: "red", backgroundColor: "gray" }}
                selectedValue={selectedQuantity}
                onValueChange={(itemValue) => handleQuantityChange(itemValue)}
              >
                <View> <Text>
                  Please select an option {value=null}
                  </Text>
                  </View>
                {siPi.map((item, index) => (
                  <TouchableOpacity  style={{
                    color: "red",
                    backgroundColor: "white",
                    borderRadius: 5,
                    padding: 10,
                    height:200
                  }}
                    key={index}
                    >

                      <Text>{item.quantity}</Text>
                      <Text>{item.price}</Text>
                    </TouchableOpacity>
                    
                    
                  
                ))}
              </Text>

              <Text>Selected quantity: {selectedQuantity}</Text>
            </View> */}

          <Pressable
            style={{
              padding: 10,
              backgroundColor: "white",
              borderWidth: 0.5,
              borderColor: "blue",
              borderRadius: 5,
              width: "80%",
              marginHorizontal: "10%",
              marginBottom: 0,
            }}
            onPress={() =>
              handleAddCart(
                productId?.productId,
                productName,
                productSlug,
                productDescription,
                productFeature,
                productPrice,
                productDiscount,
                1,
                pricedata
              )
            }
          >
            <Text
              style={{ textAlign: "center", color: "blue", fontWeight: "bold" }}
            >
              Add to cart
            </Text>
          </Pressable>
        </View>

        {/* <View style={{ margin: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Similar Products ➡️</Text>
          {relatedProducts.length < 1 && (
            <Text style={{ textAlign: 'center' }}>No Similar Products found</Text>
          )}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {relatedProducts && relatedProducts?.map((p) => (
              <TouchableOpacity key={p._id} style={{ width: '33%' }} onPress={() => navigation.navigate(`/product/${p.slug}`)}>
                <Image
                  source={{ uri: `https://manasvimart.in/api/v1/product/product-photo/${p._id}` }}
                  style={{ width: '100%', height: 150 }}
                  resizeMode="cover"
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text>
                    {Math.round(p.price - (p.price * p.discount) / 100).toLocaleString('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                    })}
                  </Text>
                  <Text style={{ textDecorationLine: 'line-through', color: 'red' }}>
                    {p.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View> */}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  mainImage: {
    alignItems: "center",
  },
  mainImageStyle: {
    width: 300,
    height: 300,
  },
  thumbnailContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  thumbnailImage: {
    width: 60,
    height: 60,
    margin: 4,
  },
  productContainer: {
    marginTop: 16,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: "blue",
    width: "80%",
    marginHorizontal: "10%",
    marginBottom: 80,
    height: 400,
  },
  productDetailsContainer: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  productDescription: {
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  Price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "green",
  },
  detailValue: {
    fontSize: 16,
    color: "green",
  },
  quantityPickerContainer: {
    marginVertical: 8,
  },
  quantityPicker: {
    height: 40,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
  },
  selectedQuantityText: {
    marginTop: 8,
    fontSize: 16,
  },
  addToCartButton: {
    padding: 10,
    backgroundColor: "white",
    borderWidth: 0.5,
    borderColor: "blue",
    borderRadius: 5,
    width: "80%",
    marginHorizontal: "10%",
    marginBottom: 0,
  },
  addToCartButtonText: {
    textAlign: "center",
    color: "blue",
    fontWeight: "bold",
  },
  similarProductsContainer: {
    margin: 16,
  },
  similarProductsHeader: {
    fontSize: 20,
    fontWeight: "bold",
  },
  noSimilarProductsText: {
    textAlign: "center",
  },
  similarProductItem: {
    width: "33%",
  },
  similarProductImage: {
    width: "100%",
    height: 150,
  },
  similarProductPriceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  similarProductPrice: {
    fontSize: 16,
  },
  discountedPrice: {
    textDecorationLine: "line-through",
    color: "red",
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
});

export default ProductDetails;
