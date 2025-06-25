import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Server, UserPlus, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminPlatformSettings = () => {
    const [settings, setSettings] = useState({
        maintenanceMode: false,
        allowRegistrations: true,
        autoApproveJobs: false,
    });

    const handleToggle = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
        toast.success('Setting toggled. Backend integration pending.');
    };

    const platformSettings = [
        { key: 'maintenanceMode' as const, label: 'Maintenance Mode', description: 'Temporarily disable the platform for non-admin users.', icon: <Server size={20}/> },
        { key: 'allowRegistrations' as const, label: 'Allow New Registrations', description: 'Enable or disable all new user sign-ups.', icon: <UserPlus size={20}/> },
        { key: 'autoApproveJobs' as const, label: 'Auto-Approve New Jobs', description: 'Bypass admin approval for jobs posted by colleges.', icon: <Send size={20}/> }
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Server size={20}/>Platform Settings</CardTitle>
                <CardDescription>Manage global settings that affect the entire platform and all users.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {platformSettings.map(setting => (
                    <div key={setting.key} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                            <div className="text-muted-foreground">{setting.icon}</div>
                            <div>
                                <Label htmlFor={setting.key}>{setting.label}</Label>
                                <p className="text-sm text-muted-foreground">{setting.description}</p>
                            </div>
                        </div>
                        <Switch id={setting.key} checked={settings[setting.key]} onCheckedChange={() => handleToggle(setting.key)} />
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

export default AdminPlatformSettings;