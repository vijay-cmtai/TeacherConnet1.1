import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  User,
  Share2,
  Linkedin,
  Twitter,
  Facebook,
  CheckCircle,
} from "lucide-react";
import {
  useGetArticleBySlugQuery,
  useGetAllCareerArticlesQuery,
} from "@/features/admin/adminApiService";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const RenderHTML = ({ htmlContent }: { htmlContent: string }) => {
  return (
    <div
      className="prose prose-lg max-w-none prose-h1:text-3xl prose-h2:font-semibold prose-h2:text-2xl prose-p:leading-relaxed prose-li:my-2 prose-a:text-violet-600 hover:prose-a:text-violet-800"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

const RelatedArticleCard = ({ article }: { article: any }) => (
  <Link
    to={`/career-guide/${article.slug}`}
    className="block group bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200 hover:border-violet-400 hover:shadow-violet-200 transition-all duration-300"
  >
    <img
      src={article?.image?.url}
      alt={article.title}
      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
    />
    <div className="p-6">
      <p className="text-sm font-semibold text-violet-600">{article.category}</p>
      <h3 className="text-xl font-bold text-gray-800 mt-2 group-hover:text-violet-700">
        {article.title}
      </h3>
      <p className="text-gray-600 mt-2 line-clamp-2">{article.summary}</p>
    </div>
  </Link>
);

const ArticleDetailsPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const {
    data: response,
    isLoading: isLoadingArticle,
    isError,
  } = useGetArticleBySlugQuery(slug!, { skip: !slug });
  const articleFromApi = response?.data;

  const { data: allArticlesResponse } = useGetAllCareerArticlesQuery();

  if (isLoadingArticle) {
    return (
      <div className="bg-white min-h-screen">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-6" />
            <Skeleton className="w-full h-96 rounded-xl mb-8" />
            <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isError || !articleFromApi) {
    return (
      <div className="bg-white min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-3xl font-bold mb-4 text-gray-800">
              Article Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              We're sorry, but the page you are looking for does not exist.
            </p>
            <Link to="/career-guide">
              <Button className="bg-violet-600 hover:bg-violet-700">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Career Guide
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const article = {
    category: "Uncategorized",
    title: "Untitled Article",
    author: "Career Expert",
    createdAt: new Date().toISOString(),
    content: "<p>No content available.</p>",
    summary: "No summary available.",
    image: { url: 'https://via.placeholder.com/1200x600', public_id: ''},
    ...articleFromApi,
  };

  const relatedArticles =
    allArticlesResponse?.data
      ?.filter((a) => a.slug !== slug && a.category === article.category)
      .slice(0, 2) || [];

  const shareUrl = window.location.href;
  const shareTitle = encodeURIComponent(article.title);

  return (
    <div className="bg-slate-50 min-h-screen">
      <Header />

      <main className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <Link
                    to="/career-guide"
                    className="inline-flex items-center gap-2 text-gray-700 hover:text-violet-700 font-semibold transition-colors"
                    >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Career Guide
                    </Link>
                </div>

                <p className="text-base font-bold text-violet-600 uppercase tracking-wider">
                    {article.category}
                </p>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-3 tracking-tight">
                    {article.title}
                </h1>
                <div className="flex items-center flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 mt-6 border-b pb-8 mb-8">
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>By {article.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>
                        Published on{" "}
                        {new Date(article.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                        </span>
                    </div>
                </div>

                <div className="mb-10">
                    <img src={article.image.url} alt={article.title} className="w-full h-auto max-h-[500px] object-cover rounded-2xl shadow-xl" />
                </div>
            </div>


          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 max-w-7xl mx-auto">
            <article className="lg:col-span-8 bg-white p-8 sm:p-10 rounded-2xl shadow-lg border border-gray-200">
              <p className="text-lg text-gray-600 italic mb-8 border-l-4 border-violet-300 pl-4">
                {article.summary}
              </p>
              <RenderHTML htmlContent={article.content} />
            </article>

            <aside className="lg:col-span-4 space-y-8">
              <div className="sticky top-24 space-y-8">
                <div className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-gray-200">
                  <h3 className="font-bold text-lg text-gray-900 mb-4 border-b pb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-violet-500" />
                    Key Takeaways
                  </h3>
                  <ul className="space-y-3 mt-4">
                    <li className="flex items-start">
                      <span className="text-violet-500 font-bold mt-1 mr-3">‣</span>
                      <span className="text-gray-700">Always tailor your application to the job.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-violet-500 font-bold mt-1 mr-3">‣</span>
                      <span className="text-gray-700">Quantify achievements with numbers.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-violet-500 font-bold mt-1 mr-3">‣</span>
                      <span className="text-gray-700">Networking is a continuous process.</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-gray-200">
                  <h3 className="font-bold text-lg text-gray-900 mb-4 border-b pb-3 flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-violet-500" />
                    Share this Article
                  </h3>
                  <div className="flex items-center gap-4 mt-4">
                    <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareTitle}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-700 transition-colors" aria-label="Share on LinkedIn"><Linkedin /></a>
                    <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-sky-500 transition-colors" aria-label="Share on Twitter"><Twitter /></a>
                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-800 transition-colors" aria-label="Share on Facebook"><Facebook /></a>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {relatedArticles && relatedArticles.length > 0 && (
            <div className="mt-20 pt-16 border-t border-gray-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                You might also like...
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedArticles.map((related) => (
                  <RelatedArticleCard key={related._id} article={related} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ArticleDetailsPage;