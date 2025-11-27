import { NotificationForm } from "./_components/notification-form";

export default function NotificationsPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
      <div className="space-y-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Send Notifications</h1>
        <p className="text-muted-foreground">
          Send push notifications to selected users. Users will receive notifications
          on their devices when they are online.
        </p>
      </div>
      <NotificationForm />
    </div>
  );
}

