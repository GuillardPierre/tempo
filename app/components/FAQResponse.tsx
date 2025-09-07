import ThemedText from "./utils/ThemedText";
import { StyleSheet, View } from "react-native";

type Props = {
  text: string;
};

export default function FAQResponse({ text }: Props) {
  return (
    <View style={styles.container}>
      <ThemedText>{text}</ThemedText>
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
  },
});
