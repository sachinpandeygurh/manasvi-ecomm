import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SectionList,
  SafeAreaView,
  // Image,
  FlatList,
  // Button,
  ImageBackground,
  TouchableOpacity,
} from "react-native";

import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";
import * as Font from "expo-font";

const loadFonts = async () => {
  await Font.loadAsync({
    Montserrat_700Bold,
    Montserrat_400Regular,
    Montserrat_600SemiBold, 
  });
};
const HandleDetails = (uri) => {
  props.navigation.navigate("Detail", { uri: uri });
  console.log(uri);
};
const ListItem = ({ item, navigation }) => {
  // console.log(item.uri);
  useEffect(() => {
    loadFonts();
  }, []);
  return (
    <View style={styles.item}>
      <ImageBackground
        source={{ uri: item.uri }}
        style={styles.itemPhoto}
        resizeMode="cover"
      >
        <TouchableOpacity
          style={{ position: "relative" }}
          onPress={() => HandleDetails(item.uri, navigation)}
        >
          <View
            style={{
              position: "absolute",
              display: "flex",
              flex: 1,
              top: 200,
              paddingHorizontal: 20,
            }}
          >
            <Text style={styles.title}>{item.text}</Text>

            {/* <Text style={styles.details}> View more details</Text> */}
          </View>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

export const ItemsList = ({ navigation }) => {
  useEffect(() => {
    loadFonts();
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={{ flex: 1 }}>
        <SectionList
          contentContainerStyle={{ paddingHorizontal: 5 }}
          stickySectionHeadersEnabled={false}
          sections={SECTIONS}
          renderSectionHeader={({ section }) => (
            <>
              <Text style={styles.sectionHeader}>{section.title}</Text>
              {section.horizontal ? (
                <FlatList
                  horizontal
                  data={section.data}
                  renderItem={({ item }) => <ListItem item={item} />}
                  showsHorizontalScrollIndicator={false}
                />
              ) : null}
            </>
          )}
          renderItem={({ item, section }) => {
            if (section.horizontal) {
              return null;
            }
            return <ListItem item={item} navigation={navigation} />;
          }}
        />
      </SafeAreaView>
    </View>
  );
};

const SECTIONS = [
  {
    title: "Bike Dekho ",
    horizontal: true,
    data: [
      {
        key: "1",
        text: "EV Bike 1",
        uri: "https://www.freepnglogos.com/uploads/scooter-png/the-appscooter-basically-tech-loaded-two-wheel-tesla-4.png",
      },
      {
        key: "2",
        text: "EV Bike 2",
        uri: "https://www.freepnglogos.com/uploads/scooter-png/cycle-city-ocean-city-scooter-rentals-sales-service-22.png",
      },
      {
        key: "3",
        text: "EV Bike 3",
        uri: "https://www.freepnglogos.com/uploads/scooter-png/aprilia-biaggi-race-replica-scooter-png-image-pngpix-8.png",
      },
      {
        key: "4",
        text: "EV Bike 4",
        uri: "https://www.freepnglogos.com/uploads/scooter-png/made-china-electric-ducati-scooter-coming-canada-moto-2.png",
      },
      {
        key: "5",
        text: "EV Bike 5",
        uri: "https://static.vecteezy.com/system/resources/previews/024/543/676/non_2x/electric-scooter-transparent-background-free-png.png",
      },
      {
        key: "6",
        text: "EV Bike 5",
        uri: "https://www.freepnglogos.com/uploads/scooter-png/scooter-png-images-available-for-download-12.png",
      },
      {
        key: "7",
        text: "EV Bike 3",
        uri: "https://www.freepnglogos.com/uploads/scooter-png/people-are-surprised-this-cool-new-electric-scooter-30.png",
      },
    ],
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 80,
  },
  sectionHeader: {
    fontWeight: "900",
    fontFamily: "Montserrat_700Bold",
    fontSize: 30,
    color: "green",
    marginBottom: 45,
    textAlign: "center",
  },
  item: {
    margin: 10,
  },
  itemPhoto: {
    width: 300,
    height: 250,
  },
  itemText: {
    color: "rgba(255, 255, 255, 0.5)",
    marginTop: 5,
  },
  img: {
    height: "50%",
    width: "120%",
    resizeMode: "contain",
  },
  title: {
    color: "#FFF",
    fontFamily: "Montserrat_700Bold",
    fontSize: 20,
    marginTop: 20,
    textAlign: "center",
  },
  details: {
    borderColor: "red",
    borderWidth: 0.3,
    color: "red",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "black",
    alignSelf: "center",
    opacity: 0.5,
    position: "absolute",
    top: 20,
    right: -150,
    width: 150,
  },
});
