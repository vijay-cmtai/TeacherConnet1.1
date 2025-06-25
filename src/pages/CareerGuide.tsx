import { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ChevronDown,
  Briefcase,
  FileText,
  MessageSquare,
  ArrowRight,
  Rocket,
} from "lucide-react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useGetAllCareerArticlesQuery } from "@/features/admin/adminApiService";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

const ArticleCard = ({ article }: { article: any }) => (
  <Link
    to={`/career-guide/${article.slug}`}
    className="group bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200/80 hover:border-violet-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
  >
    <div className="relative overflow-hidden">
      <img
        src={article?.image?.url}
        alt={article.title}
        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
    <div className="p-6 flex flex-col flex-grow">
      <p className="text-sm font-semibold text-violet-600 mb-2">
        {article.category}
      </p>
      <h3 className="text-lg font-bold text-gray-900 mb-2 text-left">
        {article.title}
      </h3>
      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4 text-left flex-grow">
        {article.summary}
      </p>
      <div className="font-semibold text-violet-600 flex items-center justify-start gap-1.5 text-sm transition-colors group-hover:text-violet-700">
        Read Article
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </div>
    </div>
  </Link>
);

const ArticleCardSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200/80">
    <Skeleton className="h-48 w-full" />
    <div className="p-6">
      <Skeleton className="h-4 w-24 mb-3" />
      <Skeleton className="h-6 w-full mb-2" />
      <Skeleton className="h-6 w-5/6 mb-4" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  </div>
);

const CategorySection = ({
  title,
  articles,
  categoryId,
  subtitle,
  theme,
  onExploreClick,
}: {
  title: string;
  articles: any[];
  categoryId: string;
  subtitle: string;
  theme: any;
  onExploreClick: (categoryId: string) => void;
}) => (
  <div className="py-16 sm:py-20 relative overflow-hidden">
    <div
      className="absolute -inset-x-32 -top-48 -bottom-32 transform-gpu overflow-hidden blur-3xl"
      aria-hidden="true"
    >
      <div
        className={`relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] ${theme.bgGradient} opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]`}
      ></div>
    </div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <div className="text-left md:text-center max-w-3xl mx-auto">
        <h2
          className={`text-4xl font-extrabold tracking-tight sm:text-5xl ${theme.textColor}`}
        >
          {title}
        </h2>
        <p className={`mt-4 text-lg max-w-2xl mx-auto ${theme.subtitleColor}`}>
          {subtitle}
        </p>
      </div>
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.length > 0 ? (
          articles
            .slice(0, 3)
            .map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))
        ) : (
          <div className="col-span-full mt-16 text-center text-gray-500 italic">
            No articles yet for this category.
          </div>
        )}
      </div>
      <div className="mt-16 text-center">
        <button
          onClick={() => onExploreClick(categoryId)}
          className={`inline-block text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${theme.buttonClasses}`}
        >
          Explore All {title} Articles
        </button>
      </div>
    </div>
  </div>
);

const CareerGuideHero = ({
  themes,
  onExploreClick,
}: {
  themes: any[];
  onExploreClick: (id: string) => void;
}) => (
  <section className="bg-gradient-to-b from-slate-50 to-violet-50 py-16 sm:py-20">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
        Career Advancement Hub
      </h1>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
        Your one-stop destination for career advice, resume tips, and interview
        strategies.
      </p>
      <form className="mt-8 max-w-xl mx-auto">
        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <Input
            placeholder="Search for articles..."
            className="h-14 pl-14 w-full text-md bg-white rounded-full border-2 border-slate-200/80 shadow-lg focus:ring-2 focus:ring-violet-400"
          />
        </div>
      </form>
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onExploreClick(theme.id)}
            className="group flex items-center justify-center gap-2 bg-white px-4 py-3 rounded-full border border-slate-200/80 shadow-sm hover:shadow-lg hover:border-violet-300 transition-all"
          >
            {theme.icon}
            <span className="font-semibold text-slate-700 group-hover:text-slate-900 text-sm">
              {theme.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  </section>
);

