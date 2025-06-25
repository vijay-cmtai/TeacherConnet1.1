import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetOfferStageApplicationsQuery, useUploadOfferLetterMutation, useFinalizeHiringMutation } from '@/features/api/collegeApplicationsApiService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Upload, Send, FileText, User, AlertTriangle, Download, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

const CollegeOfferLetter = () => {
    const [searchParams] = useSearchParams();
    const appIdFromUrl = searchParams.get('appId');

    const { data: candidates = [], isLoading, isError } = useGetOfferStageApplicationsQuery();
    const [uploadOffer, { isLoading: isUploading }] = useUploadOfferLetterMutation();
    const [finalizeHiring, { isLoading: isFinalizing }] = useFinalizeHiringMutation();

    const [selectedCandidateId, setSelectedCandidateId] = useState('');
    const [offerLetterFile, setOfferLetterFile] = useState<File | null>(null);

    useEffect(() => {
        if (appIdFromUrl) {
            setSelectedCandidateId(appIdFromUrl);
        }
    }, [appIdFromUrl]);

    const getOfferStatus = (app: any) => {
        if (app.status === 'documents_approved') return { label: 'Documents Verified', color: 'bg-teal-100 text-teal-800' };
        if (app.status === 'offer_extended' && !app.offerLetter?.forwardedByAdmin) return { label: 'Pending Admin Approval', color: 'bg-yellow-100 text-yellow-800' };
        if (app.status === 'offer_extended' && app.offerLetter?.forwardedByAdmin) return { label: 'Offer Sent', color: 'bg-blue-100 text-blue-800' };
        if (app.status === 'hired') return { label: 'Hired', color: 'bg-green-100 text-green-800' };
        if (app.status === 'rejected') return { label: 'Declined/Rejected', color: 'bg-red-100 text-red-800' };
        return { label: 'Interview Stage', color: 'bg-gray-100 text-gray-800' };
    };

    const eligibleCandidates = useMemo(() => candidates.filter(c => c.user?.employerProfile && (appIdFromUrl ? c._id === appIdFromUrl : ['interview_scheduled'].includes(c.status))), [candidates, appIdFromUrl]);
    const offerProcessCandidates = useMemo(() => candidates.filter(c => c.user?.employerProfile && ['offer_extended', 'documents_approved', 'hired', 'rejected'].includes(c.status)), [candidates]);
    
    const stats = useMemo(() => ({
        total: offerProcessCandidates.length,
        pending: offerProcessCandidates.filter(c => c.status === 'offer_extended' && !c.offerLetter?.forwardedByAdmin).length,
        sent: offerProcessCandidates.filter(c => c.status === 'offer_extended' && c.offerLetter?.forwardedByAdmin).length,
        accepted: offerProcessCandidates.filter(c => c.status === 'hired').length,
    }), [offerProcessCandidates]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) { setOfferLetterFile(e.target.files[0]); }
    };
    
    const handleSendForApproval = async () => {
        if (!selectedCandidateId || !offerLetterFile) {
            toast.error('Please select a candidate and upload an offer letter file.');
            return;
        }
        const formData = new FormData();
        formData.append('offerLetter', offerLetterFile);
        
        try {
            await uploadOffer({ appId: selectedCandidateId, formData }).unwrap();
            toast.success('Offer letter sent for admin approval!');
            setSelectedCandidateId('');
            setOfferLetterFile(null);
            const fileInput = document.getElementById('offerFile') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
        } catch (err) { toast.error('Failed to upload offer letter.'); }
    };

    const handleFinalize = async (appId: string, status: 'hired' | 'rejected') => {
        const loadingToast = toast.loading('Finalizing decision...');
        try {
            await finalizeHiring({ appId, status }).unwrap();
            toast.success(`Candidate has been successfully ${status}.`, { id: loadingToast });
        } catch (err) {
            toast.error('Failed to finalize hiring.', { id: loadingToast });
        }
    };

    if (isLoading) return <div className="space-y-4"><Skeleton className="h-48 w-full" /><Skeleton className="h-64 w-full" /></div>;
    if (isError) return <div className="text-center py-10 text-red-500 flex items-center justify-center gap-2"><AlertTriangle size={20}/>Failed to load offer data.</div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold text-foreground">Offer Letters</h1><p className="text-muted-foreground">Upload and manage offer letters for admin approval.</p></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Upload Offer Letter</CardTitle><CardDescription>Upload a custom offer letter and send it to an admin for approval.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div><Label htmlFor="candidate">Select Candidate</Label><Select value={selectedCandidateId} onValueChange={setSelectedCandidateId}><SelectTrigger><SelectValue placeholder="Choose a candidate post-interview..." /></SelectTrigger><SelectContent>{eligibleCandidates.length > 0 ? eligibleCandidates.map(app => (<SelectItem key={app._id} value={app._id}>{app.user.employerProfile.name} - {app.job.title}</SelectItem>)) : <div className="p-4 text-sm text-muted-foreground">No candidates eligible for an offer.</div>}</SelectContent></Select></div>
              <div><Label htmlFor="offerFile">Offer Letter Document (PDF, DOCX)</Label><Input id="offerFile" type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx" className="pt-1.5"/></div>
              <Button onClick={handleSendForApproval} disabled={!selectedCandidateId || !offerLetterFile || isUploading}><Send className="w-4 h-4 mr-2" />{isUploading ? 'Uploading...' : 'Send for Approval'}</Button>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6"><Card>
            <CardHeader><CardTitle>Offer Status Overview</CardTitle></CardHeader>
            <CardContent><div className="space-y-3">
                <div className="flex justify-between"><span className="text-sm">In Offer Process</span><span className="font-semibold">{stats.total}</span></div>
                <div className="flex justify-between"><span className="text-sm">Pending Admin Approval</span><span className="font-semibold text-yellow-600">{stats.pending}</span></div>
                <div className="flex justify-between"><span className="text-sm">Sent to Candidate</span><span className="font-semibold text-blue-600">{stats.sent}</span></div>
                <div className="flex justify-between"><span className="text-sm">Hired</span><span className="font-semibold text-green-600">{stats.accepted}</span></div>
            </div></CardContent>
        </Card></div>
      </div>
      <Card>
        <CardHeader><CardTitle>Offer Pipeline</CardTitle><CardDescription>Track the status of all candidates in the offer process.</CardDescription></CardHeader>
        <CardContent><div className="space-y-4">
            {offerProcessCandidates.length > 0 ? offerProcessCandidates.map((app) => {
                const status = getOfferStatus(app);
                return (
                <div key={app._id} className="p-4 border rounded-lg flex-wrap gap-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3"><div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0"><User className="w-5 h-5 text-primary-foreground" /></div>
                        <div><h4 className="font-semibold text-foreground">{app.user.employerProfile.name}</h4><p className="text-sm text-muted-foreground">{app.job.title}</p></div></div>
                        <div className="flex items-center gap-3">
                            <Badge className={status.color}>{status.label}</Badge>
                            <Button asChild variant="outline" size="sm"><a href={app.offerLetter?.url} target="_blank" rel="noreferrer" className={!app.offerLetter?.url ? 'pointer-events-none opacity-50' : ''}><FileText className="w-4 h-4 mr-2" />View Offer</a></Button>
                        </div>
                    </div>
                    {app.status === 'documents_approved' && (
                        <div className="mt-4 pt-4 border-t border-dashed">
                            <h5 className="font-semibold text-sm mb-2">Verified Documents:</h5>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {app.acceptanceDocuments.map(doc => (
                                    <Button key={doc._id} asChild variant="secondary" size="sm">
                                        <a href={doc.url} target="_blank" rel="noreferrer"><Download className="w-4 h-4 mr-2" />{doc.documentType}</a>
                                    </Button>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" onClick={() => handleFinalize(app._id, 'hired')} disabled={isFinalizing} className="bg-green-600 hover:bg-green-700"><Check className="w-4 h-4 mr-2" />Approve & Hire</Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild><Button size="sm" variant="destructive" disabled={isFinalizing}><X className="w-4 h-4 mr-2" />Reject</Button></AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader><AlertDialogTitle>Reject Candidate?</AlertDialogTitle><AlertDialogDescription>This will mark the candidate as not selected. This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                                        <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleFinalize(app._id, 'rejected')} className="bg-destructive hover:bg-destructive/90">Confirm Rejection</AlertDialogAction></AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    )}
                </div>
            )}) : <div className="p-6 text-center text-muted-foreground">No candidates are currently in the offer process.</div>}
        </div></CardContent>
      </Card>
    </div>
  );
};

export default CollegeOfferLetter; 