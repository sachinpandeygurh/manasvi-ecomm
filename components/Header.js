import React from "react";
import { StyleSheet, View, Image, TextInput, Pressable, Text } from "react-native";
import { EvilIcons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Header() {
  const router = useRouter();

  const handleHomePress = () => {
    router.push("(home)");
  };

  const handleSearchPress = () => {
    router.push("searchScreen");
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Pressable onPress={handleHomePress} style={styles.logoContainer}>
          <Image style={styles.logo} source={require("../img/c_logo.png")} />
        </Pressable>
        <Pressable onPress={handleSearchPress} style={styles.searchContainer}>
          <EvilIcons  name="search" size={24} color="black" />
          <Text style={styles.searchInput} >Search...</Text>
          {/* <TextInput style={styles.searchInput} placeholder="Search..." /> */}
          <Feather name="mic" size={24} color="black" />
        </Pressable>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex:99
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
});
