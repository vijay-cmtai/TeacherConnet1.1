import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useGetFullUserDetailsQuery, useUpdateCollegeProfileByAdminMutation, useUpdateEmployerProfileByAdminMutation } from '@/features/admin/adminApiService';
import toast from 'react-hot-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface EditUserModalProps {
  userId: string;
  onClose: () => void;
}

interface ProfileFormData {
    name?: string;
    address?: string;
    website?: string;
    phone?: string;
    headline?: string;
    location?: string;
}

const EditUserModal = ({ userId, onClose }: EditUserModalProps) => {
  const { data: userDetails, isLoading: isLoadingDetails } = useGetFullUserDetailsQuery(userId);
  
  const [updateCollegeProfile, { isLoading: isUpdatingCollege }] = useUpdateCollegeProfileByAdminMutation();
  const [updateEmployerProfile, { isLoading: isUpdatingEmployer }] = useUpdateEmployerProfileByAdminMutation();
  
  const [formData, setFormData] = useState<ProfileFormData>({});

  useEffect(() => {
    if (userDetails?.profile) {
      setFormData(userDetails.profile);
    }
  }, [userDetails]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (userDetails.user.role === 'college') {
        await updateCollegeProfile({ userId, data: formData }).unwrap();
      } else if (userDetails.user.role === 'employer' || userDetails.user.role === 'employee') {
        await updateEmployerProfile({ userId, data: formData }).unwrap();
      }
      toast.success('User profile updated successfully!');
      onClose();
    } catch (err) {
      toast.error('Failed to update profile.');
    }
  };

  const isUpdating = isUpdatingCollege || isUpdatingEmployer;

  const renderFormFields = () => {
    if (isLoadingDetails) {
        return <div className="space-y-4"><Skeleton className="h-10"/><Skeleton className="h-10"/><Skeleton className="h-10"/></div>;
    }
    
    if (userDetails?.user?.role === 'college') {
      return (
        <div className="space-y-4">
          <div><Label htmlFor="name">College Name</Label><Input id="name" value={formData.name || ''} onChange={handleChange} /></div>
          <div><Label htmlFor="address">Address</Label><Input id="address" value={formData.address || ''} onChange={handleChange} /></div>
          <div><Label htmlFor="website">Website</Label><Input id="website" value={formData.website || ''} onChange={handleChange} /></div>
          <div><Label htmlFor="phone">Phone</Label><Input id="phone" value={formData.phone || ''} onChange={handleChange} /></div>
        </div>
      );
    }

    if (userDetails?.user?.role === 'employer' || userDetails?.user?.role === 'employee') {
        return (
            <div className="space-y-4">
              <div><Label htmlFor="name">Full Name</Label><Input id="name" value={formData.name || ''} onChange={handleChange} /></div>
              <div><Label htmlFor="headline">Headline</Label><Input id="headline" value={formData.headline || ''} onChange={handleChange} /></div>
              <div><Label htmlFor="location">Location</Label><Input id="location" value={formData.location || ''} onChange={handleChange} /></div>
              <div><Label htmlFor="phone">Phone</Label><Input id="phone" value={formData.phone || ''} onChange={handleChange} /></div>
            </div>
          );
    }
    
    return <p>This user role cannot be edited.</p>;
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile for {userDetails?.profile?.name || userDetails?.user?.email}</DialogTitle>
          <DialogDescription>Modify the details for this user. Changes will be saved immediately.</DialogDescription>
        </DialogHeader>
        <div className="py-4 max-h-[60vh] overflow-y-auto pr-4">{renderFormFields()}</div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isUpdating || isLoadingDetails}>{isUpdating ? 'Saving...' : 'Save Changes'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;