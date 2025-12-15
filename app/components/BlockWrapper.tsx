import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { useThemeColors } from "../hooks/useThemeColors";

// Ce composant englobe Block dans une View avec le même style d'encapsulation
// On peut passer des children ou le composant Block directement via props

type BlockWrapperProps = {
  children: React.ReactNode;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  direction?: "row" | "column";
  fullHeight?: boolean;
  hasException?: boolean;
  disabled?: boolean;
};

export default function BlockWrapper({
  children,
  backgroundColor,
  style,
  direction = "row",
  fullHeight = false,
  hasException = false,
  disabled = false,
}: BlockWrapperProps) {
  const colors = useThemeColors();
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: backgroundColor ?? colors.primaryLight },

        disabled && { backgroundColor: colors.disabled },
        { flexDirection: direction },
        fullHeight ? { flex: 1 } : { height: 80, maxHeight: 80 },
        hasException ? styles.exceptionFilter : {},
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    borderRadius: 8,
    paddingBlock: 5,
    boxShadow: "1px 1px 10px 0 rgba(0, 0, 0, 0.1)",
    paddingHorizontal: 10,
    marginBlock: 5,
  },
  exceptionFilter: {
    opacity: 0.5,
    backgroundColor: "#3D348B",
  },
});
