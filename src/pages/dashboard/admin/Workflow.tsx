import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, FileText, Calendar, Building, User, Briefcase, Info, Mail, Phone, MapPin, Star, GraduationCap, LinkIcon, Download, Video } from 'lucide-react';
import toast from 'react-hot-toast';
import { useGetApplicationsForAdminQuery, useForwardInterviewMutation, useForwardOfferMutation, useUpdateApplicationByAdminMutation, useGetPendingApplicationsQuery, useGetPendingDocumentApplicationsQuery, useVerifyDocumentsMutation, useGetInterviewApplicationsQuery } from '@/features/admin/adminApiService';

const AgreementUploadModal = ({ onSubmit, onClose, isLoading }) => {
    const [agreementFile, setAgreementFile] = useState<File | null>(null);

    const handleSubmit = () => {
        if (!agreementFile) {
            toast.error("Please upload an agreement file.");
            return;
        }
        onSubmit(agreementFile);
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload Agreement PDF</DialogTitle>
                    <DialogDescription>
                        Please upload the final agreement PDF to be sent to the candidate along with the offer letter.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Label htmlFor="agreement">Agreement Document (PDF)</Label>
                    <Input id="agreement" type="file" accept=".pdf" onChange={(e) => setAgreementFile(e.target.files ? e.target.files[0] : null)} />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isLoading || !agreementFile}>
                        {isLoading ? "Approving..." : "Approve & Send"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const Workflow = () => {
  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Platform Approval Workflows</CardTitle>
                <CardDescription>Manage all critical approval points in the platform, from new applications to interviews and offers.</CardDescription>
            </CardHeader>
        </Card>
        <Tabs defaultValue="new-applications" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="new-applications">New Applications</TabsTrigger>
                <TabsTrigger value="interview-offers">Interview & Offer Queue</TabsTrigger>
                <TabsTrigger value="document-verification">Document Verification</TabsTrigger>
                <TabsTrigger value="all-interviews">All Scheduled Interviews</TabsTrigger>
            </TabsList>
            <TabsContent value="new-applications" className="mt-4">
                <NewApplicationApprovalQueue />
            </TabsContent>
            <TabsContent value="interview-offers" className="mt-4">
                <InterviewOfferApprovalQueue />
            </TabsContent>
            <TabsContent value="document-verification" className="mt-4">
                <DocumentApprovalQueue />
            </TabsContent>
            <TabsContent value="all-interviews" className="mt-4">
                <AllInterviewsList />
            </TabsContent>
        </Tabs>
    </div>
  );
};

const AllInterviewsList = () => {
    const { data: interviews = [], isLoading, isError, refetch } = useGetInterviewApplicationsQuery();

    const getStatusBadge = (app) => {
        if (app.status === 'hired') return <Badge className="bg-green-100 text-green-800">Hired</Badge>;
        if (new Date(app.interviewDetails.scheduledOn) < new Date()) return <Badge variant="secondary">Completed</Badge>;
        if (app.interviewDetails.confirmedByAdmin) return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
        return <Badge variant="outline">Pending Admin</Badge>;
    };

    if (isLoading) return <Skeleton className="h-64 w-full rounded-lg" />;
    if (isError) return <div className="text-center py-10 text-red-500"><Button onClick={() => refetch()} variant="link">Error loading data. Click to try again.</Button></div>;

    return (
         <Card>
            <CardHeader>
                <CardTitle>All Scheduled Interviews</CardTitle>
                <CardDescription>A complete log of all interviews, including those pending and already approved.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                {interviews.length === 0 && <div className="text-center py-10 text-muted-foreground"><Info className="mx-auto mb-2" />No interviews have been scheduled on the platform yet.</div>}
                {interviews.map(app => (
                    <Card key={app._id} className="p-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div className="flex-1">
                                <p className="font-semibold">{app.user.employerProfile?.name}</p>
                                <p className="text-sm text-muted-foreground">For: {app.job.title} at {app.job.schoolName}</p>
                                <p className="text-sm mt-2"><strong>Date:</strong> {new Date(app.interviewDetails.scheduledOn).toLocaleString()}</p>
                                <p className="text-sm"><strong>Type:</strong> {app.interviewDetails.interviewType}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                {getStatusBadge(app)}
                                {app.interviewDetails.meetingLink && (
                                    <a href={app.interviewDetails.meetingLink} target="_blank" rel="noopener noreferrer">
                                        <Button size="sm" variant="outline"><Video className="mr-2 h-4 w-4" />Join Call</Button>
                                    </a>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
                </div>
            </CardContent>
        </Card>
    )
};


const DocumentApprovalQueue = () => {
    const { data: pendingDocs = [], isLoading, isError, refetch } = useGetPendingDocumentApplicationsQuery();
    const [verifyDocuments, { isLoading: isVerifying }] = useVerifyDocumentsMutation();

    const handleVerification = async (appId: string, isApproved: boolean) => {
        const status = isApproved ? 'documents_approved' : 'documents_rejected';
        try {
            await verifyDocuments({ appId, status }).unwrap();
            toast.success(`Documents have been ${isApproved ? 'approved' : 'rejected'}.`);
        } catch (err) {
            toast.error("Failed to update document status.");
        }
    };
    
    if (isLoading) return <Skeleton className="h-64 w-full rounded-lg" />;
    if (isError) return <div className="text-center py-10 text-red-500"><Button onClick={() => refetch()} variant="link">Error loading data. Click to try again.</Button></div>;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Document Verification Queue</CardTitle>
                <CardDescription>Review and verify documents submitted by candidates after accepting an offer.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {pendingDocs.length === 0 && <div className="text-center py-10 text-muted-foreground"><Info className="mx-auto mb-2" />No documents are pending verification.</div>}
                {pendingDocs.map(app => (
                    <Card key={app._id} className="p-4 flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2"><User size={16} /><h4 className="font-semibold">{app.user.employerProfile?.name}</h4></div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Briefcase size={14} /><span>For: {app.job.title}</span></div>
                            <div className="mt-2 space-y-1">
                                {app.acceptanceDocuments.map(doc => (
                                    <a key={doc._id} href={doc.url} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1.5"><Download size={14}/>View {doc.documentType.replace('_', ' ')}</a>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => handleVerification(app._id, true)} disabled={isVerifying}><Check size={16} className="mr-2"/>Approve Docs</Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild><Button variant="destructive" size="sm" className="flex-1"><X size={16} className="mr-2"/>Reject Docs</Button></AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader><AlertDialogTitle>Reject Documents?</AlertDialogTitle><AlertDialogDescription>This will reject the submitted documents and notify the user.</AlertDialogDescription></AlertDialogHeader>
                                    <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleVerification(app._id, false)} className="bg-destructive hover:bg-destructive/90">Confirm Reject</AlertDialogAction></AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </Card>
                ))}
            </CardContent>
        </Card>
    );
};

const NewApplicationApprovalQueue = () => {
    const { data: pendingApps = [], isLoading, isError, refetch } = useGetPendingApplicationsQuery();
    const [updateApplication, { isLoading: isUpdating }] = useUpdateApplicationByAdminMutation();

    const handleApproval = async (appId: string, isApproved: boolean) => {
        const status = isApproved ? 'applied' : 'rejected';
        try {
            await updateApplication({ appId, body: { status, category: isApproved ? 'applied' : 'archived' } }).unwrap();
            toast.success(`Application has been ${isApproved ? 'approved and sent to college' : 'rejected'}.`);
        } catch (err) {
            toast.error("Failed to update application status.");
        }
    };

    if (isLoading) return <Skeleton className="h-64 w-full rounded-lg" />;
    if (isError) return <div className="text-center py-10 text-red-500"><Button onClick={() => refetch()} variant="link">Error loading data. Click to try again.</Button></div>;

    return (
        <Card>
            <CardHeader>
                <CardTitle>New Application Queue</CardTitle>
                <CardDescription>Review new applications before they are visible to colleges. Approve to forward, or reject to dismiss.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {pendingApps.length === 0 && <div className="text-center py-10 text-muted-foreground"><Info className="mx-auto mb-2" />No new applications are pending approval.</div>}
                {pendingApps.map(app => (
                    <Card key={app._id} className="p-4 flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2"><User size={16} /><h4 className="font-semibold">{app.user.employerProfile?.name}</h4></div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Briefcase size={14} /><span>Applied for: {app.job.title}</span></div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Building size={14} /><span>At: {app.job.schoolName}</span></div>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <Dialog><DialogTrigger asChild><Button variant="outline" size="sm" className="flex-1">View Details</Button></DialogTrigger><ApplicationDetailsModal application={app} /></Dialog>
                            <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => handleApproval(app._id, true)} disabled={isUpdating}><Check size={16} className="mr-2"/>Approve</Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild><Button variant="destructive" size="sm" className="flex-1"><X size={16} className="mr-2"/>Reject</Button></AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader><AlertDialogTitle>Reject Application?</AlertDialogTitle><AlertDialogDescription>This will permanently dismiss the application. It will not be sent to the college.</AlertDialogDescription></AlertDialogHeader>
                                    <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleApproval(app._id, false)} className="bg-destructive hover:bg-destructive/90">Confirm Reject</AlertDialogAction></AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </Card>
                ))}
            </CardContent>
        </Card>
    );
};

const InterviewOfferApprovalQueue = () => {
    const { data: applications = [], isLoading, isError, refetch } = useGetApplicationsForAdminQuery();
    const [forwardInterview, { isLoading: isApprovingInterview }] = useForwardInterviewMutation();
    const [forwardOffer, { isLoading: isApprovingOffer }] = useForwardOfferMutation();
    const [updateApplication, { isLoading: isRejecting }] = useUpdateApplicationByAdminMutation();
    const [showAgreementModal, setShowAgreementModal] = useState<any | null>(null);

    const workflowItems = useMemo(() => applications.map(app => {
      let type = '', status = '';
      if (app.status === 'interview_scheduled') { type = 'Interview Schedule'; status = app.interviewDetails?.confirmedByAdmin ? 'Approved' : 'Pending Approval'; } 
      else if (app.status === 'offer_extended') { type = 'Offer Letter'; status = app.offerLetter?.forwardedByAdmin ? 'Approved' : 'Pending Approval'; } 
      else { return null; }
      return { id: app._id, type, status, candidateName: app.user?.employerProfile?.name || 'N/A', collegeName: app.job?.schoolName || 'N/A', jobTitle: app.job?.title || 'N/A', updatedAt: app.updatedAt, interviewDetails: app.interviewDetails, offerLetter: app.offerLetter };
    }).filter(item => item !== null && item.status === 'Pending Approval'), [applications]);

    const handleApprove = async (item, agreementFile: File | null = null) => {
        try {
            if (item.type === 'Interview Schedule') { 
                await forwardInterview(item.id).unwrap(); 
                toast.success('Interview forwarded!'); 
            } else if (item.type === 'Offer Letter' && agreementFile) { 
                const formData = new FormData();
                formData.append('agreement', agreementFile);
                await forwardOffer({ appId: item.id, formData }).unwrap(); 
                toast.success('Offer forwarded with agreement!'); 
                setShowAgreementModal(null);
            }
        } catch (err) { 
            toast.error('Failed to approve.'); 
            setShowAgreementModal(null);
        }
    };
    
    const handleReject = async (item) => {
        try {
            await updateApplication({ appId: item.id, body: { status: 'rejected', category: 'archived' } }).unwrap();
            toast.success('Submission rejected.');
        } catch (err) { toast.error('Failed to reject.'); }
    };

    if (isLoading) return <Skeleton className="h-64 w-full rounded-lg" />;
    if (isError) return <div className="text-center py-10 text-red-500"><Button onClick={() => refetch()} variant="link">Error loading data. Click to try again.</Button></div>;

    return (
        <Card>
             <CardHeader>
                <CardTitle>Interview & Offer Queue</CardTitle>
                <CardDescription>Review interviews and offers scheduled by colleges before they are sent to candidates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {workflowItems.length === 0 && <div className="text-center py-10 text-muted-foreground"><Info className="mx-auto mb-2" />No interviews or offers are pending approval.</div>}
                {workflowItems.map(item => (
                    <Card key={item.id} className="p-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                           <div className="flex-1">
                               <div className="flex items-center gap-3 mb-2">
                                   <div className={`p-2 rounded-full ${item.type === 'Interview Schedule' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                       {item.type === 'Interview Schedule' ? <Calendar size={16}/> : <FileText size={16}/>}
                                   </div>
                                   <h4 className="font-semibold">{item.type}</h4>
                               </div>
                               <p className="text-sm"><strong>Candidate:</strong> {item.candidateName}</p>
                               <p className="text-sm"><strong>College:</strong> {item.collegeName} for {item.jobTitle}</p>
                               {item.type === 'Offer Letter' && item.offerLetter?.url && <a href={item.offerLetter.url} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1 mt-1"><LinkIcon size={14}/>View Offer Letter</a>}
                           </div>
                           <div className="flex gap-2 w-full sm:w-auto">
                                <Button size="sm" className="flex-1" onClick={() => item.type === 'Interview Schedule' ? handleApprove(item) : setShowAgreementModal(item)} disabled={isApprovingInterview || isApprovingOffer}><Check size={16} className="mr-2"/>Approve</Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild><Button variant="destructive" size="sm" className="flex-1"><X size={16} className="mr-2"/>Reject</Button></AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader><AlertDialogTitle>Reject Submission?</AlertDialogTitle><AlertDialogDescription>This will reject the submission and notify the college.</AlertDialogDescription></AlertDialogHeader>
                                        <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleReject(item)} disabled={isRejecting} className="bg-destructive hover:bg-destructive/90">Confirm Reject</AlertDialogAction></AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                           </div>
                        </div>
                    </Card>
                ))}
            </CardContent>
            {showAgreementModal && (
                <AgreementUploadModal 
                    onClose={() => setShowAgreementModal(null)} 
                    isLoading={isApprovingOffer}
                    onSubmit={(file) => handleApprove(showAgreementModal, file)} 
                />
            )}
        </Card>
    );
};

const ApplicationDetailsModal = ({ application }) => (
    <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>A complete overview of the applicant and the job they applied for.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 flex-1 overflow-y-auto pr-4">
            <div className="space-y-4">
                <Card><CardHeader><CardTitle className="flex items-center gap-2"><User size={20}/>Applicant Profile</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                        <p><strong>Name:</strong> {application.user.employerProfile.name}</p>
                        <p className="flex items-center gap-2"><strong>Email:</strong> <a href={`mailto:${application.user.email}`} className="text-primary hover:underline">{application.user.email}</a></p>
                        <p className="flex items-center gap-2"><strong>Phone:</strong> {application.user.employerProfile.phone || 'N/A'}</p>
                        <p className="flex items-center gap-2"><strong>Location:</strong> {application.user.employerProfile.location || 'N/A'}</p>
                        <p><strong>Headline:</strong> {application.user.employerProfile.headline || 'N/A'}</p>
                        <div className="pt-2"><p className="font-semibold mb-2">Skills:</p><div className="flex flex-wrap gap-2">{application.user.employerProfile.skills.map(s => <Badge key={s._id} variant="secondary">{s.name}</Badge>)}</div></div>
                    </CardContent>
                </Card>
                <Card><CardHeader><CardTitle className="flex items-center gap-2"><Briefcase size={20}/>Work Experience</CardTitle></CardHeader>
                    <CardContent>{application.user.employerProfile.workExperience.map(exp => <div key={exp._id} className="mb-2"><p className="font-semibold">{exp.title} at {exp.company}</p><p className="text-sm text-muted-foreground">{exp.duration}</p></div>)}</CardContent>
                </Card>
                 <Card><CardHeader><CardTitle className="flex items-center gap-2"><GraduationCap size={20}/>Education</CardTitle></CardHeader>
                    <CardContent>{application.user.employerProfile.education.map(edu => <div key={edu._id} className="mb-2"><p className="font-semibold">{edu.degree} from {edu.school}</p><p className="text-sm text-muted-foreground">{edu.year}</p></div>)}</CardContent>
                </Card>
            </div>
            <div className="space-y-4">
                <Card><CardHeader><CardTitle className="flex items-center gap-2"><Briefcase size={20}/>Job Details</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                        <p><strong>Title:</strong> {application.job.title}</p>
                        <p><strong>School:</strong> {application.job.schoolName}</p>
                        <p><strong>Location:</strong> {application.job.location}</p>
                        <p><strong>Salary:</strong> {application.job.salary || 'Not Disclosed'}</p>
                        <p><strong>Type:</strong> {application.job.type || 'N/A'}</p>
                        <div className="pt-2"><p className="font-semibold">Description:</p><p className="text-sm text-muted-foreground whitespace-pre-wrap">{application.job.description}</p></div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </DialogContent>
);

export default Workflow;