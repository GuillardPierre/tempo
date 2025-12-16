import React from "react";
import { View, StyleSheet } from "react-native";
import { SegmentedButtons } from "react-native-paper";
import ThemedText from "./utils/ThemedText";
import RoundButton from "./utils/RoundButton";
import TextButton from "./utils/TextButton";
import { useThemeColors } from "../hooks/useThemeColors";
import { useVibration } from "../hooks/useVibration";

interface PeriodSelectorProps {
  currentType: "week" | "month" | "year";
  setCurrentType: (type: "week" | "month" | "year") => void;
  periodDisplayText: string;
  onNavigate: (direction: "prev" | "next") => void;
  onResetToCurrent: () => void;
}

export default function PeriodSelector({
  currentType,
  setCurrentType,
  periodDisplayText,
  onNavigate,
  onResetToCurrent,
}: PeriodSelectorProps) {
  const colors = useThemeColors();
  const { vibrate } = useVibration();

  const handleTypeChange = (newType: string) => {
    vibrate();
    setCurrentType(newType as "week" | "month" | "year");
  };

  const handleNavigate = (direction: "prev" | "next") => {
    vibrate();
    onNavigate(direction);
  };

  const handleResetToCurrent = () => {
    vibrate();
    onResetToCurrent();
  };

  return (
    <View style={styles.container}>
      {/* Sélecteur de type de période */}
      <SegmentedButtons
        value={currentType}
        onValueChange={handleTypeChange}
        density="regular"
        theme={{
          colors: {
            secondaryContainer: colors.primaryLight,
          },
        }}
        style={[
          styles.segmentedButtons,
          {
            borderColor: colors.primary,
            backgroundColor: colors.background,
          },
        ]}
        buttons={[
          {
            label: "Semaine",
            value: "week",
            checkedColor: colors.primaryText,
            uncheckedColor: colors.secondaryText,
          },
          {
            label: "Mois",
            value: "month",
            checkedColor: colors.primaryText,
            uncheckedColor: colors.secondaryText,
          },
          {
            label: "Année",
            value: "year",
            checkedColor: colors.primaryText,
            uncheckedColor: colors.secondaryText,
          },
        ]}
      />

      {/* Affichage de la période et navigation */}
      <View style={styles.periodContainer}>
        <RoundButton
          type="previous"
          onPress={() => handleNavigate("prev")}
          variant="secondary"
          btnSize={35}
          svgSize={15}
        />

        <View style={styles.periodTextContainer}>
          <ThemedText
            variant="body"
            color="secondaryText"
            style={styles.periodText}
          >
            {periodDisplayText}
          </ThemedText>
        </View>

        <RoundButton
          type="next"
          onPress={() => handleNavigate("next")}
          variant="secondary"
          btnSize={35}
          svgSize={15}
        />
      </View>

      {/* Bouton pour revenir à la période actuelle */}
      <View style={styles.resetButtonContainer}>
        <TextButton
          onPress={handleResetToCurrent}
          style={{
            paddingVertical: 2,
            paddingHorizontal: 8,
            minHeight: 0,
          }}
          textStyle={{
            fontWeight: 500,
            fontSize: 12,
            color: colors.primary,
            textDecorationLine: "underline",
          }}
          text="Retour à aujourd'hui"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  segmentedButtons: {
    borderWidth: 1,
    borderRadius: 30,
    marginBottom: 15,
  },
  periodContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  periodTextContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  periodText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  resetButtonContainer: {
    alignItems: "center",
    marginTop: 5,
  },
});
