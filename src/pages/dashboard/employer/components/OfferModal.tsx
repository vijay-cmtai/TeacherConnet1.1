import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useUpdateApplicationMutation } from '@/features/profile/employerProfileApiService';
import { Application } from '@/types/employer';
import toast from 'react-hot-toast';

interface OfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application;
}

export const OfferModal = ({ isOpen, onClose, application }: OfferModalProps) => {
  const [details, setDetails] = useState({
    salary: '',
    joiningDate: '',
    offerText: ''
  });
  const [updateApplication, { isLoading }] = useUpdateApplicationMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!details.salary || !details.joiningDate) {
        toast.error("Salary and Joining Date are required.");
        return;
    }
    try {
        await updateApplication({
            appId: application._id,
            body: {
                status: 'offer_extended',
                category: 'offers',
                offerDetails: details
            }
        }).unwrap();
        toast.success("Offer sent successfully!");
        onClose();
    } catch(err) {
        toast.error("Failed to send offer.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Offer to {application.user.fullName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2"><Label htmlFor="salary">Salary Offered</Label><Input id="salary" name="salary" value={details.salary} onChange={handleChange} placeholder="e.g., ₹50,000 per month" /></div>
          <div className="space-y-2"><Label htmlFor="joiningDate">Proposed Joining Date</Label><Input id="joiningDate" name="joiningDate" type="date" value={details.joiningDate} onChange={handleChange} /></div>
          <div className="space-y-2"><Label htmlFor="offerText">Offer Details / Message (Optional)</Label><Textarea id="offerText" name="offerText" value={details.offerText} onChange={handleChange} placeholder="Additional details about the offer..."/></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isLoading}>{isLoading ? 'Sending...' : 'Send Offer'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};