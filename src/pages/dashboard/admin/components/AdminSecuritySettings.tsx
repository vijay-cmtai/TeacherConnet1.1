import React, { useState } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { logOut } from '@/features/auth/authSlice';
import { useUpdatePasswordMutation, useDeleteAccountMutation, useLogoutMutation } from '@/features/auth/authApiService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { KeyRound, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminSecuritySettings = () => {
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><KeyRound size={20}/>Security</CardTitle>
                    <CardDescription>Manage your password and other security settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <Label>Password</Label>
                            <p className="text-sm text-muted-foreground">Change your account password regularly to keep your account secure.</p>
                        </div>
                        <Button variant="outline" onClick={() => setShowPasswordModal(true)}>Change Password</Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="mt-6 border-destructive">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive"><ShieldAlert size={20}/>Danger Zone</CardTitle>
                    <CardDescription>These actions are permanent and cannot be undone.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="flex items-center justify-between p-4 border border-destructive/20 bg-destructive/5 rounded-lg">
                        <div>
                            <Label className="text-destructive">Delete Account</Label>
                            <p className="text-sm text-red-700">Once you delete your account, there is no going back.</p>
                        </div>
                        <Button variant="destructive" onClick={() => setShowDeleteModal(true)}>Delete My Account</Button>
                    </div>
                </CardContent>
            </Card>

            {showPasswordModal && <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />}
            {showDeleteModal && <DeleteAccountModal onClose={() => setShowDeleteModal(false)} />}
        </>
    );
};

const ChangePasswordModal = ({ onClose }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

    const handleSubmit = async () => {
        if (newPassword !== confirmPassword) { toast.error('New passwords do not match'); return; }
        if (newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
        try {
            await updatePassword({ currentPassword, newPassword }).unwrap();
            toast.success('Password updated successfully!');
            onClose();
        } catch (err) { toast.error(err.data?.message || 'Failed to update password.'); }
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader><DialogTitle>Change Password</DialogTitle></DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2"><Label htmlFor="currentPassword">Current Password</Label><Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} /></div>
                    <div className="space-y-2"><Label htmlFor="newPassword">New Password</Label><Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></div>
                    <div className="space-y-2"><Label htmlFor="confirmPassword">Confirm New Password</Label><Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isLoading}>{isLoading ? 'Updating...' : 'Update Password'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const DeleteAccountModal = ({ onClose }) => {
    const [password, setPassword] = useState('');
    const [deleteAccount, { isLoading }] = useDeleteAccountMutation();
    const [logoutUser] = useLogoutMutation();
    const dispatch = useAppDispatch();

    const handleDelete = async () => {
        if (!password) { toast.error("Please enter your password to confirm."); return; }
        try {
            await deleteAccount({ password }).unwrap();
            toast.success('Account deleted successfully. Logging out...');
            await logoutUser({}).unwrap();
            dispatch(logOut());
            onClose();
        } catch (err) { toast.error(err.data?.message || 'Failed to delete account.'); }
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader><DialogTitle>Delete Account</DialogTitle><DialogDescription>This is a critical action. To confirm, please enter your password.</DialogDescription></DialogHeader>
                <div className="py-4">
                    <Label htmlFor="confirmPasswordDel">Password</Label>
                    <Input id="confirmPasswordDel" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password to confirm" />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>{isLoading ? 'Deleting Account...' : 'Confirm & Delete'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AdminSecuritySettings;