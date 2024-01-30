import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import PropTypes from 'deprecated-react-native-prop-types';
import { useNavigation } from '@react-navigation/native';

const Category = () => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    getAllCategory();
  }, []);
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        "https://dmart.onrender.com/api/v1/bcategory/all"
      );
      if (data?.success) {
        setCategories(data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const navigation = useNavigation();

  const handleonpress = async ({ subCategoryId , subCategoryName }) => {
    try {
      navigation.navigate('subCategory', {
        id: subCategoryId,
        name: subCategoryName
      });
    } catch (error) {
      console.error("Error during navigation:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.customText}>Categories</Text>
      <View style={styles.cardContainer}>
        {!categories || categories.length === 0  ? (
          <Text style={{ margin: 25, padding: 40 }}>
            <Text style={{ fontSize: 24, fontWeight: "bold" }}>Loading</Text>{" "}
            Please wait...
          </Text>
        ) : (
          categories.map((item) => (
            <Pressable
              onPress={() => handleonpress({ subCategoryId: item._id, subCategoryName: item.name })}
              key={item._id}
              style={styles.card}
            >
              <Image
                style={styles.img}
                source={{
                  uri: `https://dmart.onrender.com/api/v1/bcategory/single-photo/${item._id}`,
                }}
              />
              <Text style={styles.name}>{item.name}</Text>
            </Pressable>
          ))
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    paddingVertical: 20,
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
  },
  customText: {
    fontWeight: "bold",
    fontSize: 30,
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    marginTop: 20,
  },
  card: {
    width: 89,
    height: 90,
    alignItems: "center",
  },
  img: {
    width: 50,
    height: 50,
    borderRadius: 15,
  },
  name: {
    fontSize: 12,
    color: "#6A6A6A",
    marginTop: 5,
  },
});

export default Category;
