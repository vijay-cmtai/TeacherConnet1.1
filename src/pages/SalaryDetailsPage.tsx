import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  Settings,
  DollarSign,
  BrainCircuit,
  Search,
  TrendingUp,
  Sun,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetSalaryGuideByIdQuery } from "@/features/admin/adminApiService";

// --- REUSABLE UI COMPONENTS ---

const IconWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) => (
  <div
    className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${className}`}
  >
    {children}
  </div>
);

const InfoCard = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <Card className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
    <CardHeader className="flex flex-row items-center gap-4 space-y-0">
      {icon}
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const SalaryBar = ({
  low,
  high,
  avg,
}: {
  low: number;
  high: number;
  avg: number;
}) => {
  const percentage = high > low ? ((avg - low) / (high - low)) * 100 : 50;
  const formatCurrency = (value: number) => `₹${(value / 100000).toFixed(1)}L`;
  return (
    <div className="w-full">
      <div className="relative h-2.5 bg-slate-200 rounded-full">
        <div
          className="absolute h-full rounded-full bg-indigo-600"
          style={{ width: `${percentage}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-5 w-5 bg-white rounded-full border-4 border-indigo-600 ring-2 ring-white"
          style={{ left: `calc(${percentage}% - 10px)` }}
        />
      </div>
      <div className="flex justify-between mt-3 text-sm font-medium text-slate-500">
        <span>{formatCurrency(low)}</span>
        <span className="font-bold text-slate-800">{formatCurrency(avg)}</span>
        <span>{formatCurrency(high)}</span>
      </div>
    </div>
  );
};

const SalaryDetailsPage = () => {
  const { careerPath: id } = useParams<{ careerPath: string }>();
  const {
    data: response,
    isLoading,
    isError,
  } = useGetSalaryGuideByIdQuery(id!, { skip: !id });
  const jobDataFromApi = response?.data;

  // Loading & Error States
  if (isLoading || isError) {
    const message = isLoading ? "Loading Job Details..." : "Details Not Found";
    return (
      <div className="bg-white min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center text-center px-4">
          <div>
            <p
              className={`text-xl text-slate-600 ${isLoading && "animate-pulse"}`}
            >
              {message}
            </p>
            {isError && (
              <Button asChild className="mt-6">
                <Link to="/salary-guide">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Salary Guide
                </Link>
              </Button>
            )}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const jobData = {
    category: "N/A",
    jobTitle: "No Title",
    averageSalary: 0,
    salaryRange: { min: 0, max: 0 },
    jobDescription: "No description provided.",
    commonSkills: [],
    relatedProfiles: [],
    ...jobDataFromApi,
  };

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen font-sans">
      <Header />
      <main>
        {/* --- Hero Section --- */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
              <Link
                to="/salary-guide"
                className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Salary Guide
              </Link>
            </div>
            <div className="text-center">
              <p className="font-semibold text-indigo-600 mb-2">
                {jobData.category}
              </p>
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                {jobData.jobTitle}
              </h1>
              <p className="text-lg text-slate-600 mt-3">
                Average Salary in India
              </p>
              <p className="text-5xl font-bold text-indigo-600 mt-2">
                ₹{jobData.averageSalary.toLocaleString("en-IN")}
                <span className="text-xl font-normal text-slate-500">
                  {" "}
                  /year
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* --- Details Grid --- */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column (Main Details) */}
            <div className="lg:col-span-2 space-y-8">
              <InfoCard
                icon={
                  <IconWrapper className="bg-indigo-100">
                    <DollarSign className="text-indigo-600" />
                  </IconWrapper>
                }
                title="Salary Range"
              >
                <p className="text-slate-600 mb-6 text-sm">
                  Salaries for a {jobData.jobTitle} can range from ~₹
                  {jobData.salaryRange.min.toLocaleString("en-IN")} to ~₹
                  {jobData.salaryRange.max.toLocaleString("en-IN")} per year.
                </p>
                <SalaryBar
                  low={jobData.salaryRange.min}
                  high={jobData.salaryRange.max}
                  avg={jobData.averageSalary}
                />
              </InfoCard>

              <InfoCard
                icon={
                  <IconWrapper className="bg-indigo-100">
                    <Briefcase className="text-indigo-600" />
                  </IconWrapper>
                }
                title="Job Description"
              >
                <p className="text-slate-600 leading-relaxed text-sm">
                  {jobData.jobDescription}
                </p>
              </InfoCard>

              <InfoCard
                icon={
                  <IconWrapper className="bg-emerald-100">
                    <BrainCircuit className="text-emerald-600" />
                  </IconWrapper>
                }
                title="Common Skills"
              >
                <div className="flex flex-wrap gap-2">
                  {jobData.commonSkills.length > 0 ? (
                    jobData.commonSkills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-full"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-slate-500 text-sm">
                      No specific skills listed.
                    </p>
                  )}
                </div>
              </InfoCard>

              <InfoCard
                icon={
                  <IconWrapper className="bg-amber-100">
                    <TrendingUp className="text-amber-600" />
                  </IconWrapper>
                }
                title="Career Outlook"
              >
                <p className="text-slate-600 leading-relaxed text-sm">
                  The demand for skilled {jobData.jobTitle}s continues to grow,
                  with opportunities for advancement into senior roles.
                  Continuous learning and specialization are key to long-term
                  success.
                </p>
              </InfoCard>
            </div>

            {/* Right Column (Actions and Related Info) */}
            <div className="lg:col-span-1 space-y-8">
              <div className="relative bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-2xl shadow-2xl shadow-indigo-500/30 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <IconWrapper className="bg-white/20">
                    <Search className="text-white" />
                  </IconWrapper>
                  <h3 className="text-xl font-bold">Find Your Next Job</h3>
                </div>
                <p className="text-indigo-200 mb-4 text-sm">
                  Ready to take the next step? Find open positions for{" "}
                  {jobData.jobTitle} roles.
                </p>
                <Button className="w-full bg-white hover:bg-slate-100 text-indigo-600 font-bold">
                  Search {jobData.jobTitle} Jobs
                </Button>
              </div>

              {jobData.relatedProfiles.length > 0 && (
                <InfoCard
                  icon={
                    <IconWrapper className="bg-slate-100">
                      <Settings className="text-slate-600" />
                    </IconWrapper>
                  }
                  title="Related Profiles"
                >
                  <ul className="space-y-3">
                    {jobData.relatedProfiles.map((job: any) => (
                      <li key={job._id}>
                        <Link
                          to={`/career/${job._id}/salaries`}
                          className="font-semibold text-slate-700 hover:text-indigo-600 hover:underline"
                        >
                          {job.jobTitle}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </InfoCard>
              )}

              <InfoCard
                icon={
                  <IconWrapper className="bg-sky-100">
                    <Sun className="text-sky-600" />
                  </IconWrapper>
                }
                title="A Day in the Life"
              >
                <ul className="space-y-2 text-slate-600 list-disc list-inside text-sm">
                  <li>Collaborating with team on project planning.</li>
                  <li>Writing and testing code for new features.</li>
                  <li>Debugging and resolving technical issues.</li>
                  <li>Participating in code reviews for quality.</li>
                </ul>
              </InfoCard>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SalaryDetailsPage;