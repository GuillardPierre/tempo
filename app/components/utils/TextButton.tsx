import { useThemeColors } from "../../hooks/useThemeColors";
import { useVibration } from "../../hooks/useVibration";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  ViewStyle,
  View,
  TextStyle,
} from "react-native";
import ThemedText from "./ThemedText";
import { ActivityIndicator } from "react-native-paper";

type Props = {
  onPress: () => void;
  text: string;
  style?: StyleProp<ViewStyle>;
  isPending?: boolean;
  textStyle?: StyleProp<TextStyle>;
};

export default function TextButton({
  onPress,
  text,
  style,
  isPending,
  textStyle,
}: Props) {
  const colors = useThemeColors();
  const { vibrate } = useVibration();

  return (
    <Pressable
      onPress={() => {
        vibrate();
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
        <ThemedText style={[styles.text, textStyle]}>{text}</ThemedText>
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
