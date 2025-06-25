import React, { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, MessageCircle, Camera, Plus, Edit, Trash2, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import toast from 'react-hot-toast';
import { useGetMySalariesQuery, useAddSalaryMutation, useUpdateSalaryMutation, useDeleteSalaryMutation, useGetMyInterviewsQuery, useAddInterviewMutation, useUpdateInterviewMutation, useDeleteInterviewMutation, useGetMyPhotosQuery, useAddPhotoMutation, useDeletePhotoMutation } from '@/features/contributions/contributionApiService';

const SalaryModal = ({ isOpen, onClose, salary }) => {
    const [addSalary, { isLoading: isAdding }] = useAddSalaryMutation();
    const [updateSalary, { isLoading: isUpdating }] = useUpdateSalaryMutation();
    const [formData, setFormData] = useState({ schoolName: '', jobTitle: '', yearsOfExperience: '', salary: '', salaryType: 'per_year' });
    useEffect(() => { if (salary) setFormData(salary); }, [salary]);

    const handleChange = e => setFormData({ ...formData, [e.target.id]: e.target.value });
    const handleSelectChange = value => setFormData({ ...formData, salaryType: value });

    const handleSubmit = async () => {
        try {
            if (salary) { await updateSalary({ id: salary._id, data: formData }).unwrap(); }
            else { await addSalary(formData).unwrap(); }
            toast.success(`Salary record ${salary ? 'updated' : 'added'}!`);
            onClose();
        } catch { toast.error("An error occurred."); }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader><DialogTitle>{salary ? 'Edit' : 'Add'} Salary Contribution</DialogTitle></DialogHeader>
                <div className="space-y-4 py-4">
                    <div><Label htmlFor="schoolName">School Name</Label><Input id="schoolName" value={formData.schoolName} onChange={handleChange} /></div>
                    <div><Label htmlFor="jobTitle">Job Title</Label><Input id="jobTitle" value={formData.jobTitle} onChange={handleChange} /></div>
                    <div><Label htmlFor="yearsOfExperience">Years of Experience</Label><Input id="yearsOfExperience" type="number" value={formData.yearsOfExperience} onChange={handleChange} /></div>
                    <div><Label htmlFor="salary">Salary (INR)</Label><Input id="salary" type="number" value={formData.salary} onChange={handleChange} /></div>
                    <div><Label htmlFor="salaryType">Salary Type</Label><Select onValueChange={handleSelectChange} defaultValue={formData.salaryType}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="per_month">Per Month</SelectItem><SelectItem value="per_year">Per Year</SelectItem></SelectContent></Select></div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isAdding || isUpdating}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const InterviewModal = ({ isOpen, onClose, interview }) => {
    const [addInterview, { isLoading: isAdding }] = useAddInterviewMutation();
    const [updateInterview, { isLoading: isUpdating }] = useUpdateInterviewMutation();
    const [formData, setFormData] = useState({ schoolName: '', jobTitle: '', question: '', answer: '' });
    useEffect(() => { if (interview) setFormData(interview); }, [interview]);

    const handleChange = e => setFormData({ ...formData, [e.target.id]: e.target.value });

    const handleSubmit = async () => {
        try {
            if (interview) { await updateInterview({ id: interview._id, data: formData }).unwrap(); }
            else { await addInterview(formData).unwrap(); }
            toast.success(`Interview Q&A ${interview ? 'updated' : 'added'}!`);
            onClose();
        } catch { toast.error("An error occurred."); }
    };
    
    return (
         <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader><DialogTitle>{interview ? 'Edit' : 'Add'} Interview Q&A</DialogTitle></DialogHeader>
                <div className="space-y-4 py-4">
                    <div><Label htmlFor="schoolName">School Name</Label><Input id="schoolName" value={formData.schoolName} onChange={handleChange} /></div>
                    <div><Label htmlFor="jobTitle">Job Title</Label><Input id="jobTitle" value={formData.jobTitle} onChange={handleChange} /></div>
                    <div><Label htmlFor="question">Question</Label><Textarea id="question" value={formData.question} onChange={handleChange} /></div>
                    <div><Label htmlFor="answer">Your Answer (Optional)</Label><Textarea id="answer" value={formData.answer} onChange={handleChange} /></div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isAdding || isUpdating}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const PhotoModal = ({ isOpen, onClose }) => {
    const [addPhoto, { isLoading }] = useAddPhotoMutation();
    const [formData, setFormData] = useState({ schoolName: '', caption: '' });
    const [imageFile, setImageFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleSubmit = async () => {
        if (!imageFile) { toast.error("Please select an image file."); return; }
        const fullFormData = new FormData();
        fullFormData.append('image', imageFile);
        fullFormData.append('schoolName', formData.schoolName);
        fullFormData.append('caption', formData.caption);

        try {
            await addPhoto(fullFormData).unwrap();
            toast.success("Photo uploaded successfully!");
            onClose();
        } catch { toast.error("Failed to upload photo."); }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader><DialogTitle>Add Photo</DialogTitle></DialogHeader>
                 <div className="space-y-4 py-4">
                    <div className="p-4 border-2 border-dashed rounded-lg text-center">
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => setImageFile(e.target.files[0])}/>
                        <Button variant="outline" onClick={() => fileInputRef.current.click()}>Choose Image</Button>
                        {imageFile && <p className="text-sm mt-2 text-muted-foreground">{imageFile.name}</p>}
                    </div>
                    <div><Label htmlFor="schoolName">School Name</Label><Input id="schoolName" value={formData.schoolName} onChange={e => setFormData({...formData, schoolName: e.target.value})} /></div>
                    <div><Label htmlFor="caption">Caption (Optional)</Label><Input id="caption" value={formData.caption} onChange={e => setFormData({...formData, caption: e.target.value})} /></div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isLoading}>Upload</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const SalaryTab = () => {
    const { data: salaries = [], isLoading, isError } = useGetMySalariesQuery();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingSalary, setEditingSalary] = useState(null);
    const [deleteSalary, {isLoading: isDeleting}] = useDeleteSalaryMutation();

    const handleDelete = async (id) => {
        try {
            await deleteSalary(id).unwrap();
            toast.success("Salary record deleted.");
        } catch { toast.error("Failed to delete record."); }
    };

    if (isLoading) return <Skeleton className="h-48 w-full" />;
    if (isError) return <p className="text-destructive">Failed to load salary data.</p>;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div><CardTitle>Salary Contributions</CardTitle><CardDescription>Share anonymous salary data to help others.</CardDescription></div>
                <Button onClick={() => { setEditingSalary(null); setModalOpen(true); }}><Plus className="mr-2 h-4 w-4" />Add Salary</Button>
            </CardHeader>
            <CardContent className="space-y-4">
                {salaries.length === 0 ? <p className="text-center text-muted-foreground py-8">You haven't added any salary contributions yet.</p> : salaries.map(salary => (
                    <div key={salary._id} className="p-4 border rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-semibold">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(salary.salary)} / {salary.salaryType === 'per_month' ? 'month' : 'year'}</p>
                            <p className="text-sm text-muted-foreground">{salary.jobTitle} at {salary.schoolName}</p>
                        </div>
                        <div className="flex gap-2"><Button variant="ghost" size="icon" onClick={() => { setEditingSalary(salary); setModalOpen(true); }}><Edit className="h-4 w-4" /></Button><AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Confirm Deletion</AlertDialogTitle><AlertDialogDescription>This will permanently delete this salary record.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(salary._id)} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></div>
                    </div>
                ))}
            </CardContent>
            {isModalOpen && <SalaryModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} salary={editingSalary} />}
        </Card>
    );
};

