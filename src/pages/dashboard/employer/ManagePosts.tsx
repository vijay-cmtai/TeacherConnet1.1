import React, { useState } from 'react';
import { useGetMyJobsQuery, useDeleteEmployerJobMutation } from '@/features/api/employerJobApiService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Loader2, AlertTriangle, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import { JobPostModal } from './components/JobPostModal';

// This interface correctly matches your postJob.model.js schema
interface Job {
  _id: string;
  title: string;
  schoolName: string;
  location: string;
  jobType: string;
  category: string;
  description: string;
  experienceLevel: string;
  yearsOfExperience: number;
  requiredSkills: string[];
  status: 'pending' | 'approved' | 'rejected';
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'pending': return <Badge variant="secondary">Pending Review</Badge>;
        case 'approved': return <Badge variant="default" className="bg-green-600">Approved</Badge>;
        case 'rejected': return <Badge variant="destructive">Rejected</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
};

const ManagePosts = () => {
    const { data: jobs = [], isLoading, isError } = useGetMyJobsQuery();
    const [deleteJob, { isLoading: isDeleting }] = useDeleteEmployerJobMutation();

    const [isModalOpen, setModalOpen] = useState(false);
    const [jobToEdit, setJobToEdit] = useState<Job | null>(null);

    const handleOpenModal = (job: Job | null = null) => {
        setJobToEdit(job);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setJobToEdit(null);
    };

    const handleDelete = async (jobId: string) => {
        try {
            await deleteJob(jobId).unwrap();
            toast.success("Job post deleted successfully.");
        } catch {
            toast.error("Failed to delete job post.");
        }
    };

    const renderContent = () => {
        if (isLoading) {
            return <div className="flex justify-center items-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
        }

        if (isError) {
            return (
                <Card className="flex flex-col items-center justify-center p-12 text-center bg-red-50 border-red-200">
                    <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
                    <h3 className="text-lg font-medium text-destructive mb-1">Error Loading Jobs</h3>
                    <p className="text-red-600 text-sm">There was a problem fetching your job posts. Please try again later.</p>
                </Card>
            );
        }

        if (jobs.length === 0) {
            return (
                <Card className="flex flex-col items-center justify-center p-12 text-center bg-muted/30 border-dashed">
                    <Briefcase className="w-16 h-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-1">No Job Posts Found</h3>
                    <p className="text-muted-foreground text-sm max-w-xs mb-6">You haven't posted any jobs yet. Get started by posting your first one.</p>
                    <Button onClick={() => handleOpenModal(null)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Post Your First Job
                    </Button>
                </Card>
            );
        }

        return (
            <div className="space-y-6">
                {jobs.map((job) => (
                    <Card key={job._id}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>{job.title}</CardTitle>
                                    <CardDescription>{job.schoolName} • {job.location}</CardDescription>
                                </div>
                                {getStatusBadge(job.status)}
                            </div>
                        </CardHeader>
                        <CardFooter className="flex justify-end gap-2 bg-muted/50 p-4">
                            <Button variant="outline" size="sm" onClick={() => handleOpenModal(job)}>
                                <Edit className="w-4 h-4 mr-2" /> Edit
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm" disabled={isDeleting}>
                                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>This action cannot be undone. This will permanently delete this job post.</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(job._id)} className="bg-destructive hover:bg-destructive/90">Confirm Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        );
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Manage Job Posts</h1>
                        <p className="text-muted-foreground mt-1">Create, update, and manage all your job postings.</p>
                    </div>
                    {jobs.length > 0 && (
                         <Button onClick={() => handleOpenModal(null)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Post New Job
                        </Button>
                    )}
                </div>
                {renderContent()}
            </div>
            <JobPostModal isOpen={isModalOpen} onClose={handleCloseModal} jobToEdit={jobToEdit} />
        </>
    );
};

export default ManagePosts;