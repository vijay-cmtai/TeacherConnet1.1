import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateJobMutation, useUpdateJobMutation, useGetJobByIdQuery } from '@/features/api/collegeJobApiService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, X, Save, Send, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const CollegePostJob = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const isEditMode = Boolean(jobId);
  const navigate = useNavigate();

  const { data: existingJobData, isLoading: isLoadingExisting } = useGetJobByIdQuery(jobId!, { skip: !isEditMode });
  const [createJob, { isLoading: isCreating }] = useCreateJobMutation();
  const [updateJob, { isLoading: isUpdating }] = useUpdateJobMutation();
  const isLoading = isCreating || isUpdating;

  const [jobData, setJobData] = useState({ title: '', department: '', location: '', type: '', experienceLevel: '', salaryMin: '', salaryMax: '', description: '', requirements: '', responsibilities: '', benefits: '', applicationDeadline: '' });
  const [subjects, setSubjects] = useState<string[]>([]);
  const [newSubject, setNewSubject] = useState('');

  useEffect(() => {
    if (isEditMode && existingJobData) {
        const [salaryMin, salaryMax] = (existingJobData.salary || '').replace(/\$/g, '').split(' - ');
        setJobData({
            ...existingJobData,
            applicationDeadline: existingJobData.applicationDeadline ? new Date(existingJobData.applicationDeadline).toISOString().split('T')[0] : '',
            salaryMin: salaryMin || '',
            salaryMax: salaryMax || '',
        });
        setSubjects(existingJobData.subjects || []);
    }
  }, [existingJobData, isEditMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setJobData({ ...jobData, [e.target.id]: e.target.value });
  const handleSelectChange = (id: string, value: string) => setJobData({ ...jobData, [id]: value });
  const handleAddSubject = () => { if (newSubject.trim() && !subjects.includes(newSubject.trim())) { setSubjects([...subjects, newSubject.trim()]); setNewSubject(''); } };
  const handleRemoveSubject = (subject: string) => setSubjects(subjects.filter(s => s !== subject));

  const handleSubmit = async (status: 'pending_approval' | 'draft' | 'active') => {
    const finalJobData = { ...jobData, subjects, salary: jobData.salaryMin && jobData.salaryMax ? `$${jobData.salaryMin} - $${jobData.salaryMax}` : 'Not Disclosed', status };
    delete (finalJobData as any).salaryMin;
    delete (finalJobData as any).salaryMax;

    try {
        if (isEditMode) {
            await updateJob({ jobId: jobId!, data: finalJobData }).unwrap();
            toast.success('Job successfully updated!');
        } else {
            await createJob(finalJobData).unwrap();
            toast.success(`Job successfully ${status === 'draft' ? 'saved as draft' : 'submitted for approval'}!`);
        }
        navigate('/dashboard/college/posts');
    } catch (err) { toast.error('Failed to save job. Please check the details and try again.'); }
  };

  if (isLoadingExisting) return <div className="space-y-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-48 w-full" /><Skeleton className="h-48 w-full" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4"><Button variant="outline" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4" /></Button><div><h1 className="text-3xl font-bold text-foreground">{isEditMode ? 'Edit Job Post' : 'Post New Job'}</h1><p className="text-muted-foreground">{isEditMode ? 'Update the details for this teaching position' : 'Create a new teaching position listing'}</p></div></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader><CardTitle>Job Details</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><Label htmlFor="title">Job Title</Label><Input id="title" placeholder="e.g., High School Mathematics Teacher" value={jobData.title} onChange={handleInputChange}/></div>
                        <div><Label htmlFor="department">Department</Label><Input id="department" placeholder="e.g., Mathematics Department" value={jobData.department} onChange={handleInputChange}/></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><Label htmlFor="location">Location</Label><Input id="location" placeholder="e.g., San Francisco, CA" value={jobData.location} onChange={handleInputChange}/></div>
                        <div><Label htmlFor="type">Job Type</Label><Select value={jobData.type} onValueChange={(value) => handleSelectChange('type', value)}><SelectTrigger><SelectValue placeholder="Select job type" /></SelectTrigger><SelectContent><SelectItem value="Full-time">Full-time</SelectItem><SelectItem value="Part-time">Part-time</SelectItem><SelectItem value="Contract">Contract</SelectItem><SelectItem value="Substitute">Substitute</SelectItem></SelectContent></Select></div>
                    </div>
                    <div><Label>Teaching Subjects</Label><div className="flex gap-2 mb-2"><Input placeholder="Add a subject and press Enter" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSubject(); } }} /><Button onClick={handleAddSubject} size="icon" type="button"><Plus className="w-4 h-4" /></Button></div><div className="flex flex-wrap gap-2">{subjects.map((subject) => (<Badge key={subject} variant="secondary" className="flex items-center gap-1">{subject}<X className="w-3 h-3 cursor-pointer" onClick={() => handleRemoveSubject(subject)}/></Badge>))}</div></div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>Compensation & Requirements</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div><Label htmlFor="salaryMin">Minimum Salary ($)</Label><Input id="salaryMin" type="number" placeholder="50000" value={jobData.salaryMin} onChange={handleInputChange}/></div>
                        <div><Label htmlFor="salaryMax">Maximum Salary ($)</Label><Input id="salaryMax" type="number" placeholder="70000" value={jobData.salaryMax} onChange={handleInputChange}/></div>
                        <div><Label htmlFor="experienceLevel">Experience Level</Label><Select value={jobData.experienceLevel} onValueChange={(value) => handleSelectChange('experienceLevel', value)}><SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger><SelectContent><SelectItem value="Entry Level (0-2 years)">Entry Level (0-2 years)</SelectItem><SelectItem value="Mid Level (3-5 years)">Mid Level (3-5 years)</SelectItem><SelectItem value="Senior Level (5+ years)">Senior Level (5+ years)</SelectItem></SelectContent></Select></div>
                    </div>
                    <div><Label htmlFor="applicationDeadline">Application Deadline</Label><Input id="applicationDeadline" type="date" value={jobData.applicationDeadline} onChange={handleInputChange}/></div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>Job Description</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div><Label htmlFor="description">Job Overview</Label><Textarea id="description" placeholder="Provide a comprehensive overview..." value={jobData.description} onChange={handleInputChange} rows={4}/></div>
                    <div><Label htmlFor="responsibilities">Key Responsibilities</Label><Textarea id="responsibilities" placeholder="List the main responsibilities..." value={jobData.responsibilities} onChange={handleInputChange} rows={4}/></div>
                    <div><Label htmlFor="requirements">Requirements & Qualifications</Label><Textarea id="requirements" placeholder="List required qualifications..." value={jobData.requirements} onChange={handleInputChange} rows={4}/></div>
                    <div><Label htmlFor="benefits">Benefits & Perks</Label><Textarea id="benefits" placeholder="Describe benefits..." value={jobData.benefits} onChange={handleInputChange} rows={3}/></div>
                </CardContent>
            </Card>
        </div>
        <div className="space-y-6">
          <Card><CardHeader><CardTitle>Actions</CardTitle></CardHeader><CardContent className="space-y-3">
            {isEditMode ? (<Button onClick={() => handleSubmit('active')} className="w-full" disabled={isLoading}><Save className="w-4 h-4 mr-2" />{isLoading ? 'Saving...' : 'Save Changes'}</Button>) : (<>
                <Button onClick={() => handleSubmit('draft')} variant="outline" className="w-full" disabled={isLoading}><Save className="w-4 h-4 mr-2" />{isLoading ? 'Saving...' : 'Save as Draft'}</Button>
                <Button onClick={() => handleSubmit('pending_approval')} className="w-full" disabled={isLoading}><Send className="w-4 h-4 mr-2" />{isLoading ? 'Publishing...' : 'Publish for Approval'}</Button>
            </>)}
          </CardContent></Card>
        </div>
      </div>
    </div>
  );
};

export default CollegePostJob;