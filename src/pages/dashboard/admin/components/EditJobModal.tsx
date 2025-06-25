import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useUpdateJobByAdminMutation, useGetJobDetailsForAdminQuery } from '@/features/admin/adminApiService';
import toast from 'react-hot-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface EditJobModalProps {
  jobId: string;
  onClose: () => void;
}

const EditJobModal = ({ jobId, onClose }: EditJobModalProps) => {
  const { data: job, isLoading: isLoadingJob } = useGetJobDetailsForAdminQuery(jobId);
  const [updateJob, { isLoading: isUpdating }] = useUpdateJobByAdminMutation();
  
  const [formData, setFormData] = useState({
    title: '', schoolName: '', location: '', description: '',
    salary: '', type: '', requirements: '', responsibilities: ''
  });

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        schoolName: job.schoolName || '',
        location: job.location || '',
        description: job.description || '',
        salary: job.salary || '',
        type: job.type || '',
        requirements: job.requirements || '',
        responsibilities: job.responsibilities || ''
      });
    }
  }, [job]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateJob({ jobId, data: formData }).unwrap();
      toast.success('Job updated successfully!');
      onClose();
    } catch (err: any) {
      toast.error(err.data?.message || 'Failed to update job.');
    }
  };
  
  const isLoading = isLoadingJob || isUpdating;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader><DialogTitle>Edit Job Post</DialogTitle><DialogDescription>Update the details for this job posting.</DialogDescription></DialogHeader>
        {isLoadingJob ? (
            <div className="space-y-4 py-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        ) : (
        <form onSubmit={handleSubmit} className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
           <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="title" className="text-right">Title</Label><Input id="title" value={formData.title} onChange={handleChange} className="col-span-3"/></div>
           <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="schoolName" className="text-right">School Name</Label><Input id="schoolName" value={formData.schoolName} onChange={handleChange} className="col-span-3"/></div>
           <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="location" className="text-right">Location</Label><Input id="location" value={formData.location} onChange={handleChange} className="col-span-3"/></div>
           <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="salary" className="text-right">Salary</Label><Input id="salary" value={formData.salary} onChange={handleChange} className="col-span-3"/></div>
           <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="type" className="text-right">Job Type</Label><Input id="type" value={formData.type} onChange={handleChange} className="col-span-3"/></div>
           <div className="grid grid-cols-4 items-start gap-4"><Label htmlFor="description" className="text-right pt-2">Description</Label><Textarea id="description" value={formData.description} onChange={handleChange} className="col-span-3" rows={3}/></div>
           <div className="grid grid-cols-4 items-start gap-4"><Label htmlFor="requirements" className="text-right pt-2">Requirements</Label><Textarea id="requirements" value={formData.requirements} onChange={handleChange} className="col-span-3" rows={3}/></div>
           <div className="grid grid-cols-4 items-start gap-4"><Label htmlFor="responsibilities" className="text-right pt-2">Responsibilities</Label><Textarea id="responsibilities" value={formData.responsibilities} onChange={handleChange} className="col-span-3" rows={3}/></div>
        <DialogFooter className="mt-4">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Changes'}</Button>
        </DialogFooter>
        </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
export default EditJobModal;