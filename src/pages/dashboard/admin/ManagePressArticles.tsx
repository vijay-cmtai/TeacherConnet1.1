import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";
import {
  useGetAllPressArticlesQuery,
  useCreatePressArticleMutation,
  useDeletePressArticleMutation,
  useUpdatePressArticleMutation,
  useGetPressArticleByIdQuery,
  PressArticle, // Interface import karein
} from "@/features/admin/adminApiService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Trash2, Edit, PlusCircle, X } from "lucide-react";
import toast from "react-hot-toast";

const ManagePressArticles = () => {
  // State for the form
  const [isEditing, setIsEditing] = useState<string | null>(null); // Store ID of article being edited
  const [title, setTitle] = useState("");
  const [publication, setPublication] = useState("");
  const [snippet, setSnippet] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // RTK Query Hooks
  const {
    data: articles = [],
    isLoading: isLoadingArticles,
    isError,
  } = useGetAllPressArticlesQuery();
  const [createArticle, { isLoading: isCreating }] =
    useCreatePressArticleMutation();
  const [updateArticle, { isLoading: isUpdating }] =
    useUpdatePressArticleMutation();
  const [deleteArticle] = useDeletePressArticleMutation();

  // Hook to fetch a single article's data when editing starts
  const { data: editingArticleData } = useGetPressArticleByIdQuery(isEditing!, {
    skip: !isEditing,
  });

  // Effect to populate form when editing data is fetched
  useEffect(() => {
    if (editingArticleData) {
      setTitle(editingArticleData.title);
      setPublication(editingArticleData.publication);
      setSnippet(editingArticleData.snippet);
      setImagePreview(editingArticleData.imageUrl);
      setImageFile(null); // Clear file input when editing
    }
  }, [editingArticleData]);

  // Handle image selection and create a preview
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Reset form to its initial state
  const resetForm = () => {
    setIsEditing(null);
    setTitle("");
    setPublication("");
    setSnippet("");
    setImageFile(null);
    setImagePreview(null);
    const fileInput = document.getElementById("imageUrl") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  // Handle form submission for both Create and Update
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title || !publication || !snippet) {
      toast.error("Title, Publication, and Snippet are required.");
      return;
    }
    if (!isEditing && !imageFile) {
      toast.error("An image is required for new articles.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("publication", publication);
    formData.append("snippet", snippet);
    // Only append image if a new one is selected
    if (imageFile) {
      formData.append("imageUrl", imageFile);
    }
    // We can use the snippet as the full content for now
    formData.append("fullContent", JSON.stringify([snippet]));

    try {
      if (isEditing) {
        await updateArticle({ id: isEditing, data: formData }).unwrap();
        toast.success("Article updated successfully!");
      } else {
        await createArticle(formData).unwrap();
        toast.success("Article created successfully!");
      }
      resetForm();
    } catch (err: any) {
      const errorMessage =
        err.data?.message ||
        `Failed to ${isEditing ? "update" : "create"} article.`;
      toast.error(errorMessage);
      console.error(err);
    }
  };

  // Handle article deletion with confirmation
  const handleDelete = async (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this article? This action cannot be undone."
      )
    ) {
      try {
        await deleteArticle(id).unwrap();
        toast.success("Article deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete article.");
        console.error(err);
      }
    }
  };

  // Set up form for editing an existing article
  const handleEdit = (article: PressArticle) => {
    setIsEditing(article.id);
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50/50 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8">
        Manage Press Articles
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Form Section (Create/Edit) */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md sticky top-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              {isEditing ? (
                <Edit className="mr-2 h-6 w-6 text-indigo-600" />
              ) : (
                <PlusCircle className="mr-2 h-6 w-6 text-indigo-600" />
              )}
              {isEditing ? "Edit Article" : "Add New Article"}
            </h2>
            {isEditing && (
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            )}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Article Title"
                required
              />
            </div>
            <div>
              <label
                htmlFor="publication"
                className="block text-sm font-medium text-gray-700"
              >
                Publication
              </label>
              <Input
                id="publication"
                value={publication}
                onChange={(e) => setPublication(e.target.value)}
                placeholder="e.g., The Education Times"
                required
              />
            </div>
            <div>
              <label
                htmlFor="snippet"
                className="block text-sm font-medium text-gray-700"
              >
                Snippet / Short Description
              </label>
              <Textarea
                id="snippet"
                value={snippet}
                onChange={(e) => setSnippet(e.target.value)}
                placeholder="A short summary for the article card"
                required
              />
            </div>
            <div>
              <label
                htmlFor="imageUrl"
                className="block text-sm font-medium text-gray-700"
              >
                Cover Image
              </label>
              <Input
                id="imageUrl"
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                className="file:text-indigo-600 file:font-semibold"
              />
            </div>
            {imagePreview && (
              <div className="mt-4 border rounded-md p-2">
                <p className="text-xs text-gray-500 mb-2">Image Preview:</p>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-auto rounded-md object-cover"
                />
              </div>
            )}
            <Button
              type="submit"
              disabled={isCreating || isUpdating}
              className="w-full"
            >
              {isCreating || isUpdating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : isEditing ? (
                <Edit className="mr-2 h-4 w-4" />
              ) : (
                <PlusCircle className="mr-2 h-4 w-4" />
              )}
              {isCreating
                ? "Creating..."
                : isUpdating
                  ? "Updating..."
                  : "Create Article"}
            </Button>
          </form>
        </div>

        {/* Articles List Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Existing Articles</h2>
          {isLoadingArticles ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : isError ? (
            <p className="text-red-500">Failed to load articles.</p>
          ) : articles.length === 0 ? (
            <p className="text-gray-500 text-center py-10">
              No articles found. Add one to get started!
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Image
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Publication
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {articles.map((article) => (
                    <tr key={article.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="h-10 w-16 object-cover rounded-md"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 w-48 truncate">
                          {article.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {article.publication}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(article)}
                          className="text-gray-500 hover:text-indigo-600"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(article.id)}
                          className="text-gray-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagePressArticles;
