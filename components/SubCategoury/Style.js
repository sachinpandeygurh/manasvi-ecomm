import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)' ,
    paddingVertical: 1,
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  header: {
    width: 350,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  customText: {
    fontWeight: "bold",
    fontSize: 15,
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    marginVertical: 20, 
  },
  card: {
    width: 89,
    height: 90,
    alignItems: "center",
  },
  img: {
    width: 50,
    height: 50,
    borderRadius: 15,
  },
  name: {
    fontSize: 12,
    color: "#6A6A6A",
    marginTop: 5,
  },
});

export default styles; 