import React, { Component } from "react";
import { Text, StyleSheet, View, Image, TextInput } from "react-native";
import { EvilIcons, Feather } from '@expo/vector-icons';

export default class Header extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            <Image style={styles.logo} source={require("../img/c_logo.png")} />
            
          </View>
          <View style={styles.searchContainer}>
            <EvilIcons name="search" size={24} color="black" />
            <TextInput style={styles.searchInput} placeholder="Search..." />
            <Feather name="mic" size={24} color="black" />
          </View>
        </View>
      </View>
    );
  }
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
