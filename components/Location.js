import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Alert,
  Image,
  Pressable,
  TextInput,
  Button,
  Modal,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import * as Location from "expo-location";

const LocationComponent = ({ navigation }) => {
  const [displayCurrentAddress, setDisplayCurrentAddress] =
    useState( "We are loading your location");
  const [locationServicesEnabled, setLocationServicesEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [maplocation, SetMaplocation] = useState(
    "We are loading your location"
  );

  useEffect(() => {
    checkIfLocationEnabled();
    getCurrentLocation();
  }, []);

  const checkIfLocationEnabled = async () => {
    let enabled = await Location.hasServicesEnabledAsync();
    if (!enabled) {
      Alert.alert(
        "Location services not enabled",
        "Please enable the location services",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ],
        { cancelable: false }
      );
    } else {
      setLocationServicesEnabled(enabled);
    }
  };

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission denied",
        "Allow the app to use the location services",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ],
        { cancelable: false }
      );
    }

    const { coords } = await Location.getCurrentPositionAsync();
    // console.log(coords);
    if (coords) {
      const { latitude, longitude } = coords;

      let response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      //   console.log(response);
      for (let item of response) {
        let address = `${item.name} ${item.city}  ${item.postalCode}`;
        // console.log(address);
        SetMaplocation(address);
      }
    }
  };

  const hangleLocation = (address) => {
    getCurrentLocation();
    setDisplayCurrentAddress(address);
    setIsVisible(false);
  };

  const handleLocationModal = () => {
    setIsVisible(true);
  };

  const hideModal = () => {
    setIsVisible(false);
  };

  const locationModel = () => (
    <ScrollView isVisible={isVisible} onBackdropPress={hideModal}>
      <SafeAreaView>
        <KeyboardAvoidingView behavior="position">
          <ScrollView keyboardShouldPersistTaps="handled">
            <View  style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
            
              <TextInput style={{width:100}}
                placeholder="address"
                value={userInput}
                onChangeText={(text) => setUserInput(text)}
              />
                <TouchableOpacity style={{marginHorizontal:30}} activeOpacity={0.8} onPress={hideModal}>
                <AntDesign name="close" size={24} color="black" />
              </TouchableOpacity>
              <Button
                title="Submit"
                onPress={() => hangleLocation(userInput)}
              />
            </View>
            
          </ScrollView>
          
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScrollView>
  );

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        width: "100%",
        borderRadius: 10,
      }}
    >
      <MaterialIcons name="location-on" size={30} color="#fd5c63" />
      <View>
        <Text style={{ fontSize: 18, fontWeight: "600" }}>
          Home <AntDesign name="caretdown" size={12} color="black" />
        </Text>
        <Text>
          {locationServicesEnabled ? (
            displayCurrentAddress
          ) : (
            <Pressable onPress={hangleLocation}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "red" }}>
                Click to enable location
              </Text>
            </Pressable>
          )}
        </Text>
      {isVisible && locationModel()}
      </View>
      <Pressable
        onPress={handleLocationModal}
        style={{ marginLeft: "auto", marginRight: 7 }}
      >
        <Text
          style={{
            fontWeight: "bold",
            color: "blue",
            fontSize: 20,
            marginLeft: 20,
          }}
        >
          Change
        </Text>
      </Pressable>
    </View>
  );
};

export default LocationComponent;
