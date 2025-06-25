import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useUpdateSkillsMutation } from '@/features/profile/employerProfileApiService';
import toast from 'react-hot-toast';
import { Skill } from '@/types/employer';

interface SkillsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSkills: Skill[];
}

export const SkillsModal = ({ isOpen, onClose, currentSkills }: SkillsModalProps) => {
  const [skills, setSkills] = useState('');
  const [updateSkills, { isLoading }] = useUpdateSkillsMutation();

  useEffect(() => {
    if (currentSkills) {
      setSkills(currentSkills.map(s => s.name).join(', '));
    }
  }, [currentSkills]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const skillsArray = skills.split(',').map(s => s.trim()).filter(s => s);
    try {
      await updateSkills({ skills: skillsArray }).unwrap();
      toast.success('Skills updated!');
      onClose();
    } catch (error) {
      toast.error('Failed to update skills.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Skills</DialogTitle>
          <DialogDescription>Enter your skills separated by commas.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="skills">Skills</Label>
            <Input id="skills" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="e.g., Classroom Management, Lesson Planning" />
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