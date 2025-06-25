import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useCreateEmployerJobMutation, useUpdateEmployerJobMutation } from '@/features/api/employerJobApiService';
import toast from 'react-hot-toast';

interface PostJob {
  _id: string;
  title: string;
  location: string;
  jobType: string;
  category: string;
  description: string;
  experienceLevel: string;
  yearsOfExperience: number;
  requiredSkills: string[];
}

interface JobPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobToEdit: PostJob | null;
}

const initialFormState = {
    title: '',
    location: '',
    jobType: 'Full-time',
    category: '',
    description: '',
    experienceLevel: 'Mid-level',
    yearsOfExperience: 2,
    requiredSkills: '', 
};

export const JobPostModal = ({ isOpen, onClose, jobToEdit }: JobPostModalProps) => {
  const [formData, setFormData] = useState(initialFormState);

  const [createJob, { isLoading: isCreating }] = useCreateEmployerJobMutation();
  const [updateJob, { isLoading: isUpdating }] = useUpdateEmployerJobMutation();

  useEffect(() => {
    if (jobToEdit) {
      setFormData({
        title: jobToEdit.title || '',
        location: jobToEdit.location || '',
        jobType: jobToEdit.jobType || 'Full-time',
        category: jobToEdit.category || '',
        description: jobToEdit.description || '',
        experienceLevel: jobToEdit.experienceLevel || 'Mid-level',
        yearsOfExperience: jobToEdit.yearsOfExperience || 0,
        requiredSkills: jobToEdit.requiredSkills?.join(', ') || '',
      });
    } else {
      setFormData(initialFormState);
    }
  }, [jobToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = {
        ...formData,
        requiredSkills: formData.requiredSkills.split(',').map(skill => skill.trim()).filter(Boolean),
        yearsOfExperience: Number(formData.yearsOfExperience),
    };
    
    const mutation = jobToEdit ? updateJob({ id: jobToEdit._id, data: finalData }) : createJob(finalData);

    try {
      await mutation.unwrap();
      toast.success(`Job ${jobToEdit ? 'updated' : 'created'} successfully! It is now pending admin review.`);
      onClose();
    } catch (error: any) {
      toast.error(error.data?.message || `Failed to ${jobToEdit ? 'update' : 'create'} job.`);
    }
  };
  
  const isLoading = isCreating || isUpdating;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{jobToEdit ? 'Edit Job Post' : 'Create New Job Post'}</DialogTitle>
          <DialogDescription>Fill in the details below. All job posts are subject to admin review upon creation or update.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4 pr-2">
            <div><Label htmlFor="title">Job Title</Label><Input id="title" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g., Primary School Teacher" /></div>
            <div><Label htmlFor="category">Category</Label><Input id="category" name="category" value={formData.category} onChange={handleChange} required placeholder="e.g., Education, Teaching" /></div>
            <div><Label htmlFor="location">Location</Label><Input id="location" name="location" value={formData.location} onChange={handleChange} required placeholder="e.g., New Delhi, India" /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label htmlFor="jobType">Job Type</Label><Select name="jobType" value={formData.jobType} onValueChange={(value) => handleSelectChange('jobType', value)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Full-time">Full-time</SelectItem><SelectItem value="Part-time">Part-time</SelectItem><SelectItem value="Contract">Contract</SelectItem></SelectContent></Select></div>
                <div><Label htmlFor="experienceLevel">Experience Level</Label><Select name="experienceLevel" value={formData.experienceLevel} onValueChange={(value) => handleSelectChange('experienceLevel', value)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Entry-level">Entry-level</SelectItem><SelectItem value="Mid-level">Mid-level</SelectItem><SelectItem value="Senior-level">Senior-level</SelectItem></SelectContent></Select></div>
            </div>
            <div><Label htmlFor="yearsOfExperience">Years of Experience Required</Label><Input id="yearsOfExperience" name="yearsOfExperience" type="number" value={formData.yearsOfExperience} onChange={handleChange} required /></div>
            <div><Label htmlFor="requiredSkills">Required Skills (comma-separated)</Label><Input id="requiredSkills" name="requiredSkills" value={formData.requiredSkills} onChange={handleChange} required placeholder="e.g., Classroom Management, Lesson Planning" /></div>
            <div><Label htmlFor="description">Job Description</Label><Textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows={6} placeholder="Describe the role, responsibilities, and qualifications..." /></div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Job Post'}</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};