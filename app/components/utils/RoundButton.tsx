import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useVibration } from "../../hooks/useVibration";
import PreviousIcon from "../svg/previous";
import NextIcon from "../svg/next";
import StatsIcon from "../svg/stats";
import CalendarIcon from "../svg/calendar";
import AddIcon from "../svg/addSvg";
import CloseSvg from "../svg/close";
import MinusIcon from "../svg/minus";
import NextDateSvg from "../svg/nextDate";
import PreviousDateSvg from "../svg/previousDate";

const types = {
  previous: PreviousIcon,
  next: NextIcon,
  stats: StatsIcon,
  calendar: CalendarIcon,
  add: AddIcon,
  minus: MinusIcon,
  close: CloseSvg,
  previousDate: PreviousDateSvg,
  nextDate: NextDateSvg,
};

type Props = {
  type: keyof typeof types;
  variant: "primary" | "secondary";
  btnSize?: number;
  svgSize?: number;
  onPress: () => void;
};

export default function RoundButton({
  type,
  variant,
  btnSize = 40,
  svgSize = 24,
  onPress,
}: Props) {
  const colors = useThemeColors();
  const { vibrate } = useVibration();
  const Icon = types[type];
  return (
    <Pressable
      onPress={() => {
        vibrate();
        onPress();
      }}
    >
      <View
        style={[
          styles.button,
          {
            backgroundColor: colors[variant],
            width: btnSize,
            height: btnSize,
          },
        ]}
      >
        <Icon width={svgSize} height={svgSize} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
});
