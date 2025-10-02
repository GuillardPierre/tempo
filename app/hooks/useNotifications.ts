import { useEffect } from 'react';
import { NotificationService } from '../services/NotificationService';
import { WorktimeSeries } from '../types/worktime';

interface UseNotificationsProps {
  unfinishedWorktimes?: WorktimeSeries[];
  onWorktimeStopped?: () => void;
}

/**
 * Hook pour initialiser le service de notifications
 * À utiliser dans le composant racine de l'application
 */
export const useNotifications = ({ 
  unfinishedWorktimes = [], 
  onWorktimeStopped 
}: UseNotificationsProps = {}) => {
  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        await NotificationService.getInstance().requestPermissions();
        await NotificationService.getInstance().cancelAllChronoNotifications();
        NotificationService.getInstance().clearUnfinishedWorktimes();
      } catch (error) {
        console.error('Échec de l\'initialisation des notifications:', error);
      }
    };
    
    initializeNotifications();
  }, []);

  useEffect(() => {
    if (!onWorktimeStopped || unfinishedWorktimes.length === 0) {
      return;
    }

    NotificationService.getInstance().updateUnfinishedWorktimes(unfinishedWorktimes);

    const unsubscribe = NotificationService.getInstance().setupForegroundHandler(
      unfinishedWorktimes,
      onWorktimeStopped
    );

    return unsubscribe;
  }, [unfinishedWorktimes, onWorktimeStopped]);
};

export default useNotifications;
