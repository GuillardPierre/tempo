import React from "react";
import { Chip } from "react-native-paper";
import { WorktimeSeries } from "../types/worktime";

type Props = {
  worktimes: WorktimeSeries[];
};

export default function DailyTimer({ worktimes }: Props) {
  // Calculer la durée totale de la journée
  const totalDuration = worktimes.reduce((total, worktime) => {
    return total + (worktime.duration || 0);
  }, 0);

  // Fonction locale pour formater la durée
  const formatDuration = (totalMinutes: number): string => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
      return minutes > 0
        ? `${hours}h${minutes.toString().padStart(2, "0")}`
        : `${hours}h`;
    }
    return `${minutes}min`;
  };

  // Ne pas afficher si la durée est 0
  if (totalDuration === 0) {
    return null;
  }

  return (
    <Chip
      icon="clock-outline"
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
