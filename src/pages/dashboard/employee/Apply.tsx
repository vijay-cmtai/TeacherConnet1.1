
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Clock, Building, Send, Upload } from 'lucide-react';

const EmployeeApply = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<number | null>(null);
  const [coverLetter, setCoverLetter] = useState('');

  const availableJobs = [
    {
      id: 1,
      title: 'High School Mathematics Teacher',
      school: 'Lincoln High School',
      location: 'San Francisco, CA',
      salary: '$55,000 - $75,000',
      type: 'Full-time',
      description: 'We are seeking a passionate mathematics teacher...',
      requirements: ['Bachelor\'s degree in Mathematics', 'Teaching certification'],
      postedDate: '2 days ago'
    },
    {
      id: 2,
      title: 'Elementary Science Teacher',
      school: 'Sunshine Elementary',
      location: 'Oakland, CA',
      salary: '$48,000 - $62,000',
      type: 'Full-time',
      description: 'Join our innovative elementary team...',
      requirements: ['Science degree', 'Elementary teaching credential'],
      postedDate: '1 week ago'
    }
  ];

  const handleApply = (jobId: number) => {
    console.log('Applying for job:', jobId, 'with cover letter:', coverLetter);
    // Reset form after successful application
    setCoverLetter('');
    setSelectedJob(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Apply for Jobs</h1>
        <p className="text-muted-foreground">Submit applications for teaching positions</p>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for jobs to apply..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Available Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Available Positions</h2>
          {availableJobs.map((job) => (
            <Card key={job.id} className={`cursor-pointer transition-all ${selectedJob === job.id ? 'ring-2 ring-primary' : ''}`}>
              <CardContent className="p-6" onClick={() => setSelectedJob(job.id)}>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{job.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Building className="w-4 h-4" />
                        <span>{job.school}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{job.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{job.type}</Badge>
                    <span className="text-sm font-semibold text-green-600">{job.salary}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>Posted {job.postedDate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Application Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Submit Application</CardTitle>
              <CardDescription>
                {selectedJob ? 'Complete your application below' : 'Select a job to apply'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedJob ? (
                <>
                  <div>
                    <Label htmlFor="resume">Resume/CV</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                      <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Upload your latest resume</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Choose File
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
                    <Textarea
                      id="coverLetter"
                      placeholder="Write a brief cover letter explaining why you're interested in this position..."
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      rows={6}
                    />
                  </div>
                  
                  <Button 
                    onClick={() => handleApply(selectedJob)}
                    className="w-full"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Submit Application
                  </Button>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Please select a job position to apply</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployeeApply;