const CareerGuidePage = () => {
  const [activeTab, setActiveTab] = useState("career-guide");
  const [activeSubTab, setActiveSubTab] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const lastScrollY = useRef(0);
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrollingUp(currentScrollY <= 100 || currentScrollY < lastScrollY.current);
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { data: response, isLoading, isError } = useGetAllCareerArticlesQuery();
  const articlesByCategory = useMemo(() => {
    if (!response?.data) return {};
    return response.data.reduce(
      (acc: { [key: string]: any[] }, article: any) => {
        const { category } = article;
        if (!acc[category]) acc[category] = [];
        acc[category].push(article);
        return acc;
      },
      {}
    );
  }, [response]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node))
        setOpenDropdown(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const mainNav = [
    { id: "finding-a-job", label: "Finding a Job" },
    {
      id: "resumes-cover-letters",
      label: "Resumes & Letters",
      subTabs: [
        { id: "resumes-cover-letters", label: "Resume & Cover Letter Advice" },
        { id: "resume-samples", label: "Resume Samples" },
        { id: "cover-letter-samples", label: "Cover Letter Samples" },
      ],
    },
    { id: "interviewing", label: "Interviewing" },
    { id: "pay-salary", label: "Pay & Salary" },
    {
      id: "career-development",
      label: "Career Development",
      subTabs: [
        { id: "career-development", label: "Career Development Advice" },
        { id: "starting-a-new-job", label: "Starting a New Job" },
      ],
    },
  ];

  const pageData: {
    [key: string]: { title: string; subtitle: string; categoryKey?: string };
  } = {
    "career-guide": { title: "Career Guide", subtitle: "Your one-stop resource for career advice." },
    "finding-a-job": { title: "Finding a Job", subtitle: "Career ideas and guidance to pick the right role for you." },
    "resumes-cover-letters": { title: "Resumes & Cover Letters", subtitle: "Professional templates and examples to create standout applications." },
    "resume-samples": { title: "Resume Samples", subtitle: "Browse our selection of resume samples to get started.", categoryKey: "Resume Sample" },
    "cover-letter-samples": { title: "Cover Letter Samples", subtitle: "Find inspiration for your own cover letter with our professional samples.", categoryKey: "Cover Letter Sample" },
    "interviewing": { title: "Interviewing", subtitle: "Common questions, answers and advice to help you prepare." },
    "pay-salary": { title: "Pay & Salary", subtitle: "Data and tips for talking about money at work." },
    "career-development": { title: "Career Development", subtitle: "Skills and steps to take your career to the next level." },
    "starting-a-new-job": { title: "Starting a New Job", subtitle: "Best practices to make a strong impression and transition smoothly." },
  };

  const handleTabClick = (tabId: string, subTabId: string | null = null) => {
    setActiveTab(tabId);
    const targetTab = mainNav.find((t) => t.id === tabId);
    if (subTabId) setActiveSubTab(subTabId);
    else if (targetTab?.subTabs) setActiveSubTab(targetTab.subTabs[0].id);
    else setActiveSubTab(null);
    setOpenDropdown(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    handleTabClick("career-guide");
  };
  const handleDropdownToggle = (tabId: string) => setOpenDropdown(openDropdown === tabId ? null : tabId);
  const handleSubTabClick = (e: React.MouseEvent, tabId: string, subTabId: string) => {
    e.preventDefault();
    e.stopPropagation();
    handleTabClick(tabId, subTabId);
  };

  const homePageThemes = [
    { id: "finding-a-job", title: "Job Hunting", icon: <Briefcase size={20} className="text-slate-500 group-hover:text-violet-600" /> },
    { id: "resumes-cover-letters", title: "Resumes", icon: <FileText size={20} className="text-slate-500 group-hover:text-emerald-600" /> },
    { id: "interviewing", title: "Interviewing", icon: <MessageSquare size={20} className="text-slate-500 group-hover:text-sky-600" /> },
    { id: "career-development", title: "Growth", icon: <Rocket size={20} className="text-slate-500 group-hover:text-indigo-600" /> },
  ];

  const renderHomePage = () => {
    const homePageCategories = [
      { id: "finding-a-job", categoryName: "Finding a Job", theme: { textColor: "text-violet-800", subtitleColor: "text-violet-700/90", bgGradient: "from-purple-100 to-violet-100", buttonClasses: "bg-violet-600 hover:bg-violet-700 shadow-violet-500/50" } },
      { id: "resumes-cover-letters", categoryName: "Resumes & Cover Letters", theme: { textColor: "text-emerald-800", subtitleColor: "text-emerald-700/90", bgGradient: "from-green-100 to-teal-100", buttonClasses: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/50" } },
      { id: "interviewing", categoryName: "Interviewing", theme: { textColor: "text-sky-800", subtitleColor: "text-sky-700/90", bgGradient: "from-cyan-100 to-blue-100", buttonClasses: "bg-sky-600 hover:bg-sky-700 shadow-sky-500/50" } },
    ];
    return (
      <>
        <CareerGuideHero themes={homePageThemes} onExploreClick={handleTabClick} />
        <div className="bg-slate-50">
          {homePageCategories.map((cat) => {
            const categoryData = pageData[cat.id] || { title: "", subtitle: "" };
            return (
              <div key={cat.id}>
                <CategorySection
                  title={categoryData.title}
                  subtitle={categoryData.subtitle}
                  articles={isLoading ? [] : articlesByCategory[cat.categoryName] || []}
                  categoryId={cat.id}
                  theme={cat.theme}
                  onExploreClick={handleTabClick}
                />
              </div>
            );
          })}
        </div>
      </>
    );
  };

  const renderContentPage = () => {
    const currentContentKey = activeSubTab || activeTab;
    const currentContentData = pageData[currentContentKey] || { title: "", subtitle: "" };
    const categoryToFilter = currentContentData.categoryKey || currentContentData.title;
    const articlesForCurrentTab = articlesByCategory[categoryToFilter] || [];
    return (
      <div className="bg-gray-50 min-h-[60vh]">
        <div className="bg-white border-b border-gray-200">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mt-3">{currentContentData.title}</h1>
            {currentContentData.subtitle && <p className="text-lg text-gray-600 max-w-4xl mt-2">{currentContentData.subtitle}</p>}
          </main>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => <ArticleCardSkeleton key={i} />)}
            </div>
          ) : isError ? (
            <p className="text-center text-red-500 py-20 font-semibold">Failed to load articles.</p>
          ) : articlesForCurrentTab.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articlesForCurrentTab.map((article) => <ArticleCard key={article._id} article={article} />)}
            </div>
          ) : (
            <p className="text-gray-600 md:col-span-3 text-center h-40 flex items-center justify-center">No articles found for this category yet.</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white min-h-screen font-sans flex flex-col">
      <div className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${isScrollingUp ? "translate-y-0" : "-translate-y-full"}`}>
        <Header />
      </div>
      <div className="flex-grow pt-16">
        <div className={`sticky z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 transition-all duration-300 ${isScrollingUp ? "top-16" : "top-0"}`} ref={navRef}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <a href="#" onClick={handleLogoClick} className="mr-8 py-4">
                <span className="font-bold text-gray-800 text-lg">Career Guide</span>
              </a>
              <nav className="hidden md:flex items-center space-x-2">
                {mainNav.map((tab) => (
                  <div key={tab.id} className="relative">
                    <button onClick={() => tab.subTabs ? handleDropdownToggle(tab.id) : handleTabClick(tab.id)} className={`flex items-center text-sm font-semibold px-4 py-5 transition-colors duration-200 ${activeTab === tab.id ? "text-violet-600" : "text-gray-600 hover:text-gray-900"}`}>
                      {tab.label}
                      {tab.subTabs && <ChevronDown className={`w-5 h-5 ml-1.5 transition-transform duration-200 ${openDropdown === tab.id ? "rotate-180" : ""}`} />}
                    </button>
                    {tab.subTabs && openDropdown === tab.id && (
                      <div className="absolute left-0 mt-1 w-64 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200 animate-in fade-in-20 zoom-in-95">
                        {tab.subTabs.map((subTab) => (
                          <a key={subTab.id} href="#" onClick={(e) => handleSubTabClick(e, tab.id, subTab.id)} className={`block w-full text-left px-4 py-2.5 text-sm transition-colors ${activeSubTab === subTab.id ? "font-semibold text-violet-600 bg-violet-50" : "text-gray-700"} hover:bg-gray-100`}>
                            {subTab.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </div>
        </div>
        {activeTab === "career-guide" ? renderHomePage() : renderContentPage()}
      </div>
      <Footer />
    </div>
  );
};

export default CareerGuidePage;