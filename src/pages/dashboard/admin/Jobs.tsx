import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Plus, Edit, Trash2, Check, X, Building, MapPin, Clock, Users, ChevronDown, Briefcase, DollarSign, BookOpen } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useGetAllJobsForAdminQuery, useManageJobStatusMutation, useDeleteJobByAdminMutation } from '@/features/admin/adminApiService';
import toast from 'react-hot-toast';
import CreateJobModal from './components/CreateJobModal';
import EditJobModal from './components/EditJobModal';

const AdminJobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

  const { data: jobs = [], isLoading, isError } = useGetAllJobsForAdminQuery();
  const [manageJobStatus, { isLoading: isManagingStatus }] = useManageJobStatusMutation();
  const [deleteJob, { isLoading: isDeleting }] = useDeleteJobByAdminMutation();

  const getStatusDetails = (status: string) => {
    switch (status) {
      case 'pending_approval': return { text: 'Pending Approval', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
      case 'active': return { text: 'Active', color: 'bg-green-100 text-green-800 border-green-200' };
      case 'rejected': return { text: 'Rejected', color: 'bg-red-100 text-red-800 border-red-200' };
      case 'closed': return { text: 'Closed', color: 'bg-gray-100 text-gray-800 border-gray-200' };
      default: return { text: status, color: 'bg-gray-100 text-gray-800 border-gray-200' };
    }
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const matchesSearch = job.title.toLowerCase().includes(lowerSearchTerm) || job.schoolName.toLowerCase().includes(lowerSearchTerm);
      const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [jobs, searchTerm, statusFilter]);
  
  const handleStatusChange = async (jobId: string, status: 'active' | 'rejected') => {
    try {
      await manageJobStatus({ jobId, status }).unwrap();
      toast.success(`Job has been ${status === 'active' ? 'approved' : 'rejected'}.`);
    } catch (err) {
      toast.error('Failed to update job status.');
    }
  };

  const handleDelete = async (jobId: string) => {
      try {
        await deleteJob(jobId).unwrap();
        toast.success('Job deleted successfully.');
      } catch (err) {
        toast.error('Failed to delete job.');
      }
  };
  
  const toggleExpand = (jobId: string) => {
    setExpandedJobId(prevId => (prevId === jobId ? null : jobId));
  };

  const statusCounts = useMemo(() => ({
    all: jobs.length,
    pending_approval: jobs.filter(j => j.status === 'pending_approval').length,
    active: jobs.filter(j => j.status === 'active').length,
    rejected: jobs.filter(j => j.status === 'rejected').length,
    totalApplicants: jobs.reduce((sum, job) => sum + (job.applicantCount || 0), 0)
  }), [jobs]);
  
  const renderSkeleton = () => (
      <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
              <Card key={i}><CardContent className="p-6"><Skeleton className="h-24 w-full" /></CardContent></Card>
          ))}
      </div>
  );

  if (isLoading) return renderSkeleton();
  if (isError) return <div className="text-center py-10 text-red-500">Error loading jobs. Please try again later.</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Job Management</h1>
          <p className="text-muted-foreground">Approve, reject, create, or delete job postings</p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}><Plus className="w-4 h-4 mr-2" />Create New Job</Button>
      </div>

      <Card><CardContent className="p-4 md:p-6"><div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input placeholder="Search jobs by title or school..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" /></div>
        <div className="flex gap-2 flex-wrap"><Button variant={statusFilter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('all')}>All ({statusCounts.all})</Button><Button variant={statusFilter === 'pending_approval' ? 'secondary' : 'outline'} size="sm" onClick={() => setStatusFilter('pending_approval')}>Pending ({statusCounts.pending_approval})</Button><Button variant={statusFilter === 'active' ? 'secondary' : 'outline'} size="sm" onClick={() => setStatusFilter('active')}>Active ({statusCounts.active})</Button><Button variant={statusFilter === 'rejected' ? 'secondary' : 'outline'} size="sm" onClick={() => setStatusFilter('rejected')}>Rejected ({statusCounts.rejected})</Button></div>
      </div></CardContent></Card>

      <div className="space-y-4">
        {filteredJobs.map((job) => {
          const status = getStatusDetails(job.status);
          const isExpanded = expandedJobId === job._id;
          return (
            <Card key={job._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <div className="flex items-center gap-3 flex-wrap"><h3 className="text-xl font-semibold text-foreground">{job.title}</h3><Badge className={`${status.color} border`}>{status.text}</Badge></div>
                            <div className="flex items-center text-sm text-muted-foreground mt-1"><Building className="w-4 h-4 mr-1.5" /><span>{job.schoolName}</span><span className="mx-2">·</span><MapPin className="w-4 h-4 mr-1.5" /><span>{job.location}</span></div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                            {job.status === 'pending_approval' && (<><Button size="sm" onClick={() => handleStatusChange(job._id, 'active')} disabled={isManagingStatus}><Check className="w-4 h-4 mr-2" />Approve</Button><Button variant="destructive" size="sm" onClick={() => handleStatusChange(job._id, 'rejected')} disabled={isManagingStatus}><X className="w-4 h-4 mr-2" />Reject</Button></>)}
                            <Button variant="outline" size="sm" onClick={() => setEditingJobId(job._id)}><Edit className="w-4 h-4 mr-2" />Edit</Button>
                            <AlertDialog><AlertDialogTrigger asChild><Button variant="outline" size="sm"><Trash2 className="w-4 h-4 mr-2" />Delete</Button></AlertDialogTrigger><AlertDialogContent>
                                <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. This will permanently delete the job and all associated applications.</AlertDialogDescription></AlertDialogHeader>
                                <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(job._id)} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter>
                            </AlertDialogContent></AlertDialog>
                        </div>
                    </div>
                    <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground border-t border-border pt-3 mt-3">
                        <div className="flex items-center gap-1.5" title="Applicants"><Users className="w-4 h-4" /><span>{job.applicantCount} Applicants</span></div>
                        <div className="flex items-center gap-1.5" title="Job Type"><Briefcase className="w-4 h-4" /><span>{job.type || 'N/A'}</span></div>
                        <div className="flex items-center gap-1.5" title="Salary"><DollarSign className="w-4 h-4" /><span>{job.salary || 'Not Disclosed'}</span></div>
                        <div className="flex items-center gap-1.5" title="Date Posted"><Clock className="w-4 h-4" /><span>{new Date(job.createdAt).toLocaleDateString()}</span></div>
                    </div>
                    
                    {isExpanded && (
                        <div className="mt-4 pt-4 border-t space-y-3 animate-in fade-in-50">
                            <div><h4 className="font-semibold text-sm flex items-center gap-2 mb-1"><BookOpen size={14}/>Description</h4><p className="text-sm text-muted-foreground">{job.description || 'No description provided.'}</p></div>
                            <div><h4 className="font-semibold text-sm flex items-center gap-2 mb-1"><Check size={14}/>Requirements</h4><p className="text-sm text-muted-foreground whitespace-pre-wrap">{job.requirements || 'No requirements listed.'}</p></div>
                            <div><h4 className="font-semibold text-sm flex items-center gap-2 mb-1"><Users size={14}/>Responsibilities</h4><p className="text-sm text-muted-foreground whitespace-pre-wrap">{job.responsibilities || 'No responsibilities listed.'}</p></div>
                        </div>
                    )}
                  </div>
                  <Button variant="ghost" size="icon" className="w-full md:w-auto mt-4 md:mt-0" onClick={() => toggleExpand(job._id)}><ChevronDown className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} /></Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
        {filteredJobs.length === 0 && (<div className="text-center py-10"><p className="text-muted-foreground">No jobs found that match your criteria.</p></div>)}
      </div>
      {isCreateModalOpen && <CreateJobModal onClose={() => setCreateModalOpen(false)} />}
      {editingJobId && <EditJobModal jobId={editingJobId} onClose={() => setEditingJobId(null)} />}
    </div>
  );
};

export default AdminJobs;