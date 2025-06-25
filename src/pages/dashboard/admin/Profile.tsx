import { useState, useEffect } from 'react';
import { useGetAdminProfileQuery, useUpdateAdminProfileMutation } from '@/features/admin/adminApiService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Shield, Mail, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import { Skeleton } from '@/components/ui/skeleton';

const AdminProfile = () => {
  const { data: profile, isLoading, isError } = useGetAdminProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateAdminProfileMutation();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    jobTitle: '',
    phone: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        jobTitle: profile.jobTitle || '',
        phone: profile.phone || '',
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    try {
      await updateProfile(formData).unwrap();
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      toast.error('Failed to update profile. Please try again.');
    }
  };
  
  if (isLoading) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div><Skeleton className="h-9 w-64" /><Skeleton className="h-4 w-80 mt-2" /></div>
                <Skeleton className="h-10 w-24" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1"><CardContent className="p-6"><Skeleton className="h-56 w-full" /></CardContent></Card>
                <Card className="lg:col-span-2"><CardHeader><Skeleton className="h-6 w-48" /></CardHeader><CardContent><Skeleton className="h-40 w-full" /></CardContent></Card>
            </div>
        </div>
    );
  }

  if (isError) {
    return <div className="text-center py-10 text-red-500">Failed to load profile data. Please try refreshing the page.</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Profile</h1>
          <p className="text-muted-foreground">Manage your personal administrator information</p>
        </div>
        <Button onClick={() => isEditing ? handleSave() : setIsEditing(true)} variant={isEditing ? "default" : "outline"} disabled={isUpdating}>
          {isUpdating ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mb-4">
                <Shield className="w-12 h-12 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-1">{formData.name}</h3>
              <p className="text-muted-foreground mb-4">{formData.jobTitle}</p>
              <Badge variant="secondary" className="mb-4 capitalize">{profile?.user?.role}</Badge>
              <div className="space-y-3 w-full text-left">
                <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" /><span className="text-sm break-all">{profile?.user?.email}</span></div>
                <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" /><span className="text-sm">{formData.phone || 'N/A'}</span></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>Profile Information</CardTitle><CardDescription>Update your public name, job title, and contact number.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
                <div><Label htmlFor="name">Full Name</Label><Input id="name" value={formData.name} onChange={handleInputChange} disabled={!isEditing} /></div>
                <div><Label htmlFor="jobTitle">Job Title</Label><Input id="jobTitle" value={formData.jobTitle} onChange={handleInputChange} disabled={!isEditing} placeholder="e.g., Platform Administrator" /></div>
                <div><Label htmlFor="phone">Phone Number</Label><Input id="phone" value={formData.phone} onChange={handleInputChange} disabled={!isEditing} placeholder="e.g., +1 234 567 890" /></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;