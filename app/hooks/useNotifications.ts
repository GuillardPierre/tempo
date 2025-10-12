import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { NotificationService } from '../services/NotificationService';
import { WorktimeSeries } from '../types/worktime';

interface UseNotificationsProps {
  unfinishedWorktimes?: WorktimeSeries[];
  onWorktimeStopped?: (worktimeId: string) => void;
  refreshWorktimes?: () => void;
}

/**
 * Hook pour initialiser le service de notifications
 * À utiliser dans le composant racine de l'application
 */
export const useNotifications = ({
  unfinishedWorktimes = [],
  onWorktimeStopped,
  refreshWorktimes
}: UseNotificationsProps = {}) => {
  const appStateRef = useRef(AppState.currentState);
  const wasInBackgroundRef = useRef(false);
  const unfinishedWorktimesRef = useRef<WorktimeSeries[]>(unfinishedWorktimes);

  // Mettre à jour la ref à chaque changement
  useEffect(() => {
    unfinishedWorktimesRef.current = unfinishedWorktimes;
  }, [unfinishedWorktimes]);

  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        await NotificationService.getInstance().requestPermissions();

        // Nettoyer les notifications au démarrage
        await NotificationService.getInstance().cancelAllChronoNotifications();
        NotificationService.getInstance().clearUnfinishedWorktimes();
      } catch (error) {
        console.error('❌ Échec de l\'initialisation des notifications:', error);
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

  // Gestion des changements d'état de l'application
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      const previousAppState = appStateRef.current;

      appStateRef.current = nextAppState;

      if (previousAppState.match(/inactive|background/) && nextAppState === 'active') {
        console.log(`🔄 AppState change: ${previousAppState} -> ${nextAppState}`);
        wasInBackgroundRef.current = true;

        // Quand l'app revient au premier plan, rafraîchir les données et notifications
        setTimeout(async () => {
          try {
            console.log('🔄 Rafraîchissement après retour en foreground...');
            // Rafraîchir les données depuis l'API pour synchroniser l'état local
            if (refreshWorktimes) {
              await refreshWorktimes();
            }

            // Utiliser la ref pour avoir la valeur la plus récente (pas celle capturée dans la closure)
            const currentUnfinishedWorktimes = unfinishedWorktimesRef.current;
            console.log(`📊 État actuel: ${currentUnfinishedWorktimes.length} worktimes non terminés`);

            // Mettre à jour les notifications avec les nouvelles données
            NotificationService.getInstance().updateUnfinishedWorktimes(currentUnfinishedWorktimes);

            // Vérifier si des notifications doivent être recréées
            const activeNotifications = NotificationService.getInstance().getActiveNotifications();

            if (currentUnfinishedWorktimes.length > 0 && activeNotifications.size === 0) {
              console.log(`⚠️ Tentative de recréation: ${currentUnfinishedWorktimes.length} worktimes, ${activeNotifications.size} notifications`);
              // Forcer la recréation des notifications si nécessaire
              await NotificationService.getInstance().recreateMissingNotifications(currentUnfinishedWorktimes);
            } else {
              console.log(`✅ Pas de recréation nécessaire: ${currentUnfinishedWorktimes.length} worktimes, ${activeNotifications.size} notifications`);
            }
          } catch (error) {
            console.error('❌ Erreur lors de l\'actualisation après retour en foreground:', error);
          }
        }, 1000); // Délai pour laisser l'app se stabiliser
      } else if (nextAppState.match(/inactive|background/)) {
        wasInBackgroundRef.current = true;
      }
    });

    return () => {
      subscription.remove();
    };
  }, [refreshWorktimes]); // Plus de dépendance à unfinishedWorktimes car on utilise la ref

  // Cleanup au démontage
  useEffect(() => {
    return () => {
    };
  }, []);
};

export default useNotifications;
