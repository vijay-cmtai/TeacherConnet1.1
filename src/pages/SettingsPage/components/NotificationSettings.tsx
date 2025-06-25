import React, { useEffect, useState } from 'react';
import { User } from '../../../features/auth/authSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Switch } from '../../../components/ui/switch';
import { Label } from '../../../components/ui/label';
import { Separator } from '../../../components/ui/separator';
import { Bell } from 'lucide-react';
import toast from 'react-hot-toast';
import { useGetEmployerProfileQuery, useUpdateEmployerNotificationSettingsMutation } from '../../../features/profile/employerProfileApiService';

interface NotificationSettingsProps {
  user: User;
}

const NotificationSettings = ({ user }: NotificationSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-muted-foreground" />
          Notification Preferences
        </CardTitle>
        <CardDescription>Choose how you want to be notified</CardDescription>
      </CardHeader>
      <CardContent>
        {user.role === 'employer' && <EmployerNotifications />}
        {user.role === 'college' && <CollegeNotifications />}
        {user.role === 'admin' && <AdminNotifications />}
        {!['employer', 'college', 'admin'].includes(user.role) && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No notification settings are available for your account type.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const EmployerNotifications = () => {
  const { data: profile, isLoading } = useGetEmployerProfileQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateEmployerNotificationSettingsMutation();
  const [currentSettings, setCurrentSettings] = useState({
    emailJobAlerts: true,
    whatsappUpdates: false,
    messagesFromSchools: true,
  });

  useEffect(() => {
    if (profile && profile.settings && profile.settings.notifications) {
      setCurrentSettings(profile.settings.notifications);
    }
  }, [profile]);

  const handleToggle = async (key: keyof typeof currentSettings) => {
    const newSettings = { ...currentSettings, [key]: !currentSettings[key] };
    setCurrentSettings(newSettings);
    
    try {
      await updateSettings(newSettings).unwrap();
      toast.success('Notification settings updated!');
    } catch (err) {
      toast.error('Failed to update settings.');
      setCurrentSettings(currentSettings);
    }
  };

  const notifications = [
    {
      key: 'emailJobAlerts' as const,
      label: 'New Job Alerts',
      description: 'Get emails with jobs that match your profile.',
    },
    {
      key: 'whatsappUpdates' as const,
      label: 'Application Updates via WhatsApp',
      description: 'Receive real-time updates on your application status.',
    },
    {
      key: 'messagesFromSchools' as const,
      label: 'Messages from Schools',
      description: 'Notify me when a school sends you a message.',
    },
  ];

  if (isLoading) {
    return <p>Loading settings...</p>;
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification, index) => (
        <div key={notification.key}>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor={notification.key}>{notification.label}</Label>
              <p className="text-sm text-muted-foreground">{notification.description}</p>
            </div>
            <Switch
              id={notification.key}
              checked={currentSettings[notification.key]}
              onCheckedChange={() => handleToggle(notification.key)}
              disabled={isUpdating}
            />
          </div>
          {index < notifications.length - 1 && <Separator className="mt-4" />}
        </div>
      ))}
    </div>
  );
};

const CollegeNotifications = () => {
  const notifications = [
    { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
    { key: 'studentUpdates', label: 'Student Updates', description: 'Get notified about student activity' },
  ];

  return (
    <div className="space-y-4">
        {notifications.map((notification, index) => (
            <div key={notification.key}>
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                    <Label>{notification.label}</Label>
                    <p className="text-sm text-muted-foreground">{notification.description}</p>
                    </div>
                    <Switch disabled />
                </div>
                {index < notifications.length - 1 && <Separator className="mt-4" />}
            </div>
        ))}
    </div>
  );
};

const AdminNotifications = () => {
  const notifications = [
    { key: 'systemAlerts', label: 'System Alerts', description: 'Get notified about system status and issues' },
    { key: 'userReports', label: 'User Reports', description: 'Get notified about user reports and feedback' },
  ];
  
  return (
    <div className="space-y-4">
        {notifications.map((notification, index) => (
            <div key={notification.key}>
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                    <Label>{notification.label}</Label>
                    <p className="text-sm text-muted-foreground">{notification.description}</p>
                    </div>
                    <Switch disabled />
                </div>
                {index < notifications.length - 1 && <Separator className="mt-4" />}
            </div>
        ))}
    </div>
  );
};

export default NotificationSettings;