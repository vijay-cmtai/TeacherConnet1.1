import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetMyPostedJobsQuery, useDeleteJobMutation } from '@/features/api/collegeJobApiService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Edit, Trash2, Eye, Users, Calendar, DollarSign, Plus, Building, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

const CollegePosts = () => {
    const navigate = useNavigate();
    const { data: jobPosts = [], isLoading, isError } = useGetMyPostedJobsQuery();
    const [deleteJob, { isLoading: isDeleting }] = useDeleteJobMutation();

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
    const [viewingPost, setViewingPost] = useState<any | null>(null);

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'active': return { label: 'Active', color: 'bg-green-100 text-green-800' };
            case 'pending_approval': return { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' };
            case 'rejected': return { label: 'Rejected', color: 'bg-orange-100 text-orange-800' };
            case 'closed': return { label: 'Closed', color: 'bg-red-100 text-red-800' };
            case 'draft': return { label: 'Draft', color: 'bg-gray-100 text-gray-800' };
            default: return { label: status, color: 'bg-gray-100 text-gray-800' };
        }
    };
    
    const filteredPosts = useMemo(() => {
        return jobPosts.filter(post => {
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch = post.title.toLowerCase().includes(searchLower) || (post.department && post.department.toLowerCase().includes(searchLower));
            const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [jobPosts, searchTerm, statusFilter]);

    const stats = useMemo(() => {
        return {
            total: jobPosts.length,
            active: jobPosts.filter(p => p.status === 'active').length,
            pending: jobPosts.filter(p => p.status === 'pending_approval').length,
            closed: jobPosts.filter(p => p.status === 'closed' || p.status === 'rejected').length,
            totalApplicants: jobPosts.reduce((sum, post) => sum + (post.applicants || 0), 0),
            totalViews: jobPosts.reduce((sum, post) => sum + (post.views || 0), 0),
        };
    }, [jobPosts]);

    const handleDeleteClick = (jobId: string) => setShowDeleteConfirm(jobId);
    const handleEditClick = (jobId: string) => navigate(`/dashboard/college/post-job/edit/${jobId}`);
    const handleViewClick = (post: any) => setViewingPost(post);

    const confirmDelete = async () => {
        if (!showDeleteConfirm) return;
        try {
            await deleteJob(showDeleteConfirm).unwrap();
            toast.success('Job post deleted successfully!');
            setShowDeleteConfirm(null);
        } catch (err) { toast.error('Failed to delete job post.'); }
    };

    if (isLoading) return <div className="space-y-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-48 w-full" /><Skeleton className="h-48 w-full" /></div>;
    if (isError) return <div className="text-center py-10 text-red-500">Failed to load job posts. Please try again later.</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center"><h1 className="text-3xl font-bold text-foreground">Manage Job Posts</h1><Button onClick={() => navigate('/dashboard/college/post-job')}><Plus className="w-4 h-4 mr-2" />New Job Post</Button></div>
            <Card><CardContent className="p-4 md:p-6"><div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input placeholder="Search by title or department..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" /></div>
                <div className="flex gap-2 flex-wrap"><Button variant={statusFilter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('all')}>All ({stats.total})</Button><Button variant={statusFilter === 'active' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('active')}>Active ({stats.active})</Button><Button variant={statusFilter === 'pending_approval' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('pending_approval')}>Pending ({stats.pending})</Button><Button variant={statusFilter === 'closed' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('closed')}>Closed ({stats.closed})</Button></div>
            </div></CardContent></Card>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card><CardHeader className="p-4"><CardTitle>{stats.total}</CardTitle><CardDescription>Total Posts</CardDescription></CardHeader></Card>
                <Card><CardHeader className="p-4"><CardTitle className="text-green-600">{stats.active}</CardTitle><CardDescription>Active Posts</CardDescription></CardHeader></Card>
                <Card><CardHeader className="p-4"><CardTitle className="text-blue-600">{stats.totalApplicants}</CardTitle><CardDescription>Total Applicants</CardDescription></CardHeader></Card>
                <Card><CardHeader className="p-4"><CardTitle className="text-purple-600">{stats.totalViews}</CardTitle><CardDescription>Total Views</CardDescription></CardHeader></Card>
            </div>
            <div className="space-y-4">
                {filteredPosts.length > 0 ? filteredPosts.map((post) => {
                    const status = getStatusInfo(post.status);
                    return (
                        <Card key={post._id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4 md:p-6"><div className="flex flex-col md:flex-row justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2 flex-wrap"><h3 className="text-lg md:text-xl font-semibold text-foreground">{post.title}</h3><Badge className={status.color}>{status.label}</Badge></div>
                                    <div className="grid grid-cols-2 xl:grid-cols-4 gap-x-4 gap-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground"><Users className="w-4 h-4 flex-shrink-0" /><span>{post.applicants} applicants</span></div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground"><Eye className="w-4 h-4 flex-shrink-0" /><span>{post.views || 0} views</span></div>
                                        {post.applicationDeadline && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Calendar className="w-4 h-4 flex-shrink-0" /><span>Deadline: {new Date(post.applicationDeadline).toLocaleDateString()}</span></div>}
                                        {post.salary && <div className="flex items-center gap-2 text-sm text-muted-foreground"><DollarSign className="w-4 h-4 flex-shrink-0" /><span>{post.salary}</span></div>}
                                    </div>
                                    <div className="flex gap-x-4 gap-y-1 text-sm text-muted-foreground flex-wrap"><span><strong>Department:</strong> {post.department}</span><span><strong>Location:</strong> {post.location}</span><span><strong>Posted:</strong> {new Date(post.createdAt).toLocaleDateString()}</span></div>
                                </div>
                                <div className="flex flex-row md:flex-col gap-2 mt-4 md:mt-0 md:ml-6 flex-wrap">
                                    <Button variant="outline" size="sm" onClick={() => handleViewClick(post)}><Eye className="w-4 h-4 md:mr-2" /><span className="hidden md:inline">View</span></Button>
                                    <Button variant="outline" size="sm" onClick={() => handleEditClick(post._id)}><Edit className="w-4 h-4 md:mr-2" /><span className="hidden md:inline">Edit</span></Button>
                                    <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(post._id)} disabled={isDeleting}><Trash2 className="w-4 h-4 md:mr-2" /><span className="hidden md:inline">Delete</span></Button>
                                </div>
                            </div></CardContent>
                        </Card>
                    );
                }) : (<Card><CardContent className="p-10 text-center"><p className="text-muted-foreground">No job posts match your current filters.</p></CardContent></Card>)}
            </div>
            <Dialog open={showDeleteConfirm !== null} onOpenChange={() => setShowDeleteConfirm(null)}>
                <DialogContent><DialogHeader><DialogTitle>Are you absolutely sure?</DialogTitle><DialogDescription>This will permanently delete the job post and all associated applications.</DialogDescription></DialogHeader><DialogFooter><Button variant="outline" onClick={() => setShowDeleteConfirm(null)}>Cancel</Button><Button variant="destructive" onClick={confirmDelete} disabled={isDeleting}>{isDeleting ? "Deleting..." : "Delete"}</Button></DialogFooter></DialogContent>
            </Dialog>
            <Dialog open={viewingPost !== null} onOpenChange={() => setViewingPost(null)}>
                <DialogContent className="max-w-3xl"><DialogHeader><DialogTitle>{viewingPost?.title}</DialogTitle><DialogDescription>Posted on {viewingPost && new Date(viewingPost.createdAt).toLocaleDateString()}</DialogDescription></DialogHeader>
                {viewingPost && <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
                    <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">Job Overview</h4><p className="text-sm text-muted-foreground">{viewingPost.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg"><h4 className="font-semibold mb-2 flex items-center gap-2"><Building size={16}/>Details</h4><div className="text-sm space-y-1 text-muted-foreground"><div><strong>Department:</strong> {viewingPost.department}</div><div><strong>Location:</strong> {viewingPost.location}</div><div><strong>Job Type:</strong> {viewingPost.type}</div><div><strong>Experience:</strong> {viewingPost.experienceLevel}</div></div></div>
                        <div className="p-4 border rounded-lg"><h4 className="font-semibold mb-2 flex items-center gap-2"><DollarSign size={16}/>Compensation</h4><div className="text-sm space-y-1 text-muted-foreground"><div><strong>Salary:</strong> {viewingPost.salary}</div>{viewingPost.benefits && <><strong>Benefits:</strong><p>{viewingPost.benefits}</p></>}</div></div>
                    </div>
                    <div className="p-4 border rounded-lg"><h4 className="font-semibold mb-2 flex items-center gap-2"><Briefcase size={16}/>Responsibilities</h4><p className="text-sm text-muted-foreground whitespace-pre-wrap">{viewingPost.responsibilities}</p></div>
                    <div className="p-4 border rounded-lg"><h4 className="font-semibold mb-2 flex items-center gap-2"><Users size={16}/>Requirements</h4><p className="text-sm text-muted-foreground whitespace-pre-wrap">{viewingPost.requirements}</p></div>
                </div>}</DialogContent>
            </Dialog>
        </div>
    );
};

export default CollegePosts;