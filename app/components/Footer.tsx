import { StyleSheet, View, Animated } from "react-native";
import RoundButton from "./utils/RoundButton";
import { useThemeColors } from "../hooks/useThemeColors";
import { useFooter } from "../hooks/useFooter";

type Props = {
  setTimerIsOpen: () => void;
  timerIsOpen: boolean;
  calendarIsOpen: boolean;
  setCalendarIsOpen: () => void;
};

export default function Footer({
  setTimerIsOpen,
  timerIsOpen,
  calendarIsOpen,
  setCalendarIsOpen,
}: Props) {
  const colors = useThemeColors();
  const {
    buttonType,
    setButtonType,
    handleAddPress,
    handleCalendarPress,
    spin,
    calendarSpin,
    handleStatsPress,
  } = useFooter({
    setTimerIsOpen,
    timerIsOpen,
    calendarIsOpen,
    setCalendarIsOpen,
  });

  return (
    <View style={styles.container}>
      <RoundButton
        type="stats"
        variant="ghost"
        btnSize={50}
        onPress={handleStatsPress}
        iconColor={colors.secondary}
      />
      <Animated.View style={{ transform: [{ rotate: calendarSpin }] }}>
        <RoundButton
          type="calendar"
          variant="ghost"
          btnSize={50}
          onPress={handleCalendarPress}
          iconColor={colors.secondary}
        />
      </Animated.View>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <RoundButton
          type={buttonType}
          variant="secondary"
          btnSize={50}
          svgSize={buttonType === "add" ? 24 : 30}
          onPress={handleAddPress}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 80,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
    backgroundColor: "white",
    borderRadius: 16,
    marginHorizontal: 11,
    marginBottom: 10,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
});
