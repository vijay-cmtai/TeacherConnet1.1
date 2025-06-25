import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetShortlistedApplicationsQuery, useScheduleInterviewMutation, useUpdateApplicationStatusMutation } from '@/features/api/collegeApplicationsApiService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Search, Calendar, FileText, CheckCircle, User, Mail, Phone, Link as LinkIcon, AlertTriangle, XCircle, Briefcase, GraduationCap, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const ScheduleInterviewModal = ({ application, onClose, onSchedule }: { application: any; onClose: () => void; onSchedule: (details: any) => Promise<void> }) => {
    const [details, setDetails] = useState({ scheduledOn: '', interviewType: '', meetingLink: '', notes: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!details.scheduledOn || !details.interviewType) { toast.error('Please provide an interview date and type.'); return; }
        if (details.interviewType === 'Online' && !details.meetingLink) { toast.error('Please provide a meeting link for online interviews.'); return; }
        setIsLoading(true);
        await onSchedule(details);
        setIsLoading(false);
        onClose();
    };

    return (
        <Dialog open={true} onOpenChange={onClose}><DialogContent>
            <DialogHeader><DialogTitle>Schedule Interview</DialogTitle><DialogDescription>Propose interview details for {application.user.employerProfile.name}. This will be sent to an admin for confirmation.</DialogDescription></DialogHeader>
            <div className="space-y-4 py-4">
                <div><Label htmlFor="scheduledOn">Interview Date & Time</Label><Input id="scheduledOn" type="datetime-local" value={details.scheduledOn} onChange={e => setDetails({ ...details, scheduledOn: e.target.value })} /></div>
                <div><Label htmlFor="interviewType">Interview Type</Label><Select value={details.interviewType} onValueChange={value => setDetails({ ...details, interviewType: value })}><SelectTrigger><SelectValue placeholder="Select a type..." /></SelectTrigger><SelectContent><SelectItem value="Online">Online</SelectItem><SelectItem value="In-Person">In-Person</SelectItem><SelectItem value="Telephonic">Telephonic</SelectItem></SelectContent></Select></div>
                {details.interviewType === 'Online' && <div><Label htmlFor="meetingLink">Meeting Link (Zoom, Google Meet, etc.)</Label><Input id="meetingLink" type="url" placeholder="https://meet.google.com/abc-xyz" value={details.meetingLink} onChange={e => setDetails({ ...details, meetingLink: e.target.value })} /></div>}
                <div><Label htmlFor="notes">Notes for Admin/Candidate</Label><Textarea id="notes" placeholder="e.g., Please prepare a 10-minute demo lesson..." value={details.notes} onChange={e => setDetails({ ...details, notes: e.target.value })} /></div>
            </div>
            <DialogFooter><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={handleSubmit} disabled={isLoading}>{isLoading ? 'Scheduling...' : 'Schedule'}</Button></DialogFooter>
        </DialogContent></Dialog>
    );
};

