import React, { useEffect } from "react";
import {
  WorktimeSeries,
  RecurrenceException,
  WorktimeByDay,
} from "../types/worktime";
import Block from "./Block";
import MainWrapper from "./MainWrapper";
import { NotificationService } from "../services/NotificationService";

interface UnfinishedWorktimesListProps {
  unfinishedWorktimes: WorktimeSeries[];
  currentDate: string;
  recurrenceExceptions: RecurrenceException[];
  setModalType: (type: "menu" | "update") => void;
  setModalVisible: (visible: boolean) => void;
  setSelectedWorktime: (worktime: WorktimeSeries) => void;
  setUnfinishedWorktimes: (
    worktimes: WorktimeSeries[] | ((prev: WorktimeSeries[]) => WorktimeSeries[])
  ) => void;
  setWorktimes: (
    worktimes: WorktimeSeries[] | ((prev: WorktimeSeries[]) => WorktimeSeries[])
  ) => void;
  setWorktimesByDay: (
    worktimes: WorktimeByDay | ((prev: WorktimeByDay) => WorktimeByDay)
  ) => void;
  setSnackBar: (type: "error" | "info", messageText: string) => void;
  onWorktimeStopped?: () => void; // Nouvelle prop
}

export default function UnfinishedWorktimesList({
  unfinishedWorktimes,
  currentDate,
  recurrenceExceptions,
  setModalType,
  setModalVisible,
  setSelectedWorktime,
  setUnfinishedWorktimes,
  setWorktimes,
  setWorktimesByDay,
  setSnackBar,
  onWorktimeStopped,
}: UnfinishedWorktimesListProps) {
  const prevWorktimesRef = React.useRef<WorktimeSeries[]>([]);

  // Mettre à jour les unfinishedWorktimes dans le service de notifications
  // (Les notifications sont maintenant créées directement dans useTimerForm pour éviter les problèmes de timing)
  useEffect(() => {
    const syncNotifications = async () => {
      try {
        // Mettre à jour les unfinishedWorktimes dans le service (pour le background handler)
        NotificationService.getInstance().updateUnfinishedWorktimes(
          unfinishedWorktimes
        );

        // Mettre à jour la référence pour le prochain render
        prevWorktimesRef.current = unfinishedWorktimes;
      } catch (error) {
        console.error(
          "❌ Erreur lors de la synchronisation des notifications:",
          error
        );
      }
    };

    syncNotifications();
  }, [unfinishedWorktimes]);

  if (unfinishedWorktimes.length === 0) {
    return null;
  }

  return (
    <>
      {unfinishedWorktimes.map((worktime) => (
        <Block
          key={`${worktime.id}-chrono`}
          worktime={worktime}
          setModalType={setModalType}
          setModalVisible={setModalVisible}
          setSelectedWorktime={setSelectedWorktime}
          setUnfinishedWorktimes={setUnfinishedWorktimes}
          setWorktimes={setWorktimes}
          setWorktimesByDay={setWorktimesByDay}
          setSnackBar={setSnackBar}
          currentDate={currentDate}
          recurrenceExceptions={recurrenceExceptions}
          onWorktimeStopped={onWorktimeStopped}
        />
      ))}
    </>
  );
}
