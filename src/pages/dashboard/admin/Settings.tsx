import { useState } from 'react';
import { useAppSelector } from '@/app/hooks';
import { selectCurrentUser } from '@/features/auth/authSlice';
import { User, Shield, Server, Settings as SettingsIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminAccountSettings from './components/AdminAccountSettings';
import AdminSecuritySettings from './components/AdminSecuritySettings';
import AdminPlatformSettings from './components/AdminPlatformSettings';

const AdminSettings = () => {
  const user = useAppSelector(selectCurrentUser);

  if (!user) { return <div>Loading user...</div>; }

  return (
    <div className="space-y-6">
        <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg"><SettingsIcon className="h-8 w-8 text-primary" /></div>
            <div>
                <h1 className="text-3xl font-bold text-foreground">Settings</h1>
                <p className="text-muted-foreground">Manage administrator account, security, and platform-wide settings.</p>
            </div>
        </div>
        
        <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="account"><User className="w-4 h-4 mr-2"/>Account</TabsTrigger>
                <TabsTrigger value="security"><Shield className="w-4 h-4 mr-2"/>Security</TabsTrigger>
                <TabsTrigger value="platform"><Server className="w-4 h-4 mr-2"/>Platform</TabsTrigger>
            </TabsList>
            <TabsContent value="account" className="mt-4">
                <AdminAccountSettings />
            </TabsContent>
            <TabsContent value="security" className="mt-4">
                <AdminSecuritySettings />
            </TabsContent>
            <TabsContent value="platform" className="mt-4">
                <AdminPlatformSettings />
            </TabsContent>
        </Tabs>
    </div>
  );
};

export default AdminSettings;