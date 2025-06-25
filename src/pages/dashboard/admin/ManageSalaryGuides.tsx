import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { Search, Trash2, Edit } from "lucide-react";

// RTK Query Hooks
import {
  useGetAllSalaryGuidesQuery,
  useCreateSalaryGuideMutation,
  useUpdateSalaryGuideMutation,
  useDeleteSalaryGuideMutation,
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
import { Skeleton } from "@/components/ui/skeleton";

interface SalaryGuide {
  _id: string;
  jobTitle: string;
  category: string;
  averageSalary: number;
  salaryRange: {
    min: number;
    max: number;
  };
  jobDescription: string;
  commonSkills: string[];
}

const initialFormData = {
  jobTitle: "",
  category: "",
  averageSalary: "",
  salaryRange: "",
  jobDescription: "",
  commonSkills: "",
};

const ManageSalaryGuides = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [editingGuideId, setEditingGuideId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: guidesResponse,
    isLoading: isLoadingGuides,
    isError,
  } = useGetAllSalaryGuidesQuery();
  const [createSalaryGuide, { isLoading: isCreating }] =
    useCreateSalaryGuideMutation();
  const [updateSalaryGuide, { isLoading: isUpdating }] =
    useUpdateSalaryGuideMutation();
  const [deleteSalaryGuide] = useDeleteSalaryGuideMutation();

  const guides: SalaryGuide[] = guidesResponse?.data || [];

  const filteredGuides = useMemo(() => {
    if (!searchTerm) return guides;
    return guides.filter((guide) =>
      guide.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [guides, searchTerm]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingGuideId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const rangeParts = formData.salaryRange
      .split("-")
      .map((part) => part.trim());

    if (rangeParts.length !== 2 || !rangeParts[0] || !rangeParts[1]) {
      toast.error(
        "Please enter Salary Range in 'min-max' format (e.g., 80000-120000)."
      );
      return;
    }

    const payload = {
      ...formData,
      averageSalary: Number(formData.averageSalary),
      commonSkills: formData.commonSkills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
      salaryRange: {
        min: parseInt(rangeParts[0], 10),
        max: parseInt(rangeParts[1], 10),
      },
    };

    const mutation = editingGuideId
      ? updateSalaryGuide({ id: editingGuideId, data: payload })
      : createSalaryGuide(payload);

    try {
      await mutation.unwrap();
      toast.success(
        `Salary Guide ${editingGuideId ? "updated" : "created"} successfully!`
      );
      resetForm();
    } catch (err: any) {
      console.error("Failed to save guide:", err);
      const errorMessage =
        err.data?.message || "An error occurred. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleEdit = (guide: SalaryGuide) => {
    setEditingGuideId(guide._id);

    const salaryRangeString =
      guide.salaryRange && guide.salaryRange.min !== undefined
        ? `${guide.salaryRange.min}-${guide.salaryRange.max}`
        : "";

    setFormData({
      jobTitle: guide.jobTitle,
      category: guide.category,
      averageSalary: String(guide.averageSalary),
      salaryRange: salaryRangeString,
      jobDescription: guide.jobDescription,
      commonSkills: Array.isArray(guide.commonSkills)
        ? guide.commonSkills.join(", ")
        : "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSalaryGuide(id).unwrap();
      toast.success("Salary Guide deleted successfully!");
      if (id === editingGuideId) {
        resetForm();
      }
    } catch (err) {
      toast.error("Failed to delete the guide.");
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
                {editingGuideId ? "Edit Guide" : "Create Guide"}
              </CardTitle>
              <CardDescription>
                {editingGuideId
                  ? "Update the details of the selected guide."
                  : "Fill in the form to add a new salary guide."}
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="averageSalary">Average Salary</Label>
                      <Input
                        id="averageSalary"
                        name="averageSalary"
                        type="number"
                        value={formData.averageSalary}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salaryRange">Range (min-max)</Label>
                      <Input
                        id="salaryRange"
                        name="salaryRange"
                        value={formData.salaryRange}
                        onChange={handleChange}
                        placeholder="80000-120000"
                        required
                      />
                    </div>
                  </div>
                <div className="space-y-2">
                  <Label htmlFor="jobDescription">Job Description</Label>
                  <Textarea
                    id="jobDescription"
                    name="jobDescription"
                    value={formData.jobDescription}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commonSkills">Common Skills (comma-separated)</Label>
                  <Input
                    id="commonSkills"
                    name="commonSkills"
                    value={formData.commonSkills}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="submit" disabled={isLoading}>
                  {editingGuideId
                    ? isLoading ? "Updating..." : "Update Guide"
                    : isLoading ? "Creating..." : "Create Guide"}
                </Button>
                {editingGuideId && (
                  <Button variant="secondary" type="button" onClick={resetForm}>
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
              <CardTitle>Existing Salary Guides</CardTitle>
              <CardDescription>
                Browse, edit, or delete existing salary guides.
              </CardDescription>
              <div className="relative pt-2">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by job title..."
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
                    <TableHead>Job Title</TableHead>
                    <TableHead>Avg. Salary</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingGuides ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
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
                      <TableCell colSpan={3} className="text-center text-red-500">
                        Failed to load guides.
                      </TableCell>
                    </TableRow>
                  ) : filteredGuides.length > 0 ? (
                    filteredGuides.map((guide) => (
                      <TableRow key={guide._id} className={guide._id === editingGuideId ? "bg-muted/50" : ""}>
                        <TableCell className="font-medium">
                          {guide.jobTitle}
                          <p className="text-xs text-muted-foreground">{guide.category}</p>
                        </TableCell>
                        <TableCell>
                          {new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "INR",
                            maximumFractionDigits: 0,
                          }).format(guide.averageSalary)}
                        </TableCell>
                        <TableCell className="text-right space-x-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => handleEdit(guide)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Edit Guide</p></TooltipContent>
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
                              <TooltipContent><p>Delete Guide</p></TooltipContent>
                            </Tooltip>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action will permanently delete the guide for "{guide.jobTitle}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(guide._id)}>
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
                      <TableCell colSpan={3} className="text-center h-24">
                        No salary guides found.
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

export default ManageSalaryGuides;