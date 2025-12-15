import { StyleSheet, View, Pressable } from "react-native";
import { useThemeColors } from "../hooks/useThemeColors";
import { useVibration } from "../hooks/useVibration";
import React from "react";
import ThemedText from "./utils/ThemedText";
import CustomChip from "./utils/CustomChip";
import BurgerMenuSvg from "./svg/burgerMenu";
import {
  RecurrenceException,
  Worktime,
  WorktimeSeries,
  WorktimeByDay,
} from "../types/worktime";
import StopSvg from "./svg/stop";
import { httpPut } from "./utils/querySetup";
import ENDPOINTS from "./utils/ENDPOINT";
import Chronometre from "./utils/Chronometre";
import BlockWrapper from "./BlockWrapper";
import { formatLocalDateTime } from "./utils/utils";
import { NotificationService } from "../services/NotificationService";

type Props = {
  worktime: WorktimeSeries;
  setModalType: (type: "menu" | "update") => void;
  setModalVisible: (visible: boolean) => void;
  setSelectedWorktime: (worktime: any) => void;
  setUnfinishedWorktimes?: (
    worktimes: WorktimeSeries[] | ((prev: WorktimeSeries[]) => WorktimeSeries[])
  ) => void;
  setWorktimes?: (worktimes: WorktimeSeries[]) => void;
  setWorktimesByDay?: (
    worktimes: WorktimeByDay | ((prev: WorktimeByDay) => WorktimeByDay)
  ) => void;
  worktimes?: WorktimeSeries[];
  setSnackBar?: (type: "error" | "info", messageText: string) => void;
  currentDate: string;
  recurrenceExceptions?: RecurrenceException[];
  onWorktimeStopped?: () => void; // Nouvelle prop pour déclencher le rafraîchissement
};

export default function Block({
  worktime,
  setModalType,
  setModalVisible,
  setSelectedWorktime,
  setUnfinishedWorktimes,
  setWorktimes,
  setWorktimesByDay,
  worktimes,
  setSnackBar,
  currentDate,
  recurrenceExceptions = [],
  onWorktimeStopped,
}: Props) {
  const colors = useThemeColors();
  const { vibrate } = useVibration();
  const convertTime = (time: string) => {
    const date = new Date(time);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}h${minutes}`;
  };

  const convertDuration = (duration: number) => {
    const hours = Math.floor(duration / 60);
    if (hours > 0) {
      return `${hours}h${duration % 60 < 10 ? "0" : ""}${duration % 60}`;
    } else {
      return `${duration < 10 ? "0" : ""}${duration}m`;
    }
  };

  const categoryName = worktime.categoryName || worktime.category?.name || "";
  const categoryColor =
    worktime.type === "SINGLE"
      ? colors.secondary
      : worktime.type === "RECURRING"
      ? colors.primaryLight
      : colors.secondary;

  const hasException =
    recurrenceExceptions?.some((exception) => {
      const worktimeIdNumber = Number(worktime.id);
      const seriesIdsNumbers =
        exception.seriesIds?.map((id) => Number(id)) || [];

      // Ignorer les exceptions qui ne concernent pas cette série
      if (!seriesIdsNumbers.includes(worktimeIdNumber)) {
        return false;
      }

      // Ignorer si le worktime n'est pas récurrent ou si les exceptions sont ignorées
      if (worktime.type !== "RECURRING" || worktime.ignoreExceptions) {
        return false;
      }

      const exceptionStart = exception.pauseStart
        ? new Date(exception.pauseStart + "Z")
        : null;
      const exceptionEnd = exception.pauseEnd
        ? new Date(exception.pauseEnd + "Z")
        : null;
      const currentDateObj = new Date(currentDate);

      // Vérifier si currentDate est dans la période d'exception
      return (
        exceptionStart &&
        exceptionEnd &&
        currentDateObj >= exceptionStart &&
        currentDateObj <= exceptionEnd
      );
    }) || false;

  const stopWorktime = async () => {
    const newData = {
      ...worktime,
      isActive: false,
      endHour: new Date(),
      category: { id: worktime.categoryId, title: worktime.categoryName },
    };
    const formattedData = {
      ...newData,
      endHour: formatLocalDateTime(new Date()),
    };

    const rep = await httpPut(
      `${ENDPOINTS.worktime.root}${worktime.id}`,
      formattedData
    );

    if (rep.ok) {
      const data = await rep.json();

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

      if (setWorktimes && worktimes) {
        const worktimeDay = new Date(data.start).toISOString().split("T")[0];
        if (worktimeDay === currentDate) {
          setWorktimes([
            ...worktimes.filter((wt: WorktimeSeries) => wt.id !== data.id),
            data,
          ]);
        }
      }

      if (setSnackBar) {
        setSnackBar("info", "Temps de travail terminé ! Bravo !");
      }

      // Déclencher le rafraîchissement des données depuis le serveur
      if (onWorktimeStopped) {
        onWorktimeStopped();
      }
    } else {
      console.error("Erreur lors de l'arrêt du worktime:", rep);
    }
  };

  return (
    <BlockWrapper
      backgroundColor={categoryColor}
      hasException={hasException}
      disabled={worktime.isCancelled}
    >
      <View style={styles.timeContainer}>
        <ThemedText>{convertTime(worktime.startHour)}</ThemedText>
        <View style={styles.separator} />
        <ThemedText>
          {worktime.endHour ? convertTime(worktime.endHour) : "-"}
        </ThemedText>
      </View>
      <ThemedText style={styles.mainText} variant="header2" color="primaryText">
        {categoryName} {!worktime.endHour ? "- En cours..." : ""}
      </ThemedText>
      <>
        <CustomChip>
          {typeof worktime.duration === "number" ? (
            convertDuration(worktime.duration)
          ) : (
            <Chronometre startTime={worktime.startHour} />
          )}
        </CustomChip>
        {worktime.endHour !== null ? (
          <Pressable
            onPress={() => {
              vibrate();
              setModalType("update");
              setModalVisible(true);
              setSelectedWorktime(worktime);
            }}
          >
            <BurgerMenuSvg />
          </Pressable>
        ) : (
          <Pressable
            onPress={() => {
              vibrate();
              stopWorktime();
            }}
          >
            <StopSvg />
          </Pressable>
        )}
      </>
    </BlockWrapper>
  );
}

const styles = StyleSheet.create({
  timeContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  separator: {
    height: 2,
    width: "100%",
    backgroundColor: "#FFF",
  },
  mainText: {
    width: 150,
  },
});
