
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Briefcase, GraduationCap, Settings, Users } from 'lucide-react';
import Header from '@/components/Header';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleIcon = () => {
    switch (user.role) {
      case 'employer':
        return <Briefcase className="h-12 w-12 text-primary" />;
      case 'employee':
        return <User className="h-12 w-12 text-primary" />;
      case 'admin':
        return <Settings className="h-12 w-12 text-primary" />;
      case 'college':
        return <GraduationCap className="h-12 w-12 text-primary" />;
      default:
        return <User className="h-12 w-12 text-primary" />;
    }
  };

  const getRoleContent = () => {
    switch (user.role) {
      case 'employer':
        return {
          title: 'Employer Dashboard',
          description: 'Manage your job postings and find the best candidates',
          stats: [
            { label: 'Active Jobs', value: '5' },
            { label: 'Applications', value: '23' },
            { label: 'Interviews', value: '8' }
          ]
        };
      case 'employee':
        return {
          title: 'Employee Dashboard',
          description: 'Track your applications and explore new opportunities',
          stats: [
            { label: 'Applications Sent', value: '12' },
            { label: 'Profile Views', value: '45' },
            { label: 'Saved Jobs', value: '7' }
          ]
        };
      case 'admin':
        return {
          title: 'Admin Dashboard',
          description: 'Manage platform users and system settings',
          stats: [
            { label: 'Total Users', value: '1,234' },
            { label: 'Active Jobs', value: '89' },
            { label: 'Reports', value: '15' }
          ]
        };
      case 'college':
        return {
          title: 'College Dashboard',
          description: 'Manage student placements and industry connections',
          stats: [
            { label: 'Students', value: '456' },
            { label: 'Partnerships', value: '23' },
            { label: 'Placements', value: '67' }
          ]
        };
      default:
        return {
          title: 'Dashboard',
          description: 'Welcome to your profile',
          stats: []
        };
    }
  };

  const roleContent = getRoleContent();

  return (
    <div className="min-h-screen bg-page">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid gap-6">
          {/* Welcome Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                {getRoleIcon()}
                <div>
                  <CardTitle className="text-2xl">Welcome back, {user.name}!</CardTitle>
                  <CardDescription className="text-lg capitalize">
                    {user.role} • {user.email}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {roleContent.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {roleContent.description}
                  </p>
                </div>
                <Button onClick={handleLogout} variant="outline">
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roleContent.stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <Users className="h-6 w-6 mb-2" />
                  View Profile
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Settings className="h-6 w-6 mb-2" />
                  Settings
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Briefcase className="h-6 w-6 mb-2" />
                  {user.role === 'employer' ? 'Post Job' : 'Find Jobs'}
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <GraduationCap className="h-6 w-6 mb-2" />
                  Resources
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
