import notifee, { EventType, AndroidImportance } from "@notifee/react-native";
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
          await this.stopWorktimeFromNotification(worktimeId, worktime);
        }
      }
    });
  }

  /**
   * Demande les permissions de notification
   */
  public async requestPermissions(): Promise<void> {
    await notifee.requestPermission();
  }

  /**
   * Crée un canal de notification pour Android
   */
  private async createChannel(): Promise<string> {
    return await notifee.createChannel({
      id: "chrono_channel",
      name: "Chronomètres",
      importance: AndroidImportance.HIGH,
      description: "Notifications pour les chronomètres actifs",
    });
  }

  /**
   * Affiche une notification de chronomètre avec bouton d'arrêt
   */
  public async displayChronoNotification(
    worktime: WorktimeSeries,
    categoryTitle: string,
    startTime: Date
  ): Promise<void> {
    await this.requestPermissions();
    const channelId = await this.createChannel();

    const notificationId = `chrono_${worktime.id}`;
    const actionId = `stop_${worktime.id}`;
    
    await notifee.displayNotification({
      id: notificationId,
      title: `Chronomètre lancé pour ${categoryTitle}`,
      body: "Appuyez sur le bouton ci-dessous pour arrêter",
      android: {
        smallIcon: "ic_launcher",
        color: "#7B32F5",
        showChronometer: true,
        timestamp: startTime.getTime(),
        channelId,
        pressAction: {
          id: "default",
        },
        actions: [
          {
            title: "Arrêter le chronomètre",
            pressAction: {
              id: actionId, // Inclure l'ID directement dans l'action
            },
          },
        ],
        ongoing: true, // Notification persistante
        autoCancel: false, // Ne pas supprimer automatiquement
      },
    });

    this.activeNotifications.set(worktime.id?.toString() || "", notificationId);
  }

  /**
   * Supprime une notification de chronomètre
   */
  public async cancelChronoNotification(worktimeId: string): Promise<void> {
    const notificationId = this.activeNotifications.get(worktimeId);
    if (notificationId) {
      await notifee.cancelNotification(notificationId);
      this.activeNotifications.delete(worktimeId);
    }
  }

  /**
   * Arrête un worktime depuis une notification (arrière-plan)
   */
  private async stopWorktimeFromNotification(worktimeId: string, worktime: WorktimeSeries): Promise<void> {
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
      } else {
        console.error('Échec de l\'arrêt du worktime:', response.status);
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
            await this.stopWorktimeFromNotification(worktimeId, activeWorktime);
            onWorktimeStopped(worktimeId);
          }
        }
      }
    });
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
