import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Zap,
  Building,
  ShieldCheck,
  Loader2,
  AlertTriangle,
  Search,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Interface definitions...
interface Job {
  _id: string;
  title: string;
  schoolName: string;
  location: string;
  salary: string;
  type: string;
  experienceLevel: string;
  isUrgent: boolean;
  description: string;
  responsibilities: string;
  requirements: string;
  tags: string[];
}
interface CarouselSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  primaryButton: { text: string; href: string };
  secondaryButton: { text: string; href: string };
  backgroundGradient: string;
  backgroundVideo?: string;
}
interface Testimonial {
  id: number;
  name: string;
  role: string;
  institution: string;
  content: string;
  rating: number;
  avatar: string;
}

// SLIDES ARRAY UPDATED WITH A VIDEO FOR EACH SLIDE
const slides: CarouselSlide[] = [
  {
    id: 1,
    title: "Find Your Dream Teaching Job",
    subtitle: "Connect with Excellence",
    description:
      "Connect with top schools and educational institutions. Discover opportunities that match your skills and passion for teaching.",
    primaryButton: { text: "Browse Jobs", href: "/browse-jobs" },
    secondaryButton: { text: "Sign Up Now", href: "/signup" },
    backgroundGradient: "from-indigo-700 to-purple-800",
    backgroundVideo:
      "https://videos.pexels.com/video-files/3209828/3209828-hd.mp4",
  },
  {
    id: 2,
    title: "Making Headlines in Education",
    subtitle: "In The Spotlight",
    description:
      "We're proud to be featured for our commitment to connecting exceptional educators with top institutions.",
    primaryButton: { text: "Read The Articles", href: "/press" },
    secondaryButton: { text: "Learn Our Mission", href: "/" },
    backgroundGradient: "from-slate-700 to-gray-800",
    backgroundVideo:
      "https://pixabay.com/videos/library-books-the-corridor-window-846",
  },
  {
    id: 3,
    title: "Shape Young Minds",
    subtitle: "Make a Difference",
    description:
      "Join prestigious educational institutions and be part of shaping the future. Find teaching positions that align with your expertise and values.",
    primaryButton: { text: "Explore Opportunities", href: "/browse-jobs" },
    secondaryButton: { text: "Join Today", href: "/signup" },
    backgroundGradient: "from-blue-700 to-indigo-800",
    backgroundVideo:
      "https://videos.pexels.com/video-files/855341/855341-hd.mp4",
  },
  {
    id: 4,
    title: "Advance Your Career",
    subtitle: "Grow with Purpose",
    description:
      "Take your teaching career to the next level. Connect with schools and institutes that value professional growth and educational excellence.",
    primaryButton: { text: "View Positions", href: "/jobs" },
    secondaryButton: { text: "Get Started", href: "/signup" },
    backgroundGradient: "from-purple-700 to-pink-800",
    backgroundVideo:
      "https://videos.pexels.com/video-files/4434253/4434253-hd.mp4",
  },
  {
    id: 5,
    title: "For Educational Institutions",
    subtitle: "Find Quality Educators",
    description:
      "Post your teaching positions and connect with qualified, passionate educators. Build your team with the best teaching talent available.",
    primaryButton: { text: "Post a Job", href: "/signup" },
    secondaryButton: { text: "Learn More", href: "/about" },
    backgroundGradient: "from-green-700 to-teal-800",
    backgroundVideo:
      "https://videos.pexels.com/video-files/5949887/5949887-hd.mp4",
  },
];

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Mathematics Teacher",
    institution: "Greenwood High School",
    content:
      "This platform helped me find my dream teaching position at an amazing school. The process was smooth and the support team was incredibly helpful throughout my job search journey.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Science Teacher",
    institution: "Riverside Academy",
    content:
      "As a school administrator, I've found exceptional teachers through this portal. The quality of candidates and the easy-to-use interface makes hiring so much more efficient.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "English Literature Teacher",
    institution: "Oakwood International School",
    content:
      "I was able to connect with multiple schools and found a position that perfectly matches my teaching philosophy. The detailed job descriptions really helped me make the right choice.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%D%3D&auto=format&fit=crop&w=1170&q=80",
  },
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    const interval = setInterval(
      () => setCurrentSlide((prev) => (prev + 1) % slides.length),
      5000
    );
    return () => clearInterval(interval);
  }, []);
  const currentSlideData = slides[currentSlide];

  return (
    <div className="relative overflow-hidden bg-gray-900 text-white">
      <div className="relative min-h-[600px] flex items-center justify-center">
        {currentSlideData.backgroundVideo && (
          <video
            key={currentSlideData.id}
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
            src={currentSlideData.backgroundVideo}
            autoPlay
            loop
            muted
            playsInline
          />
        )}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${currentSlideData.backgroundGradient} opacity-75 z-10`}
        />
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="mb-4">
            <span className="inline-block px-4 py-2 bg-white text-black font-bold bg-opacity-20 rounded-full text-md backdrop-blur-sm">
              {currentSlideData.subtitle}
            </span>
          </div>
          <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight drop-shadow-lg">
            {currentSlideData.title}
          </h1>
          <p className="mt-6 text-xl max-w-3xl mx-auto leading-relaxed opacity-90 drop-shadow-md">
            {currentSlideData.description}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={currentSlideData.primaryButton.href}
              className="px-8 py-4 border border-transparent text-base font-medium rounded-lg text-gray-900 bg-white hover:bg-gray-100 md:text-lg md:px-10 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              {currentSlideData.primaryButton.text}
            </Link>
            <Link
              to={currentSlideData.secondaryButton.href}
              className="px-8 py-4 border-2 border-white text-base font-medium rounded-lg text-white bg-transparent hover:bg-white hover:text-gray-900 md:text-lg md:px-10 transition-all duration-200 transform hover:scale-105"
            >
              {currentSlideData.secondaryButton.text}
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentSlide
                ? "bg-white scale-125"
                : "bg-white bg-opacity-50 hover:bg-opacity-75"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const NewJobDetails = ({
  job,
  applicationStatus,
}: {
  job: Job;
  applicationStatus: "applied" | "saved" | null;
}) => {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const currentUser = useAppSelector(selectCurrentUser);
  const [applyToJob, { isLoading: isApplying }] = useApplyToJobMutation();
  const [saveJob, { isLoading: isSaving }] = useSaveJobMutation();

  const handleAction = async (action: "apply" | "save") => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (currentUser?.role !== "employer") {
      toast.error(`Only teachers can ${action} for jobs.`);
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
      if (!selectedJob || !filteredJobs.some(job => job._id === selectedJob._id)) {
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
    <section id="jobs" className="bg-slate-50 border-y border-gray-200">
      <div className="max-w-screen-2xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Find Your Next Opportunity
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Explore thousands of teaching jobs from top institutions.
          </p>
          <div className="mt-8 max-w-lg mx-auto">
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
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5 xl:col-span-4 space-y-4 lg:h-[calc(100vh-200px)] lg:overflow-y-auto pr-4 custom-scrollbar">
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
          <div className="hidden lg:block lg:col-span-7 xl:col-span-8 lg:h-[calc(100vh-200px)] lg:overflow-y-auto pr-2 custom-scrollbar">
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

const HowWeWork = () => (
  <div className="bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How We Work
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Empowering teachers with transparency and trust.
            </p>
          </div>
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p className="text-lg">
              Our mission is not just to help teachers find jobs, but to support
              them in their journey from the first step to success. We believe
              in fair practices and long-term impact.
            </p>
            <p className="text-lg">
              That's why we do <strong>not charge any fees upfront</strong> from
              teachers. Once you are successfully placed and receive your{" "}
              <strong>first salary</strong>, only then we collect our service
              charges. This is what makes us stand out in the industry — we grow
              when you grow.
            </p>
          </div>
          <div className="pt-6">
            <Link
              to="/signup"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Join as a Teacher
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
        <div className="relative">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Teacher celebrating"
              className="w-full h-96 object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="bg-indigo-100 rounded-full p-3">
                <Check className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">100%</p>
                <p className="text-sm text-gray-600">
                  Upfront Fee-Free Placement
                </p>
              </div>
            </div>
          </div>
          <div className="absolute -top-6 -right-6 bg-green-500 text-white rounded-full p-4 shadow-lg">
            <div className="text-center">
              <p className="text-lg font-bold">1st Salary</p>
              <p className="text-xs">Then We Charge</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
const ForEmployers = () => (
  <div className="bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="relative lg:order-last">
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                For Employers
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Find the best talent for your institution.
              </p>
            </div>
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-lg">
                Our mission is to connect you with qualified and passionate
                educators who can make a real difference in your institution. We
                simplify the hiring process, saving you time and resources.
              </p>
              <p className="text-lg">
                We pre-screen candidates to ensure you only meet the most
                suitable professionals. Post your job openings and access a
                curated pool of talent ready to inspire your students.
              </p>
            </div>
            <div className="pt-6">
              <Link
                to="/post-job"
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Join as an Employer
                <svg
                  className="ml-2 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1573496130407-57329f01f769?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Employer reviewing candidates"
              className="w-full h-96 object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="bg-indigo-100 rounded-full p-3">
                <ShieldCheck className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">Quality</p>
                <p className="text-sm text-gray-600">Verified Candidates</p>
              </div>
            </div>
          </div>
          <div className="absolute -top-6 -right-6 bg-green-500 text-white rounded-full p-4 shadow-lg">
            <div className="text-center">
              <p className="text-lg font-bold">Efficient</p>
              <p className="text-xs">Hiring</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);
  const total = Math.ceil(testimonials.length / 3);
  useEffect(() => {
    const i = setInterval(() => setCurrent((p) => (p + 1) % total), 4000);
    return () => clearInterval(i);
  }, [total]);
  const renderStars = (r: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < r ? "text-yellow-400" : "text-gray-300"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            What Our Community Says
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Hear from teachers and institutions who have found success
          </p>
        </div>
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {Array.from({ length: total }, (_, i) => (
                <div key={i} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.slice(i * 3, i * 3 + 3).map((t) => (
                      <div
                        key={t.id}
                        className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                      >
                        <div className="flex items-center mb-4">
                          {renderStars(t.rating)}
                        </div>
                        <blockquote className="text-gray-700 mb-6">
                          “{t.content}”
                        </blockquote>
                        <div className="flex items-center">
                          <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                            <img
                              src={t.avatar}
                              alt={t.name}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {t.name}
                            </h4>
                            <p className="text-sm text-gray-600">{t.role}</p>
                            <p className="text-sm text-indigo-600">
                              {t.institution}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const StatsSection = () => (
  <div className="py-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center bg-indigo-600">
    <div>
      <div className="text-3xl font-bold text-white">500+</div>
      <div className="text-sm text-white mt-1">Teachers Placed</div>
    </div>
    <div>
      <div className="text-3xl font-bold text-white">200+</div>
      <div className="text-sm text-white mt-1">Partner Schools</div>
    </div>
    <div>
      <div className="text-3xl font-bold text-white">95%</div>
      <div className="text-sm text-white mt-1">Success Rate</div>
    </div>
    <div>
      <div className="text-3xl font-bold text-white">4.9/5</div>
      <div className="text-sm text-white mt-1">User Rating</div>
    </div>
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />
      <HeroCarousel />
      <HowWeWork />
      <ForEmployers />
      <JobSearchSection />
      <TestimonialsSection />
      <StatsSection />
      <Footer />
    </div>
  );
};
export default Index;