const InterviewTab = () => {
    const { data: interviews = [], isLoading, isError } = useGetMyInterviewsQuery();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingInterview, setEditingInterview] = useState(null);
    const [deleteInterview, {isLoading: isDeleting}] = useDeleteInterviewMutation();

    if (isLoading) return <Skeleton className="h-48 w-full" />;
    if (isError) return <p className="text-destructive">Failed to load interview data.</p>;
    
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div><CardTitle>Interview Q&A</CardTitle><CardDescription>Share interview questions you were asked.</CardDescription></div>
                <Button onClick={() => { setEditingInterview(null); setModalOpen(true); }}><Plus className="mr-2 h-4 w-4" />Add Q&A</Button>
            </CardHeader>
            <CardContent className="space-y-4">
                {interviews.length === 0 ? <p className="text-center text-muted-foreground py-8">You haven't added any interview questions yet.</p> : interviews.map(item => (
                    <div key={item._id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                            <div className="flex-1 pr-4">
                                <p className="text-sm text-muted-foreground">{item.jobTitle} at {item.schoolName}</p>
                                <p className="font-semibold mt-1">Q: {item.question}</p>
                                <p className="text-sm mt-1">A: {item.answer || 'No answer provided.'}</p>
                            </div>
                            <div className="flex gap-2"><Button variant="ghost" size="icon" onClick={() => { setEditingInterview(item); setModalOpen(true); }}><Edit className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => deleteInterview(item._id)} disabled={isDeleting}><Trash2 className="h-4 w-4 text-destructive" /></Button></div>
                        </div>
                    </div>
                ))}
            </CardContent>
            {isModalOpen && <InterviewModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} interview={editingInterview} />}
        </Card>
    );
};

const PhotoTab = () => {
    const { data: photos = [], isLoading, isError } = useGetMyPhotosQuery();
    const [isModalOpen, setModalOpen] = useState(false);
    const [deletePhoto, {isLoading: isDeleting}] = useDeletePhotoMutation();

    if (isLoading) return <Skeleton className="h-48 w-full" />;
    if (isError) return <p className="text-destructive">Failed to load photo data.</p>;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div><CardTitle>Photo Contributions</CardTitle><CardDescription>Share photos of schools and facilities.</CardDescription></div>
                <Button onClick={() => setModalOpen(true)}><Plus className="mr-2 h-4 w-4" />Add Photo</Button>
            </CardHeader>
            <CardContent>
                {photos.length === 0 ? <p className="text-center text-muted-foreground py-8">You haven't added any photos yet.</p> : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {photos.map(photo => (
                            <div key={photo._id} className="relative group">
                                <img src={photo.image.url} alt={photo.caption} className="rounded-lg object-cover w-full h-40" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 text-white">
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild><Button variant="destructive" size="icon" className="self-end h-8 w-8"><Trash2 className="h-4 w-4"/></Button></AlertDialogTrigger>
                                        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Confirm Deletion</AlertDialogTitle><AlertDialogDescription>This will permanently delete this photo.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => deletePhoto(photo._id)} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
                                    </AlertDialog>
                                    <div><p className="text-sm font-semibold">{photo.caption}</p><p className="text-xs">{photo.schoolName}</p></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
            {isModalOpen && <PhotoModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />}
        </Card>
    );
};

const MyContributions = () => {
    return (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Contributions</h1>
            <p className="text-muted-foreground mt-1">Help the community by sharing your experiences. Manage all your contributions here.</p>
          </div>
           <Tabs defaultValue="salary" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="salary"><DollarSign className="w-4 h-4 mr-2"/>Salary</TabsTrigger>
                    <TabsTrigger value="interview"><MessageCircle className="w-4 h-4 mr-2"/>Interview Q&A</TabsTrigger>
                    <TabsTrigger value="photos"><Camera className="w-4 h-4 mr-2"/>Photos</TabsTrigger>
                </TabsList>
                <TabsContent value="salary" className="mt-4"><SalaryTab /></TabsContent>
                <TabsContent value="interview" className="mt-4"><InterviewTab /></TabsContent>
                <TabsContent value="photos" className="mt-4"><PhotoTab /></TabsContent>
            </Tabs>
        </div>
      );
};

export default MyContributions;