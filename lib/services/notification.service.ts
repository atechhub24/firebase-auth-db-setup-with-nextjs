import { getDatabase, ref, get } from "firebase/database";
import { initializeApp, getApps, getApp } from "firebase/app";
import { firebaseConfig } from "@/lib/env";
import type {
  NotificationPayload,
  NotificationSendResult,
  NotificationToken,
} from "@/lib/types/notification.type";

class NotificationService {
  /**
   * Get notification tokens for a user from Firebase Database
   */
  async getUserTokens(userId: string): Promise<string[]> {
    try {
      // Initialize Firebase client SDK for database access
      const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
      const database = getDatabase(app);

      const tokenRef = ref(database, `notificationTokens/${userId}`);
      const snapshot = await get(tokenRef);

      if (!snapshot.exists()) {
        return [];
      }

      const tokenData = snapshot.val();
      // Return array of tokens (supporting both single token string and token object)
      if (typeof tokenData === "string") {
        return [tokenData];
      }
      if (tokenData && typeof tokenData === "object" && "token" in tokenData) {
        return [tokenData.token];
      }
      return [];
    } catch (error) {
      console.error(`Error fetching tokens for user ${userId}:`, error);
      return [];
    }
  }

  /**
   * Get notification tokens for multiple users
   */
  async getUserTokensBatch(userIds: string[]): Promise<Map<string, string[]>> {
    const tokenMap = new Map<string, string[]>();

    await Promise.all(
      userIds.map(async (userId) => {
        const tokens = await this.getUserTokens(userId);
        if (tokens.length > 0) {
          tokenMap.set(userId, tokens);
        }
      }),
    );

    return tokenMap;
  }

  /**
   * Build notification message from payload
   */
  private buildNotificationMessage(payload: NotificationPayload) {
    return {
      notification: {
        title: payload.title,
        body: payload.body,
        ...(payload.image && { image: payload.image }),
      },
      webpush: {
        notification: {
          title: payload.title,
          body: payload.body,
          icon: payload.icon || "/icon.png",
          badge: payload.badge || "/badge.png",
          ...(payload.image && { image: payload.image }),
          ...(payload.tag && { tag: payload.tag }),
          ...(payload.sound && { sound: payload.sound }),
        },
        fcmOptions: {
          ...(payload.clickAction && { link: payload.clickAction }),
        },
      },
      apns: {
        payload: {
          aps: {
            alert: {
              title: payload.title,
              body: payload.body,
            },
            sound: payload.sound || "default",
            badge: 1,
          },
        },
      },
      android: {
        priority: payload.priority === "high" ? "high" : "normal",
        notification: {
          sound: payload.sound || "default",
          ...(payload.image && { imageUrl: payload.image }),
          ...(payload.icon && { icon: payload.icon }),
          clickAction: payload.clickAction,
        },
      },
      data: payload.data || {},
    };
  }

  /**
   * Send notification to a single token
   * Note: Requires Firebase Admin SDK to be initialized in the calling context
   */
  async sendToToken(
    messaging: ReturnType<typeof import("firebase-admin").messaging>,
    token: string,
    payload: NotificationPayload,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const message = {
        token,
        ...this.buildNotificationMessage(payload),
      };

      await messaging.send(message);
      return { success: true };
    } catch (error) {
      console.error("Error sending notification:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Send notification to multiple tokens (multicast)
   * Note: Requires Firebase Admin SDK to be initialized in the calling context
   */
  async sendToTokens(
    messaging: ReturnType<typeof import("firebase-admin").messaging>,
    tokens: string[],
    payload: NotificationPayload,
  ): Promise<{ successCount: number; failureCount: number; errors: string[] }> {
    if (tokens.length === 0) {
      return { successCount: 0, failureCount: 0, errors: [] };
    }

    try {
      const multicastMessage = {
        tokens,
        ...this.buildNotificationMessage(payload),
      };

      const response = await messaging.sendEachForMulticast(multicastMessage);

      return {
        successCount: response.successCount,
        failureCount: response.failureCount,
        errors: response.responses
          .map((resp, idx) =>
            resp.success ? null : `Token ${idx}: ${resp.error?.message || "Unknown error"}`,
          )
          .filter((err): err is string => err !== null),
      };
    } catch (error) {
      console.error("Error sending multicast notification:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return {
        successCount: 0,
        failureCount: tokens.length,
        errors: [errorMessage],
      };
    }
  }

  /**
   * Send notifications to multiple users
   * Note: Requires Firebase Admin SDK messaging instance to be passed in
   */
  async sendNotification(
    messaging: ReturnType<typeof import("firebase-admin").messaging>,
    userIds: string[],
    payload: NotificationPayload,
  ): Promise<NotificationSendResult[]> {
    const results: NotificationSendResult[] = [];

    // Get all tokens for all users
    const tokenMap = await this.getUserTokensBatch(userIds);

    // Build user to tokens mapping
    const userTokensMap = new Map<string, string[]>();
    tokenMap.forEach((tokens, userId) => {
      userTokensMap.set(userId, tokens);
    });

    // Collect all unique tokens
    const allTokensSet = new Set<string>();
    tokenMap.forEach((tokens) => {
      tokens.forEach((token) => allTokensSet.add(token));
    });

    const allTokens = Array.from(allTokensSet);

    if (allTokens.length === 0) {
      // No tokens found for any user
      userIds.forEach((userId) => {
        results.push({
          success: false,
          userId,
          error: "No notification token found",
        });
      });
      return results;
    }

    // Send multicast notification
    const multicastResult = await this.sendToTokens(messaging, allTokens, payload);

    // Map results back to users
    // For simplicity, we mark a user as successful if they have tokens and multicast succeeded
    // In production, you'd track individual token results more precisely
    const successRatio = allTokens.length > 0 
      ? multicastResult.successCount / allTokens.length 
      : 0;

    userIds.forEach((userId) => {
      const userTokens = userTokensMap.get(userId) || [];
      if (userTokens.length === 0) {
        results.push({
          success: false,
          userId,
          error: "No notification token found",
        });
      } else {
        // Consider successful if most tokens succeeded (or all if perfect)
        const isSuccess = successRatio > 0.5 || multicastResult.failureCount === 0;
        results.push({
          success: isSuccess,
          userId,
          token: userTokens[0],
          ...(!isSuccess && {
            error: multicastResult.errors[0] || "Failed to send notification",
          }),
        });
      }
    });

    return results;
  }
}

export const notificationService = new NotificationService();

