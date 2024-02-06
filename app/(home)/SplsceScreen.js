import React, { useEffect } from "react";
import { StyleSheet, View, Pressable, Text, Animated } from "react-native";
import { useRouter } from "expo-router";

export default function SplashScreen({ navigation }) {
  const router = useRouter();

  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start(() => {
     
      router.push('(home)');

    });
  }, [fadeAnim, navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Pressable style={styles.logoPressable}>
          <Animated.Image
            style={{ ...styles.logo, opacity: fadeAnim }}
            source={require("../../img/c_logo.png")}
          />
        </Pressable>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Manasvi Dmart</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000", // Set your background color
  },
  logoContainer: {
    alignItems: "center",
  },
  logoPressable: {
    borderRadius: 50,
    overflow: "hidden",
  },
  logo: {
    width: 150,
    height: 150,
  },
  titleContainer: {
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333", // Set your text color
  },
});
