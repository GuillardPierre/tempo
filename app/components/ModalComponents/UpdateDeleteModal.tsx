import React, { useState } from "react";
import { View, StyleSheet, Vibration } from "react-native";
import ThemedText from "../utils/ThemedText";
import { SelectedWorktime, WorktimeSeries } from "../../types/worktime";
import TimerForm from "../../forms/timerForm";
import ButtonMenu from "../ButtonMenu";
import DeleteBlock from "./DeleteBlock";
import { useThemeColors } from "../../hooks/useThemeColors";
import { formatDateRange } from "../../utils/dateFormatters";
import { formatActiveDaysInFrench } from "../../utils/recurrence";

type Props = {
  setModalVisible: (visible: boolean) => void;
  selectedWorktime: SelectedWorktime | null;
  categories: any[];
  setCategories: (categories: any[] | ((prev: any[]) => any[])) => void;
  setWorktimes: (
    worktimes: WorktimeSeries[] | ((prev: WorktimeSeries[]) => WorktimeSeries[])
  ) => void;
  setSnackBar: (type: "error" | "info", messageText: string) => void;
  date: string;
};

export default function UpdateDeleteModal({
  setModalVisible,
  selectedWorktime,
  categories = [],
  setCategories,
  setWorktimes,
  setSnackBar,
  date,
}: Props) {
  const colors = useThemeColors();
  const [mode, setMode] = useState<"view" | "edit" | "delete">("view");
  const [snackBarMessage, setSnackBarMessage] = useState<{
    type: "error" | "info";
    message: string;
  } | null>(null);

  const handleUpdateSuccess = () => {
    setSnackBarMessage({
      type: "info",
      message: "Modification réussie",
    });
    setMode("view");
    setModalVisible(false);
  };

  const handleDeleteSuccess = () => {
    setSnackBarMessage({
      type: "info",
      message: "Suppression réussie",
    });
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {mode === "view" && (
        <View>
          <View style={styles.workTimeInfoContainer}>
            <ThemedText variant="body" color="secondaryText">
              <Text style={styles.bold}>Catégorie: </Text>
              {selectedWorktime?.categoryName || "Non spécifiée"}
            </ThemedText>
            <ThemedText variant="body" color="secondaryText">
              <Text style={styles.bold}>Type: </Text>
              {selectedWorktime?.isRecurring ? "Récurrent" : "Ponctuel"}
            </ThemedText>
            <ThemedText variant="body" color="secondaryText">
              <Text style={styles.bold}>Période: </Text>
              {formatDateRange(
                selectedWorktime?.startDate,
                selectedWorktime?.endDate,
                selectedWorktime?.startHour,
                selectedWorktime?.endHour,
                selectedWorktime?.type
              )}
            </ThemedText>
            {selectedWorktime?.isRecurring && (
              <ThemedText variant="body" color="secondaryText">
                <Text style={styles.bold}>Jours actifs: </Text>
                {formatActiveDaysInFrench(selectedWorktime?.recurrence || "")}
              </ThemedText>
            )}
          </View>
          <View style={styles.buttonsContainer}>
            <ButtonMenu
              type="round"
              action={() => {
                Vibration.vibrate(50);
                setMode("edit");
              }}
              text="Modifier"
            />
            <ButtonMenu
              type="round"
              action={() => {
                Vibration.vibrate(50);
                setMode("delete");
              }}
              style={[{ backgroundColor: colors.error }]}
              text="Supprimer"
            />
          </View>
        </View>
      )}

      {mode === "edit" && (
        <View>
          <View style={styles.header}>
            <ThemedText variant="body" color="secondaryText">
              {`Modification de l'entrée`}
            </ThemedText>
          </View>

          <View>
            <TimerForm
              mode="activity"
              setSnackBar={setSnackBar}
              setTimerIsOpen={setModalVisible}
              setWorktimes={setWorktimes}
              categories={categories}
              setCategories={setCategories}
              selectedWorktime={selectedWorktime}
              isEditing={true}
              date={date}
            />
          </View>

          <View>
            <ButtonMenu
              type="round"
              text="Annuler"
              action={() => {
                Vibration.vibrate(50);
                setMode("view");
              }}
            />
          </View>
        </View>
      )}

      {mode === "delete" && (
        <View>
          <DeleteBlock
            selectedWorktime={selectedWorktime}
            onDeleteSuccess={handleDeleteSuccess}
            onCancel={() => setMode("view")}
            setModalVisible={setModalVisible}
            setWorktimes={setWorktimes}
            setSnackBar={setSnackBar}
          />
        </View>
      )}

      {/* Affichage du snackbar si nécessaire */}
      {snackBarMessage && (
        <View
          style={[
            styles.snackbar,
            {
              backgroundColor:
                snackBarMessage.type === "error"
                  ? colors.primary
                  : colors.secondary,
            },
          ]}
        >
          <ThemedText>{snackBarMessage.message}</ThemedText>
        </View>
      )}
    </View>
  );
}

import { Text } from "react-native";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 5,
  },
  header: {
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: 10,
    marginHorizontal: "auto",
    width: "50%",
    alignItems: "center",
  },
  snackbar: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  workTimeInfoContainer: {
    marginVertical: 15,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  bold: {
    fontWeight: "bold",
  },
});
