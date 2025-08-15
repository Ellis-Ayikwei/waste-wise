import React from 'react';
import { History } from 'lucide-react';

interface UserActivityItem {
  id: string;
  activity_type: string;
  request_id?: string;
  details?: any;
  created_at: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface UserAccount {
  user_activities?: UserActivityItem[];
}

interface UserActivityProps {
  user: UserAccount;
}

const UserActivity: React.FC<UserActivityProps> = ({ user }) => {
  const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderActivityIcon = (activity: UserActivityItem) => {
    const IconComponent = activity.icon || History;
    return <IconComponent className="w-5 h-5 text-blue-500" />;
  };

  // Helper to map activity_type to friendly label
  const activityTypeLabels: Record<string, string> = {
    login: 'User Login',
    logout: 'User Logout',
    password_change: 'Password Changed',
    // Add more mappings as needed
  };

  function getActivityLabel(type: string) {
    return activityTypeLabels[type] || type.charAt(0).toUpperCase() + type.slice(1);
  }

  function renderActivityDetails(details: any) {
    if (!details) return null;
    if (details.ip) {
      return <span>IP: <span className="font-mono">{details.ip}</span></span>;
    }
    // Add more detail renderers as needed
    return <span>{JSON.stringify(details)}</span>;
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-semibold">User Activity</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {user.user_activities?.map((activity, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                {renderActivityIcon(activity)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{getActivityLabel(activity.activity_type)}</p>
                <p className="text-sm text-gray-500">{formatDate(activity.created_at)}</p>
                {activity.details && (
                  <p className="mt-1 text-sm text-gray-600">{renderActivityDetails(activity.details)}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserActivity; 