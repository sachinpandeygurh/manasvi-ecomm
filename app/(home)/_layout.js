import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="employees" />
      <Stack.Screen name="adddetails" />
      <Stack.Screen name="markattendance" />
      <Stack.Screen name="[user]" />
      <Stack.Screen name="cart" />
      <Stack.Screen name="subCategory"  />
      <Stack.Screen name="notifications"  />
      <Stack.Screen name="categories"/>
      <Stack.Screen name="account"/>
      <Stack.Screen name="login"/>
      <Stack.Screen name="signup"/>
      <Stack.Screen name="aboutProduct"/>
      <Stack.Screen name="searchScreen"/>
      <Stack.Screen name="SplsceScreen"/>
    </Stack>
  );
}