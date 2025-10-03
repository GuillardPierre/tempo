import ThemedText from "./utils/ThemedText";
import { StyleSheet, View } from "react-native";

type Props = {
  text: string;
};

export default function FAQResponse({ text }: Props) {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.text}>{text}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    marginHorizontal: "auto",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#3D348B",
    padding: 10,
    borderRadius: 10,
    boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
  },
  text: {
    lineHeight: 22,
  },
});
