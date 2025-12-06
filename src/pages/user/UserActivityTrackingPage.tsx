// src/pages/user/UserActivityTrackingPage.tsx
import React from 'react';
import { useFetchUserActivity } from '../../services/useUserActivityTracking';

const UserActivityTrackingPage: React.FC = () => {
  const { data: activities, isLoading, error } = useFetchUserActivity();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">19. User Activity Tracking</h1>
      <p>Monitor and log user actions within the platform for auditing purposes.</p>
      {isLoading && <p>Loading user activity...</p>}
      {error && <p className="text-red-500">Error loading activity: {error.message}</p>}
      {activities && (
        <ul className="mt-4 space-y-2">
          {activities.map(activity => (
            <li key={activity.id} className="p-2 border rounded">
              User: {activity.userId} - Action: {activity.activityType} - Timestamp: {new Date(activity.timestamp).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserActivityTrackingPage;