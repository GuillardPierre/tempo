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
  // Mettre à jour les unfinishedWorktimes dans le service de notifications
  useEffect(() => {
    NotificationService.getInstance().updateUnfinishedWorktimes(
      unfinishedWorktimes
    );
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
