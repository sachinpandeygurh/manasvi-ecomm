import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import axios from 'axios';
import { Pressable } from 'react-native';

const ProductDetails = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const route = useRoute();

  const [cart, setCart] = useState([]);
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [productPhotos, setProductPhotos] = useState([]);
  const [siPi, setSiPi] = useState([]);
  const [unit, setUnit] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState('');
  const [nprice, setNPrice] = useState('');
  const [cartAddedMap, setCartAddedMap] = useState({});
  const [imgnum , setImgnum] = useState(1)
  const qandp = ()=>{

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
  }
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
  } = route.params;
  console.log("pricedata", pricedata);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`https://dmart.onrender.com/api/v1/product/get-product/${productId}`);
        setProduct(data?.product);
        getSimilarProduct(data?.product?._id, data?.product?.category?._id);
        getProductAllPhoto(data?.product?._id);

        const pd = data?.product?.pricedata;
        const pdata = pd ? JSON.parse(pd) : {};

        for (const propertyName in pdata) {
          if (pdata.hasOwnProperty(propertyName) && Array.isArray(pdata[propertyName])) {
            const u = propertyName;
            setUnit(u);
          }
        }

      }catch (error) {
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

  // const data =[ "kg" ,"gm" ,"liter","ml","meter","cm","pcs","size" ]
  

  console.log("sipi", siPi)

  useEffect(() => {
    if (selectedQuantity) {
      const selectedSize = siPi.find((item) => item.quantity === selectedQuantity);
      if (selectedSize) {
        setNPrice(selectedSize.price);
      }
    }
  }, [selectedQuantity, siPi]);

  const getProductAllPhoto = async () => {
    try {
      // console.log("productId2", productId);
      const { data } = await axios.get(`https://dmart.onrender.com/api/v1/product/product-allphoto/${productId?.productId}`);
      console.log("data", data);
      if (data) {
        setProductPhotos(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // console.log("ProductPhotos", productPhotos);



  const getSimilarProduct = async () => {
    try {
      const { data } = await axios.get(`https://dmart.onrender.com/api/v1/product/related-product/${productId}/${categoryId}`);
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  const changeMainImage = (index) => {
   setImgnum(index)
  };

  const handleQuantityChange = (value) => {
    setSelectedQuantity(value);
  };

  const handleAddCart = async () => {
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
        Quantity: selectedQuantity,
        pricedata,
      };

      const updatedCart = [...cart, selectedProduct];
      await AsyncStorage.setItem('@cart', JSON.stringify(updatedCart));

      console.log('Item added to cart successfully!');
      Alert.alert('Item Added to cart');
      setCartAddedMap((prevMap) => ({
        ...prevMap,
        [productId]: true,
      }));
      router.push('(home)');
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };
  // console.log("pricedata", pricedata);
  return (
    <>
      <ScrollView>
        <View style={{ margin: 16 }}>
          <View style={{ alignItems: 'center' }}>
            <Image
              source={{ uri: `data:${productPhotos[0]?.contentType};base64,${productPhotos[imgnum]?.data}` }}
              style={{ width: 300, height: 300 }}
              resizeMode="cover"
            />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            {productPhotos.map((photo, index) => (
              <TouchableOpacity key={index} onPress={() => changeMainImage(index)}>
                <Image
                  source={{ uri: `data:${photo.contentType};base64,${photo?.data}` }}
                  style={{ width: 60, height: 60, margin: 4 }}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.productContainer}>
          <ScrollView style={styles.productDetailsContainer}>
            <Text style={styles.productName}>{productName}</Text>
            <View style={styles.productDescription}>
              <Text style={styles.productDetails}>{productDescription}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={{ color: "gray", textDecorationLine: "line-through" }}>
                {Math.floor(productPrice * (100 / (100 - productDiscount)))}
              </Text>
              <Text style={styles.Price}>&#x20B9; {productPrice}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailValue}>{productDiscount ? productDiscount : "0"}% OFF</Text>
            </View>
            <View >
              <Text>Available quantities</Text>
              <Picker  style={{color:"red",  backgroundColor:"gray"}}
                selectedValue={selectedQuantity}
                onValueChange={(itemValue) => handleQuantityChange(itemValue)}
              >
                <Picker.Item style={{color:"red", backgroundColor:"blue", height:300}} label="Please select an option" value={pricedata} />
                {pricedata && siPi?.map((item, index) => (
                  <Picker.Item style={{color:"red" , backgroundColor:"green"}} key={index} label={item.quantity} value={item.price} /> // TODO data nor vshoww in app
                ))}
              </Picker>
              <Text >Selected quantity: {selectedQuantity}</Text>
            </View>
          </ScrollView>

          <Pressable
            style={{
              padding: 10,
              backgroundColor:"white",
              borderWidth: 0.5,
              borderColor:  "blue",
              borderRadius: 5,
              width: "80%",
              marginHorizontal: "10%",
              marginBottom: 20,
            }}
            onPress={handleAddCart}
            
          >
            <Text style={{ textAlign: "center", color:"blue", fontWeight: "bold" }}>
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
                  source={{ uri: `https://dmart.onrender.com/api/v1/product/product-photo/${p._id}` }}
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
    alignItems: 'center',
  },
  mainImageStyle: {
    width: 300,
    height: 300,
  },
  thumbnailContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  thumbnailImage: {
    width: 60,
    height: 60,
    margin: 4,
  },
  productContainer: {
    marginTop: 16,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: 'blue',
    width: '80%',
    marginHorizontal: '10%',
    marginBottom: 20,
    height: 250
  },
  productDetailsContainer: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productDescription: {
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  Price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailValue: {
    fontSize: 16,
    color: 'green',
  },
  quantityPickerContainer: {
    marginVertical: 8,
  },
  quantityPicker: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
  },
  selectedQuantityText: {
    marginTop: 8,
    fontSize: 16,
  },
  addToCartButton: {
    padding: 10,
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: 'blue',
    borderRadius: 5,
    width: '80%',
    marginHorizontal: '10%',
    marginBottom: 20,
  },
  addToCartButtonText: {
    textAlign: 'center',
    color: 'blue',
    fontWeight: 'bold',
  },
  similarProductsContainer: {
    margin: 16,
  },
  similarProductsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  noSimilarProductsText: {
    textAlign: 'center',
  },
  similarProductItem: {
    width: '33%',
  },
  similarProductImage: {
    width: '100%',
    height: 150,
  },
  similarProductPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  similarProductPrice: {
    fontSize: 16,
  },
  discountedPrice: {
    textDecorationLine: 'line-through',
    color: 'red',
  },
});


export default ProductDetails;
