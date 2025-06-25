
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Clock, DollarSign, Building, Filter } from 'lucide-react';

const EmployeeJobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    location: '',
    subject: '',
    experience: '',
    salary: ''
  });

  const jobs = [
    {
      id: 1,
      title: 'High School Mathematics Teacher',
      school: 'Lincoln High School',
      location: 'San Francisco, CA',
      salary: '$55,000 - $75,000',
      type: 'Full-time',
      experience: '3-5 years',
      subjects: ['Algebra', 'Geometry', 'Calculus'],
      description: 'We are seeking a passionate mathematics teacher to join our dynamic team...',
      requirements: ['Bachelor\'s degree in Mathematics or Education', 'Teaching certification', '3+ years experience'],
      postedDate: '2 days ago',
      status: 'Approved',
      applicants: 12
    },
    {
      id: 2,
      title: 'Elementary Science Teacher',
      school: 'Sunshine Elementary',
      location: 'Oakland, CA',
      salary: '$48,000 - $62,000',
      type: 'Full-time',
      experience: '2-4 years',
      subjects: ['Science', 'STEM'],
      description: 'Join our innovative elementary team to inspire young minds in science...',
      requirements: ['Bachelor\'s degree in Science or Education', 'Elementary teaching credential'],
      postedDate: '1 week ago',
      status: 'Approved',
      applicants: 8
    },
    {
      id: 3,
      title: 'English Literature Teacher',
      school: 'Riverside Middle School',
      location: 'Berkeley, CA',
      salary: '$52,000 - $68,000',
      type: 'Full-time',
      experience: '1-3 years',
      subjects: ['English', 'Literature', 'Writing'],
      description: 'We need an enthusiastic English teacher to engage middle school students...',
      requirements: ['English or Literature degree', 'Middle school teaching experience preferred'],
      postedDate: '3 days ago',
      status: 'Approved',
      applicants: 15
    }
  ];

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Browse Approved Jobs</h1>
        <p className="text-muted-foreground">Discover teaching opportunities that match your expertise</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by job title, school, or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Job Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">{filteredJobs.length}</div>
            <p className="text-sm text-muted-foreground">Available Jobs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">24</div>
            <p className="text-sm text-muted-foreground">New This Week</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">156</div>
            <p className="text-sm text-muted-foreground">Schools Hiring</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">$58K</div>
            <p className="text-sm text-muted-foreground">Average Salary</p>
          </CardContent>
        </Card>
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-foreground">{job.title}</h3>
                    <Badge variant="secondary">{job.status}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Building className="w-4 h-4" />
                      <span>{job.school}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{job.postedDate}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-3">{job.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {job.subjects.map((subject, index) => (
                      <Badge key={index} variant="outline">{subject}</Badge>
                    ))}
                  </div>
                </div>
                <div className="text-right ml-6">
                  <div className="flex items-center gap-1 text-green-600 font-semibold mb-2">
                    <DollarSign className="w-4 h-4" />
                    <span>{job.salary}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{job.type}</p>
                  <p className="text-sm text-muted-foreground mb-4">{job.applicants} applicants</p>
                  <Button>Apply Now</Button>
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Requirements:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {job.requirements.map((req, index) => (
                        <li key={index}>• {req}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Experience Level:</h4>
                    <p className="text-sm text-muted-foreground">{job.experience}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EmployeeJobs;
