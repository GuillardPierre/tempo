import { Pressable, StyleSheet, View } from "react-native";
import { useThemeColors } from "../hooks/useThemeColors";

import RoundButton from "./utils/RoundButton";
import ThemedText from "./utils/ThemedText";
import { useDateDisplay } from "../hooks/useDateDisplay";
import { useDateFormatter } from "../hooks/useDateFormatter";
import { WorktimeSeries, RecurrenceException } from "../types/worktime";
import DailyTimer from "./DailyTimer";

type Props = {
  date: string;
  setDate: (date: string) => void;
  setCalendarIsOpen: () => void;
  worktimes: WorktimeSeries[];
  recurrenceExceptions?: RecurrenceException[];
};

export default function DateDisplay({
  date,
  setDate,
  setCalendarIsOpen,
  worktimes,
  recurrenceExceptions = [],
}: Props) {
  const colors = useThemeColors();
  const { handlePrevious, handleNext } = useDateDisplay(date, setDate);
  const { formatDate, getDayName } = useDateFormatter();

  return (
    <View style={styles.dateDisplay}>
      <RoundButton
        type="previousDate"
        variant='background'
        svgSize={15}
        onPress={handlePrevious}
      />
      <Pressable onPress={setCalendarIsOpen}>
        <View style={styles.dateContainer}>
          <ThemedText variant="header2" color="primaryText">
            {formatDate(date)}
          </ThemedText>
          <View style={styles.dayNameContainer}>
            <ThemedText
              variant="body"
              color="primaryText"
              style={styles.dayName}
            >
              {getDayName(date)}
            </ThemedText>
            <DailyTimer
                worktimes={worktimes}
                recurrenceExceptions={recurrenceExceptions}
                date={date}
            />
          </View>
        </View>
      </Pressable>
      <RoundButton
        type="nextDate"
        variant="background"
        svgSize={15}
        onPress={handleNext}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  dateDisplay: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  dateContainer: {
    alignItems: "center",
    width: 140,
  },
  dayName: {
    fontSize: 14,
    // marginTop: 2,
  },
  dayNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
});
