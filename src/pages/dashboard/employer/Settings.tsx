import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { logOut, selectCurrentUser } from '@/features/auth/authSlice';
import { User as AuthUser } from '@/types/user';
import { useGetEmployerProfileQuery, useUpdateEmployerProfileDetailsMutation, useUpdateEmployerNotificationSettingsMutation, useUpdateProfileVisibilityMutation } from '@/features/profile/employerProfileApiService';
import { useUpdatePasswordMutation, useDeleteAccountMutation, useLogoutMutation } from '@/features/auth/authApiService';
import toast from 'react-hot-toast';
import { User, Bell, Shield, Key, Loader2, Briefcase } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const Settings = () => {
    const [activeSection, setActiveSection] = useState<'account' | 'notifications' | 'privacy' | 'security'>('account');
    const user = useAppSelector(selectCurrentUser);

    if (!user) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
    }

    const sections = [
        { key: 'account' as const, label: 'Account', icon: User },
        { key: 'notifications' as const, label: 'Notifications', icon: Bell },
        { key: 'privacy' as const, label: 'Privacy', icon: Shield },
        { key: 'security' as const, label: 'Security', icon: Key }
    ];

    const renderContent = () => {
        switch (activeSection) {
            case 'account': return <AccountSettingsSection user={user} />;
            case 'notifications': return <NotificationSettingsSection />;
            case 'privacy': return <PrivacySettingsSection />;
            case 'security': return <SecuritySettingsSection />;
            default: return null;
        }
    };

    return (
        <div className="p-1 md:p-4 bg-gray-50/50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-500 mt-1">Manage your account, notifications, and privacy.</p>
                </div>
                <div className="mb-6 overflow-x-auto">
                    <div className="inline-flex items-center p-1.5 bg-white rounded-lg shadow-sm border space-x-1">
                        {sections.map((section) => {
                            const Icon = section.icon;
                            const isActive = activeSection === section.key;
                            return (
                                <button
                                    key={section.key}
                                    onClick={() => setActiveSection(section.key)}
                                    className={`flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${isActive ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-transparent text-gray-600 hover:bg-gray-100'}`}
                                >
                                    <Icon className="w-5 h-5 mr-2" />
                                    <span>{section.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
                <div>{renderContent()}</div>
            </div>
        </div>
    );
};

const AccountSettingsSection = ({ user }: { user: AuthUser }) => {
    const { data: profile, isLoading } = useGetEmployerProfileQuery();
    const [updateDetails, { isLoading: isUpdating }] = useUpdateEmployerProfileDetailsMutation();
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

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
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5" />Personal Details</CardTitle>
                    <CardDescription>Manage your public name and contact phone number.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isLoading ? <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /><span>Loading Details...</span></div> : (
                        <>
                            <div className="space-y-2"><Label htmlFor="name">Full Name</Label><Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" /></div>
                            <div className="space-y-2"><Label htmlFor="phone">Phone Number</Label><Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter phone number" /></div>
                            <Button onClick={handleSave} disabled={isUpdating}>{isUpdating ? 'Saving...' : 'Save Changes'}</Button>
                        </>
                    )}
                </CardContent>
            </Card>
            <Card className="mt-6">
                <CardHeader><CardTitle>Account Management</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg"><div><Label>Email address</Label><p className="text-sm text-muted-foreground">{user.email}</p></div></div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg"><div><Label>Password</Label><p className="text-sm text-muted-foreground">••••••••••••</p></div><Button variant="outline" onClick={() => setShowPasswordModal(true)} className="mt-2 sm:mt-0">Change Password</Button></div>
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <h4 className="font-semibold text-red-800">Close Account</h4>
                        <p className="text-sm text-red-700 mt-1 mb-3">This action is permanent and cannot be undone.</p>
                        <Button variant="destructive" onClick={() => setShowDeleteModal(true)}>Close My Account</Button>
                    </div>
                </CardContent>
            </Card>
            {showPasswordModal && <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />}
            {showDeleteModal && <DeleteAccountModal onClose={() => setShowDeleteModal(false)} />}
        </>
    );
};

const NotificationSettingsSection = () => {
    const { data: profile, isLoading } = useGetEmployerProfileQuery();
    const [updateSettings, { isLoading: isUpdating }] = useUpdateEmployerNotificationSettingsMutation();
    const [currentSettings, setCurrentSettings] = useState({
        emailJobAlerts: true,
        whatsappUpdates: false,
        messagesFromSchools: true,
    });

    useEffect(() => {
        if (profile?.settings?.notifications) {
            setCurrentSettings(profile.settings.notifications);
        }
    }, [profile]);

    const handleToggle = async (key: keyof typeof currentSettings) => {
        const originalSettings = { ...currentSettings };
        const newSettings = { ...currentSettings, [key]: !currentSettings[key] };
        setCurrentSettings(newSettings);
        try {
            await updateSettings(newSettings).unwrap();
            toast.success('Notification settings updated!');
        } catch (err) {
            toast.error('Failed to update settings.');
            setCurrentSettings(originalSettings);
        }
    };

    const notifications = [
        { key: 'emailJobAlerts' as const, label: 'Job Alerts & Updates', description: 'Emails about new jobs and application status.' },
        { key: 'whatsappUpdates' as const, label: 'WhatsApp Updates', description: 'Receive real-time status updates on WhatsApp.' },
        { key: 'messagesFromSchools' as const, label: 'Direct Messages', description: 'Get notified when a school messages you.' },
    ];

    return (
        <Card>
            <CardHeader><CardTitle>Notification Settings</CardTitle></CardHeader>
            <CardContent className="space-y-2">
                {isLoading ? <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /><span>Loading...</span></div> : notifications.map((notification) => (
                    <div key={notification.key} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-0.5">
                            <Label htmlFor={notification.key}>{notification.label}</Label>
                            <p className="text-sm text-muted-foreground">{notification.description}</p>
                        </div>
                        <Switch id={notification.key} checked={currentSettings[notification.key]} onCheckedChange={() => handleToggle(notification.key)} disabled={isUpdating} />
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

const PrivacySettingsSection = () => {
    const { data: profile, isLoading } = useGetEmployerProfileQuery();
    const [updateVisibility, { isLoading: isUpdating }] = useUpdateProfileVisibilityMutation();

    const handleVisibilityToggle = async (isVisible: boolean) => {
        try {
            await updateVisibility({ isVisible }).unwrap();
            toast.success(`Profile visibility updated.`);
        } catch (error) {
            toast.error("Failed to update visibility.");
        }
    };

    return (
        <Card>
            <CardHeader><CardTitle>Privacy Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                {isLoading ? <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /><span>Loading...</span></div> : (
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-0.5 pr-4">
                            <Label htmlFor="discoverability">Profile Discoverability</Label>
                            <p className="text-sm text-muted-foreground">Allow schools to find your profile in searches.</p>
                        </div>
                        <Switch id="discoverability" checked={profile?.isVisible} onCheckedChange={handleVisibilityToggle} disabled={isUpdating} />
                    </div>
                )}
                <div className="p-4 border rounded-lg">
                    <Label>Request Your Data</Label>
                    <p className="text-sm text-muted-foreground mt-1 mb-3">Download a copy of all your personal data.</p>
                    <Button variant="outline" disabled>Request Data</Button>
                </div>
            </CardContent>
        </Card>
    );
};

const SecuritySettingsSection = () => (
    <Card>
        <CardHeader><CardTitle>Security Settings</CardTitle></CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5"><Label>Two-Factor Authentication</Label><p className="text-sm text-muted-foreground">Add an extra layer of security.</p></div>
                <Button variant="outline" disabled>Enable</Button>
            </div>
            <div className="p-4 border rounded-lg">
                <Label>Active Sessions</Label>
                <p className="text-sm text-muted-foreground mt-1 mb-3">Devices currently signed into your account.</p>
                <div className="p-3 bg-gray-50 rounded-md"><p className="text-sm font-medium">Current Session</p><p className="text-xs text-muted-foreground">Chrome on Windows • New Delhi, India</p></div>
            </div>
        </CardContent>
    </Card>
);

const ChangePasswordModal = ({ onClose }: { onClose: () => void }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

    const handleSubmit = async () => {
        if (newPassword !== confirmPassword) { toast.error('New passwords do not match'); return; }
        try {
            await updatePassword({ currentPassword, newPassword }).unwrap();
            toast.success('Password updated successfully!');
            onClose();
        } catch (err: any) { toast.error(err.data?.message || 'Failed to update password.'); }
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader><DialogTitle>Change Password</DialogTitle><DialogDescription>Enter your current password and choose a new one.</DialogDescription></DialogHeader>
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

const DeleteAccountModal = ({ onClose }: { onClose: () => void }) => {
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
        } catch (err: any) { toast.error(err.data?.message || 'Failed to delete account.'); }
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader><DialogTitle>Delete Account</DialogTitle><DialogDescription>This action is irreversible. Please enter your password to confirm deletion.</DialogDescription></DialogHeader>
                <div className="py-4">
                    <Label htmlFor="confirmPasswordDel">Password</Label>
                    <Input id="confirmPasswordDel" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>{isLoading ? 'Deleting...' : 'Delete Account'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default Settings;