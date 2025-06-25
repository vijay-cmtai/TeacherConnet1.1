import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useGetFullUserDetailsQuery } from '@/features/admin/adminApiService';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import StatusBadge from '@/components/ui/StatusBadge';
import { Building, Briefcase, Mail, Phone, MapPin, Globe, Book, Star, GraduationCap } from 'lucide-react';

interface UserDetailsModalProps {
  userId: string;
  onClose: () => void;
}

const UserDetailsModal = ({ userId, onClose }: UserDetailsModalProps) => {
  const { data: userDetails, isLoading, isError } = useGetFullUserDetailsQuery(userId, { skip: !userId });

  const renderContent = () => {
    if (isLoading) return <div className="space-y-4"><Skeleton className="h-6 w-1/2" /><Skeleton className="h-4 w-full" /><Skeleton className="h-20 w-full" /><Skeleton className="h-20 w-full" /></div>;
    if (isError || !userDetails) return <p>Could not load user details.</p>;

    const { user, profile, applications, jobs } = userDetails;

    return (
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg">{profile?.name || user.email}</h3>
                    <p className="text-muted-foreground">{user.email}</p>
                </div>
                <div className="flex gap-2">
                    <Badge variant="secondary" className="capitalize">{user.role}</Badge>
                    <StatusBadge status={user.status}><span className="capitalize">{user.status}</span></StatusBadge>
                </div>
            </div>
            
            {user.role === 'employer' && profile && (
                <div className="space-y-4">
                    <div className="p-4 border rounded-lg space-y-2">
                        <h4 className="font-semibold text-sm flex items-center gap-2"><Phone size={14}/>Contact</h4>
                        <p className="text-sm"><strong>Headline:</strong> {profile.headline || 'N/A'}</p>
                        <p className="text-sm"><strong>Location:</strong> {profile.location || 'N/A'}</p>
                        <p className="text-sm"><strong>Phone:</strong> {profile.phone || 'N/A'}</p>
                    </div>
                    <div className="p-4 border rounded-lg space-y-2">
                        <h4 className="font-semibold text-sm flex items-center gap-2"><Star size={14}/>Skills</h4>
                        <div className="flex flex-wrap gap-2">{profile.skills?.length > 0 ? profile.skills.map(skill => <Badge key={skill._id} variant="outline">{skill.name}</Badge>) : <p className="text-sm text-muted-foreground">No skills listed.</p>}</div>
                    </div>
                     <div className="p-4 border rounded-lg space-y-2">
                        <h4 className="font-semibold text-sm flex items-center gap-2"><Briefcase size={14}/>Work Experience ({profile.workExperience?.length})</h4>
                        {profile.workExperience?.map(exp => <div key={exp._id}><p className="text-sm font-medium">{exp.title} at {exp.company}</p><p className="text-xs text-muted-foreground">{exp.duration}</p></div>)}
                    </div>
                    <div className="p-4 border rounded-lg space-y-2">
                        <h4 className="font-semibold text-sm flex items-center gap-2"><GraduationCap size={14}/>Education ({profile.education?.length})</h4>
                        {profile.education?.map(edu => <div key={edu._id}><p className="text-sm font-medium">{edu.degree} from {edu.school}</p><p className="text-xs text-muted-foreground">{edu.year}</p></div>)}
                    </div>
                </div>
            )}

            {user.role === 'college' && profile && (
                <div className="space-y-4">
                    <div className="p-4 border rounded-lg space-y-2">
                         <h4 className="font-semibold text-sm flex items-center gap-2"><Building size={14}/>College Details</h4>
                        <p className="text-sm"><strong>Address:</strong> {profile.address || 'N/A'}</p>
                        <p className="text-sm"><strong>Phone:</strong> {profile.phone || 'N/A'}</p>
                        <p className="text-sm"><strong>Website:</strong> <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{profile.website}</a></p>
                    </div>
                    <div className="p-4 border rounded-lg space-y-2">
                        <h4 className="font-semibold text-sm flex items-center gap-2"><Briefcase size={14}/>Jobs Posted ({jobs?.length})</h4>
                        <ul className="list-disc list-inside text-sm text-muted-foreground">{jobs?.map(job => <li key={job._id}>{job.title}</li>)}</ul>
                    </div>
                </div>
            )}
        </div>
    );
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>User Profile Details</DialogTitle><DialogDescription>A complete overview of the selected user and their activities.</DialogDescription></DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;