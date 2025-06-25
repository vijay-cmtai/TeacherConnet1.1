// File: src/pages/ResourcesPage.tsx

import React, { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Menu, X } from "lucide-react";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useGetAllResourcesQuery } from "@/features/admin/adminApiService"; // [STEP 1] Import the RTK Query hook

// [STEP 2] Define a TypeScript interface for the data coming from your backend
interface IResource {
  _id: string;
  category: string;
  title: string;
  content: string;
  imageUrl: string;
  readTime: number;
  isFeatured: boolean;
  createdAt: string;
}

// --- PLACEHOLDER COMPONENTS (These can remain as they are) ---
const EmployerHeader = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navLinks = [
    { href: "/post-job", label: "Post a Job" },
    { href: "/products", label: "Products" },
    { href: "/resources", label: "Resources" },
  ];
  return (
    <header className="bg-[#2d2d2d] text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold tracking-wider">
              TeacherConnect
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 text-sm rounded-full transition-colors ${
                  currentPath === link.href
                    ? "font-semibold text-white bg-white/10"
                    : "font-medium text-gray-300 hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="hidden md:flex items-center">
            <Link
              to="/"
              className="text-sm font-medium text-gray-300 hover:text-white"
            >
              For Jobseekers
            </Link>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white p-2"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
const ResourcesNav = ({
  items,
  activeItem,
  onItemClick,
}: {
  items: string[];
  activeItem: string;
  onItemClick: (item: string) => void;
}) => {
  return (
    <div className="sticky top-16 z-40 bg-white/80 backdrop-blur-lg border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 sm:gap-4 overflow-x-auto h-14">
          {items.map((item) => (
            <button
              key={item}
              onClick={() => onItemClick(item)}
              className={`flex-shrink-0 px-3 py-2 text-sm font-semibold h-full flex items-center border-b-2 transition-all duration-200 ${activeItem === item ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-600 hover:text-indigo-600 hover:border-indigo-300"}`}
            >
              {item}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};
const FeaturedResourceCard = ({ resource }: { resource: any }) => (
  <Link
    to={resource.path}
    className="group block md:grid md:grid-cols-2 md:gap-12 items-center"
  >
    <div className="overflow-hidden rounded-2xl">
      <img
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        src={resource.imageUrl}
        alt={resource.title}
      />
    </div>
    <div className="mt-6 md:mt-0">
      <p className="text-sm font-bold text-indigo-600 uppercase tracking-wider">
        {resource.category}
      </p>
      <h2 className="mt-3 text-3xl font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
        {resource.title}
      </h2>
      <p className="mt-4 text-lg text-slate-600 leading-relaxed">
        {resource.description}
      </p>
      <Button
        asChild
        variant="link"
        className="p-0 h-auto text-indigo-600 font-semibold group mt-6 text-md"
      >
        <span>
          Read Article
          <ArrowRight className="inline-block w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
        </span>
      </Button>
    </div>
  </Link>
);
const ResourceCard = ({ resource }: { resource: any }) => (
  <Link
    to={resource.path}
    className="group flex flex-col h-full bg-white rounded-2xl shadow-md overflow-hidden border border-slate-200 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300"
  >
    <div className="overflow-hidden">
      <img
        className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-500"
        src={resource.imageUrl}
        alt={resource.title}
      />
    </div>
    <div className="p-6 flex flex-col flex-grow">
      <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
        {resource.category}
      </p>
      <h3 className="mt-2 text-lg font-bold text-slate-800 flex-grow">
        {resource.title}
      </h3>
      <Button
        asChild
        variant="link"
        className="p-0 h-auto text-sm text-indigo-600 font-semibold group mt-4 justify-start"
      >
        <span>
          Read More
          <ArrowRight className="inline-block w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
        </span>
      </Button>
    </div>
  </Link>
);

// --- Main Page Component ---
const ResourcesPage = () => {
  const { data: apiResources, isLoading, isError } = useGetAllResourcesQuery();

  // [STEP 3] Transform the backend data into the format the frontend components need
  // useMemo prevents this logic from re-running on every render
  const resources = useMemo(() => {
    if (!apiResources) return [];

    return apiResources.map((res: IResource) => ({
      id: res._id,
      category: res.category,
      title: res.title,
      description:
        res.content?.replace(/<[^>]*>?/gm, "").substring(0, 150) + "..." ||
        "No description available.",
      imageUrl: res.imageUrl,
      path: `/resources/${res._id}`,
    }));
  }, [apiResources]);

  const navItems = [
    "All Resources",
    ...new Set(resources.map((r) => r.category)),
  ];
  const [activeFilter, setActiveFilter] = useState(navItems[0]);

  const filteredResources = useMemo(() => {
    if (activeFilter === "All Resources") return resources;
    return resources.filter((resource) => resource.category === activeFilter);
  }, [activeFilter, resources]);

  const featuredArticle = filteredResources[0];
  const otherArticles = filteredResources.slice(1);

  // [STEP 4] Handle loading and error states for a good user experience
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <h2 className="text-2xl font-semibold text-slate-700">
          Loading Resources...
        </h2>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <h2 className="text-2xl font-semibold text-red-600">
          Failed to load resources.
        </h2>
        <p className="text-slate-500">Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <EmployerHeader />
      <ResourcesNav
        items={navItems}
        activeItem={activeFilter}
        onItemClick={setActiveFilter}
      />

      <main>
        <section className="relative bg-gradient-to-br from-indigo-700 to-purple-800 text-white overflow-hidden">
          <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-white/10 rounded-full filter blur-3xl opacity-70"></div>
          <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-96 h-96 bg-white/10 rounded-full filter blur-3xl opacity-70"></div>
          <div className="relative z-10 max-w-4xl mx-auto text-center py-20 sm:py-24 px-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
              Employer Resource Library
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-indigo-200">
              Hiring made simple. Learn more about tools, hiring with
              TeacherConnect, trends, and more. It’s all here in our resource
              center.
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
          {filteredResources.length > 0 ? (
            <div className="space-y-20">
              {featuredArticle && (
                <section>
                  <FeaturedResourceCard resource={featuredArticle} />
                </section>
              )}
              {otherArticles.length > 0 && (
                <section>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {otherArticles.map((resource) => (
                      <ResourceCard key={resource.id} resource={resource} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-slate-700">
                No Resources Found
              </h3>
              <p className="text-slate-500 mt-2">
                There are currently no articles in the "{activeFilter}"
                category.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResourcesPage;