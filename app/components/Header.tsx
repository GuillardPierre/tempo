import { Pressable, StyleSheet, View } from "react-native";
import { useThemeColors } from "../hooks/useThemeColors";
import { useVibration } from "../hooks/useVibration";
import SquareButton from "./utils/SquareButton";
import { router, usePathname } from "expo-router";
import ArrowBackSvg from "./svg/arrowback";
import type { ModalType } from "../types/modal";
import DateDisplay from "./DateDisplay";
import { WorktimeSeries, RecurrenceException } from "../types/worktime";

type Props = {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  setModalType: (type: ModalType) => void;
  date?: string;
  setDate?: (date: string) => void;
  setCalendarIsOpen?: () => void;
  todayWorktimes?: WorktimeSeries[];
  recurrenceExceptions?: RecurrenceException[];
};

export default function Header({
  modalVisible,
  setModalVisible,
  setModalType,
  date,
  setDate,
  setCalendarIsOpen,
  todayWorktimes = [],
  recurrenceExceptions = [],
}: Props) {
  const colors = useThemeColors();
  const { vibrate } = useVibration();
  const pathname = usePathname();
  return (
    <View style={[styles.header, { backgroundColor: colors.background }]}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ width: "13%" }}>
          {router.canGoBack() && pathname !== "/screens/Homepage" && (
            <Pressable
              style={{
                backgroundColor: colors.background,
                borderRadius: "50%",
                padding: 5,
                width: 40,
                height: 40,
              }}
              onPress={() => router.back()}
            >
              <ArrowBackSvg fill={colors.primaryText} />
            </Pressable>
          )}
        </View>
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        {pathname === "/screens/Homepage" &&
          date &&
          setDate &&
          setCalendarIsOpen && (
            <>
              <DateDisplay
                date={date}
                setDate={setDate}
                setCalendarIsOpen={setCalendarIsOpen}
                worktimes={todayWorktimes}
                recurrenceExceptions={recurrenceExceptions}
              />
            </>
          )}
      </View>
      <SquareButton
        type={modalVisible ? "close" : "menu"}
        onPress={() => {
          vibrate();
          setModalVisible(!modalVisible);
          setModalType("menu");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
