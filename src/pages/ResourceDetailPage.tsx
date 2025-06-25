// File: src/pages/ResourceDetailPage.tsx

import React from "react";
import { Link, useParams } from "react-router-dom";
import EmployerHeader from "@/components/EmployerHeader";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Twitter, Linkedin, Link2 } from "lucide-react";
// Your import path is correct, so we keep it.
import {
  useGetResourceByIdQuery,
  useGetAllResourcesQuery,
} from "@/features/admin/adminApiService";

// [STEP 1] Define the TypeScript interface at the top level.
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

// [STEP 2] Define the Sidebar component at the top level, OUTSIDE of the detail page component.
const Sidebar = ({ currentId }: { currentId: string }) => {
  const { data: allResources } = useGetAllResourcesQuery();

  const relatedResources = allResources
    ?.filter((r: IResource) => r._id !== currentId)
    .slice(0, 2);

  return (
    <aside className="sticky top-24 space-y-8">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80">
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          Share this article
        </h3>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="w-full">
            <Twitter className="w-5 h-5" />
          </Button>
          <Button variant="outline" size="icon" className="w-full">
            <Linkedin className="w-5 h-5" />
          </Button>
          <Button variant="outline" size="icon" className="w-full">
            <Link2 className="w-5 h-5" />
          </Button>
        </div>
      </div>
      {relatedResources && relatedResources.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Read Next</h3>
          <div className="space-y-4">
            {relatedResources.map((res: IResource) => (
              <Link
                to={`/resources/${res._id}`}
                key={res._id}
                className="group block"
              >
                <p className="font-semibold text-slate-800 group-hover:text-indigo-600">
                  {res.title}
                </p>
                <p className="text-sm text-slate-500">{res.category}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};

// Now, the main component is clean and follows React rules.
const ResourceDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: resource,
    isLoading,
    isError,
    error,
  } = useGetResourceByIdQuery(id!, {
    skip: !id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <h1 className="text-2xl font-bold">Loading Resource...</h1>
      </div>
    );
  }

  if (isError || !resource) {
    if (error) console.error("Error fetching resource:", error);
    return (
      <div className="bg-slate-50 min-h-screen">
        <EmployerHeader />
        <div className="flex flex-col items-center justify-center pt-20 text-center">
          <h1 className="text-4xl font-bold text-slate-800">
            Resource Not Found
          </h1>
          <p className="text-slate-500 mt-4 max-w-md">
            The article you are looking for does not exist or may have been
            moved. Please check the URL or return to the main resources page.
          </p>
          <Button asChild className="mt-8">
            <Link to="/resources">Back to Resources</Link>
          </Button>
        </div>
        <div className="absolute bottom-0 w-full">
          <Footer />
        </div>
      </div>
    );
  }

  const categoryColors: { [key: string]: string } = {
    "Hiring Guides": "bg-indigo-100 text-indigo-800",
    "Interview Tips": "bg-emerald-100 text-emerald-800",
    "Industry Insights": "bg-sky-100 text-sky-800",
    "Legal & Compliance": "bg-rose-100 text-rose-800",
    "Well-being": "bg-amber-100 text-amber-800",
  };
  const categoryClass =
    categoryColors[resource.category] || "bg-slate-100 text-slate-800";
  const formattedDate = new Date(resource.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      <EmployerHeader />
      <main>
        <section className="relative h-96 bg-slate-800">
          <img
            src={resource.imageUrl}
            alt={resource.title}
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          <div className="relative max-w-4xl mx-auto h-full flex flex-col justify-end py-12 px-4 sm:px-6 lg:px-8">
            <span
              className={`text-sm font-bold px-3 py-1 rounded-full self-start ${categoryClass}`}
            >
              {resource.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-4">
              {resource.title}
            </h1>
            <p className="text-lg text-slate-300 mt-2">
              Published on: {formattedDate} • {resource.readTime} min read
            </p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <article
              className="lg:col-span-2 prose prose-lg max-w-none prose-h2:font-bold prose-h2:text-slate-800 prose-a:text-indigo-600 hover:prose-a:text-indigo-800"
              dangerouslySetInnerHTML={{ __html: resource.content }}
            />
            <div className="lg-col-span-1">
              <Sidebar currentId={resource._id} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ResourceDetailPage;
