import { useState, useMemo, useEffect } from "react";
import toast from "react-hot-toast";
import { Search, Trash2, Edit, UploadCloud, X } from "lucide-react";
import {
  useGetAllCareerArticlesQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
} from "@/features/admin/adminApiService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";

interface Article {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  image: {
    url: string;
    public_id: string;
  };
  content: string;
}

const initialFormData = {
  title: "",
  slug: "",
  summary: "",
  category: "",
  content: "",
};

const articleCategories = [
  "Finding a Job",
  "Resumes & Cover Letters",
  "Interviewing",
  "Pay & Salary",
  "Career Development",
  "Resume Sample",
  "Cover Letter Sample",
  "Starting a New Job",
];

const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const ManageArticles = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    data: articlesResponse,
    isLoading: isLoadingArticles,
    isError,
  } = useGetAllCareerArticlesQuery();
  const [createArticle, { isLoading: isCreating }] = useCreateArticleMutation();
  const [updateArticle, { isLoading: isUpdating }] = useUpdateArticleMutation();
  const [deleteArticle] = useDeleteArticleMutation();

  const articles: Article[] = articlesResponse?.data || [];

  const filteredArticles = useMemo(() => {
    if (!searchTerm) return articles;
    return articles.filter((article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [articles, searchTerm]);

  useEffect(() => {
    if (formData.title && !editingArticleId && !isSlugManuallyEdited) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(prev.title),
      }));
    }
  }, [formData.title, editingArticleId, isSlugManuallyEdited]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    const input = document.getElementById('image') as HTMLInputElement;
    if (input) input.value = '';
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "slug") {
      setIsSlugManuallyEdited(true);
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingArticleId(null);
    setIsSlugManuallyEdited(false);
    clearImage();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingArticleId && !imageFile) {
        toast.error("A featured image is required for a new article.");
        return;
    }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });
    if (imageFile) {
      formDataToSend.append("image", imageFile);
    }

    const mutation = editingArticleId
      ? updateArticle({ id: editingArticleId, data: formDataToSend })
      : createArticle(formDataToSend);

    try {
      await mutation.unwrap();
      toast.success(
        `Article ${editingArticleId ? "updated" : "created"} successfully!`
      );
      resetForm();
    } catch (err: any) {
      console.error("Failed to save article:", err);
      const errorMessage =
        err.data?.message || "An error occurred. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleEdit = (article: Article) => {
    setEditingArticleId(article._id);
    setFormData({
      title: article.title,
      slug: article.slug,
      summary: article.summary,
      category: article.category,
      content: article.content,
    });
    setImagePreview(article.image.url);
    setImageFile(null);
    setIsSlugManuallyEdited(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteArticle(id).unwrap();
      toast.success("Article deleted successfully!");
      if (id === editingArticleId) {
        resetForm();
      }
    } catch (err) {
      toast.error("Failed to delete the article.");
      console.error(err);
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <TooltipProvider>
      <div className="grid gap-8 md:grid-cols-5 lg:grid-cols-3">
        <div className="md:col-span-2 lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>
                {editingArticleId ? "Edit Article" : "Create Article"}
              </CardTitle>
              <CardDescription>
                {editingArticleId
                  ? "Update the details of the selected article."
                  : "Fill in the form to publish a new article."}
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="image">Featured Image</Label>
                    {imagePreview ? (
                        <div className="relative">
                            <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-md border" />
                            <Button type="button" size="icon" variant="destructive" className="absolute top-2 right-2 h-7 w-7" onClick={clearImage}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <label htmlFor="image" className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground">
                                    <span className="font-semibold">Click to upload</span>
                                </p>
                                <p className="text-xs text-muted-foreground">PNG, JPG or WEBP</p>
                            </div>
                            <Input id="image" type="file" className="hidden" onChange={handleImageChange} accept="image/png, image/jpeg, image/webp" />
                        </label>
                    )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input id="slug" name="slug" value={formData.slug} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={handleSelectChange} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {articleCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="summary">Summary</Label>
                  <Textarea id="summary" name="summary" value={formData.summary} onChange={handleChange} rows={3} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content (Markdown Supported)</Label>
                  <Textarea id="content" name="content" value={formData.content} onChange={handleChange} rows={8} />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="submit" disabled={isLoading}>
                  {editingArticleId ? (isLoading ? "Updating..." : "Update Article") : (isLoading ? "Publishing..." : "Publish Article")}
                </Button>
                {editingArticleId && (
                  <Button variant="outline" type="button" onClick={resetForm}>
                    Cancel
                  </Button>
                )}
              </CardFooter>
            </form>
          </Card>
        </div>

        <div className="md:col-span-3 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Existing Articles</CardTitle>
              <CardDescription>Browse, edit, or delete existing career articles.</CardDescription>
              <div className="relative pt-2">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search articles by title..." className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Article</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingArticles ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><div className="flex items-center gap-4"><Skeleton className="h-12 w-12 rounded-md" /><div className="space-y-1"><Skeleton className="h-5 w-48" /><Skeleton className="h-3 w-40" /></div></div></TableCell>
                        <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell className="text-right"><div className="flex justify-end gap-2"><Skeleton className="h-8 w-8 rounded-md" /><Skeleton className="h-8 w-8 rounded-md" /></div></TableCell>
                      </TableRow>
                    ))
                  ) : isError ? (
                    <TableRow><TableCell colSpan={3} className="text-center text-red-500">Failed to load articles.</TableCell></TableRow>
                  ) : filteredArticles.length > 0 ? (
                    filteredArticles.map((article) => (
                      <TableRow key={article._id} className={article._id === editingArticleId ? "bg-muted/50" : ""}>
                        <TableCell>
                          <div className="flex items-center gap-4">
                            <img src={article?.image?.url} alt={article.title} className="h-12 w-12 object-cover rounded-md" />
                            <div className="font-medium">
                              {article.title}
                              <p className="text-xs text-muted-foreground hidden sm:block">/{article.slug}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{article.category}</TableCell>
                        <TableCell className="text-right space-x-1">
                          <Tooltip>
                            <TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={() => handleEdit(article)}><Edit className="h-4 w-4" /></Button></TooltipTrigger>
                            <TooltipContent><p>Edit Article</p></TooltipContent>
                          </Tooltip>
                          <AlertDialog>
                            <Tooltip>
                              <TooltipTrigger asChild><AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-red-500" /></Button></AlertDialogTrigger></TooltipTrigger>
                              <TooltipContent><p>Delete Article</p></TooltipContent>
                            </Tooltip>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>This action cannot be undone. This will permanently delete the article "{article.title}".</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(article._id)}>Continue</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={3} className="text-center h-24">No articles found.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ManageArticles;