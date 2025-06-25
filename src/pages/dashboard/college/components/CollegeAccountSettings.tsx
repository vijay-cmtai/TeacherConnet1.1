import React, { useState, useEffect } from 'react';
import { useGetCollegeProfileQuery, useUpdateCollegeProfileDetailsMutation } from '@/features/profile/collegeProfileApiService';
import { User as UserType } from '@/types/user';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Mail, Building } from 'lucide-react';
import toast from 'react-hot-toast';

interface AccountSettingsProps { user: UserType; }

const CollegeAccountSettings = ({ user }: AccountSettingsProps) => {
  const { data: profile, isLoading } = useGetCollegeProfileQuery();
  const [updateDetails, { isLoading: isUpdating }] = useUpdateCollegeProfileDetailsMutation();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setAddress(profile.address || '');
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await updateDetails({ name, address }).unwrap();
      toast.success('College profile updated!');
    } catch (err) { toast.error('Failed to update college profile.'); }
  };

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5" />Account Information</CardTitle><CardDescription>Manage your institution's public profile and login details</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2"><Label>Email Address</Label><Input value={user.email} disabled className="bg-muted" /><p className="text-sm text-muted-foreground">Your login email address cannot be changed.</p></div>
        {isLoading ? <Skeleton className="h-24 w-full"/> : (
            <>
                <div className="space-y-2"><Label htmlFor="collegeName">College Name</Label><Input id="collegeName" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter college name"/></div>
                <div className="space-y-2"><Label htmlFor="address">Address</Label><Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter college address"/></div>
                <Button onClick={handleSave} disabled={isUpdating}>{isUpdating ? 'Saving...' : 'Save Changes'}</Button>
            </>
        )}
      </CardContent>
    </Card>
  );
};

export default CollegeAccountSettings;