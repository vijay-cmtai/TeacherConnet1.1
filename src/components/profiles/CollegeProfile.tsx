
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Users, Calendar, TrendingUp, Building, Award, BookOpen, Target } from 'lucide-react';

const CollegeProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const stats = [
    { label: 'Student Placements', value: '342', icon: GraduationCap, color: 'text-primary', bgColor: 'bg-primary/10', trend: '+15%' },
    { label: 'Partner Schools', value: '76', icon: Users, color: 'text-secondary', bgColor: 'bg-secondary/10', trend: '+8' },
    { label: 'Upcoming Events', value: '8', icon: Calendar, color: 'text-accent', bgColor: 'bg-accent/10', trend: '3 new' },
    { label: 'Placement Rate', value: '94%', icon: TrendingUp, color: 'text-success', bgColor: 'bg-success/10', trend: '+2%' },
  ];

  const recentPlacements = [
    { 
      student: 'Alice Williams', 
      school: 'Maple Elementary', 
      position: 'Primary Teacher',
      placementDate: '2 days ago',
      statusColor: 'bg-success/20 text-success',
      gpa: '3.8',
      program: 'Elementary Education'
    },
    { 
      student: 'Robert Johnson', 
      school: 'City High School', 
      position: 'Math Teacher',
      placementDate: '5 days ago',
      statusColor: 'bg-success/20 text-success',
      gpa: '3.6',
      program: 'Mathematics Education'
    },
    { 
      student: 'Maria Garcia', 
      school: 'Sunset Middle School', 
      position: 'Science Teacher',
      placementDate: '1 week ago',
      statusColor: 'bg-success/20 text-success',
      gpa: '3.9',
      program: 'Science Education'
    },
  ];

  return (
    <div className="min-h-screen bg-page">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Welcome, {user?.name}! 🎓
              </h1>
              <p className="text-muted-foreground text-lg">
                College Dashboard - Manage student placements and industry partnerships
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
            {/* Recent Placements */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-6 w-6 text-primary" />
                  Recent Placements
                </CardTitle>
                <CardDescription>
                  Latest successful student job placements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPlacements.map((placement, index) => (
                    <div key={index} className="flex items-start justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-foreground">{placement.student}</h4>
                          <Badge className={placement.statusColor} variant="secondary">
                            Placed
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {placement.school} - {placement.position}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Award className="h-3 w-3" />
                            <span>GPA: {placement.gpa}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            <span>{placement.program}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{placement.placementDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Placements
                </Button>
              </CardContent>
            </Card>

            {/* College Services */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-6 w-6 text-primary" />
                  College Services
                </CardTitle>
                <CardDescription>
                  Manage your college operations and programs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start h-12 text-left" variant="outline">
                  <GraduationCap className="mr-3 h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Student Directory</div>
                    <div className="text-xs text-muted-foreground">Manage student profiles and progress</div>
                  </div>
                </Button>
                <Button className="w-full justify-start h-12 text-left" variant="outline">
                  <Users className="mr-3 h-5 w-5 text-secondary" />
                  <div>
                    <div className="font-medium">Partner Network</div>
                    <div className="text-xs text-muted-foreground">School partnerships and relationships</div>
                  </div>
                </Button>
                <Button className="w-full justify-start h-12 text-left" variant="outline">
                  <Calendar className="mr-3 h-5 w-5 text-accent" />
                  <div>
                    <div className="font-medium">Career Events</div>
                    <div className="text-xs text-muted-foreground">Job fairs and networking events</div>
                  </div>
                </Button>
                <Button className="w-full justify-start h-12 text-left" variant="outline">
                  <TrendingUp className="mr-3 h-5 w-5 text-success" />
                  <div>
                    <div className="font-medium">Placement Analytics</div>
                    <div className="text-xs text-muted-foreground">Track success metrics and trends</div>
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
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Curriculum</h3>
                <p className="text-sm text-muted-foreground">Manage education programs and course offerings</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-all hover:scale-105">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Alumni Network</h3>
                <p className="text-sm text-muted-foreground">Connect with graduates and track career progression</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-all hover:scale-105">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-success" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Accreditation</h3>
                <p className="text-sm text-muted-foreground">Maintain program standards and certifications</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeProfile;
