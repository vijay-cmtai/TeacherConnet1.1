import { useState, useEffect } from 'react';
import { useGetAdminProfileQuery, useUpdateAdminProfileMutation } from '@/features/admin/adminApiService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Mail, Phone, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminAccountSettings = () => {
    const { data: profile, isLoading } = useGetAdminProfileQuery();
    const [updateProfile, { isLoading: isUpdating }] = useUpdateAdminProfileMutation();

    const [formData, setFormData] = useState({ name: '', jobTitle: '', phone: '' });

    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || '',
                jobTitle: profile.jobTitle || '',
                phone: profile.phone || '',
            });
        }
    }, [profile]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleSaveChanges = async () => {
        try {
            await updateProfile(formData).unwrap();
            toast.success('Profile updated successfully!');
        } catch (err) {
            toast.error('Failed to update profile.');
        }
    };

    if (isLoading) {
        return <div className="space-y-4"><Skeleton className="h-12 w-full" /><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><User size={20}/>Account Information</CardTitle>
                <CardDescription>Manage your administrator profile details. This information is private.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex items-center gap-2 p-2 bg-muted rounded-md border">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{profile?.user?.email}</span>
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={formData.name} onChange={handleInputChange} placeholder="Enter your full name" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input id="jobTitle" value={formData.jobTitle} onChange={handleInputChange} placeholder="e.g., Platform Administrator" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" value={formData.phone} onChange={handleInputChange} placeholder="Enter your contact number" />
                </div>
            </CardContent>
            <CardFooter>
                 <Button onClick={handleSaveChanges} disabled={isUpdating}>
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default AdminAccountSettings;