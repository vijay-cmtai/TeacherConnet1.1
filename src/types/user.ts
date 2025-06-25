export interface User {
  id: string;
  email: string;
  name: string;
  role: 'employer' | 'employee' | 'admin' | 'college';
  organizationName?: string;
  industry?: string;
  location?: string;
  phone?: string;
  profileCompletion?: number;
  applications?: number;
  interviews?: number;
  experience?: string;
} 