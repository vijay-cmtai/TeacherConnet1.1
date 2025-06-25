import React from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  useGetPressArticleByIdQuery,
  useGetAllPressArticlesQuery,
  PressArticle,
} from "@/features/admin/adminApiService";
import {
  Calendar,
  Newspaper,
  ArrowLeft,
  Loader2,
  Twitter,
  Facebook,
  Linkedin,
} from "lucide-react";

// Enhanced Related Article Card
const RelatedArticleCard = ({ article }: { article: PressArticle }) => (
  <Link
    to={`/press/${article.id}`}
    className="block group bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
  >
    <div className="overflow-hidden rounded-t-lg">
      <img
        src={article.imageUrl}
        alt={article.title}
        className="w-full h-40 object-cover transform transition-transform duration-500 ease-in-out group-hover:scale-110"
      />
    </div>
    <div className="p-4">
      <h4 className="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors line-clamp-2">
        {article.title}
      </h4>
      <p className="text-xs text-gray-500 mt-2">{article.publication}</p>
    </div>
  </Link>
);

const PressArticleDetailsPage = () => {
  const { articleId } = useParams<{ articleId: string }>();

  const {
    data: article,
    isLoading,
    isError,
  } = useGetPressArticleByIdQuery(articleId!);
  const { data: allArticles = [] } = useGetAllPressArticlesQuery();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (isError || !article) {
    return <Navigate to="/404" replace />;
  }

  const relatedArticles = allArticles
    .filter((a) => a.id !== article.id)
    .slice(0, 3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const pageUrl = window.location.href;
  const shareText = `Check out this article: ${article.title}`;

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <main className="py-12 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link
              to="/press"
              className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-800 group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
              Back to All Articles
            </Link>
          </div>

          <article className="bg-white p-6 sm:p-10 rounded-xl shadow-xl animate-fade-in">
            <header className="text-center mb-10">
              <p className="text-base font-semibold text-indigo-600 tracking-wide uppercase">
                {article.publication}
              </p>
              <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                {article.title}
              </h1>
              <div className="mt-6 flex justify-center items-center gap-x-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{formatDate(article.date)}</span>
                </div>
              </div>
            </header>

            <figure className="my-12">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-2xl"
              />
            </figure>

            <div className="prose prose-lg lg:prose-xl max-w-none text-gray-700 leading-relaxed space-y-6">
              {article.fullContent?.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <footer className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="font-semibold text-gray-700">
                  Share this article:
                </span>
                <div className="flex items-center gap-4">
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-blue-500 transition-colors"
                  >
                    <Twitter className="h-6 w-6" />
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-blue-700 transition-colors"
                  >
                    <Facebook className="h-6 w-6" />
                  </a>
                  <a
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(pageUrl)}&title=${encodeURIComponent(article.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <Linkedin className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </footer>
          </article>

          {relatedArticles.length > 0 && (
            <section className="mt-20 pt-16 border-t-2 border-dashed border-gray-300">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                You Might Also Like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedArticles.map((related) => (
                  <RelatedArticleCard key={related.id} article={related} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PressArticleDetailsPage;
