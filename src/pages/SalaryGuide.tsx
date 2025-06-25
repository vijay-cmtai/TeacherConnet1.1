import { Link } from "react-router-dom";
import { Briefcase, ArrowRight, Wallet, Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useGetAllSalaryGuidesQuery } from "@/features/admin/adminApiService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// --- TYPE DEFINITIONS ---
interface Career {
  _id: string;
  jobTitle: string;
  category: string;
  averageSalary: number;
  minSalary: number;
  maxSalary: number;
}

interface Theme {
  gradient: string;
  textColor: string;
  accentBg: string;
  borderColor: string;
}

// --- COLOR THEME MAPPING ---
const categoryThemes: { [key: string]: Theme } = {
  Technology: {
    gradient: "bg-gradient-to-br from-violet-500 to-purple-500",
    textColor: "text-violet-600",
    accentBg: "bg-violet-50",
    borderColor: "hover:border-violet-400",
  },
  Teacher: {
    gradient: "bg-gradient-to-br from-emerald-500 to-teal-500",
    textColor: "text-emerald-600",
    accentBg: "bg-emerald-50",
    borderColor: "hover:border-emerald-400",
  },
  Academics: {
    gradient: "bg-gradient-to-br from-sky-500 to-blue-500",
    textColor: "text-sky-600",
    accentBg: "bg-sky-50",
    borderColor: "hover:border-sky-400",
  },
  Default: {
    gradient: "bg-gradient-to-br from-slate-500 to-gray-600",
    textColor: "text-slate-600",
    accentBg: "bg-slate-100",
    borderColor: "hover:border-slate-400",
  },
};

// --- REUSABLE COMPONENTS ---
const SalaryGraph = () => (
  <div className="flex items-end gap-1.5 h-10">
    <div className="w-3 h-4 bg-indigo-200 rounded-t-sm"></div>
    <div className="w-3 h-8 bg-indigo-300 rounded-t-sm"></div>
    <div className="w-3 h-6 bg-indigo-200 rounded-t-sm"></div>
    <div className="w-3 h-10 bg-indigo-300 rounded-t-sm"></div>
  </div>
);

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-slate-200 animate-pulse overflow-hidden">
    <div className="p-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
        <div className="flex-1 space-y-2">
          <div className="h-5 w-3/4 bg-slate-200 rounded"></div>
          <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
        </div>
      </div>
    </div>
    <div className="bg-slate-100/70 p-6 space-y-2">
      <div className="h-4 w-1/3 bg-slate-200 rounded"></div>
      <div className="h-8 w-1/2 bg-slate-200 rounded-lg"></div>
    </div>
  </div>
);

const SalaryCard = ({
  career,
  theme = categoryThemes.Default,
}: {
  career: Career;
  theme?: Theme;
}) => (
  <Link to={`/career/${career._id}/salaries`} className="group block h-full">
    <div
      className={`bg-white rounded-2xl border border-slate-200/80 ${theme.borderColor} hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 h-full flex flex-col overflow-hidden`}
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg shadow-lg ${theme.gradient}`}>
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600">
              {career.jobTitle}
            </h3>
            <p className="text-sm text-slate-500">{career.category}</p>
          </div>
        </div>
      </div>
      <div
        className={`p-6 mt-auto border-t border-slate-200/60 ${theme.accentBg}`}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: theme.textColor }}
            >
              Average Salary
            </p>
            <p className="text-2xl font-extrabold text-slate-800">
              ₹{career.averageSalary.toLocaleString("en-IN")}
            </p>
          </div>
          <SalaryGraph />
        </div>
        <div
          className={`mt-4 font-semibold text-sm flex items-center gap-1.5 ${theme.textColor}`}
        >
          View Details{" "}
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  </Link>
);

// --- MAIN PAGE COMPONENT ---
const SalaryGuide = () => {
  const { data: response, isLoading, isError } = useGetAllSalaryGuidesQuery();
  const careers: Career[] | undefined = response?.data;

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-indigo-700 via-purple-800 to-indigo-800 text-white overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 25px 25px, white 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          ></div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 md:py-28">
            <div className="inline-block p-4 bg-white/10 backdrop-blur-sm rounded-2xl mb-6 border border-white/20">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
              Discover Your Earning Potential
            </h1>
            <p className="text-lg md:text-xl text-indigo-200 max-w-3xl mx-auto">
              Compare salaries for thousands of jobs and take the next step in
              your career.
            </p>
            <form className="mt-10 max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  placeholder="Search job title..."
                  className="h-14 pl-14 text-md bg-white/10 text-white placeholder:text-indigo-200 rounded-full border-2 border-white/20 focus:ring-2 focus:ring-white/50"
                />
                <Button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-11 rounded-full px-6 font-semibold bg-white text-indigo-700 hover:bg-slate-100"
                >
                  Search
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Popular Job Profiles
            </h2>
            <p className="text-md text-slate-500 mt-2">
              Browse average salaries by job role in your industry.
            </p>
          </div>

          {isError && (
            <div className="text-center p-8 bg-red-50 rounded-lg">
              <p className="font-semibold text-red-600">Something went wrong</p>
              <p className="text-red-500 mt-1">
                Failed to load salary data. Please try again later.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading &&
              Array.from({ length: 6 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}

            {careers &&
              careers.length > 0 &&
              careers.map((career) => {
                const theme =
                  categoryThemes[career.category] || categoryThemes.Default;
                return (
                  <SalaryCard key={career._id} career={career} theme={theme} />
                );
              })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SalaryGuide;