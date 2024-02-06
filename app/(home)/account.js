import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import Footer from "../../components/Footer";
import Dashboard from "../../components/user/Dashboard";
import Orders from "../../components/user/Orders";
import Profile from "../../components/Profile";
import CheckData from "../../components/auth/CheckData";
import Logout from "../../components/auth/Logout";

class Account extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container}>
          {/* <CheckData/> */}
          <View
            style={{
              alignItems: "center",
              justifyContent: "flex-end",
              flexDirection: "row",
              width: "90%",
            }}
          >
            <Logout />
          </View>
          <Dashboard />
          <Orders />
          <Profile />
        </ScrollView>
        <Footer />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Account;
