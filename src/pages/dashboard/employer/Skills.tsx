import React, { useState } from 'react';
import { Send, Calendar, FileText, CheckCircle, Archive, User, Check, Loader2, Info, Briefcase } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGetMyApplicationsQuery, useUpdateApplicationMutation } from '../../../features/profile/employerProfileApiService';
import { Application } from '@/types/employer';
import toast from 'react-hot-toast';
import { InterviewModal } from './components/InterviewModal';
import { OfferModal } from './components/OfferModal';

type ApplicationCategory = 'applied' | 'interviews' | 'offers' | 'hired' | 'archived';

// A more robust progress component to visualize application status
const ApplicationProgress = ({ status }: { status: Application['status'] }) => {
    const steps = [
        { key: 'applied', label: 'Applied' },
        { key: 'viewed', label: 'Reviewed' },
        { key: 'interview_scheduled', label: 'Interview' },
        { key: 'offer_extended', label: 'Offer Sent' },
        { key: 'hired', label: 'Hired' }
    ];

    const statusOrder: Application['status'][] = ['applied', 'viewed', 'shortlisted', 'interview_scheduled', 'offer_extended', 'hired'];
    let currentStepIndex = statusOrder.indexOf(status);

    // If status is 'shortlisted', treat it as 'viewed' for progress visualization
    if (status === 'shortlisted') {
        currentStepIndex = 1;
    }
    
    return (
        <div className="flex items-center">
            {steps.map((step, index) => (
                <React.Fragment key={step.key}>
                    <div className="flex flex-col items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${index <= currentStepIndex ? 'bg-primary text-primary-foreground' : 'bg-gray-200'}`}>
                            {index <= currentStepIndex && <Check className="w-4 h-4" />}
                        </div>
                        <p className={`text-xs mt-1 whitespace-nowrap ${index <= currentStepIndex ? 'text-primary' : 'text-muted-foreground'}`}>{step.label}</p>
                    </div>
                    {index < steps.length - 1 && <div className={`flex-1 h-0.5 transition-colors ${index < currentStepIndex ? 'bg-primary' : 'bg-gray-200'}`} />}
                </React.Fragment>
            ))}
        </div>
    );
};

