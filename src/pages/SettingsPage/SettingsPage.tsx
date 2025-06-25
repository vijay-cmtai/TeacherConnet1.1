import { useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import { selectCurrentUser } from '../../features/auth/authSlice';
import AccountSettings from './components/AccountSettings';
import NotificationSettings from './components/NotificationSettings';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Card, CardContent } from '../../components/ui/card';
import { User, Bell, Settings as SettingsIcon } from 'lucide-react';

const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState<'account' | 'notifications'>('account');
  const user = useAppSelector(selectCurrentUser);

  if (!user) {
    return (
      <div className="min-h-screen bg-page flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive">Error: User Not Found</h1>
            <p className="text-muted-foreground">Please log in to access the settings page.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const sections = [
    { key: 'account' as const, label: 'Account', icon: User },
    { key: 'notifications' as const, label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-page flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                 <SettingsIcon className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Settings</h1>
                <p className="text-muted-foreground capitalize">
                  Manage your account preferences and settings for your {user.role} profile.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-3">
                  <nav className="space-y-1">
                    {sections.map((section) => (
                      <button
                        key={section.key}
                        onClick={() => setActiveSection(section.key)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-md transition-colors text-sm ${
                          activeSection === section.key
                            ? 'bg-primary text-primary-foreground font-semibold'
                            : 'text-foreground hover:bg-muted'
                        }`}
                      >
                        <section.icon className="h-5 w-5" />
                        <span>{section.label}</span>
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3">
              {activeSection === 'account' && <AccountSettings user={user} />}
              {activeSection === 'notifications' && <NotificationSettings user={user} />}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SettingsPage;