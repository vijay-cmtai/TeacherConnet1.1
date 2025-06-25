
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowRight, Loader2, AlertTriangle } from 'lucide-react';
import { useGetAllPressArticlesQuery, PressArticle } from '@/features/admin/adminApiService';

// Enhanced Article Card Component
const ArticleCard = ({ article, index }: { article: PressArticle, index: number }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    // Staggered fade-in animation for each card
    <div 
      className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="overflow-hidden">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-56 object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-4">
          <p className="text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-500 text-transparent bg-clip-text">
            {article.publication}
          </p>
          <p className="text-xs text-gray-500 mt-1">{formatDate(article.date)}</p>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3 flex-grow">
          {article.title}
        </h3>
        <p className="text-gray-600 leading-relaxed text-sm mb-6">
          {article.snippet}
        </p>
        <Link
          to={`/press/${article.id}`}
          className="mt-auto inline-flex items-center text-indigo-600 font-semibold group"
        >
          Read Full Article
          <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

// Main Press Page with Enhanced UI
const PressPage = () => {
  const { data: articles = [], isLoading, isError } = useGetAllPressArticlesQuery();

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main>
        <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
          {/* Animated Hero Section */}
          <div className="text-center mb-20 animate-fade-in">
            <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight">
              In The News
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto" style={{ animationDelay: '200ms' }}>
              See what the world is saying about our work to revolutionize education.
            </p>
          </div>

          {/* Conditional Rendering for Loading/Error/Data states */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
              <p className="mt-4 text-lg">Loading Articles...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-20 bg-red-50 p-8 rounded-lg">
              <AlertTriangle className="mx-auto h-12 w-12 text-red-400" />
              <h3 className="mt-2 text-xl font-semibold text-red-800">Failed to Load Articles</h3>
              <p className="mt-1 text-red-700">Please try again later or contact support.</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-gray-500">
                No articles have been published yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {articles.map((article, index) => (
                <ArticleCard key={article.id} article={article} index={index} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PressPage;