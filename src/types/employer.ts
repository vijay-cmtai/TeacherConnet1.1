export interface Media {
  public_id: string;
  url: string;
}

export interface Document extends Media {
  name: string;
}

export interface WorkExperience {
  _id: string;
  title: string;
  company: string;
  location?: string;
  duration?: string;
}

export interface Education {
  _id: string;
  degree: string;
  school: string;
  year?: string;
  percentage?: string;
}

export interface Skill {
  _id: string;
  name: string;
}

export interface JobPreferences {
  jobType?: string;
  expectedSalary?: string;
  preferredLocation?: string;
  noticePeriod?: string;
}

export interface NotificationSettings {
  emailJobAlerts: boolean;
  whatsappUpdates: boolean;
  messagesFromSchools: boolean;
}

export interface EmployerProfile {
  _id: string;
  user: string;
  name: string;
  headline: string;
  location: string;
  phone: string;
  email: string; 
  profilePicture?: Media;
  demoVideo?: Media;
  documents: Document[];
  isVisible: boolean;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  jobPreferences: JobPreferences;
  settings: {
    notifications: NotificationSettings;
  };
  profileStrength: number;
  updatedAt: string;
}

export interface AcceptanceDocument {
  name: string;
  documentType: 'aadhar' | 'pan' | 'result' | 'experience' | 'signed_agreement';
  url: string;
  public_id: string;
  _id: string;
}

export interface Application {
    _id: string;
    user: {
        _id: string;
        fullName: string;
        email: string;
    };
    job: {
        _id: string;
        title: string;
        schoolName: string;
        location: string;
    };
    status: 'saved' | 'pending_admin_approval' | 'applied' | 'viewed' | 'shortlisted' | 'interview_scheduled' | 'offer_extended' | 'pending_document_approval' | 'documents_approved' | 'hired' | 'rejected';
    category: 'saved' | 'applied' | 'interviews' | 'offers' | 'hired' | 'archived';
    appliedDate: string;
    interviewDetails?: {
        scheduledOn?: string;
        interviewType?: 'Online' | 'In-Person' | 'Telephonic';
        notes?: string;
        meetingLink?: string;
        confirmedByAdmin?: boolean;
    };
    offerDetails?: {
        offerText?: string;
        joiningDate?: string;
        salary?: string;
    };
    offerLetter?: {
        url?: string;
        forwardedByAdmin?: boolean;
    };
    agreementLetter?: {
        public_id: string;
        url: string;
    };
    termsAndConditionsAccepted?: boolean;
    acceptanceDocuments?: AcceptanceDocument[];
}

export interface Jobs {
    _id: string;
    title: string;
    schoolName: string;
    description: string;
    location: string;
    jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
    salary?: string;
    status: 'open' | 'closed';
    postedBy: string;
    applicants: Application[];
    createdAt: string;
}