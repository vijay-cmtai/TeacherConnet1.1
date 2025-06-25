import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useAddEducationMutation, useUpdateEducationMutation } from '@/features/profile/employerProfileApiService';
import toast from 'react-hot-toast';
import { Education } from '@/types/employer';

interface EducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  education: Education | null;
}

export const EducationModal = ({ isOpen, onClose, education }: EducationModalProps) => {
  const [formData, setFormData] = useState({
    degree: '',
    school: '',
    year: '',
    percentage: '',
  });

  const [addEducation, { isLoading: isAdding }] = useAddEducationMutation();
  const [updateEducation, { isLoading: isUpdating }] = useUpdateEducationMutation();

  useEffect(() => {
    if (education) {
      setFormData({
        degree: education.degree,
        school: education.school,
        year: education.year || '',
        percentage: education.percentage || '',
      });
    } else {
      setFormData({ degree: '', school: '', year: '', percentage: '' });
    }
  }, [education]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (education) {
        await updateEducation({ _id: education._id, ...formData }).unwrap();
        toast.success('Education updated!');
      } else {
        await addEducation(formData).unwrap();
        toast.success('Education added!');
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
          <DialogTitle>{education ? 'Edit' : 'Add'} Education</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2"><Label htmlFor="degree">Degree</Label><Input id="degree" name="degree" value={formData.degree} onChange={handleChange} required /></div>
          <div className="space-y-2"><Label htmlFor="school">School / University</Label><Input id="school" name="school" value={formData.school} onChange={handleChange} required /></div>
          <div className="space-y-2"><Label htmlFor="year">Year of Completion</Label><Input id="year" name="year" value={formData.year} onChange={handleChange} /></div>
          <div className="space-y-2"><Label htmlFor="percentage">Percentage / GPA</Label><Input id="percentage" name="percentage" value={formData.percentage} onChange={handleChange} /></div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};