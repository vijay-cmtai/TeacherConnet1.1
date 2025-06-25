import React, { useState, useEffect } from 'react';
import { User } from '@/types/user';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Button } from '../../../components/ui/button';
import { Separator } from '../../../components/ui/separator';
import { Mail, Lock, Trash2, Briefcase, Building } from 'lucide-react';
import toast from 'react-hot-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { useAppDispatch } from '../../../app/hooks';
import { useDeleteAccountMutation, useUpdatePasswordMutation, useLogoutMutation } from '../../../features/auth/authApiService';
import { useGetEmployerProfileQuery, useUpdateEmployerProfileDetailsMutation } from '../../../features/profile/employerProfileApiService';
import { useGetCollegeProfileQuery, useUpdateCollegeProfileDetailsMutation } from '../../../features/profile/collegeProfileApiService';
import { logOut } from '../../../features/auth/authSlice';

interface AccountSettingsProps {
  user: User;
}

const AccountSettings = ({ user }: AccountSettingsProps) => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5" />Account Information</CardTitle>
          <CardDescription>Basic account details and login information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input value={user.email} disabled className="bg-muted" />
            <p className="text-sm text-muted-foreground">Your email address cannot be changed.</p>
          </div>
          <div className="space-y-2">
            <Label>Account Type</Label>
            <Input value={user.role} disabled className="bg-muted capitalize" />
          </div>
          <Separator />
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" onClick={() => setShowPasswordModal(true)} className="flex items-center gap-2"><Lock className="h-4 w-4" />Change Password</Button>
            <Button variant="destructive" onClick={() => setShowDeleteModal(true)} className="flex items-center gap-2"><Trash2 className="h-4 w-4" />Delete Account</Button>
          </div>
        </CardContent>
      </Card>
      {user.role === 'employer' && <EmployerAccountFields />}
      {user.role === 'college' && <CollegeAccountFields />}
      {user.role === 'admin' && <AdminAccountFields />}
      {showPasswordModal && <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />}
      {showDeleteModal && <DeleteAccountModal onClose={() => setShowDeleteModal(false)} />}
    </div>
  );
};

const EmployerAccountFields = () => {
  const { data: profile, isLoading } = useGetEmployerProfileQuery();
  const [updateDetails, { isLoading: isUpdating }] = useUpdateEmployerProfileDetailsMutation();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setPhone(profile.phone || '');
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await updateDetails({ name, phone }).unwrap();
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile.');
    }
  };

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5" />Employer Details</CardTitle><CardDescription>Manage your public profile information</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? <p>Loading...</p> : (
            <>
                <div className="space-y-2"><Label htmlFor="name">Full Name</Label><Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name"/></div>
                <div className="space-y-2"><Label htmlFor="phone">Phone Number</Label><Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter phone number"/></div>
                <Button onClick={handleSave} disabled={isUpdating}>{isUpdating ? 'Saving...' : 'Save Changes'}</Button>
            </>
        )}
      </CardContent>
    </Card>
  );
};

const CollegeAccountFields = () => {
  const { data: profile, isLoading } = useGetCollegeProfileQuery();
  const [updateDetails, { isLoading: isUpdating }] = useUpdateCollegeProfileDetailsMutation();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setAddress(profile.address || '');
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await updateDetails({ name, address }).unwrap();
      toast.success('College profile updated!');
    } catch (err) {
      toast.error('Failed to update college profile.');
    }
  };

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Building className="h-5 w-5" />College Details</CardTitle><CardDescription>Manage your institution information</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? <p>Loading...</p> : (
            <>
                <div className="space-y-2"><Label htmlFor="collegeName">College Name</Label><Input id="collegeName" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter college name"/></div>
                <div className="space-y-2"><Label htmlFor="address">Address</Label><Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter college address"/></div>
                <Button onClick={handleSave} disabled={isUpdating}>{isUpdating ? 'Saving...' : 'Save Changes'}</Button>
            </>
        )}
      </CardContent>
    </Card>
  );
};

const AdminAccountFields = () => {
  return (
    <Card>
      <CardHeader><CardTitle>Admin Details</CardTitle><CardDescription>View your administrative information</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2"><Label>Role</Label><Input value="Administrator" disabled className="bg-muted"/></div>
        <div className="space-y-2"><Label>Permissions</Label><div className="text-sm text-muted-foreground">• Full system access</div></div>
      </CardContent>
    </Card>
  );
};

const ChangePasswordModal = ({ onClose }: { onClose: () => void }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    try {
      await updatePassword({ currentPassword, newPassword }).unwrap();
      toast.success('Password updated successfully!');
      onClose();
    } catch (err: any) {
      toast.error(err.data?.message || 'Failed to update password.');
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader><DialogTitle>Change Password</DialogTitle><DialogDescription>Enter your current password and choose a new one.</DialogDescription></DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2"><Label htmlFor="currentPassword">Current Password</Label><Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}/></div>
          <div className="space-y-2"><Label htmlFor="newPassword">New Password</Label><Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/></div>
          <div className="space-y-2"><Label htmlFor="confirmPassword">Confirm New Password</Label><Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isLoading}>{isLoading ? 'Updating...' : 'Update Password'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const DeleteAccountModal = ({ onClose }: { onClose: () => void }) => {
  const [password, setPassword] = useState('');
  const [deleteAccount, { isLoading }] = useDeleteAccountMutation();
  const [logoutUser] = useLogoutMutation();
  const dispatch = useAppDispatch();

  const handleDelete = async () => {
    if (!password) {
      toast.error("Please enter your password to confirm.");
      return;
    }
    try {
      await deleteAccount({ password }).unwrap();
      await logoutUser({}).unwrap();
      dispatch(logOut());
      toast.success('Account deleted successfully.');
      onClose();
    } catch (err: any) {
      toast.error(err.data?.message || 'Failed to delete account.');
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader><DialogTitle>Delete Account</DialogTitle><DialogDescription>This action is irreversible. Please enter your password to confirm deletion.</DialogDescription></DialogHeader>
        <div className="py-4">
          <Label htmlFor="confirmPasswordDel">Password</Label>
          <Input id="confirmPasswordDel" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password"/>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>{isLoading ? 'Deleting...' : 'Delete Account'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AccountSettings;