import notifee, { EventType, AndroidImportance, AndroidFlags } from "@notifee/react-native";
import { WorktimeSeries } from "../types/worktime";
import { httpPut } from "../components/utils/querySetup";
import ENDPOINTS from "../components/utils/ENDPOINT";
import { formatLocalDateTime } from "../components/utils/utils";

export class NotificationService {
  private static instance: NotificationService;
  private activeNotifications: Map<string, string> = new Map(); // worktime.id -> notification.id
  private unfinishedWorktimes: WorktimeSeries[] = [];

  private constructor(unfinishedWorktimes: WorktimeSeries[] = []) {
    this.unfinishedWorktimes = unfinishedWorktimes;
    this.setupBackgroundHandler();
  }

  /**
   * Configure le gestionnaire d'événements en arrière-plan
   */
  private setupBackgroundHandler() {
    notifee.onBackgroundEvent(async ({ type, detail }) => {
      if (type === EventType.ACTION_PRESS && detail.pressAction?.id?.startsWith("stop_")) {
        const worktimeId = detail.pressAction.id.replace("stop_", "");
        const worktime = this.unfinishedWorktimes.find(
          (wt) => wt.id?.toString() === worktimeId
        );
        if (worktimeId && worktime) {
          // En arrière-plan, on ne peut pas déclencher le callback directement
          // Les données seront rafraîchies quand l'app reviendra au premier plan
          await this.stopWorktimeFromNotification(worktimeId, worktime);
        }
      }

      // Note: BOOT_COMPLETED n'est pas disponible dans notifee pour le moment
      // Cette fonctionnalité nécessiterait une implémentation personnalisée avec un BroadcastReceiver
    });
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Met à jour la liste des worktimes non terminés
   */
  public updateUnfinishedWorktimes(unfinishedWorktimes: WorktimeSeries[]): void {
    this.unfinishedWorktimes = unfinishedWorktimes;
  }

  /**
   * Nettoie la liste des worktimes non terminés stockés localement
   */
  public clearUnfinishedWorktimes(): void {
    this.unfinishedWorktimes = [];
  }

  /**
   * Vérifie et demande les permissions de notification si nécessaire
   */
  public async ensurePermissions(): Promise<void> {
    try {
      // Vérifier d'abord les permissions actuelles
      const permissions = await notifee.getNotificationSettings();

      if (permissions.authorizationStatus === 1) {
        return;
      }

      // Si pas de permissions, les demander
      await this.requestPermissions();
    } catch (error) {
      console.error('❌ Erreur lors de la vérification des permissions:', error);
      throw error;
    }
  }

  /**
   * Demande les permissions de notification
   */
  public async requestPermissions(): Promise<void> {
    try {
      // Demander spécifiquement les permissions pour Android 13+
      const permissions = await notifee.requestPermission({
        alert: true,
        badge: true,
        sound: true,
      });

      if (permissions.authorizationStatus !== 1) {
        throw new Error('Permissions de notification refusées');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la demande de permissions:', error);
      throw error;
    }
  }


  /**
   * Crée un canal de notification pour Android
   */
  private async createChannel(): Promise<string> {
    try {
      // Vérifier si le canal existe déjà
      const existingChannels = await notifee.getChannels();
      const existingChannel = existingChannels.find(channel => channel.id === "chrono_channel");

      if (existingChannel) {
        return existingChannel.id;
      }

      // Créer le canal avec des paramètres optimisés pour la production
      return await notifee.createChannel({
        id: "chrono_channel",
        name: "Chronomètres",
        importance: AndroidImportance.HIGH,
        description: "Notifications pour les chronomètres actifs",
        sound: "default", // Activer le son par défaut
        vibration: true, // Activer la vibration
        vibrationPattern: [200, 200, 200, 200], // Pattern de vibration
        lights: true, // Activer les lumières
        lightColor: "#7B32F5", // Couleur des lumières
        badge: true, // Afficher le badge sur l'icône de l'app
        bypassDnd: false, // Ne pas contourner le mode Ne pas déranger (évite les problèmes de batterie)
      });
    } catch (error) {
      console.error("Erreur lors de la création du canal de notification:", error);
      // Retourner un ID par défaut en cas d'erreur
      return "chrono_channel";
    }
  }

  /**
   * Affiche une notification de chronomètre avec bouton d'arrêt
   */
  public async displayChronoNotification(
    worktime: WorktimeSeries,
    categoryTitle: string,
    startTime: Date
  ): Promise<void> {
    try {
      // Ne pas créer de notification si le worktime est déjà terminé
      if (worktime.endHour) {
        console.log(`⚠️ Worktime ${worktime.id} est déjà terminé, pas de notification créée`);
        return;
      }

      // Vérifier et demander les permissions si nécessaire
      await this.ensurePermissions();

      // Créer le canal de notification avec une configuration plus robuste
      const channelId = await this.createChannel();

      const notificationId = `chrono_${worktime.id}`;
      const actionId = `stop_${worktime.id}`;

      // Configuration de notification plus robuste pour la production
      await notifee.displayNotification({
        id: notificationId,
        title: `Chronomètre lancé pour ${categoryTitle}`,
        body: "Bon courage ! 💪",
        android: {
          smallIcon: "ic_launcher",
          color: "#7B32F5",
          showChronometer: true,
          timestamp: startTime.getTime(),
          channelId,
          pressAction: {
            id: "default",
            launchActivity: "default",
            mainComponent: "Homepage", // Spécifier le composant principal
          },
          actions: [
            {
              title: "Arrêter le chronomètre",
              pressAction: {
                id: actionId,
                // Ne pas mettre mainComponent pour éviter d'ouvrir/relancer l'app
              },
            },
          ],
          ongoing: true, // Notification persistante
          autoCancel: false, // Ne pas supprimer automatiquement (on le fait manuellement)
          fullScreenAction: {
            id: "default",
            launchActivity: "default",
          },
        },
      });

      this.activeNotifications.set(worktime.id?.toString() || "", notificationId);
    } catch (error) {
      console.error("Erreur lors de la création de la notification:", error);
      // Rethrow pour que l'appelant puisse gérer
      throw new Error(`Échec de création de notification: ${error}`);
    }
  }

  /**
   * Supprime une notification de chronomètre
   */
  public async cancelChronoNotification(worktimeId: string): Promise<void> {
    // Utiliser l'ID standardisé pour être sûr d'annuler la bonne notification
    const notificationId = `chrono_${worktimeId}`;
    
    try {
      // Toujours essayer d'annuler, même si la Map n'est pas synchronisée
      await notifee.cancelNotification(notificationId);
      console.log(`✅ Notification ${notificationId} annulée avec succès`);
    } catch (error) {
      console.error(`❌ Erreur lors de l'annulation de la notification ${notificationId}:`, error);
    }
    
    // Nettoyer la Map dans tous les cas
    this.activeNotifications.delete(worktimeId);
  }

  /**
   * Arrête un worktime depuis une notification (arrière-plan)
   */
  private async stopWorktimeFromNotification(
    worktimeId: string,
    worktime: WorktimeSeries,
    onWorktimeStopped?: (worktimeId: string) => void
  ): Promise<void> {
    try {
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

      const response = await httpPut(
        `${ENDPOINTS.worktime.root}${worktimeId}`,
        formattedData
      );

      if (response.ok) {
        await this.cancelChronoNotification(worktimeId);
        await this.displayStopConfirmation();

        // Attendre que la BDD se synchronise avant de rafraîchir
        // Cela évite que getWorktimes() récupère l'ancien état
        if (onWorktimeStopped) {
          setTimeout(() => {
            onWorktimeStopped(worktimeId);
          }, 500); // Délai de 500ms pour la synchronisation BDD
        }
      } else {
        console.error(`❌ Échec de l'arrêt du worktime ${worktimeId}:`, response.status);
      }
    } catch (error) {
      console.error("Erreur lors de l'arrêt du worktime:", error);
    }
  }

  /**
   * Affiche une notification de confirmation d'arrêt
   */
  private async displayStopConfirmation(): Promise<void> {
    const channelId = await this.createChannel();
    
    await notifee.displayNotification({
      title: "Chronomètre arrêté",
      body: "Votre temps de travail a été enregistré avec succès !",
      android: {
        channelId,
        autoCancel: true,
        smallIcon: "ic_launcher",
        // color: "#7B32F5",
        pressAction: {
          id: 'default',
          launchActivity: 'default', // Ouvre l'app quand on clique sur la notification
        },
      },
    });
  }

  /**
   * Configure le gestionnaire d'événements en premier plan
   */
  public setupForegroundHandler(
    unfinishedWorktimes: WorktimeSeries[],
    onWorktimeStopped: (worktimeId: string) => void
  ) {
    return notifee.onForegroundEvent(async ({ type, detail }) => {
      if (type === EventType.ACTION_PRESS && detail.pressAction?.id?.startsWith("stop_")) {
        const worktimeId = detail.pressAction.id.replace("stop_", "");

        if (worktimeId) {
          const activeWorktime = unfinishedWorktimes.find(
            (wt) => wt.id?.toString() === worktimeId
          );
          if (activeWorktime) {
            await this.stopWorktimeFromNotification(worktimeId, activeWorktime, onWorktimeStopped);
          }
        }
      }
    });
  }

  /**
   * Obtient la liste des notifications actives
   */
  public getActiveNotifications(): Map<string, string> {
    return this.activeNotifications;
  }

  /**
   * Recrée les notifications manquantes pour les worktimes actifs
   */
  public async recreateMissingNotifications(unfinishedWorktimes: WorktimeSeries[]): Promise<void> {
    try {
      console.log(`🔄 recreateMissingNotifications appelée avec ${unfinishedWorktimes.length} worktimes`);
      
      // Vérifier quelles notifications existent déjà
      const displayedNotifications = await notifee.getDisplayedNotifications();
      const displayedIds = new Set(displayedNotifications.map(n => n.id));

      // Créer les notifications manquantes
      for (const worktime of unfinishedWorktimes) {
        const notificationId = `chrono_${worktime.id}`;

        // Ne créer la notification QUE si elle n'existe pas ET que le worktime n'est pas terminé
        if (!displayedIds.has(notificationId) && worktime.type === 'CHRONO' && !worktime.endHour) {
          console.log(`📱 Tentative de recréation de notification pour worktime ${worktime.id}`);
          try {
            await this.displayChronoNotification(
              worktime,
              worktime.categoryName || worktime.category?.name || "Chronomètre",
              new Date(worktime.startHour)
            );
          } catch (error) {
            console.error(`❌ Erreur lors de la recréation de la notification ${worktime.id}:`, error);
          }
        }
      }
    } catch (error) {
      console.error('❌ Erreur lors de la recréation des notifications:', error);
    }
  }

  /**
   * Nettoie toutes les notifications actives
   */
  public async cancelAllChronoNotifications(): Promise<void> {
    for (const [worktimeId] of this.activeNotifications) {
      await this.cancelChronoNotification(worktimeId);
    }
  }
}

export default NotificationService.getInstance();
