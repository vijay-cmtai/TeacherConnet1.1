import React, { useEffect, useState } from 'react';
import { useGetCollegeProfileQuery, useUpdateCollegeSettingsMutation } from '@/features/profile/collegeProfileApiService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Bell } from 'lucide-react';
import toast from 'react-hot-toast';

const CollegeNotificationSettings = () => {
  const { data: profile, isLoading } = useGetCollegeProfileQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateCollegeSettingsMutation();
  
  const [notifications, setNotifications] = useState({ newApplications: true, jobStatusUpdates: true });

  useEffect(() => { if (profile?.settings?.notifications) { setNotifications(profile.settings.notifications); } }, [profile]);

  const handleToggle = async (key: keyof typeof notifications) => {
    const newSettings = { ...notifications, [key]: !notifications[key] };
    setNotifications(newSettings);
    try {
      await updateSettings({ notifications: newSettings, privacy: profile.settings.privacy }).unwrap();
      toast.success('Notification settings updated!');
    } catch (err) { toast.error('Failed to update settings.'); setNotifications(notifications); }
  };

  const notificationOptions = [
    { key: 'newApplications' as const, label: 'New Application Alerts', description: 'Get notified via email for new job applications.' },
    { key: 'jobStatusUpdates' as const, label: 'My Job Post Updates', description: 'Receive alerts when your job post is approved or rejected.' },
  ];

  if (isLoading) return <Skeleton className="h-40 w-full" />;

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5" />Notification Preferences</CardTitle><CardDescription>Choose how you want to be notified</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        {notificationOptions.map((opt, i) => (
          <div key={opt.key} className="flex items-center justify-between p-4 border rounded-lg">
            <div><Label htmlFor={opt.key}>{opt.label}</Label><p className="text-sm text-muted-foreground">{opt.description}</p></div>
            <Switch id={opt.key} checked={notifications[opt.key]} onCheckedChange={() => handleToggle(opt.key)} disabled={isUpdating} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CollegeNotificationSettings;