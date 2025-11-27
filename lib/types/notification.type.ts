export interface NotificationPayload {
  title: string;
  body: string;
  image?: string;
  icon?: string;
  clickAction?: string;
  priority?: "normal" | "high";
  sound?: string;
  tag?: string;
  badge?: string;
  data?: Record<string, string>;
}

export interface NotificationSendRequest {
  userIds: string[];
  payload: NotificationPayload;
}

export interface NotificationToken {
  token: string;
  deviceInfo?: string;
  createdAt: number;
  updatedAt: number;
}

export interface NotificationSendResult {
  success: boolean;
  userId: string;
  token?: string;
  error?: string;
}

export interface NotificationSendResponse {
  success: boolean;
  results: NotificationSendResult[];
  totalSent: number;
  totalFailed: number;
}

