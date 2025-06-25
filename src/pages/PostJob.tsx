import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Users, Search, Briefcase, Quote, X, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import EmployerHeader from "@/components/EmployerHeader"; // Reusable header
import { useGetMyJobsQuery } from '@/features/api/employerJobApiService';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

// NOTE: Ensure these colors are in your tailwind.config.js
// theme: {
//   extend: {
//     colors: {
//       'primary': '#4A55A2',
//       'employer-dark': '#2d2d2d',
//     },
//   },
// }

// Interface for a posted job
interface PostedJob {
  _id: string;
  title: string;
  location: string;
  schoolName: string;
  status: 'pending' | 'approved' | 'rejected';
  jobType: string;
  description: string;
  experienceLevel: string;
  yearsOfExperience: number;
}

// Helper to get status badge
const getStatusBadge = (status: string) => {
    switch (status) {
        case 'pending': return <Badge variant="secondary">Pending Review</Badge>;
        case 'approved': return <Badge className="bg-green-600 text-white">Approved</Badge>;
        case 'rejected': return <Badge variant="destructive">Rejected</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
};

// --- [NEW] Job Post Modal Component ---
const JobPostModal = ({ onClose }: { onClose: () => void }) => {
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would handle form submission here (e.g., send data to an API)
    alert("Job submitted successfully! (This is a demo)");
    onClose(); // Close the modal after submission
  };

  // Prevents the modal from closing when clicking inside the content area
  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    // The Modal Overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* The Modal Content */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={handleModalContentClick}
      >
        <div className="p-8">
          {/* Modal Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Post a New Job
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Fill out the details below to find your next great hire.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* The Form */}
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="jobTitle"
                className="block text-sm font-medium text-gray-700"
              >
                Job Title
              </label>
              <input
                type="text"
                id="jobTitle"
                name="jobTitle"
                placeholder="e.g., Senior Physics Teacher"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="e.g., New Delhi, India"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label
                htmlFor="jobType"
                className="block text-sm font-medium text-gray-700"
              >
                Job Type
              </label>
              <select
                id="jobType"
                name="jobType"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Temporary</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Job Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={6}
                placeholder="Describe the responsibilities, qualifications, and benefits..."
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              ></textarea>
            </div>

            {/* Form Footer with Buttons */}
            <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Post Job</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- FeatureCard Component ---
const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="text-center p-6 bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-5">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

// --- [NEW] Job Detail Modal Component ---
const JobDetailModal = ({ job, onClose }: { job: PostedJob | null; onClose: () => void }) => {
  if (!job) return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{job.title}</DialogTitle>
          <DialogDescription>
            {job.schoolName} • {job.location}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6">
          <div className="flex flex-wrap gap-4 text-sm">
            <Badge variant="outline">{job.jobType}</Badge>
            <Badge variant="outline">{job.experienceLevel}</Badge>
            <Badge variant="outline">{job.yearsOfExperience} years experience</Badge>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-2">Job Description</h4>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{job.description}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// --- [NEW] Section to display posted jobs ---
const PostedJobsSection = () => {
    const { data: jobs = [], isLoading, isError } = useGetMyJobsQuery();
    const [selectedJob, setSelectedJob] = useState<PostedJob | null>(null);

    const renderContent = () => {
        if (isLoading) {
            return <div className="flex justify-center items-center p-20"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>;
        }

        if (isError) {
            return (
                <div className="p-12 text-center bg-red-50 border border-red-200 rounded-lg">
                    <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-destructive">Error Loading Jobs</h3>
                    <p className="text-sm text-red-600">Could not fetch your job posts. Please try again later.</p>
                </div>
            );
        }

        if (jobs.length === 0) {
            return (
                <div className="p-16 text-center bg-gray-50 border-2 border-dashed rounded-lg">
                    <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-800">No Jobs Posted Yet</h3>
                    <p className="text-gray-600 mt-2">The jobs you post from your dashboard will appear here.</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(jobs as PostedJob[]).map((job) => (
                    <Card key={job._id} className="flex flex-col">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">{job.title}</CardTitle>
                                {getStatusBadge(job.status)}
                            </div>
                            <CardDescription>{job.schoolName} • {job.location}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-sm text-gray-600 line-clamp-3">{job.description}</p>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full" onClick={() => setSelectedJob(job)}>View Details</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        );
    };

    return (
        <section className="py-20 sm:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Posted Jobs</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Here is a list of all the jobs you have created.
                    </p>
                </div>
                {renderContent()}
            </div>
            {selectedJob && <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
        </section>
    );
};

// --- Main Page Component ---
const PostJob = () => {
  // State to control the visibility of the job post form
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <EmployerHeader />

      {/* --- HERO SECTION --- */}
      <section className="relative bg-gradient-to-br from-employer-dark to-primary text-white py-20 sm:py-24 overflow-hidden">
        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/30 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6">
                Let's hire your next great teacher. Fast.
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                No matter the skills, experience, or qualifications, you'll find
                the right people on TeacherConnect.
              </p>
              <Button
                size="lg"
                className="px-8 py-3 bg-white text-primary font-bold rounded-lg hover:bg-gray-100 transition-colors text-lg shadow-lg"
                onClick={() => setIsFormOpen(true)}
              >
                Post a Job for Free
              </Button>
              <div className="mt-8 flex items-center gap-6 text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>10,000+ Active Teachers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Fast & Easy Posting</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-80 h-96">
                <div className="absolute top-0 right-0 w-full h-full bg-white/10 rounded-3xl backdrop-blur-md border border-white/20 transform -rotate-6"></div>
                <div className="relative w-full h-full bg-white/5 rounded-3xl backdrop-blur-xl border border-white/20 p-6 flex flex-col justify-between shadow-2xl">
                  <div>
                    <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                      <Users className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="font-bold text-2xl text-white">
                      Find Top Talent
                    </h3>
                    <p className="text-blue-200">
                      Connect with qualified educators.
                    </p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg">
                    <p className="text-sm font-bold text-white">
                      "A seamless hiring experience."
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-slate-200">
                        Verified Partner
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- "HOW IT WORKS" SECTION --- */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to make great hires
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform simplifies the hiring process for educational
              institutions.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Briefcase className="w-8 h-8 text-primary" />}
              title="1. Post Your Job"
              description="Reach thousands of qualified teachers across India with a single, easy-to-create job post."
            />
            <FeatureCard
              icon={<Search className="w-8 h-8 text-primary" />}
              title="2. Find Quality Candidates"
              description="Our smart matching tools help you identify and connect with the best-matched teachers for your role."
            />
            <FeatureCard
              icon={<CheckCircle className="w-8 h-8 text-primary" />}
              title="3. Hire with Confidence"
              description="Make informed decisions with detailed profiles, peer reviews, and our expert guidance."
            />
          </div>
        </div>
      </section>

      {/* --- [NEW] Inserted the posted jobs section here --- */}
      <PostedJobsSection />

      {/* --- TESTIMONIALS SECTION --- */}
      <section className="py-20 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Trusted by Schools Across India
            </h2>
          </div>
          <div className="relative max-w-3xl mx-auto">
            <div className="relative bg-white rounded-2xl p-8 sm:p-10 text-center border-t-4 border-primary shadow-2xl">
              <Quote className="absolute top-4 right-4 w-16 h-16 text-gray-100" />
              <img
                className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4 border-4 border-white"
                src="https://via.placeholder.com/150"
                alt="avatar"
              />
              <blockquote className="text-xl text-gray-700 my-4 italic">
                "TeacherConnect helped us find a qualified Physics PGT in just
                two weeks. The process was seamless and the quality of
                candidates was exceptional."
              </blockquote>
              <div>
                <p className="font-semibold text-gray-900">Dr. Rajesh Kumar</p>
                <p className="text-gray-600">Principal, Delhi Public School</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FINAL CTA SECTION --- */}
      <section className="relative py-20 bg-primary text-white overflow-hidden">
        <div className="absolute -left-16 -top-16 w-48 h-48 border-[16px] border-white/5 rounded-full"></div>
        <div className="absolute -right-16 -bottom-16 w-48 h-48 border-[16px] border-white/5 rounded-full"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to find your next great hire?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join thousands of schools that trust TeacherConnect for their hiring
            needs.
          </p>
          <Button
            size="lg"
            className="px-10 py-4 bg-white text-primary font-bold rounded-lg hover:bg-gray-100 transition-colors text-lg shadow-lg"
            onClick={() => setIsFormOpen(true)}
          >
            Post Your Job Now
          </Button>
        </div>
      </section>

      <Footer />

      {/* Render the modal form conditionally */}
      {isFormOpen && <JobPostModal onClose={() => setIsFormOpen(false)} />}
    </div>
  );
};

export default PostJob;