const EmployerApplications = () => {
  const [activeCategory, setActiveCategory] = useState<ApplicationCategory>('applied');
  const { data: applications, isLoading, isError, refetch } = useGetMyApplicationsQuery(activeCategory, { pollingInterval: 60000 });
  const [updateApplication, { isLoading: isUpdating }] = useUpdateApplicationMutation();

  const [isInterviewModalOpen, setInterviewModalOpen] = useState(false);
  const [isOfferModalOpen, setOfferModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const handleOpenInterviewModal = (app: Application) => {
    setSelectedApp(app);
    setInterviewModalOpen(true);
  };
  
  const handleOpenOfferModal = (app: Application) => {
    setSelectedApp(app);
    setOfferModalOpen(true);
  };

  const handleCloseModals = () => {
    setInterviewModalOpen(false);
    setOfferModalOpen(false);
    setSelectedApp(null);
    refetch(); // Refetch data when modals are closed to ensure UI is up-to-date
  };

  const handleMarkAsHired = async (appId: string) => {
    try {
        await updateApplication({ appId, body: { status: 'hired', category: 'hired' } }).unwrap();
        toast.success("Candidate marked as Hired!");
        refetch(); // Immediately refetch to update UI
    } catch(err) {
        toast.error("Failed to update status.");
    }
  };

  const categories = [
    { key: 'applied' as const, label: 'Applied', icon: Send },
    { key: 'interviews' as const, label: 'Interviews', icon: Calendar },
    { key: 'offers' as const, label: 'Offers', icon: FileText },
    { key: 'hired' as const, label: 'Hired', icon: CheckCircle },
    { key: 'archived' as const, label: 'Archived', icon: Archive }
  ];

  const getActionForApplicant = (app: Application) => {
    switch(app.status) {
      case 'applied':
      case 'viewed':
      case 'shortlisted': 
        return <Button onClick={() => handleOpenInterviewModal(app)} disabled={isUpdating}><Calendar className="w-4 h-4 mr-2" />Schedule Interview</Button>;
      case 'interview_scheduled': 
        return <Button onClick={() => handleOpenOfferModal(app)} disabled={isUpdating}><FileText className="w-4 h-4 mr-2" />Send Offer</Button>;
      case 'offer_extended': 
        return <Button onClick={() => handleMarkAsHired(app._id)} disabled={isUpdating} className="bg-green-600 hover:bg-green-700"><CheckCircle className="w-4 h-4 mr-2" />Mark as Hired</Button>;
      default: return null;
    }
  };

  const renderContent = () => {
    if (isLoading) return <div className="flex justify-center items-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    if (isError) return <div className="text-center p-12 text-red-600"><Button onClick={() => refetch()} variant="link">Failed to load applications. Click to retry.</Button></div>;
    if (!applications || applications.length === 0) return (
        <Card className="flex flex-col items-center justify-center p-12 text-center bg-muted/30 border-dashed">
            <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-4 border"><Briefcase className="w-8 h-8 text-muted-foreground" /></div>
            <h3 className="text-lg font-medium text-foreground mb-1">No Applicants Here</h3>
            <p className="text-muted-foreground text-sm max-w-xs">Candidates in the '{activeCategory}' stage will appear here.</p>
        </Card>
    );
    return (
        <div className="space-y-6">
        {applications.map((app) => (
            <Card key={app._id} className="overflow-hidden">
                <CardHeader className="p-4 bg-muted/30 border-b">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
                        <div>
                            <CardTitle className="text-lg">{app.user.fullName}</CardTitle>
                            <CardDescription className="pt-1">Applying for: {app.job.title}</CardDescription>
                            <p className="text-xs text-muted-foreground pt-1.5">Applied on {new Date(app.appliedDate).toLocaleDateString()}</p>
                        </div>
                        <Badge variant="outline" className="capitalize">{app.status.replace('_', ' ')}</Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                    {app.interviewDetails?.scheduledOn && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm space-y-1">
                            <p className="font-semibold text-blue-800 flex items-center gap-2"><Calendar size={16}/>Interview Scheduled</p>
                            <p><strong>Date:</strong> {new Date(app.interviewDetails.scheduledOn).toLocaleString()}</p>
                            <p><strong>Type:</strong> {app.interviewDetails.interviewType}</p>
                            {app.interviewDetails.notes && <p><strong>Notes:</strong> {app.interviewDetails.notes}</p>}
                        </div>
                    )}
                    {app.offerDetails?.joiningDate && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm space-y-1">
                            <p className="font-semibold text-green-800 flex items-center gap-2"><FileText size={16}/>Offer Sent</p>
                            <p><strong>Salary:</strong> {app.offerDetails.salary}</p>
                            <p><strong>Joining Date:</strong> {new Date(app.offerDetails.joiningDate).toLocaleDateString()}</p>
                            {app.offerDetails.offerText && <p><strong>Message:</strong> {app.offerDetails.offerText}</p>}
                        </div>
                    )}
                    <div className="pt-2">
                        <ApplicationProgress status={app.status}/>
                    </div>
                </CardContent>
                <CardFooter className="p-4 bg-muted/30 flex justify-end">
                    {getActionForApplicant(app)}
                </CardFooter>
            </Card>
        ))}
        </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                  <h1 className="text-3xl font-bold text-foreground">Manage Applications</h1>
                  <p className="text-muted-foreground mt-1">Track and manage all candidates for your job postings.</p>
              </div>
          </div>
          <div className="bg-background p-1 rounded-lg border inline-flex flex-wrap gap-1">
              {categories.map((category) => (
                <Button key={category.key} onClick={() => setActiveCategory(category.key)} variant={activeCategory === category.key ? "default" : "ghost"} className="flex items-center justify-center gap-2">
                  <category.icon className="w-4 h-4" />
                  <span>{category.label}</span>
                </Button>
              ))}
          </div>
          {renderContent()}
      </div>
      {isInterviewModalOpen && selectedApp && <InterviewModal isOpen={isInterviewModalOpen} onClose={handleCloseModals} application={selectedApp} />}
      {isOfferModalOpen && selectedApp && <OfferModal isOpen={isOfferModalOpen} onClose={handleCloseModals} application={selectedApp} />}
    </>
  );
};

export default EmployerApplications;