import { useState } from 'react';
import { httpPost } from '../components/utils/querySetup';
import ENDPOINTS from '../components/utils/ENDPOINT';
import { SelectedWorktime, WorktimeSeries } from '../types/worktime';

interface UseUpdateDeleteModalProps {
  selectedWorktime: SelectedWorktime | null;
  setWorktimes: (
    worktimes: WorktimeSeries[] | ((prev: WorktimeSeries[]) => WorktimeSeries[])
  ) => void;
  setSnackBar: (type: "error" | "info", messageText: string) => void;
  setModalVisible: (visible: boolean) => void;
  date: string;
}

export const useUpdateDeleteModal = ({
  selectedWorktime,
  setWorktimes,
  setSnackBar,
  setModalVisible,
  date,
}: UseUpdateDeleteModalProps) => {
  const [mode, setMode] = useState<"view" | "edit" | "delete">("view");

  const handleUpdateSuccess = () => {
    setSnackBar("info", "Modification réussie");
    setMode("view");
    setModalVisible(false);
  };

  const handleDeleteSuccess = () => {
    setSnackBar("info", "Suppression réussie");
    setModalVisible(false);
  };

  const toggleSuspendOccurrence = async () => {
    try {
      const response = await httpPost(
        `${ENDPOINTS.recurrenceException.toggleRecurrenceException}`,
        {
          seriesId: selectedWorktime?.id,
          date: date,
        }
      );
      if (response?.ok) {
        setWorktimes((prev) =>
          prev.map((worktime) =>
            worktime.id === selectedWorktime?.id
              ? { ...worktime, isCancelled: !worktime.isCancelled }
              : worktime
          )
        );
        console.log("worktime");
        setSnackBar("info", selectedWorktime?.isCancelled
          ? "Entrée prise en compte"
          : "Entrée suspendue");
      }
      setModalVisible(false);
    } catch (error) {
      console.error("Error suspending one occurrence:", error);
      setSnackBar("error", "Erreur lors de la suspension");
    }
  };

  return {
    mode,
    setMode,
    handleUpdateSuccess,
    handleDeleteSuccess,
    toggleSuspendOccurrence,
  };
};
