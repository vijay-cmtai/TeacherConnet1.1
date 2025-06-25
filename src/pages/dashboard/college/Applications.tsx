import { useState, useMemo } from 'react';
import { useGetCollegeApplicationsQuery, useUpdateApplicationStatusMutation } from '@/features/api/collegeApplicationsApiService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Eye, Download, CheckCircle, XCircle, User, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { ViewProfileModal } from './components/ViewProfileModal';

const CollegeApplications = () => {
    const { data: applications = [], isLoading, isError } = useGetCollegeApplicationsQuery();
    const [updateStatus, { isLoading: isUpdating }] = useUpdateApplicationStatusMutation();

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [viewingProfileApp, setViewingProfileApp] = useState<any | null>(null);

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'applied': return { label: 'New', color: 'bg-blue-100 text-blue-800' };
            case 'viewed': return { label: 'Under Review', color: 'bg-yellow-100 text-yellow-800' };
            case 'shortlisted': return { label: 'Shortlisted', color: 'bg-green-100 text-green-800' };
            case 'rejected': return { label: 'Rejected', color: 'bg-red-100 text-red-800' };
            default: return { label: status, color: 'bg-gray-100 text-gray-800' };
        }
    };

    const filteredApplications = useMemo(() => {
        return applications.filter(app => {
            const profile = app.user?.employerProfile;
            const job = app.job;
            if (!profile || !job) return false;
            
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch = profile.name.toLowerCase().includes(searchLower) || job.title.toLowerCase().includes(searchLower);
            
            let currentStatusFilter = statusFilter;
            if (statusFilter === 'new') currentStatusFilter = 'applied';
            if (statusFilter === 'underreview') currentStatusFilter = 'viewed';

            const matchesStatus = statusFilter === 'all' || app.status === currentStatusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [applications, searchTerm, statusFilter]);

    const stats = useMemo(() => ({
        total: applications.length,
        new: applications.filter(a => a.status === 'applied').length,
        underReview: applications.filter(a => a.status === 'viewed').length,
        shortlisted: applications.filter(a => a.status === 'shortlisted').length,
    }), [applications]);

    const handleStatusChange = async (appId: string, newStatus: string) => {
        try {
            await updateStatus({ appId, status: newStatus }).unwrap();
            toast.success(`Application status updated to ${newStatus}`);
        } catch (err) {
            toast.error('Failed to update status.');
        }
    };
    function maskEmail(email: string) {
        if (!email) return "N/A";
        const [user, domain] = email.split("@");
        if (!domain) return email;
        const maskedUser = user.length <= 2 ? user[0] + '***' : user.slice(0, 2) + '***';
        return `${maskedUser}@${domain}`;
    }

    if (isLoading) return <div className="space-y-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-48 w-full" /><Skeleton className="h-48 w-full" /></div>;
    if (isError) return <div className="text-center py-10 text-red-500 flex items-center justify-center gap-2"><AlertTriangle size={20}/>Failed to load applications.</div>;

  return (
    <>
        <div className="space-y-6">
          <div><h1 className="text-3xl font-bold text-foreground">Applications</h1><p className="text-muted-foreground">Review and manage job applications</p></div>
          <Card><CardContent className="p-6"><div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input placeholder="Search by applicant name or job title..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10"/></div>
                <div className="flex gap-2 flex-wrap"><Button variant={statusFilter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('all')}>All ({stats.total})</Button><Button variant={statusFilter === 'new' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('new')}>New ({stats.new})</Button><Button variant={statusFilter === 'underreview' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('viewed')}>Under Review ({stats.underReview})</Button><Button variant={statusFilter === 'shortlisted' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('shortlisted')}>Shortlisted ({stats.shortlisted})</Button></div>
          </div></CardContent></Card>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card><CardContent className="p-4"><div className="text-2xl font-bold text-foreground">{stats.total}</div><p className="text-sm text-muted-foreground">Total Applications</p></CardContent></Card>
            <Card><CardContent className="p-4"><div className="text-2xl font-bold text-blue-600">{stats.new}</div><p className="text-sm text-muted-foreground">New Applications</p></CardContent></Card>
            <Card><CardContent className="p-4"><div className="text-2xl font-bold text-green-600">{stats.shortlisted}</div><p className="text-sm text-muted-foreground">Shortlisted</p></CardContent></Card>
            <Card><CardContent className="p-4"><div className="text-2xl font-bold text-yellow-600">{stats.underReview}</div><p className="text-sm text-muted-foreground">Under Review</p></CardContent></Card>
          </div>
          <div className="space-y-4">
            {filteredApplications.length > 0 ? filteredApplications.map((app) => {
                const profile = app.user.employerProfile;
                const statusInfo = getStatusInfo(app.status);
                return(
                <Card key={app._id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6"><div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0"><User className="w-5 h-5 text-primary-foreground" /></div>
                                <div><h3 className="text-lg font-semibold text-foreground">{profile.name}</h3><p className="text-sm text-muted-foreground">{maskEmail(app.user.email)}</p></div>
                                <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                            </div>
                            <div className="mb-3"><h4 className="font-medium text-foreground">Applied for: {app.job.title}</h4><p className="text-sm text-muted-foreground">Applied on {new Date(app.appliedDate).toLocaleDateString()}</p></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div><p className="text-sm"><strong>Experience:</strong> {profile.workExperience?.[0]?.title || 'N/A'}</p><p className="text-sm"><strong>Education:</strong> {profile.education?.[0]?.degree || 'N/A'}</p></div>
                                <div><p className="text-sm"><strong>Skills:</strong></p><div className="flex flex-wrap gap-1 mt-1">{profile.skills.slice(0, 5).map((skill: any) => (<Badge key={skill._id} variant="outline" className="text-xs">{skill.name}</Badge>))}</div></div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 w-full md:w-auto md:ml-6">
                            <Button variant="outline" size="sm" onClick={() => setViewingProfileApp(app)}><Eye className="w-4 h-4 mr-2" />View Profile</Button>
                            <Button size="sm" onClick={() => handleStatusChange(app._id, 'shortlisted')} disabled={isUpdating || app.status === 'shortlisted'}><CheckCircle className="w-4 h-4 mr-2" />Shortlist</Button>
                            <Button variant="destructive" size="sm" onClick={() => handleStatusChange(app._id, 'rejected')} disabled={isUpdating || app.status === 'rejected'}><XCircle className="w-4 h-4 mr-2" />Reject</Button>
                        </div>
                    </div></CardContent>
                </Card>
            )}) : (
                <Card><CardContent className="p-10 text-center"><p className="text-muted-foreground">No applications match your current filters.</p></CardContent></Card>
            )}
          </div>
        </div>
        {viewingProfileApp && <ViewProfileModal application={viewingProfileApp} onClose={() => setViewingProfileApp(null)} />}
    </>
  );
};

export default CollegeApplications;