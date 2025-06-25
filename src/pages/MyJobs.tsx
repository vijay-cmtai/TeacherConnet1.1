
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Briefcase, MapPin, Clock, DollarSign, Search, Filter, Calendar, Building } from 'lucide-react';

const MyJobs = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const applications = [
    {
      id: 1,
      position: 'Mathematics Teacher',
      school: 'Lincoln Elementary School',
      location: 'Springfield, IL',
      salary: '$45,000 - $55,000',
      appliedDate: '2024-01-15',
      status: 'interview',
      type: 'Full-time',
      description: 'Seeking an experienced Math teacher for grades 3-5.',
      statusColor: 'bg-secondary text-secondary-foreground'
    },
    {
      id: 2,
      position: 'Science Teacher',
      school: 'Oak Hill High School',
      location: 'Madison, WI',
      salary: '$48,000 - $62,000',
      appliedDate: '2024-01-12',
      status: 'under-review',
      type: 'Full-time',
      description: 'High school science teacher position for Biology and Chemistry.',
      statusColor: 'bg-warning text-warning-foreground'
    },
    {
      id: 3,
      position: 'English Teacher',
      school: 'Central Middle School',
      location: 'Chicago, IL',
      salary: '$42,000 - $52,000',
      appliedDate: '2024-01-10',
      status: 'applied',
      type: 'Full-time',
      description: 'Middle school English teacher for grades 6-8.',
      statusColor: 'bg-primary text-primary-foreground'
    },
    {
      id: 4,
      position: 'Art Teacher',
      school: 'Riverside Elementary',
      location: 'Milwaukee, WI',
      salary: '$40,000 - $48,000',
      appliedDate: '2024-01-08',
      status: 'rejected',
      type: 'Part-time',
      description: 'Part-time art teacher for elementary students.',
      statusColor: 'bg-destructive text-destructive-foreground'
    },
    {
      id: 5,
      position: 'Physical Education Teacher',
      school: 'Sunset High School',
      location: 'Green Bay, WI',
      salary: '$46,000 - $58,000',
      appliedDate: '2024-01-05',
      status: 'hired',
      type: 'Full-time',
      description: 'High school PE teacher and sports coach.',
      statusColor: 'bg-success text-success-foreground'
    }
  ];

  const getStatusText = (status: string) => {
    switch (status) {
      case 'applied': return 'Applied';
      case 'under-review': return 'Under Review';
      case 'interview': return 'Interview Scheduled';
      case 'hired': return 'Hired';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.school.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-page">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Job Applications</h1>
              <p className="text-muted-foreground">Track and manage your job application progress</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{applications.length}</div>
                <div className="text-sm text-muted-foreground">Total Applied</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-warning">{statusCounts['under-review'] || 0}</div>
                <div className="text-sm text-muted-foreground">Under Review</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-secondary">{statusCounts['interview'] || 0}</div>
                <div className="text-sm text-muted-foreground">Interviews</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-success">{statusCounts['hired'] || 0}</div>
                <div className="text-sm text-muted-foreground">Hired</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-destructive">{statusCounts['rejected'] || 0}</div>
                <div className="text-sm text-muted-foreground">Rejected</div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs or schools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="under-review">Under Review</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="hired">Hired</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <Card key={application.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-1">
                          {application.position}
                        </h3>
                        <div className="flex items-center gap-4 text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <Building className="h-4 w-4" />
                            <span>{application.school}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{application.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            <span>{application.salary}</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-3">{application.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Applied: {new Date(application.appliedDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{application.type}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className={application.statusColor}>
                        {getStatusText(application.status)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    {application.status === 'interview' && (
                      <Button size="sm">
                        Schedule Interview
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredApplications.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No applications found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Start applying to jobs to see them here.'}
              </p>
              <Button>Browse Jobs</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MyJobs;
