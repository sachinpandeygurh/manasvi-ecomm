import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity } from "react-native";
// Add imports for toast and axios if not already present in your project

const Profile = () => {
  // Simulate authentication context
  const auth = {
    user: {
      name: "John Doe",
      email: "john@example.com",
      phone: "1234567890",
      locality: "Sample Locality",
      pincode: "123456",
      address: "Sample Address",
      city_district_town: "Sample City",
      landmark: "Sample Landmark",
      alternate_phone: "9876543210",
      shipping_address: "Sample Shipping Address",
    },
  };

  // State
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
  const [shipping_address, setsa] = useState("");

  // Get user data
  useEffect(() => {
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
    } = auth?.user;
    setName(name);
    setEmail(email);
    setPhone(phone);
    setLocality(locality);
    setPincode(pincode);
    setAddress(address);
    setCity_district_town(city_district_town);
    setLandmark(landmark);
    setAlternate_phone(alternate_phone);
    setsa(shipping_address);
  }, [auth?.user]);

  // Form submission
  const handleSubmit = () => {
    // Replace the following log statement with actual API calls for form submission
    console.log("Form submitted with data:", {
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
    // Add API call logic here
  };

  const [show, setShow] = useState(false);

  const handleView = () => {
    setShow(!show);
  };

  return (
    <View style={{ flex: 1, marginBottom: 40 }}>
      <ScrollView>
        <View style={{ margin: 16 }}>
            <View style={{ fontWeight: "bold", marginBottom: 16, flexDirection:"row", alignItems: "center" , justifyContent:"space-between" }}>
          <Text style={{fontWeight:"bold"}}>
            Your Profile
          </Text>
          <TouchableOpacity onPress={handleView} style={{paddingHorizontal:10}}>
            <Text style={{color:!show? "green":"red"}}>{show ? "Hide" : "Show"}</Text>
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
            placeholder="Enter Your Password"
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
