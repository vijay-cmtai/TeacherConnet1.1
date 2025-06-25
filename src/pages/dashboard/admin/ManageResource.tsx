// src/pages/dashboard/admin/ManageResources.tsx

import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { Search, Edit, Trash2 } from "lucide-react";

// RTK Query Hooks
import {
  useGetAllResourcesQuery,
  useCreateResourceMutation,
  useUpdateResourceMutation,
  useDeleteResourceMutation,
} from "@/features/admin/adminApiService";

// Shadcn/ui Components
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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

// Define the shape of our form data and resource data
interface IResource {
  _id: string;
  title: string;
  category: string;
  content: string;
  status: "draft" | "published";
  isFeatured: boolean;
  readTime: number;
}

interface IResourceFormInput {
  title: string;
  category: string;
  content: string;
  readTime: number;
  status: "draft" | "published";
  isFeatured: boolean;
  image?: FileList;
}

const ManageResource = () => {
  const [editingResource, setEditingResource] = useState<IResource | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");

  // RTK Query Hooks
  const {
    data: resources,
    isLoading: isLoadingResources,
    isError,
  } = useGetAllResourcesQuery();
  const [createResource, { isLoading: isCreating }] =
    useCreateResourceMutation();
  const [updateResource, { isLoading: isUpdating }] =
    useUpdateResourceMutation();
  const [deleteResource] = useDeleteResourceMutation();

  const { register, handleSubmit, reset, setValue, watch } =
    useForm<IResourceFormInput>();
  const isFeaturedValue = watch("isFeatured");

  // Filter resources based on search term
  const filteredResources = React.useMemo(() => {
    if (!resources) return [];
    if (!searchTerm) return resources;
    return resources.filter((resource) =>
      resource.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [resources, searchTerm]);

  // Effect to pre-fill the form when an item is selected for editing
  useEffect(() => {
    if (editingResource) {
      setValue("title", editingResource.title);
      setValue("category", editingResource.category);
      setValue("content", editingResource.content);
      setValue("readTime", editingResource.readTime);
      setValue("status", editingResource.status);
      setValue("isFeatured", editingResource.isFeatured);
    } else {
      reset(); // Clear the form if we are not editing
    }
  }, [editingResource, setValue, reset]);

  const resetForm = () => {
    reset();
    setEditingResource(null);
  };

  const handleFormSubmit: SubmitHandler<IResourceFormInput> = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("category", data.category);
    formData.append("content", data.content);
    formData.append("readTime", data.readTime.toString());
    formData.append("status", data.status);
    formData.append("isFeatured", String(data.isFeatured));

    if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0]);
    }

    const mutation = editingResource
      ? updateResource({ id: editingResource._id, data: formData })
      : createResource(formData);

    try {
      await mutation.unwrap();
      toast.success(
        `Resource ${editingResource ? "updated" : "created"} successfully!`
      );
      resetForm();
    } catch (err: any) {
      console.error("Failed to save resource:", err);
      toast.error(err.data?.message || "An error occurred.");
    }
  };

  const handleEdit = (resource: IResource) => {
    setEditingResource(resource);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteResource(id).unwrap();
      toast.success("Resource deleted successfully!");
      if (id === editingResource?._id) {
        resetForm();
      }
    } catch (err) {
      toast.error("Failed to delete the resource.");
    }
  };

  const isLoadingMutation = isCreating || isUpdating;

  return (
    <TooltipProvider>
      <div className="grid gap-8 md:grid-cols-5 lg:grid-cols-3">
        {/* Left Column: Form Card */}
        <div className="md:col-span-2 lg:col-span-1">
          <Card className="sticky top-24">
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <CardHeader>
                <CardTitle>
                  {editingResource ? "Edit Resource" : "Create Resource"}
                </CardTitle>
                <CardDescription>
                  {editingResource
                    ? "Update the details for this resource."
                    : "Fill the form to add a new resource."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    {...register("title", { required: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    {...register("category", { required: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content (HTML Supported)</Label>
                  <Textarea
                    id="content"
                    {...register("content", { required: true })}
                    rows={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="readTime">Read Time (minutes)</Label>
                  <Input
                    id="readTime"
                    type="number"
                    {...register("readTime", {
                      required: true,
                      valueAsNumber: true,
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Feature Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    {...register("image", { required: !editingResource })}
                  />
                  {editingResource && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Leave blank to keep current image.
                    </p>
                  )}
                </div>
                <div className="flex justify-between items-center pt-2">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      onValueChange={(value) =>
                        setValue("status", value as "draft" | "published")
                      }
                      defaultValue={editingResource?.status || "draft"}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch
                      id="isFeatured"
                      checked={isFeaturedValue}
                      onCheckedChange={(checked) =>
                        setValue("isFeatured", checked)
                      }
                    />
                    <Label htmlFor="isFeatured">Featured</Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="submit" disabled={isLoadingMutation}>
                  {editingResource
                    ? isLoadingMutation
                      ? "Updating..."
                      : "Update Resource"
                    : isLoadingMutation
                      ? "Creating..."
                      : "Create Resource"}
                </Button>
                {editingResource && (
                  <Button variant="secondary" type="button" onClick={resetForm}>
                    Cancel
                  </Button>
                )}
              </CardFooter>
            </form>
          </Card>
        </div>

        {/* Right Column: Table Card */}
        <div className="md:col-span-3 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Existing Resources</CardTitle>
              <CardDescription>
                Browse, edit, or delete existing resources.
              </CardDescription>
              <div className="relative pt-2">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingResources ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-5 w-48" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-20" />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Skeleton className="h-8 w-8" />
                            <Skeleton className="h-8 w-8" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : isError ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-red-500"
                      >
                        Failed to load resources.
                      </TableCell>
                    </TableRow>
                  ) : filteredResources.length > 0 ? (
                    filteredResources.map((resource) => (
                      <TableRow
                        key={resource._id}
                        className={
                          resource._id === editingResource?._id
                            ? "bg-muted/50"
                            : ""
                        }
                      >
                        <TableCell className="font-medium">
                          {resource.title}
                        </TableCell>
                        <TableCell>{resource.category}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${resource.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                          >
                            {resource.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right space-x-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(resource)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit Resource</p>
                            </TooltipContent>
                          </Tooltip>
                          <AlertDialog>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </AlertDialogTrigger>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete Resource</p>
                              </TooltipContent>
                            </Tooltip>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action will permanently delete the
                                  resource: "{resource.title}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(resource._id)}
                                >
                                  Continue
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center h-24">
                        No resources found.
                      </TableCell>
                    </TableRow>
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

export default ManageResource;
