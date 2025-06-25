import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useAddExperienceMutation, useUpdateExperienceMutation } from '@/features/profile/employerProfileApiService';
import toast from 'react-hot-toast';
import { WorkExperience } from '@/types/employer';

interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  experience: WorkExperience | null;
}

export const ExperienceModal = ({ isOpen, onClose, experience }: ExperienceModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    duration: '',
  });

  const [addExperience, { isLoading: isAdding }] = useAddExperienceMutation();
  const [updateExperience, { isLoading: isUpdating }] = useUpdateExperienceMutation();

  useEffect(() => {
    if (experience) {
      setFormData({
        title: experience.title,
        company: experience.company,
        location: experience.location || '',
        duration: experience.duration || '',
      });
    } else {
      setFormData({ title: '', company: '', location: '', duration: '' });
    }
  }, [experience]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (experience) {
        await updateExperience({ _id: experience._id, ...formData }).unwrap();
        toast.success('Experience updated!');
      } else {
        await addExperience(formData).unwrap();
        toast.success('Experience added!');
      }
      onClose();
    } catch (error) {
      toast.error('An error occurred.');
    }
  };
  
  const isLoading = isAdding || isUpdating;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{experience ? 'Edit' : 'Add'} Work Experience</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2"><Label htmlFor="title">Title</Label><Input id="title" name="title" value={formData.title} onChange={handleChange} required /></div>
          <div className="space-y-2"><Label htmlFor="company">Company</Label><Input id="company" name="company" value={formData.company} onChange={handleChange} required /></div>
          <div className="space-y-2"><Label htmlFor="location">Location</Label><Input id="location" name="location" value={formData.location} onChange={handleChange} /></div>
          <div className="space-y-2"><Label htmlFor="duration">Duration</Label><Input id="duration" name="duration" value={formData.duration} onChange={handleChange} placeholder="e.g., 2019 - Present" /></div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};