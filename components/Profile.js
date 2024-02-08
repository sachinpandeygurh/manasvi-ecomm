import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from "axios"; // Correct import statement

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [locality, setLocality] = useState("");
  const [pincode, setPincode] = useState("");
  const [address, setAddress] = useState("");
  const [city_district_town, setCity_district_town] = useState("");
  const [landmark, setLandmark] = useState("");
  const [alternate_phone, setAlternate_phone] = useState("");
  const [shipping_address, setShipping_address] = useState("");
  const [auth, setAuth] = useState(null);

  // Get user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const value = await AsyncStorage.getItem('@MySuperStore:key');
        if (value !== null) {
          const authData = JSON.parse(value);
          setAuth(authData);
          const {
            name,
            email,
            phone,
            locality,
            pincode,
            address,
            city_district_town,
            landmark,
            alternate_phone,
            shipping_address,
          } = authData?.user || {};
          setName(name);
          setEmail(email);
          setPhone(phone);
          setLocality(locality);
          setPincode(pincode);
          setAddress(address);
          setCity_district_town(city_district_town);
          setLandmark(landmark);
          setAlternate_phone(alternate_phone);
          setShipping_address(shipping_address);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [auth?.user]);

  // Form submission
  const handleSubmit = async () => {
    try {
      const { data } = await Axios.put("https://manasvimart.in/api/v1/auth/profile", {
        name,
        email,
        password,
        phone,
        locality,
        pincode,
        address,
        city_district_town,
        landmark,
        alternate_phone,
        shipping_address,
      });

      if (data?.error) {
        Alert.alert(data?.error);
      } else {
        setAuth({ ...auth, user: data?.updatedUser });
        const ls = await AsyncStorage.getItem("@MySuperStore:key");
        const lsData = JSON.parse(ls);
        lsData.user = data.updatedUser;
        await AsyncStorage.setItem("@MySuperStore:key", JSON.stringify(lsData));
        Alert.alert("Profile Updated Successfully");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Something went wrong");
    }
  };

  const [show, setShow] = useState(false);

  const handleView = () => {
    setShow(!show);
  };

  return (
    <View style={{ flex: 1, marginBottom: 40 }}>
      <ScrollView>
        <View style={{ margin: 16 }}>
          <View style={{ fontWeight: "bold", marginBottom: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={{ fontWeight: "bold" }}>
              Update Profile
            </Text>
            <TouchableOpacity onPress={handleView} style={{ paddingHorizontal: 10 }}>
              <Text style={{ color: !show ? "green" : "red" }}>{show ? "Hide" : "Show"}</Text>
            </TouchableOpacity>
          </View>
          {show && (
            <View>
          <TextInput
            value={name}
            onChangeText={(text) => setName(text)}
            placeholder="Enter Your Name"
            style={{ borderWidth: 1, padding: 8, marginBottom: 16 }}
          />
          <TextInput
            value={email}
            onChangeText={(text) => setEmail(text)}
            placeholder="Enter Your Email"
            style={{ borderWidth: 1, padding: 8, marginBottom: 16 }}
            editable={false}
          />
          <TextInput
            value={password}
            onChangeText={(text) => setPassword(text)}
            placeholder="Update Your Password"
            secureTextEntry
            style={{ borderWidth: 1, padding: 8, marginBottom: 16 }}
          />
          <TextInput
            value={phone}
            onChangeText={(text) => setPhone(text)}
            placeholder="Enter Your Phone"
            style={{ borderWidth: 1, padding: 8, marginBottom: 16 }}
          />
          <TextInput
            value={address}
            onChangeText={(text) => setAddress(text)}
            placeholder="Enter Your Address"
            multiline
            numberOfLines={3}
            style={{ borderWidth: 1, padding: 8, marginBottom: 16 }}
          />
          <TextInput
            value={shipping_address}
            onChangeText={(text) => setsa(text)}
            placeholder="Enter Your Shipping Address"
            multiline
            numberOfLines={3}
            style={{ borderWidth: 1, padding: 8, marginBottom: 16 }}
          />
          <TextInput
            value={locality}
            onChangeText={(text) => setLocality(text)}
            placeholder="Enter Your Locality"
            style={{ borderWidth: 1, padding: 8, marginBottom: 16 }}
          />
          <TextInput
            value={pincode}
            onChangeText={(text) => setPincode(text)}
            placeholder="Enter Your Pincode"
            style={{ borderWidth: 1, padding: 8, marginBottom: 16 }}
          />
          <TextInput
            value={city_district_town}
            onChangeText={(text) => setCity_district_town(text)}
            placeholder="Enter Your City / District / Town"
            style={{ borderWidth: 1, padding: 8, marginBottom: 16 }}
          />
          <TextInput
            value={landmark}
            onChangeText={(text) => setLandmark(text)}
            placeholder="Enter Your Landmark"
            style={{ borderWidth: 1, padding: 8, marginBottom: 16 }}
          />
          <TextInput
            value={alternate_phone}
            onChangeText={(text) => setAlternate_phone(text)}
            placeholder="Enter Your Alternate Phone"
            style={{ borderWidth: 1, padding: 8, marginBottom: 16 }}
          />
          <TouchableOpacity
            onPress={handleSubmit}
            style={{
              backgroundColor: "#ffa502",
              borderRadius: 80,
              padding: 16,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#000", fontWeight: "bold" }}>UPDATE</Text>
          </TouchableOpacity>
        </View>)}
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;
