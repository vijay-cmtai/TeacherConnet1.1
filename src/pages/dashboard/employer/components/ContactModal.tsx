import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useUpdateEmployerProfileDetailsMutation } from '@/features/profile/employerProfileApiService';
import toast from 'react-hot-toast';
import { EmployerProfile } from '@/types/employer';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: EmployerProfile;
}

export const ContactModal = ({ isOpen, onClose, profile }: ContactModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    headline: '',
    location: '',
    phone: '',
  });

  const [updateDetails, { isLoading }] = useUpdateEmployerProfileDetailsMutation();

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        headline: profile.headline || '',
        location: profile.location || '',
        phone: profile.phone || '',
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateDetails(formData).unwrap();
      toast.success('Contact information updated!');
      onClose();
    } catch (error) {
      toast.error('Failed to update information.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Contact Information</DialogTitle>
          <DialogDescription>Update your personal and contact details here.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="headline">Headline</Label>
            <Input id="headline" name="headline" value={formData.headline} onChange={handleChange} placeholder="e.g., Experienced PGT Physics Teacher" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" value={formData.location} onChange={handleChange} placeholder="e.g., Noida, Uttar Pradesh" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Changes'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};