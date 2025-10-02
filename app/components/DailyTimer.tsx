import React from "react";
import { Chip } from "react-native-paper";
import { WorktimeSeries, RecurrenceException } from "../types/worktime";
// @ts-ignore
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

type Props = {
  worktimes: WorktimeSeries[];
  recurrenceExceptions?: RecurrenceException[];
  date?: string;
};

export default function DailyTimer({
  worktimes,
  recurrenceExceptions = [],
  date,
}: Props) {
  /**
   * Vérifie si une date est dans une période d'exception (vacances/pause)
   */
  const isDateInException = (
    dateStr: string,
    exceptions: RecurrenceException[]
  ): boolean => {
    if (!dateStr || exceptions.length === 0) return false;

    const dateObj = new Date(dateStr);
    const timestamp = dateObj.getTime();

    return exceptions.some((exception) => {
      const start = new Date(exception.pauseStart).getTime();
      const end = new Date(exception.pauseEnd).getTime();
      const endPlusOneDay = new Date(end);
      endPlusOneDay.setDate(endPlusOneDay.getDate() + 1);
      return timestamp >= start && timestamp < endPlusOneDay.getTime();
    });
  };

  // Filtrer les worktimes si la date est dans une période d'exception
  const filteredWorktimes =
    date && isDateInException(date, recurrenceExceptions)
      ? worktimes.filter((worktime) => {
          // Exclure les worktimes récurrents et les worktimes annulés
          return worktime.type !== "RECURRING" && !worktime.isCancelled;
        })
      : worktimes.filter((worktime) => !worktime.isCancelled); // Toujours exclure les worktimes annulés

  // Calculer la durée totale de la journée
  const totalDuration = filteredWorktimes.reduce((total, worktime) => {
    return total + (worktime.duration || 0);
  }, 0);

  // Fonction locale pour formater la durée
  const formatDuration = (totalMinutes: number): string => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return minutes > 0
      ? `${hours}h${minutes.toString().padStart(2, "0")}`
      : `${hours}h`;
  };

  return (
    <Chip
      icon={({ size, color }) => (
        <Icon name="clock-outline" size={size} color="white" />
      )}
      mode="outlined"
      compact
      style={{
        marginLeft: 8,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderColor: "rgba(255, 255, 255, 0.3)",
      }}
      textStyle={{
        color: "white",
        fontSize: 12,
        fontWeight: "bold",
      }}
    >
      {formatDuration(totalDuration)}
    </Chip>
  );
}
