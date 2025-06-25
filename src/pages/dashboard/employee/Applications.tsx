
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Building, Eye, MessageCircle } from 'lucide-react';

const EmployeeApplications = () => {
  const applications = [
    {
      id: 1,
      jobTitle: 'High School Mathematics Teacher',
      school: 'Lincoln High School',
      location: 'San Francisco, CA',
      appliedDate: '2024-01-15',
      status: 'Under Review',
      statusColor: 'bg-yellow-100 text-yellow-800',
      lastUpdate: '2 days ago',
      feedback: 'Your application is being reviewed by the hiring committee.'
    },
    {
      id: 2,
      jobTitle: 'Middle School Science Teacher',
      school: 'Riverside Middle School',
      location: 'Oakland, CA',
      appliedDate: '2024-01-10',
      status: 'Shortlisted',
      statusColor: 'bg-blue-100 text-blue-800',
      lastUpdate: '1 week ago',
      feedback: 'Congratulations! You have been shortlisted for an interview.'
    },
    {
      id: 3,
      jobTitle: 'Elementary Teacher',
      school: 'Sunshine Elementary',
      location: 'Berkeley, CA',
      appliedDate: '2024-01-05',
      status: 'Interview Scheduled',
      statusColor: 'bg-green-100 text-green-800',
      lastUpdate: '3 days ago',
      feedback: 'Interview scheduled for January 25th at 2:00 PM.'
    },
    {
      id: 4,
      jobTitle: 'Art Teacher',
      school: 'Creative Arts School',
      location: 'San Jose, CA',
      appliedDate: '2023-12-20',
      status: 'Rejected',
      statusColor: 'bg-red-100 text-red-800',
      lastUpdate: '2 weeks ago',
      feedback: 'Thank you for your interest. We have decided to move forward with another candidate.'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Under Review':
        return '⏳';
      case 'Shortlisted':
        return '📋';
      case 'Interview Scheduled':
        return '📅';
      case 'Rejected':
        return '❌';
      case 'Hired':
        return '✅';
      default:
        return '📄';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Applications</h1>
        <p className="text-muted-foreground">Track the status of your job applications</p>
      </div>

      {/* Application Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">12</div>
            <p className="text-sm text-muted-foreground">Total Applied</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">3</div>
            <p className="text-sm text-muted-foreground">Under Review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">2</div>
            <p className="text-sm text-muted-foreground">Shortlisted</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">1</div>
            <p className="text-sm text-muted-foreground">Interviews</p>
          </CardContent>
        </Card>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {applications.map((application) => (
          <Card key={application.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{getStatusIcon(application.status)}</span>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">{application.jobTitle}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          <span>{application.school}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{application.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-3">
                    <Badge className={application.statusColor}>{application.status}</Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>Applied: {new Date(application.appliedDate).toLocaleDateString()}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Last update: {application.lastUpdate}
                    </span>
                  </div>
                  
                  <div className="bg-muted/30 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-foreground mb-2">Latest Update:</h4>
                    <p className="text-sm text-muted-foreground">{application.feedback}</p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 ml-6">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  {application.status === 'Interview Scheduled' && (
                    <Button size="sm">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EmployeeApplications;
