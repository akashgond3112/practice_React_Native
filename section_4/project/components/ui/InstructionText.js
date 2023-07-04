import { StyleSheet, Text } from "react-native";
import Colors from "../../constants/color";

function InstructionText({ children, style }) {
  return <Text style={[styles.instructionText, style]}>{children}</Text>;
}

export default InstructionText;

const styles = StyleSheet.create({
  instructionText: {
    color: Colors.p,
    fontSize: 24,
  },
});
