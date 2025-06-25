import React, { useEffect, useState } from 'react';
import { useGetCollegeProfileQuery, useUpdateCollegeSettingsMutation } from '@/features/profile/collegeProfileApiService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const CollegePrivacySettings = () => {
  const { data: profile, isLoading } = useGetCollegeProfileQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateCollegeSettingsMutation();

  const [privacy, setPrivacy] = useState({ displayContactInfo: true, shareStudentData: false });

  useEffect(() => { if (profile?.settings?.privacy) { setPrivacy(profile.settings.privacy); } }, [profile]);

  const handleToggle = async (key: keyof typeof privacy) => {
    const newSettings = { ...privacy, [key]: !privacy[key] };
    setPrivacy(newSettings);
    try {
      await updateSettings({ privacy: newSettings, notifications: profile.settings.notifications }).unwrap();
      toast.success('Privacy settings updated!');
    } catch (err) { toast.error('Failed to update settings.'); setPrivacy(privacy); }
  };

  const privacyOptions = [
    { key: 'displayContactInfo' as const, label: 'Display Contact Information', description: 'Show your contact details on the public college profile.' },
    { key: 'shareStudentData' as const, label: 'Share Anonymized Student Data', description: 'Allow employers to see aggregated, anonymous data about graduates.' },
  ];

  if (isLoading) return <Skeleton className="h-40 w-full" />;

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Privacy Preferences</CardTitle><CardDescription>Control how your institution's data is shared</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        {privacyOptions.map((opt) => (
          <div key={opt.key} className="flex items-center justify-between p-4 border rounded-lg">
            <div><Label htmlFor={opt.key}>{opt.label}</Label><p className="text-sm text-muted-foreground">{opt.description}</p></div>
            <Switch id={opt.key} checked={privacy[opt.key]} onCheckedChange={() => handleToggle(opt.key)} disabled={isUpdating} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CollegePrivacySettings;