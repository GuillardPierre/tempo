import ThemedText from "./utils/ThemedText";
import { StyleSheet, View } from "react-native";
import { useThemeColors } from "../hooks/useThemeColors";

type Props = {
  text: string;
};

export default function FAQResponse({ text }: Props) {
  const colors = useThemeColors();
  return (
    <View style={[styles.container, {backgroundColor: colors.primaryLight}]} >
      <ThemedText color="primaryText"  style={styles.text}>{text}</ThemedText>
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
    // borderWidth: 1,
    borderColor: "#3D348B",
    padding: 10,
    borderRadius: 10,
    boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
  },
  text: {
    lineHeight: 22,
  },
});
