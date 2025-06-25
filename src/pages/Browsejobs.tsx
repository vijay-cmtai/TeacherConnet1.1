import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import {
  selectIsAuthenticated,
  selectCurrentUser,
} from "@/features/auth/authSlice";
import { useGetPublicJobsQuery } from "@/features/api/publicJobApiService";
import {
  useApplyToJobMutation,
  useSaveJobMutation,
  useGetMyApplicationsQuery,
} from "@/features/profile/employerProfileApiService";
import {
  MapPin,
  Briefcase,
  Clock,
  Check,
  Bookmark,
  Share2,
  Wallet,
  Building,
  Loader2,
  AlertTriangle,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Define the Job interface
interface Job {
  _id: string;
  title: string;
  schoolName: string;
  location: string;
  salary: string;
  type: string;
  experienceLevel: string;
  description: string;
  responsibilities: string;
  requirements: string;
  tags: string[];
}

// STYLED Job Details Component
const NewJobDetails = ({
  job,
  applicationStatus,
}: {
  job: Job;
  applicationStatus: "applied" | "saved" | null;
}) => {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [applyToJob, { isLoading: isApplying }] = useApplyToJobMutation();
  const [saveJob, { isLoading: isSaving }] = useSaveJobMutation();

  const handleAction = async (action: "apply" | "save") => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    const mutation = action === "apply" ? applyToJob : saveJob;
    const successMessage =
      action === "apply" ? "Successfully applied!" : "Job saved!";
    const loadingToast = toast.loading(
      `${action === "apply" ? "Applying" : "Saving"}...`
    );
    try {
      await mutation(job._id).unwrap();
      toast.success(successMessage, { id: loadingToast });
    } catch (err: any) {
      toast.error(err.data?.message || `Failed to ${action} for job.`, {
        id: loadingToast,
      });
    }
  };

  const responsibilitiesList =
    typeof job.responsibilities === "string"
      ? job.responsibilities.split("\n").filter((line) => line.trim() !== "")
      : [];
  const requirementsList =
    typeof job.requirements === "string"
      ? job.requirements.split("\n").filter((line) => line.trim() !== "")
      : [];

  const renderActionButtons = () => {
    if (applicationStatus === "applied") {
      return (
        <Button size="lg" className="w-full text-base" disabled>
          <Check className="w-5 h-5 mr-2" />
          Applied
        </Button>
      );
    }
    if (applicationStatus === "saved") {
      return (
        <Button
          size="lg"
          className="w-full text-base"
          variant="outline"
          disabled
        >
          <Bookmark className="w-5 h-5 mr-2" />
          Saved
        </Button>
      );
    }
    return (
      <Button
        onClick={() => handleAction("apply")}
        disabled={isApplying || isSaving}
        size="lg"
        className="w-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors font-bold text-base disabled:bg-indigo-400"
      >
        {isApplying ? "Applying..." : "Apply Now"}
      </Button>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-lg">
      <div className="p-6">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{job.title}</h2>
            <div className="mt-2 flex items-center gap-2 text-gray-700">
              <Building size={18} className="text-gray-500" />
              <p className="text-lg font-semibold text-indigo-600">
                {job.schoolName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => handleAction("save")}
              disabled={isSaving || isApplying || applicationStatus !== null}
              className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors disabled:opacity-50"
              title="Save Job"
            >
              <Bookmark size={20} />
            </button>
            <button
              className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              title="Share Job"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>
        <div className="mt-6">{renderActionButtons()}</div>
      </div>

      <div className="px-6 py-5 border-y border-gray-200 bg-gray-50/50 flex flex-wrap gap-4">
        {[
          { icon: <Wallet size={18} />, label: job.salary },
          { icon: <MapPin size={18} />, label: job.location },
          { icon: <Briefcase size={18} />, label: job.type },
          { icon: <Clock size={18} />, label: job.experienceLevel },
        ].map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 rounded-lg px-3 py-2 text-sm"
          >
            <div className="text-indigo-500">{item.icon}</div>
            <span className="font-medium">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Full Job Description
        </h3>
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <div>
            <h4 className="font-bold text-gray-800 mb-2">About the Role</h4>
            <p className="text-gray-600">{job.description}</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 mb-2">
              Key Responsibilities
            </h4>
            <ul className="space-y-2 list-disc list-outside pl-5 text-gray-600">
              {responsibilitiesList.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 mb-2">
              Required Skills and Qualifications
            </h4>
            <ul className="space-y-2 list-disc list-outside pl-5 text-gray-600">
              {requirementsList.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// STYLED Job List Item Component
const JobListItem = ({
  job,
  isSelected,
  onClick,
  applicationStatus,
}: {
  job: Job;
  isSelected: boolean;
  onClick: () => void;
  applicationStatus: "applied" | "saved" | null;
}) => (
  <div
    onClick={onClick}
    className={`bg-white rounded-lg border cursor-pointer transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 ${
      isSelected
        ? "border-indigo-500 ring-2 ring-indigo-300"
        : "border-gray-200"
    }`}
  >
    <div className="p-5 relative">
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
          <p className="text-sm font-semibold text-gray-600 mt-1">
            {job.schoolName}
          </p>
        </div>
        {applicationStatus && (
          <Badge
            variant={applicationStatus === "applied" ? "default" : "secondary"}
            className="capitalize"
          >
            {applicationStatus}
          </Badge>
        )}
      </div>
      <div className="mt-4 space-y-3 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <MapPin size={16} />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Wallet size={16} />
          <span>{job.salary}</span>
        </div>
      </div>
    </div>
  </div>
);

// Main Section Component with updated layout
const JobSearchSection = () => {
  const { data: jobs = [], isLoading, isError } = useGetPublicJobsQuery();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { data: myApplications = [] } = useGetMyApplicationsQuery("applied", {
    skip: !isAuthenticated,
  });
  const { data: savedApplications = [] } = useGetMyApplicationsQuery("saved", {
    skip: !isAuthenticated,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const applicationStatusMap = useMemo(() => {
    const map = new Map();
    myApplications.forEach((app) => map.set(app.job._id, "applied"));
    savedApplications.forEach((app) => map.set(app.job._id, "saved"));
    return map;
  }, [myApplications, savedApplications]);
  
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        job.schoolName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [jobs, searchTerm]);

  useEffect(() => {
    if (filteredJobs.length > 0) {
        const isSelectedJobInFilteredList = filteredJobs.some(job => job._id === selectedJob?._id);
        if (!isSelectedJobInFilteredList) {
            setSelectedJob(filteredJobs[0]);
        }
    } else {
        setSelectedJob(null);
    }
  }, [filteredJobs, selectedJob]);


  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center py-24 text-lg font-semibold text-gray-600 gap-3">
        <Loader2 className="animate-spin w-8 h-8 text-indigo-500" />
        Loading Jobs...
      </div>
    );
  if (isError)
    return (
      <div className="flex flex-col items-center justify-center py-24 text-lg font-semibold text-red-600 gap-3">
        <AlertTriangle className="w-8 h-8" />
        Failed to load jobs. Please try again later.
      </div>
    );

  const getJobApplicationStatus = (jobId: string) =>
    applicationStatusMap.get(jobId) || null;

  return (
    <section id="jobs" className="bg-gray-50 flex-grow">
      <div className="max-w-screen-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            Find Your Next Opportunity
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Explore thousands of teaching jobs from top institutions.
          </p>
        </div>
        <div className="max-w-xl mx-auto mb-8">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"/>
                <Input 
                    placeholder="Search by job title or school name..."
                    className="h-12 pl-12"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5 xl:col-span-4 space-y-4">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <JobListItem
                  key={job._id}
                  job={job}
                  isSelected={selectedJob?._id === job._id}
                  onClick={() => setSelectedJob(job)}
                  applicationStatus={getJobApplicationStatus(job._id)}
                />
              ))
            ) : (
              <div className="text-center text-gray-500 py-10 bg-white rounded-lg border">
                <p className="font-semibold">No Jobs Found</p>
                <p className="text-sm">Try adjusting your search term.</p>
              </div>
            )}
          </div>
          <div className="hidden lg:block lg:col-span-7 xl:col-span-8 sticky top-24 h-fit">
            {selectedJob ? (
              <NewJobDetails
                job={selectedJob}
                applicationStatus={getJobApplicationStatus(selectedJob._id)}
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-white rounded-xl border-2 border-dashed border-gray-300 py-40">
                <p className="text-gray-500 text-lg">
                  Select a job to see details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const BrowseJobsPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow">
        <JobSearchSection />
      </main>
      <Footer />
    </div>
  );
};

export default BrowseJobsPage;