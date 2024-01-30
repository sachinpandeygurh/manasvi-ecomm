import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import Mobile from "./SubCategoury/mobile";
import Fashion from "./SubCategoury/Fashion";
import HomenDecor from "./SubCategoury/HomenDcor";
import Appliances from "./SubCategoury/Appliances";
import Electronics from "./SubCategoury/Electronics";
import Grocery from "./SubCategoury/Grocery";

export default function SubCategoury() {
 

  return (
    <View style={{marginBottom:40 , marginTop:15}}>
      <Electronics/>
      <HomenDecor />
      <Grocery/>
      {/* <Mobile />
      <Fashion />
      <Appliances/> */}
      
    </View>
  );
}
