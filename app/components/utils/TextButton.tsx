import { useThemeColors } from "../../hooks/useThemeColors";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  Vibration,
  View,
} from "react-native";
import ThemedText from "./ThemedText";
import { ActivityIndicator } from "react-native-paper";

type Props = {
  onPress: () => void;
  text: string;
  style?: any;
  isPending?: boolean;
};

export default function TextButton({ onPress, text, style, isPending }: Props) {
  const colors = useThemeColors();

  return (
    <Pressable
      onPress={() => {
        Vibration.vibrate(50);
        onPress();
      }}
      style={[styles.pressable, style]}
    >
      <View style={styles.content}>
        {isPending && (
          <ActivityIndicator
            size="small"
            color={colors.primary}
            style={styles.loader}
          />
        )}
        <ThemedText style={styles.text}>{text}</ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  loader: {
    marginRight: 4,
  },
  text: {
    textAlign: "center",
    fontWeight: "600",
  },
});
