import React, { useEffect } from "react";
import { View } from "react-native";
import TimePickerInput from "../utils/TimePickerInput";
import ButtonMenu from "../../components/ButtonMenu";
import { useVibration } from "../../hooks/useVibration";
import { Category, WorktimeSeries } from "../../types/worktime";
import { httpPut } from "../../components/utils/querySetup";
import ENDPOINTS from "../../components/utils/ENDPOINT";
import { formatLocalDateTime } from "../../components/utils/utils";
import { NotificationService } from "../../services/NotificationService";

type TimerFormMode = "chrono" | "activity";

interface DateTimeSelectorsProps {
  mode: TimerFormMode;
  selectedDays: string[];
  startDate: Date;
  startHour: Date;
  endHour?: Date | null;
  date: string;
  onDateChange: (date: Date) => void;
  onStartHourChange: (date: Date) => void;
  onEndHourChange: (date: Date) => void;
  onSubmit: () => void;
  setSnackBar: (type: "error" | "info", message: string) => void;
  category: { id: string; title: string } | { id: null; title: string };
  unfinishedWorktimes?: WorktimeSeries[];
  setUnfinishedWorktimes?: (
    worktimes: WorktimeSeries[] | ((prev: WorktimeSeries[]) => WorktimeSeries[])
  ) => void;
  onWorktimeStopped?: () => void;
  onWorktimeCreated?: (worktime: WorktimeSeries) => void;
}

export default function DateTimeSelectors({
  mode,
  selectedDays,
  startDate,
  startHour,
  endHour,
  date,
  onDateChange,
  onStartHourChange,
  onEndHourChange,
  onSubmit,
  setSnackBar,
  category,
  unfinishedWorktimes = [],
  setUnfinishedWorktimes,
  onWorktimeStopped,
  onWorktimeCreated,
}: DateTimeSelectorsProps) {
  const { vibrate } = useVibration();

  const stopWorktime = async (worktime: WorktimeSeries) => {
    const newData = {
      ...worktime,
      isActive: false,
      endHour: new Date(),
      category: {
        id: worktime.category?.id || null,
        title: worktime.category?.name || "Chronomètre",
      },
    };
    const formattedData = {
      ...newData,
      endHour: formatLocalDateTime(new Date()),
    };

    try {
      const rep = await httpPut(
        `${ENDPOINTS.worktime.root}${worktime.id}`,
        formattedData
      );

      if (rep.ok) {
        // Supprimer la notification associée
        if (worktime.id) {
          await NotificationService.getInstance().cancelChronoNotification(
            worktime.id.toString()
          );
        }

        if (setUnfinishedWorktimes) {
          setUnfinishedWorktimes((prev) =>
            prev.filter((wt) => wt.id !== worktime.id)
          );
        }

        setSnackBar("info", "Chronomètre arrêté ! Bravo !");

        // Déclencher le rafraîchissement des données depuis le serveur
        if (onWorktimeStopped) {
          onWorktimeStopped();
        }
      } else {
        console.error("Erreur lors de l'arrêt du worktime:", rep);
        setSnackBar("error", "Erreur lors de l'arrêt du chronomètre");
      }
    } catch (error) {
      console.error("Erreur lors de l'arrêt du worktime:", error);
      setSnackBar("error", "Erreur lors de l'arrêt du chronomètre");
    }
  };

  // Cette fonction sera appelée après la création réussie du chronomètre
  const displayNotificationForWorktime = async (worktime: WorktimeSeries) => {
    await NotificationService.getInstance().displayChronoNotification(
      worktime,
      worktime.category?.name || category.title,
      new Date(startHour)
    );
  };

  return (
    <>
      <TimePickerInput
        label={`${
          selectedDays.length > 0 ? "Date de début" : "Date de l'activité"
        } :`}
        value={startDate}
        onChange={onDateChange}
        mode="date"
        display="calendar"
        style={{
          width: "47%",
        }}
      />

      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
          width: "100%",
          gap: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            flex: 1,
            gap: 10,
          }}
        >
          <TimePickerInput
            label="Heure début:"
            value={startHour}
            onChange={(date) => {
              vibrate();
              onStartHourChange(date);
              startHour && date > startHour && onEndHourChange(date);
            }}
          />
          {mode === "chrono" && (
            <ButtonMenu
              fullWidth={false}
              style={{
                transform: [{ translateY: 12 }],
                alignSelf: "flex-end",
                flex: 1,
              }}
              type="round"
              text="Lancer Chronomètre"
              action={() => {
                vibrate();
                if (startHour > new Date()) {
                  setSnackBar(
                    "error",
                    "Vous ne pouvez pas démarrer un chronomètre dans le futur. Veuillez choisir une date/heure valide."
                  );
                  return;
                }
                onSubmit();
              }}
            />
          )}
        </View>
        {mode === "activity" && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              flex: 1,
            }}
          >
            <TimePickerInput
              label="Heure fin:"
              value={
                endHour ||
                new Date(date + "T" + new Date().toTimeString().slice(0, 8))
              }
              onChange={(date) => {
                vibrate();
                onEndHourChange(date);
              }}
            />
          </View>
        )}
      </View>
    </>
  );
}
