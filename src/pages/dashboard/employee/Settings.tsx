
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Bell, Lock, User, Mail, Eye, EyeOff } from 'lucide-react';

const EmployeeSettings = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    jobAlerts: true,
    applicationUpdates: true,
    emailDigest: false,
    smsNotifications: false
  });
  
  const [accountData, setAccountData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    email: 'sarah.johnson@email.com'
  });

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handlePasswordChange = () => {
    console.log('Changing password...');
    // Reset password fields
    setAccountData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
  };

  const handleEmailChange = () => {
    console.log('Updating email...');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Account Settings
          </CardTitle>
          <CardDescription>Update your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                value={accountData.email}
                onChange={(e) => setAccountData(prev => ({ ...prev, email: e.target.value }))}
              />
              <Button onClick={handleEmailChange}>Update</Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Change Password
            </h3>
            
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPassword ? "text" : "password"}
                  value={accountData.currentPassword}
                  onChange={(e) => setAccountData(prev => ({ ...prev, currentPassword: e.target.value }))}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                value={accountData.newPassword}
                onChange={(e) => setAccountData(prev => ({ ...prev, newPassword: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={accountData.confirmPassword}
                onChange={(e) => setAccountData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              />
            </div>
            
            <Button onClick={handlePasswordChange}>Change Password</Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>Choose what notifications you want to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="jobAlerts">Job Alerts</Label>
                <p className="text-sm text-muted-foreground">Get notified about new job postings</p>
              </div>
              <Switch
                id="jobAlerts"
                checked={notifications.jobAlerts}
                onCheckedChange={(checked) => handleNotificationChange('jobAlerts', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="applicationUpdates">Application Updates</Label>
                <p className="text-sm text-muted-foreground">Updates on your application status</p>
              </div>
              <Switch
                id="applicationUpdates"
                checked={notifications.applicationUpdates}
                onCheckedChange={(checked) => handleNotificationChange('applicationUpdates', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailDigest">Weekly Email Digest</Label>
                <p className="text-sm text-muted-foreground">Summary of activity and opportunities</p>
              </div>
              <Switch
                id="emailDigest"
                checked={notifications.emailDigest}
                onCheckedChange={(checked) => handleNotificationChange('emailDigest', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="smsNotifications">SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">Important updates via text message</p>
              </div>
              <Switch
                id="smsNotifications"
                checked={notifications.smsNotifications}
                onCheckedChange={(checked) => handleNotificationChange('smsNotifications', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy & Data</CardTitle>
          <CardDescription>Control your privacy and data settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline">Download My Data</Button>
          <Button variant="destructive">Delete Account</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeSettings;
