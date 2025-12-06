import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { NotificationType } from '../types/mindmesh'; // Assuming NotificationType is now available via ../types

interface Notification {
  id: string;
  message: string;
  isRead: boolean;
  linkTo?: string;
  createdAt: string;
  type: NotificationType;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

export const useNotificationStore = create(
  immer<NotificationState>((set, get) => ({
    notifications: [],
    unreadCount: 0,

    fetchNotifications: async () => {
      // Mock fetching notifications
      // Fetching notifications
      await new Promise(resolve => setTimeout(resolve, 500));

      const mockNotifications: Notification[] = [
        { id: '1', message: 'New leave request pending approval.', isRead: false, linkTo: '/approvals/leave', createdAt: new Date().toISOString(), type: 'task_assigned' },
        { id: '2', message: 'Your enrollment was approved.', isRead: true, linkTo: '/profile', createdAt: new Date(Date.now() - 3600000).toISOString(), type: 'task_escalated' },
      ];

      set((state) => {
        state.notifications = mockNotifications;
        state.unreadCount = mockNotifications.filter(n => !n.isRead).length;
      });
    },

    markAsRead: (id: string) => {
      set((state) => {
        const notification = state.notifications.find(n => n.id === id);
        if (notification && !notification.isRead) {
          notification.isRead = true;
          state.unreadCount = get().unreadCount - 1;
        }
      });
    },

    markAllAsRead: () => {
      set((state) => {
        state.notifications = state.notifications.map(n => ({ ...n, isRead: true }));
        state.unreadCount = 0;
      });
    }
  }))
);