import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useUpdateApplicationMutation } from '@/features/profile/employerProfileApiService';
import { Application } from '@/types/employer';
import toast from 'react-hot-toast';

interface InterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application;
}

type InterviewType = 'Online' | 'In-Person' | 'Telephonic';

interface InterviewDetailsState {
    scheduledOn: string;
    interviewType: InterviewType;
    notes: string;
}

export const InterviewModal = ({ isOpen, onClose, application }: InterviewModalProps) => {
  const [details, setDetails] = useState<InterviewDetailsState>({
    scheduledOn: '',
    interviewType: 'Online',
    notes: ''
  });
  const [updateApplication, { isLoading }] = useUpdateApplicationMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };
  
  const handleSelectChange = (value: InterviewType) => {
    setDetails({ ...details, interviewType: value });
  };

  const handleSubmit = async () => {
    if (!details.scheduledOn) {
        toast.error("Please select an interview date.");
        return;
    }
    try {
        await updateApplication({
            appId: application._id,
            body: {
                status: 'interview',
                category: 'interviews',
                interviewDetails: details
            }
        }).unwrap();
        toast.success("Interview scheduled successfully!");
        onClose();
    } catch(err) {
        toast.error("Failed to schedule interview.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Interview for {application.user.fullName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="scheduledOn">Interview Date and Time</Label>
            <Input id="scheduledOn" name="scheduledOn" type="datetime-local" value={details.scheduledOn} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="interviewType">Interview Type</Label>
            <Select name="interviewType" value={details.interviewType} onValueChange={handleSelectChange}>
                <SelectTrigger><SelectValue placeholder="Select type..." /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="In-Person">In-Person</SelectItem>
                    <SelectItem value="Telephonic">Telephonic</SelectItem>
                </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea id="notes" name="notes" value={details.notes} onChange={handleChange} placeholder="e.g., Focus on pedagogical skills..." />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isLoading}>{isLoading ? 'Scheduling...' : 'Schedule'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};