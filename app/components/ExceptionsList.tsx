import React from "react";
import { View, Pressable } from "react-native";
import { useThemeColors } from "../hooks/useThemeColors";
import { useVibration } from "../hooks/useVibration";
import BlockWrapper from "./BlockWrapper";
import ThemedText from "./utils/ThemedText";
import BurgerMenuSvg from "./svg/burgerMenu";
import { RecurrenceException } from "../types/worktime";

interface ExceptionsListProps {
  exceptions: RecurrenceException[];
  date: string;
  onExceptionPress: (exception: RecurrenceException) => void;
}

const ExceptionsList = ({
  exceptions,
  date,
  onExceptionPress,
}: ExceptionsListProps) => {
  const colors = useThemeColors();
  const { vibrate } = useVibration();

  const filteredExceptions = exceptions.filter((exception) => {
    const exceptionStart = new Date(exception.pauseStart);
    const exceptionEnd = new Date(exception.pauseEnd);
    exceptionEnd.setDate(exceptionEnd.getDate() + 1);
    const currentDate = new Date(date);
    return currentDate >= exceptionStart && currentDate <= exceptionEnd;
  });

  if (filteredExceptions.length === 0) return null;

  return (
    <>
      {filteredExceptions.map((exception) => (
        <BlockWrapper
          key={exception.id}
          backgroundColor={colors.primaryLight}
          style={{ marginBottom: 5 }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View
              style={{
                maxWidth: "85%",
                paddingHorizontal: 10,
                paddingVertical: 8,
              }}
            >
              <ThemedText
                variant="header2"
                style={{ fontSize: 20 }}
                color="primaryText"
              >
                Vacances / pause en cours
              </ThemedText>
              <ThemedText variant="body" color="primaryText">
                Reposez-vous!
              </ThemedText>
            </View>
            <Pressable
              style={{
                alignItems: "flex-end",
                marginLeft: 17,
              }}
              onPress={() => {
                vibrate();
                onExceptionPress(exception);
              }}
            >
              <BurgerMenuSvg />
            </Pressable>
          </View>
        </BlockWrapper>
      ))}
    </>
  );
};

export default ExceptionsList;
