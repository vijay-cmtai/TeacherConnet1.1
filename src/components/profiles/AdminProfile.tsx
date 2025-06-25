
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, Settings, BarChart3, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';

const AdminProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const stats = [
    { label: 'Total Users', value: '1,247', icon: Users, color: 'text-primary', bgColor: 'bg-primary/10', trend: '+12%' },
    { label: 'Active Jobs', value: '89', icon: BarChart3, color: 'text-secondary', bgColor: 'bg-secondary/10', trend: '+5%' },
    { label: 'System Alerts', value: '3', icon: Shield, color: 'text-destructive', bgColor: 'bg-destructive/10', trend: '-2' },
    { label: 'Monthly Growth', value: '+12%', icon: TrendingUp, color: 'text-success', bgColor: 'bg-success/10', trend: 'up' },
  ];

  const recentActivities = [
    { 
      action: 'New employer registered', 
      user: 'Springfield School District', 
      time: '2 hours ago',
      type: 'registration',
      icon: Users,
      iconColor: 'text-primary'
    },
    { 
      action: 'Job posting approved', 
      user: 'Oak Elementary', 
      time: '4 hours ago',
      type: 'approval',
      icon: CheckCircle,
      iconColor: 'text-success'
    },
    { 
      action: 'User account suspended', 
      user: 'john.doe@email.com', 
      time: '6 hours ago',
      type: 'warning',
      icon: AlertTriangle,
      iconColor: 'text-destructive'
    },
    { 
      action: 'System maintenance completed', 
      user: 'System', 
      time: '8 hours ago',
      type: 'system',
      icon: Settings,
      iconColor: 'text-muted-foreground'
    },
  ];

  return (
    <div className="min-h-screen bg-page">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Welcome, {user?.name}! ⚡
              </h1>
              <p className="text-muted-foreground text-lg">
                Admin Dashboard - System management and oversight
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout} size="lg">
              Logout
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {stat.label}
                      </p>
                      <p className="text-3xl font-bold text-foreground mb-1">
                        {stat.value}
                      </p>
                      <div className="flex items-center gap-1">
                        <Badge variant="secondary" className="text-xs">
                          {stat.trend}
                        </Badge>
                      </div>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activities */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-6 w-6 text-primary" />
                  Recent Activities
                </CardTitle>
                <CardDescription>
                  Latest system activities and user actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className={`p-2 rounded-full bg-background ${activity.iconColor}`}>
                        <activity.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-foreground">{activity.action}</p>
                          <span className="text-xs text-muted-foreground">{activity.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{activity.user}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View Activity Log
                </Button>
              </CardContent>
            </Card>

            {/* Admin Tools */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-primary" />
                  Admin Tools
                </CardTitle>
                <CardDescription>
                  System management options and controls
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start h-12 text-left" variant="outline">
                  <Users className="mr-3 h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Manage Users</div>
                    <div className="text-xs text-muted-foreground">User accounts and permissions</div>
                  </div>
                </Button>
                <Button className="w-full justify-start h-12 text-left" variant="outline">
                  <Shield className="mr-3 h-5 w-5 text-secondary" />
                  <div>
                    <div className="font-medium">Security Settings</div>
                    <div className="text-xs text-muted-foreground">System security configuration</div>
                  </div>
                </Button>
                <Button className="w-full justify-start h-12 text-left" variant="outline">
                  <BarChart3 className="mr-3 h-5 w-5 text-accent" />
                  <div>
                    <div className="font-medium">Analytics Dashboard</div>
                    <div className="text-xs text-muted-foreground">Detailed system metrics</div>
                  </div>
                </Button>
                <Button className="w-full justify-start h-12 text-left" variant="outline">
                  <Settings className="mr-3 h-5 w-5 text-success" />
                  <div>
                    <div className="font-medium">System Configuration</div>
                    <div className="text-xs text-muted-foreground">Platform settings and features</div>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Additional Admin Features */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center hover:shadow-lg transition-all hover:scale-105">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Reports</h3>
                <p className="text-sm text-muted-foreground">Generate comprehensive system reports and analytics</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-all hover:scale-105">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Monitoring</h3>
                <p className="text-sm text-muted-foreground">Real-time system monitoring and health checks</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-all hover:scale-105">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-success" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Support</h3>
                <p className="text-sm text-muted-foreground">User support tickets and system maintenance</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
