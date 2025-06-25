import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Shield, Loader2 } from 'lucide-react';
import { useGetEmployerProfileQuery, useUpdateProfileVisibilityMutation } from '@/features/profile/employerProfileApiService';
import toast from 'react-hot-toast';

const PrivacySettings = () => {
  const { data: profile, isLoading } = useGetEmployerProfileQuery();
  const [updateVisibility, { isLoading: isUpdating }] = useUpdateProfileVisibilityMutation();

  const handleVisibilityToggle = async (isVisible: boolean) => {
    try {
      await updateVisibility({ isVisible }).unwrap();
      toast.success(`Profile visibility updated.`);
    } catch (error) {
      toast.error("Failed to update visibility.");
    }
  };

  if (isLoading) {
    return <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /><span>Loading Settings...</span></div>;
  }
  
  if (!profile) {
    return <div>Could not load profile data.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-muted-foreground" />
            Privacy Settings
        </CardTitle>
        <CardDescription>Control how your profile is viewed and discovered.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-0.5 pr-4">
            <Label htmlFor="discoverability">Profile Discoverability</Label>
            <p className="text-sm text-muted-foreground">Allow schools to find your profile in searches.</p>
          </div>
          <Switch
            id="discoverability"
            checked={profile.isVisible}
            onCheckedChange={handleVisibilityToggle}
            disabled={isUpdating}
          />
        </div>
        <div className="p-4 border rounded-lg">
          <Label>Request Your Data</Label>
          <p className="text-sm text-muted-foreground mt-1 mb-3">Download a copy of all your personal data.</p>
          <Button variant="outline" disabled>Request Data</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrivacySettings;