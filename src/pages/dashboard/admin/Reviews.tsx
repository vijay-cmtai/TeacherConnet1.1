import React, { useState, useMemo, useEffect } from 'react';
import { useGetAllReviewsQuery, useUpdateReviewMutation, useDeleteReviewMutation, useCreateReviewMutation, useGetCollegesForAdminQuery } from '@/features/api/adminReviewApiService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from '@/components/ui/skeleton';
import { Star, Edit, Trash2, Search, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const renderStars = (rating: number) => Array.from({ length: 5 }, (_, i) => <Star key={i} className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />);

const ReviewFormModal = ({ review, onSave, onClose }: { review: any | null, onSave: (data: any) => Promise<void>, onClose: () => void }) => {
    const { data: colleges = [], isLoading: isLoadingColleges } = useGetCollegesForAdminQuery();
    const [formData, setFormData] = useState({ collegeId: '', title: '', content: '', rating: 3 });
    
    useEffect(() => {
        if (review) {
            setFormData({ collegeId: review.college._id, title: review.title, content: review.content, rating: review.rating });
        }
    }, [review]);

    const handleSubmit = () => {
        onSave(formData);
        onClose();
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader><DialogTitle>{review ? 'Edit' : 'Add New'} Review</DialogTitle></DialogHeader>
                <div className="space-y-4 py-4">
                    <div><Label>College</Label><Select value={formData.collegeId} onValueChange={(value) => setFormData({...formData, collegeId: value})}><SelectTrigger>{isLoadingColleges ? 'Loading...' : <SelectValue placeholder="Select a college..." />}</SelectTrigger><SelectContent>{colleges.map(c => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}</SelectContent></Select></div>
                    <div><Label>Rating</Label><div className="flex">{[1,2,3,4,5].map(r => <Star key={r} className={`cursor-pointer w-6 h-6 ${r <= formData.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} onClick={() => setFormData({...formData, rating: r})}/>)}</div></div>
                    <div><Label>Review Title</Label><Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
                    <div><Label>Review Content</Label><Textarea value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} /></div>
                </div>
                <DialogFooter><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={handleSubmit}>Save Review</Button></DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const AdminReviews = () => {
    const { data: reviews = [], isLoading, isError } = useGetAllReviewsQuery();
    const [createReview] = useCreateReviewMutation();
    const [updateReview] = useUpdateReviewMutation();
    const [deleteReview] = useDeleteReviewMutation();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingReview, setEditingReview] = useState<any | null>(null);

    const filteredReviews = useMemo(() => {
        return reviews.filter(review => {
            const searchLower = searchTerm.toLowerCase();
            if (searchLower === "") return true;
            return (review.college?.name?.toLowerCase() || '').includes(searchLower) ||
                   (review.user?.employerProfile?.name?.toLowerCase() || '').includes(searchLower) ||
                   (review.title?.toLowerCase() || '').includes(searchLower);
        });
    }, [reviews, searchTerm]);

    const handleSave = async (data: any) => {
        const promise = editingReview 
            ? updateReview({ reviewId: editingReview._id, data }).unwrap() 
            : createReview(data).unwrap();
        
        toast.promise(promise, {
            loading: 'Saving review...',
            success: `Review successfully ${editingReview ? 'updated' : 'created'}!`,
            error: 'Failed to save review.'
        });
        setEditingReview(null);
    };
    
    const handleDelete = async (reviewId: string) => {
        toast.promise(deleteReview(reviewId).unwrap(), {
            loading: 'Deleting review...',
            success: 'Review deleted successfully.',
            error: 'Failed to delete review.'
        });
    };

    if (isLoading) return <div className="space-y-4"><Skeleton className="h-12 w-full" /><Skeleton className="h-48 w-full" /></div>;
    if (isError) return <p className="text-red-500">Failed to load reviews.</p>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center"><CardHeader className="p-0"><CardTitle>Manage Company Reviews</CardTitle><CardDescription>Create, edit, or delete all user-submitted reviews.</CardDescription></CardHeader><Button onClick={() => setIsFormOpen(true)}><PlusCircle className="mr-2 h-4 w-4"/>Add New Review</Button></div>
            <Card><CardContent className="p-4"><div className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search by school, user, or title..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" /></div></CardContent></Card>
            <Card>
                <Table><TableHeader><TableRow><TableHead>School</TableHead><TableHead>Rating</TableHead><TableHead>Title</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {filteredReviews.length > 0 ? filteredReviews.map(review => (
                            <TableRow key={review._id}>
                                <TableCell className="font-medium">{review.college?.name || 'N/A'}</TableCell>
                                <TableCell><div className="flex items-center">{renderStars(review.rating)}</div></TableCell>
                                <TableCell>{review.title}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => {setEditingReview(review); setIsFormOpen(true);}}><Edit className="w-4 h-4"/></Button>
                                    <AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="w-4 h-4 text-destructive"/></Button></AlertDialogTrigger>
                                        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Review?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => handleDelete(review._id)}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        )) : <TableRow><TableCell colSpan={6} className="h-24 text-center">No reviews found.</TableCell></TableRow>}
                    </TableBody>
                </Table>
            </Card>
            {isFormOpen && <ReviewFormModal review={editingReview} onClose={() => { setIsFormOpen(false); setEditingReview(null); }} onSave={handleSave} />}
        </div>
    );
};

export default AdminReviews;