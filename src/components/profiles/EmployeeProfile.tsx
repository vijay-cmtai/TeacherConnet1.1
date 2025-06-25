
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Calendar, FileText, Award, TrendingUp, Clock, MapPin, Users } from 'lucide-react';

const EmployeeProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const stats = [
    { label: 'Applications Sent', value: '23', icon: FileText, color: 'text-primary', bgColor: 'bg-primary/10' },
    { label: 'Interviews Scheduled', value: '5', icon: Calendar, color: 'text-secondary', bgColor: 'bg-secondary/10' },
    { label: 'Skills Certified', value: '12', icon: Award, color: 'text-accent', bgColor: 'bg-accent/10' },
    { label: 'Profile Views', value: '89', icon: BookOpen, color: 'text-success', bgColor: 'bg-success/10' },
  ];

  const recentApplications = [
    { 
      school: 'Riverside Elementary', 
      position: 'Math Teacher', 
      status: 'Under Review',
      appliedDate: '2 days ago',
      statusColor: 'bg-warning/20 text-warning',
      location: 'Springfield, IL'
    },
    { 
      school: 'Oak Hill High School', 
      position: 'Science Teacher', 
      status: 'Interview Scheduled',
      appliedDate: '5 days ago',
      statusColor: 'bg-secondary/20 text-secondary',
      location: 'Madison, WI'
    },
    { 
      school: 'Central Middle School', 
      position: 'English Teacher', 
      status: 'Application Sent',
      appliedDate: '1 week ago',
      statusColor: 'bg-primary/20 text-primary',
      location: 'Chicago, IL'
    },
  ];

  return (
    <div className="min-h-screen bg-page">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-muted-foreground text-lg">
                Employee Dashboard - Track your job search progress and opportunities
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
                      <p className="text-3xl font-bold text-foreground">
                        {stat.value}
                      </p>
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
            {/* Recent Applications */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-primary" />
                  Recent Applications
                </CardTitle>
                <CardDescription>
                  Track your job application status and progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentApplications.map((application, index) => (
                    <div key={index} className="flex items-start justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-foreground">{application.school}</h4>
                          <Badge className={application.statusColor} variant="secondary">
                            {application.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{application.position}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{application.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{application.appliedDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Applications
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Enhance your job search and professional growth
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start h-12 text-left" variant="outline">
                  <BookOpen className="mr-3 h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Update Resume</div>
                    <div className="text-xs text-muted-foreground">Keep your profile current</div>
                  </div>
                </Button>
                <Button className="w-full justify-start h-12 text-left" variant="outline">
                  <FileText className="mr-3 h-5 w-5 text-secondary" />
                  <div>
                    <div className="font-medium">Browse Jobs</div>
                    <div className="text-xs text-muted-foreground">Find new opportunities</div>
                  </div>
                </Button>
                <Button className="w-full justify-start h-12 text-left" variant="outline">
                  <Calendar className="mr-3 h-5 w-5 text-accent" />
                  <div>
                    <div className="font-medium">Schedule Interviews</div>
                    <div className="text-xs text-muted-foreground">Manage your calendar</div>
                  </div>
                </Button>
                <Button className="w-full justify-start h-12 text-left" variant="outline">
                  <Award className="mr-3 h-5 w-5 text-success" />
                  <div>
                    <div className="font-medium">Add Certifications</div>
                    <div className="text-xs text-muted-foreground">Boost your credentials</div>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Additional Features */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center hover:shadow-lg transition-all hover:scale-105">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Network</h3>
                <p className="text-sm text-muted-foreground">Connect with other educators and build your professional network</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-all hover:scale-105">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Resources</h3>
                <p className="text-sm text-muted-foreground">Access career guides, salary information, and professional development</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-all hover:scale-105">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-success" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Analytics</h3>
                <p className="text-sm text-muted-foreground">Track your job search progress and optimize your applications</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
