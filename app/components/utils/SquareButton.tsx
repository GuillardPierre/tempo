import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import CloseSvg from "../svg/close";
import MenuSvg from "../svg/menu";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useVibration } from "../../hooks/useVibration";

const types = {
  close: CloseSvg,
  menu: MenuSvg,
};

type Props = {
  type?: keyof typeof types;
  onPress: () => void;
};

export default function SquareButton({ type, onPress }: Props) {
  const colors = useThemeColors();
  const { vibrate } = useVibration();
  const Icon = types[type ?? "close"];

  return (
    <Pressable
      onPress={() => {
        vibrate();
        onPress();
      }}
    >
      <View style={[styles.button, { backgroundColor: colors.primaryLight }]}>
        <Icon
          width={type === "close" ? 18 : 44}
          height={type === "close" ? 18 : 44}
          stroke={colors.primary}
          color={colors.primary}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 52,
    height: 52,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
