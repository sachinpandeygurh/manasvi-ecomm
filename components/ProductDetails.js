import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import {Picker} from '@react-native-picker/picker' 
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
// import Toast from 'react-native-Toast-message';

const ProductDetails = ( ) => {
  const navigation = useNavigation();
  const [cart, setCart] = useState([]);
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [productPhotos, setProductPhotos] = useState([]);
  const [siPi, setSiPi] = useState([]);
  const [unit, setUnit] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(siPi[1]?.quantity);
  const [nprice, setNPrice] = useState('');

  const route = useRoute();
  const productId = route?.params?.id;
  const handleQuantityChange = (value) => {
    setSelectedQuantity(value);
  };

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
        setSiPi(qandp);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [route.params.slug]);

  const getProductAllPhoto = async (productId) => {
    try {
      const { data } = await axios.get(`https://dmart.onrender.com/api/v1/product/product-allphoto/${productId}`);
      console.log("data",data);
      if (data) {
        setProductPhotos(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getSimilarProduct = async (productId, categoryId) => {
    try {
      const { data } = await axios.get(`https://dmart.onrender.com/api/v1/product/related-product/${productId}/${categoryId}`);
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  const addToCart = (product, selectedSize) => {
    if (!selectedSize) {
        Alert.alert('Please select a valid quantity');
      return;
    }

    const updatedCart = [...cart];
    const existingProduct = updatedCart.find((item) => item._id === product._id);

    if (existingProduct) {
      existingProduct.customQuantity += 1;
    } else {
      updatedCart.push({ ...product, customQuantity: 1, selectedSize, unit });
    }

    setCart(updatedCart);
    // localStorage.setItem('cart', JSON.stringify(updatedCart)); // React Native doesn't have localStorage
    Alert.alert('Item Added to cart');
  };

  const changeMainImage = (photo) => {
    // Handle changing the main image
  };

  const selectedSize = siPi.find((item) => item.quantity === selectedQuantity);

  useEffect(() => {
    if (selectedSize) {
      setNPrice(selectedSize.price);
    }
  }, [selectedSize]);
console.log("productPhotos", productPhotos);
  return (
    <>
      <ScrollView>
        <View style={{ margin: 16 }}>
          <View style={{ alignItems: 'center' }}>
            <Image
              source={{ uri: `data:${productPhotos[0]?.contentType};base64,${productPhotos[0]?.data}` }}
              style={{ width: 300, height: 300 }}
              resizeMode="cover"
            />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            {productPhotos.map((photo, index) => (
              <TouchableOpacity key={index} onPress={() => changeMainImage(photo)}>
                <Image
                  source={{ uri: `data:${photo.contentType};base64,${photo?.data}` }}
                  style={{ width: 60, height: 60, margin: 4 }}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ margin: 16 }}>
          {/* <Text style={{ textAlign: 'center', fontSize: 24 }}>{product}</Text> */}
          <View style={{ borderBottomWidth: 1, borderBottomColor: 'grey', marginVertical: 8 }} />

          <View style={{ marginVertical: 8 }}>
            <Text>Available quantities:</Text>
            <Picker
              selectedValue={selectedQuantity}
              onValueChange={(itemValue) => handleQuantityChange(itemValue)}
            >
              <Picker.Item label="Please select an option" value="" />
              {siPi.map((item) => (
                <Picker.Item key={item.quantity} label={item.quantity} value={item.quantity} />
              ))}
            </Picker>
            <Text>Selected quantity: {selectedQuantity}</Text>
          </View>

          {nprice && selectedSize ? (
            <>
              <Text>
                Updated Price: {Math.round(nprice).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
              </Text>
              {/* Include other details related to the selected size */}
            </>
          ) : (
            <Text>No pricing information available for the selected option.</Text>
          )}

          {/* Other product details */}
          {/* ... */}

          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              borderRadius: 8,
              paddingVertical: 12,
              marginVertical: 16,
              alignItems: 'center',
                borderWidth: 1,
                    borderColor: "blue",
            }}
            onPress={() => {
            //   addToCart(product, selectedSize);
            }}
          >
            <Text style={{ color: 'blue', fontWeight: 'bold' }}>ADD TO CART</Text>
          </TouchableOpacity>
        </View>

        <View style={{ margin: 16 }}>
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
                {/* <Text>{p.name}</Text> */}
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
        </View>
      </ScrollView>
    </>
  );
};

export default ProductDetails;
