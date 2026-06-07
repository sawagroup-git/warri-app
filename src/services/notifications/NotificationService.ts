import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, any>;
  badge?: number;
  sound?: string;
}

/**
 * Push Notification Service
 */
export class NotificationService {
  private static instance: NotificationService;

  private constructor() {
    this.setupNotificationHandler();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Setup notification handler
   */
  private setupNotificationHandler(): void {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  }

  /**
   * Request notification permissions
   */
  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Failed to request notification permissions:', error);
      return false;
    }
  }

  /**
   * Get device notification token
   */
  async getDeviceToken(): Promise<string | null> {
    try {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      return token;
    } catch (error) {
      console.error('Failed to get device token:', error);
      return null;
    }
  }

  /**
   * Send local notification
   */
  async sendLocalNotification(payload: NotificationPayload): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: payload.title,
          body: payload.body,
          data: payload.data || {},
          badge: payload.badge || 1,
          sound: payload.sound || 'default',
        },
        trigger: {
          seconds: 1,
        },
      });
    } catch (error) {
      console.error('Failed to send local notification:', error);
    }
  }

  /**
   * Send transaction notification
   */
  async sendTransactionNotification(
    type: 'sent' | 'received' | 'failed',
    amount: number,
    phone: string
  ): Promise<void> {
    const messages = {
      sent: `Sent ${amount} XOF to ${phone}`,
      received: `Received ${amount} XOF from ${phone}`,
      failed: `Transfer to ${phone} failed`,
    };

    await this.sendLocalNotification({
      title: `Transaction ${type === 'failed' ? 'Failed' : 'Completed'}`,
      body: messages[type],
      data: { type, amount, phone },
    });
  }

  /**
   * Listen to notifications
   */
  onNotificationReceived(
    callback: (notification: Notifications.Notification) => void
  ): any {
    return Notifications.addNotificationReceivedListener(callback);
  }

  /**
   * Listen to notification responses
   */
  onNotificationResponse(
    callback: (response: Notifications.NotificationResponse) => void
  ): any {
    return Notifications.addNotificationResponseReceivedListener(callback);
  }
}

export const notificationService = NotificationService.getInstance();
