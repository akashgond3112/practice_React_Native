import { StyleSheet, Text, View, Button } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <View>
        <Text>Hello World!</Text>
      </View>
      <Text
        style={{
          color: "red",
          margin: 16,
          borderWidth: 2,
          borderColor: "yellow",
          padding: 16,
        }}
      >
        Hello World!
      </Text>
      <Button title="Hit me!" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "purple",
    alignItems: "center",
    justifyContent: "center",
  },
});
