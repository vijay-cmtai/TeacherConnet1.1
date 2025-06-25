import { useState } from 'react';
import { useAppSelector } from '@/app/hooks';
import { selectCurrentUser } from '@/features/auth/authSlice';
import { Card, CardContent } from '@/components/ui/card';
import { User, Bell, Shield, Settings as SettingsIcon } from 'lucide-react';
import CollegeAccountSettings from './components/CollegeAccountSettings';
import CollegeNotificationSettings from './components/CollegeNotificationSettings';
import CollegePrivacySettings from './components/CollegePrivacySettings';

const CollegeSettings = () => {
  const [activeSection, setActiveSection] = useState<'account' | 'notifications' | 'privacy'>('account');
  const user = useAppSelector(selectCurrentUser);

  if (!user) { return <div>Loading user...</div>; }

  const sections = [
    { key: 'account' as const, label: 'Account', icon: User },
    { key: 'notifications' as const, label: 'Notifications', icon: Bell },
    { key: 'privacy' as const, label: 'Privacy', icon: Shield },
  ];

  return (
    <div className="space-y-6">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg"><SettingsIcon className="h-8 w-8 text-primary" /></div>
            <div><h1 className="text-3xl font-bold text-foreground">Settings</h1><p className="text-muted-foreground capitalize">Manage your account preferences and settings for your {user.role} profile.</p></div>
        </div>

        {/* Horizontal Navigation */}
        <div className="border-b border-border">
            <nav className="flex -mb-px space-x-6">
                {sections.map((section) => (
                    <button 
                        key={section.key} 
                        onClick={() => setActiveSection(section.key)}
                        className={`flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeSection === section.key
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
                        }`}
                    >
                        <section.icon className="h-5 w-5" />
                        <span>{section.label}</span>
                    </button>
                ))}
            </nav>
        </div>

        {/* Content Area */}
        <div className="pt-4">
            {activeSection === 'account' && <CollegeAccountSettings user={user} />}
            {activeSection === 'notifications' && <CollegeNotificationSettings />}
            {activeSection === 'privacy' && <CollegePrivacySettings />}
        </div>
    </div>
  );
};

export default CollegeSettings;