const ViewProfileModal = ({ application, onClose }: { application: any, onClose: () => void }) => {
    function maskEmail(email: string) {
        const [user, domain] = email.split("@");
        const maskedUser =
            user.length <= 2 ? user[0] + "*" : user.slice(0, 2) + "*".repeat(user.length - 2);
        return `${maskedUser}@${domain}`;
    }

    function maskPhone(phone: string) {
        return phone.length >= 10
            ? phone.slice(0, 2) + "*".repeat(phone.length - 5) + phone.slice(-3)
            : "N/A";
    }

    if (!application) return null;
    const profile = application.user.employerProfile;
    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
                <DialogHeader><DialogTitle className="text-2xl">{profile.name}</DialogTitle><DialogDescription>{profile.headline}</DialogDescription></DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4 overflow-hidden flex-grow">
                    <div className="md:col-span-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar border-r"><div className="flex flex-col items-center"><div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4"><User className="w-12 h-12 text-muted-foreground" /></div></div><Separator /><h4 className="font-semibold">Contact Information</h4><div className="space-y-2 text-sm"><div className="flex items-center gap-2"><Mail size={14} className="text-muted-foreground" /><span>{maskEmail(application.user.email)}</span></div><div className="flex items-center gap-2"><Phone size={14} className="text-muted-foreground" /><span>{profile.phone ? maskPhone(profile.phone) : "N/A"}</span></div></div><Separator /><h4 className="font-semibold">Skills</h4><div className="flex flex-wrap gap-2">{profile.skills?.length > 0 ? profile.skills.map((skill: any) => (<Badge key={skill._id} variant="secondary">{skill.name}</Badge>)) : <p className="text-sm text-muted-foreground">No skills listed.</p>}</div></div>
                    <div className="md:col-span-2 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                        <div><h4 className="font-semibold text-lg mb-3 flex items-center gap-2"><Briefcase size={18} />Work Experience</h4><div className="space-y-4">{profile.workExperience?.length > 0 ? profile.workExperience.map((exp: any, index: number) => (<div key={index} className="pl-4 border-l-2 border-border"><p className="font-semibold">{exp.title}</p><p className="text-sm">{exp.company}</p><p className="text-xs text-muted-foreground">{exp.duration}</p></div>)) : <p className="text-sm text-muted-foreground">No work experience provided.</p>}</div></div><Separator />
                        <div><h4 className="font-semibold text-lg mb-3 flex items-center gap-2"><GraduationCap size={18} />Education</h4><div className="space-y-4">{profile.education?.length > 0 ? profile.education.map((edu: any, index: number) => (<div key={index} className="pl-4 border-l-2 border-border"><p className="font-semibold">{edu.degree}</p><p className="text-sm">{edu.school}</p><p className="text-xs text-muted-foreground">{edu.year}</p></div>)) : <p className="text-sm text-muted-foreground">No education details provided.</p>}</div></div><Separator />
                        <div><h4 className="font-semibold text-lg mb-3 flex items-center gap-2"><FileText size={18} />Documents</h4><div className="space-y-2">{profile.documents?.length > 0 ? profile.documents.map((doc: any, index: number) => (<a key={index} href={doc.url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-2 bg-muted/50 rounded-md hover:bg-muted"><span className="text-sm font-medium truncate">{doc.name}</span><Download size={16} /></a>)) : <p className="text-sm text-muted-foreground">No documents uploaded.</p>}</div></div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

const InterviewOutcomeButtons = ({ app, onReject, onExtendOffer }: { app: any; onReject: (appId: string) => void; onExtendOffer: (appId: string) => void; }) => {
    const [isDecisionTime, setIsDecisionTime] = useState(false);
    useEffect(() => {
        if (!app.interviewDetails?.scheduledOn) return;
        const checkTime = () => {
            const decisionTime = new Date(new Date(app.interviewDetails.scheduledOn).getTime() + 30 * 60000);
            if (new Date() >= decisionTime) { setIsDecisionTime(true); }
        };
        checkTime();
        const interval = setInterval(checkTime, 60000);
        return () => clearInterval(interval);
    }, [app.interviewDetails?.scheduledOn]);

    if (!isDecisionTime) {
        return <p className="text-xs text-center text-muted-foreground p-2 bg-muted rounded-md">Decision options will appear 30 mins after interview start.</p>;
    }

    return (
        <div className="flex flex-col gap-2">
            <Button size="sm" onClick={() => onExtendOffer(app._id)}><CheckCircle className="w-4 h-4 mr-2" />Extend Offer</Button>
            <AlertDialog><AlertDialogTrigger asChild><Button variant="destructive" size="sm"><XCircle className="w-4 h-4 mr-2" />Reject</Button></AlertDialogTrigger>
                <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently mark the candidate as not selected for this role.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => onReject(app._id)}>Confirm Rejection</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

const CollegeShortlist = () => {
    const navigate = useNavigate();
    const { data: candidates = [], isLoading, isError } = useGetShortlistedApplicationsQuery();
    const [updateStatus] = useUpdateApplicationStatusMutation();
    const [scheduleInterview] = useScheduleInterviewMutation();
    const [searchTerm, setSearchTerm] = useState('');
    const [schedulingApp, setSchedulingApp] = useState<any | null>(null);
    const [viewingProfileApp, setViewingProfileApp] = useState<any | null>(null);

    const getInterviewStatus = (app: any) => {
        if (app.status === 'hired') return { label: 'Hired', color: 'bg-green-100 text-green-800' };
        if (app.status === 'offer_extended') return { label: 'Offer Stage', color: 'bg-indigo-100 text-indigo-800' };
        if (app.status === 'interview_scheduled' && app.interviewDetails?.confirmedByAdmin) return { label: 'Interview Scheduled', color: 'bg-blue-100 text-blue-800' };
        if (app.status === 'interview_scheduled' && !app.interviewDetails?.confirmedByAdmin) return { label: 'Pending Admin', color: 'bg-yellow-100 text-yellow-800' };
        if (app.status === 'rejected') return { label: 'Rejected', color: 'bg-red-100 text-red-800' };
        return { label: 'Shortlisted', color: 'bg-green-100 text-green-800' };
    };

    const filteredCandidates = useMemo(() => candidates.filter(app => {
        const profile = app.user?.employerProfile;
        return profile && (profile.name.toLowerCase().includes(searchTerm.toLowerCase()) || app.job.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }), [candidates, searchTerm]);

    const stats = useMemo(() => ({
        total: candidates.length,
        scheduled: candidates.filter(c => c.status === 'interview_scheduled').length,
        hired: candidates.filter(c => c.status === 'hired').length,
        pending: candidates.filter(c => c.status === 'shortlisted').length,
    }), [candidates]);

    function maskEmail(email: string) {
        const [user, domain] = email.split("@");
        const maskedUser =
            user.length <= 2 ? user[0] + "*" : user.slice(0, 2) + "*".repeat(user.length - 2);
        return `${maskedUser}@${domain}`;
    }

    function maskPhone(phone: string) {
        return phone.length >= 10
            ? phone.slice(0, 2) + "*".repeat(phone.length - 5) + phone.slice(-3)
            : "N/A";
    }

    const handleSchedule = async (details: any) => {
        if (!schedulingApp) return;
        try {
            await scheduleInterview({ appId: schedulingApp._id, details }).unwrap();
            toast.success('Interview scheduled and sent for admin approval!');
        } catch (err) { toast.error('Failed to schedule interview.'); }
    };

    const handleReject = async (appId: string) => {
        try { await updateStatus({ appId, status: 'rejected' }).unwrap(); toast.success('Candidate has been rejected.'); } catch (err) { toast.error('Failed to update status.'); }
    };

    const handleExtendOffer = (appId: string) => navigate(`/dashboard/college/offer-letter?appId=${appId}`);

    if (isLoading) return <div className="space-y-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-64 w-full" /><Skeleton className="h-64 w-full" /></div>;
    if (isError) return <div className="text-center py-10 text-red-500 flex items-center justify-center gap-2"><AlertTriangle size={20} />Failed to load shortlisted candidates.</div>;

    return (
        <div className="space-y-6">
            <div><h1 className="text-3xl font-bold text-foreground">Shortlisted Candidates</h1><p className="text-muted-foreground">Manage interviews and hiring for top candidates.</p></div>
            <Card><CardContent className="p-6"><div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input placeholder="Search by name or job title..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" /></div></CardContent></Card>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card><CardContent className="p-4"><div className="text-2xl font-bold">{stats.total}</div><p className="text-sm text-muted-foreground">Shortlisted</p></CardContent></Card>
                <Card><CardContent className="p-4"><div className="text-2xl font-bold text-blue-600">{stats.scheduled}</div><p className="text-sm text-muted-foreground">Interviews</p></CardContent></Card>
                <Card><CardContent className="p-4"><div className="text-2xl font-bold text-green-600">{stats.hired}</div><p className="text-sm text-muted-foreground">Hired</p></CardContent></Card>
                <Card><CardContent className="p-4"><div className="text-2xl font-bold text-yellow-600">{stats.pending}</div><p className="text-sm text-muted-foreground">Pending Action</p></CardContent></Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {filteredCandidates.length > 0 ? filteredCandidates.map((app) => {
                    const profile = app.user.employerProfile;
                    const status = getInterviewStatus(app);
                    return (
                        <Card key={app._id} className="hover:shadow-md transition-shadow flex flex-col">
                            <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4 pb-2">
                                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0"><User className="w-6 h-6 text-primary-foreground" /></div>
                                <div className="flex-1">
                                    <CardTitle>{profile.name}</CardTitle>
                                    <CardDescription>Applied for: {app.job.title}</CardDescription>
                                </div>
                                <Badge className={status.color}>{status.label}</Badge>
                            </CardHeader>
                            <CardContent className="p-4 pt-2 grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow">
                                <div className="md:col-span-2 space-y-2">
                                    <div className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground">{maskEmail(app.user.email)}</span></div>
                                    <div className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground">{profile.phone ? maskPhone(profile.phone) : "N/A"}</span></div>
                                    {app.interviewDetails?.scheduledOn && <div className="bg-muted/50 rounded-lg p-3 mt-2"><p className="text-sm font-medium">Interview Details:</p><p className="text-sm">Date: {new Date(app.interviewDetails.scheduledOn).toLocaleString()}</p><p className="text-sm">Type: {app.interviewDetails.interviewType}</p>{app.interviewDetails.meetingLink && <div className="flex items-center gap-2 mt-1"><LinkIcon size={14} /><a href={app.interviewDetails.meetingLink} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline truncate">{app.interviewDetails.meetingLink}</a></div>}</div>}
                                </div>
                                <div className="md:col-span-1 flex flex-col justify-center gap-2">
                                    {app.status === 'shortlisted' && <Button size="sm" onClick={() => setSchedulingApp(app)}><Calendar className="w-4 h-4 mr-2" />Schedule Interview</Button>}
                                    {app.status === 'interview_scheduled' && app.interviewDetails.confirmedByAdmin && <InterviewOutcomeButtons app={app} onReject={handleReject} onExtendOffer={handleExtendOffer} />}
                                    <Button variant="outline" size="sm" onClick={() => setViewingProfileApp(app)}><FileText className="w-4 h-4 mr-2" />View Profile</Button>
                                </div>
                            </CardContent>
                        </Card>
                    )
                }) : (
                    <div className="col-span-full"><Card><CardContent className="p-10 text-center"><p className="text-muted-foreground">No shortlisted candidates found.</p></CardContent></Card></div>
                )}
            </div>
            {viewingProfileApp && <ViewProfileModal application={viewingProfileApp} onClose={() => setViewingProfileApp(null)} />}
            {schedulingApp && <ScheduleInterviewModal application={schedulingApp} onClose={() => setSchedulingApp(null)} onSchedule={handleSchedule} />}
        </div>
    );
};

export default CollegeShortlist;