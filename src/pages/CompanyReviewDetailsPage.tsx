import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetReviewsByCollegeQuery } from '@/features/api/publicApiService';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, PenSquare, User, Calendar } from 'lucide-react';

const renderStars = (rating: number) => Array.from({ length: 5 }, (_, i) => <Star key={i} className={`w-5 h-5 ${i < rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}`} />);

const CompanyReviewDetailsPage = () => {
    const { collegeId } = useParams<{ collegeId: string }>();
    const { data, isLoading, isError } = useGetReviewsByCollegeQuery(collegeId!, { skip: !collegeId });

    if (isLoading) {
        return <div className="p-8"><Header /><div className="max-w-4xl mx-auto py-12"><Skeleton className="h-48 w-full" /><Skeleton className="mt-4 h-96 w-full" /></div><Footer /></div>;
    }

    if (isError || !data) {
        return <div className="min-h-screen"><Header /><div className="text-center py-20">Failed to load reviews. Please try again.</div><Footer /></div>;
    }

    const { college, reviews, stats } = data;

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />
            <main className="max-w-4xl mx-auto py-12 px-4">
                <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
                    <img src={college.logo?.url || `https://ui-avatars.com/api/?name=${college.name.charAt(0)}&background=random`} alt={`${college.name} logo`} className="w-24 h-24 rounded-lg border object-contain bg-white" />
                    <div className="flex-1">
                        <h1 className="text-4xl font-bold text-slate-900">{college.name}</h1>
                        <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-slate-700">{stats.averageRating.toFixed(1)}</span>
                                <div className="flex">{renderStars(stats.averageRating)}</div>
                            </div>
                            <span className="text-slate-600">{stats.reviewCount} reviews</span>
                        </div>
                    </div>
                    {/* <Button asChild><Link to={`/review/company/${college._id}`}><PenSquare className="w-4 h-4 mr-2"/>Write a review</Link></Button> */}
                </div>

                <div className="space-y-6">
                    {reviews.length > 0 ? reviews.map((review: any) => (
                        <Card key={review._id} className="overflow-hidden">
                            <CardHeader className="bg-white p-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">{review.title}</CardTitle>
                                    <div className="flex items-center gap-2">{renderStars(review.rating)}</div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4">
                                <p className="text-slate-700 leading-relaxed">{review.content}</p>
                                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2"><User size={14}/><span>By: {review.user?.employerProfile?.name || 'Anonymous'}</span></div>
                                    <div className="flex items-center gap-2"><Calendar size={14}/><span>{new Date(review.createdAt).toLocaleDateString()}</span></div>
                                </div>
                            </CardContent>
                        </Card>
                    )) : (
                        <Card><CardContent className="p-12 text-center text-muted-foreground">No reviews have been submitted for this school yet.</CardContent></Card>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CompanyReviewDetailsPage;