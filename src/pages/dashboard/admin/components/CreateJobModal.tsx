import { useState } from 'react';
import { useCreateJobByAdminMutation } from '@/features/admin/adminApiService';
import { useGetCollegesForAdminQuery } from '@/features/api/adminReviewApiService';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import toast from 'react-hot-toast';

interface CreateJobModalProps {
  onClose: () => void;
}

const CreateJobModal = ({ onClose }: CreateJobModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    description: '',
    type: '',
    salary: '',
    postedBy: '',
  });

  const { data: colleges = [], isLoading: isLoadingColleges } = useGetCollegesForAdminQuery();
  const [createJob, { isLoading: isCreating }] = useCreateJobByAdminMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async () => {
    const selectedCollege = colleges.find(c => c.user === formData.postedBy);
    if (!selectedCollege) {
        toast.error('Invalid college selection.');
        return;
    }

    const jobData = {
        ...formData,
        schoolName: selectedCollege.name,
    };
    
    try {
      await createJob(jobData).unwrap();
      toast.success('Job created successfully!');
      onClose();
    } catch (err) {
      toast.error('Failed to create job.');
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Job</DialogTitle>
          <DialogDescription>Create a job posting on behalf of a college.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="postedBy" className="text-right">College</Label>
            <div className="col-span-3">
              <Select value={formData.postedBy} onValueChange={(value) => handleSelectChange('postedBy', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingColleges ? "Loading colleges..." : "Select a college"} />
                </SelectTrigger>
                <SelectContent>
                  {colleges.map((college) => (
                    <SelectItem key={college._id} value={college.user}>
                      {college.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Job Title</Label>
            <Input id="title" value={formData.title} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">Location</Label>
            <Input id="location" value={formData.location} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">Job Type</Label>
            <Input id="type" value={formData.type} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="salary" className="text-right">Salary</Label>
            <Input id="salary" value={formData.salary} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Textarea id="description" value={formData.description} onChange={handleChange} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isCreating}>
            {isCreating ? 'Creating...' : 'Create Job'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateJobModal;