import { apiService } from '../api/apiService';

export interface PressArticle {
  _id: string;
  id: string;
  title: string;
  publication: string;
  snippet: string;
  imageUrl: string;
  date: string;
  fullContent: string[];
}

interface SingleItemApiResponse {
  success: boolean;
  data: any;
}

interface ApiResponse {
  success: boolean;
  count?: number;
  data: any;
}

export const adminApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<any, void>({
      query: () => 'admin/stats',
      providesTags: ['User', 'Job', 'Application'],
    }),
    getSystemActivity: builder.query<any[], void>({
      query: () => 'notifications/activity',
      providesTags: ['Notification'],
    }),
    getAdminProfile: builder.query<any, void>({
      query: () => 'admin/profile',
      providesTags: ['AdminProfile'],
    }),
    updateAdminProfile: builder.mutation<any, Partial<any>>({
      query: (profileData) => ({
        url: 'admin/profile',
        method: 'PUT',
        body: profileData,
      }),
      invalidatesTags: ['AdminProfile'],
    }),
    getPendingApprovalJobs: builder.query<any[], void>({
      query: () => 'admin/jobs/pending-approval',
      providesTags: ['Job'],
    }),
    getCollegesForAdmin: builder.query<any[], void>({
      query: () => 'admin/colleges',
      providesTags: ['CollegeProfile']
    }),
    getAllJobsForAdmin: builder.query<any[], void>({
      query: () => 'admin/jobs',
      providesTags: (result) => result ? [...result.map(({ _id }) => ({ type: 'Job' as const, id: _id })), { type: 'Job', id: 'LIST' }] : [{ type: 'Job', id: 'LIST' }],
    }),
    getJobDetailsForAdmin: builder.query<any, string>({
      query: (jobId) => `admin/jobs/${jobId}`,
      providesTags: (result, error, id) => [{ type: 'Job', id }],
    }),
    createJobByAdmin: builder.mutation<any, any>({
      query: (jobData) => ({ url: 'admin/jobs', method: 'POST', body: jobData }),
      invalidatesTags: [{ type: 'Job', id: 'LIST' }],
    }),
    updateJobByAdmin: builder.mutation<any, { jobId: string; data: any }>({
      query: ({ jobId, data }) => ({ url: `admin/jobs/${jobId}`, method: 'PUT', body: data }),
      invalidatesTags: (result, error, { jobId }) => [{ type: 'Job', id: jobId }, { type: 'Job', id: 'LIST' }],
    }),
    deleteJobByAdmin: builder.mutation<any, string>({
      query: (jobId) => ({ url: `admin/jobs/${jobId}`, method: 'DELETE' }),
      invalidatesTags: (result, error, jobId) => [{ type: 'Job', id: jobId }, { type: 'Job', id: 'LIST' }],
    }),
    manageJobStatus: builder.mutation<any, { jobId: string; status: string }>({
      query: ({ jobId, status }) => ({ url: `admin/jobs/${jobId}/manage`, method: 'PUT', body: { status } }),
      invalidatesTags: (result, error, { jobId }) => [{ type: 'Job', id: jobId }, { type: 'Job', id: 'LIST' }],
    }),
    getUsersByRole: builder.query<any[], { role: string }>({
      query: ({ role }) => `admin/users?role=${role}`,
      providesTags: ['User'],
    }),
    getApplicationsForAdmin: builder.query<any[], void>({
      query: () => 'admin/applications',
      providesTags: ['Application'],
    }),
    getInterviewApplications: builder.query<any[], void>({
        query: () => 'admin/applications/interviews',
        providesTags: (result) => result ? [...result.map(({ _id }) => ({ type: 'Application' as const, id: _id })), 'Application'] : ['Application'],
    }),
    updateApplicationByAdmin: builder.mutation<any, { appId: string; body: any }>({
      query: ({ appId, body }) => ({
        url: `admin/applications/${appId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Application'],
    }),
    getPendingApplications: builder.query<any[], void>({
      query: () => 'admin/applications/pending-approval',
      providesTags: ['Application'],
    }),
    getPendingDocumentApplications: builder.query<any[], void>({
      query: () => 'admin/applications/pending-documents',
      providesTags: (result) => result ? [...result.map(({ _id }) => ({ type: 'Application' as const, id: _id })), 'Application'] : ['Application'],
    }),
    verifyDocuments: builder.mutation<any, { appId: string; status: string }>({
      query: ({ appId, status }) => ({
        url: `admin/applications/${appId}/verify-documents`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (result, error, { appId }) => [{ type: 'Application', id: appId }, 'Application'],
    }),
    forwardInterview: builder.mutation<any, string>({
      query: (appId) => ({ url: `admin/applications/${appId}/forward-interview`, method: 'PUT' }),
      invalidatesTags: (result, error, appId) => [{ type: 'Application', id: appId }, 'Application'],
    }),
    forwardOffer: builder.mutation<any, { appId: string; formData: FormData }>({
      query: ({ appId, formData }) => ({ url: `admin/applications/${appId}/forward-offer`, method: 'PUT', body: formData }),
      invalidatesTags: (result, error, { appId }) => [{ type: 'Application', id: appId }, 'Application'],
    }),
    getAllUsers: builder.query<any[], void>({
      query: () => 'admin/users/all',
      providesTags: (result) => result ? [...result.map(({ _id }) => ({ type: 'User' as const, id: _id })), { type: 'User', id: 'LIST' }] : [{ type: 'User', id: 'LIST' }],
    }),
    getFullUserDetails: builder.query<any, string>({
      query: (userId) => `admin/users/${userId}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    updateUserStatus: builder.mutation<any, { userId: string; status: string }>({
      query: ({ userId, status }) => ({ url: `admin/users/${userId}/status`, method: 'PUT', body: { status }, }),
      invalidatesTags: (result, error, { userId }) => [{ type: 'User', id: userId }, { type: 'User', id: 'LIST' }],
    }),
    updateCollegeProfileByAdmin: builder.mutation<any, { userId: string; data: any }>({
      query: ({ userId, data }) => ({ url: `admin/users/college/${userId}/profile`, method: 'PUT', body: data }),
      invalidatesTags: (result, error, { userId }) => [{ type: 'User', id: userId }, { type: 'User', id: 'LIST' }],
    }),
    updateEmployerProfileByAdmin: builder.mutation<any, { userId: string; data: any }>({
      query: ({ userId, data }) => ({ url: `admin/users/employer/${userId}/profile`, method: 'PUT', body: data }),
      invalidatesTags: (result, error, { userId }) => [{ type: 'User', id: userId }, { type: 'User', id: 'LIST' }],
    }),
    deleteUserByAdmin: builder.mutation<any, string>({
      query: (userId) => ({ url: `admin/users/${userId}`, method: 'DELETE' }),
      invalidatesTags: (result, error, userId) => [{ type: 'User', id: userId }, { type: 'User', id: 'LIST' }],
    }),
    getAllCareerArticles: builder.query<ApiResponse, string | void>({
      query: (category) => category ? `/career-articles?category=${encodeURIComponent(category)}` : "/career-articles",
      providesTags: (result) => result ? [...result.data.map(({ _id }) => ({ type: 'CareerArticle' as const, id: _id })), { type: 'CareerArticle', id: 'LIST' }] : [{ type: 'CareerArticle', id: 'LIST' }],
    }),
    getArticleBySlug: builder.query<SingleItemApiResponse, string>({
      query: (slug) => `/career-articles/${slug}`,
      providesTags: (result) => result?.data?._id ? [{ type: "CareerArticle", id: result.data._id }] : [],
    }),
    createArticle: builder.mutation<any, FormData>({
      query: (articleData) => ({
        url: "/career-articles",
        method: "POST",
        body: articleData,
      }),
      invalidatesTags: [{ type: 'CareerArticle', id: 'LIST' }],
    }),
    updateArticle: builder.mutation<any, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/career-articles/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "CareerArticle", id }, { type: 'CareerArticle', id: 'LIST' }],
    }),
    deleteArticle: builder.mutation<any, string>({
      query: (id) => ({
        url: `/career-articles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: 'CareerArticle', id }, { type: 'CareerArticle', id: 'LIST' }],
    }),
    getAllSalaryGuides: builder.query<ApiResponse, void>({
      query: () => "/salary-guide",
      providesTags: (result) => result ? [...result.data.map(({ _id }) => ({ type: 'SalaryGuide' as const, id: _id })), { type: 'SalaryGuide', id: 'LIST' }] : [{ type: 'SalaryGuide', id: 'LIST' }],
    }),
    getSalaryGuideById: builder.query<SingleItemApiResponse, string>({
      query: (id) => `/salary-guide/${id}`,
      providesTags: (result, error, id) => [{ type: "SalaryGuide", id }],
    }),
    createSalaryGuide: builder.mutation<any, any>({
      query: (salaryData) => ({
        url: "/salary-guide",
        method: "POST",
        body: salaryData,
      }),
      invalidatesTags: [{ type: 'SalaryGuide', id: 'LIST' }],
    }),
    updateSalaryGuide: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/salary-guide/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "SalaryGuide", id }, { type: 'SalaryGuide', id: 'LIST' }],
    }),
    deleteSalaryGuide: builder.mutation<any, string>({
      query: (id) => ({
        url: `/salary-guide/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "SalaryGuide", id }, { type: 'SalaryGuide', id: 'LIST' }],
    }),
    getPublicJobs: builder.query<any[], void>({
      query: () => "/jobs",
      providesTags: ["Job"],
    }),
    getAllResources: builder.query<any[], void>({
      query: () => "/resource",
      providesTags: (result) => result ? [...result.map(({ _id }) => ({ type: "Resource" as const, id: _id })), { type: "Resource", id: "LIST" }] : [{ type: "Resource", id: "LIST" }],
    }),
    getResourceById: builder.query<any, string>({
      query: (id) => `/resource/${id}`,
      providesTags: (result, error, id) => [{ type: "Resource", id }],
    }),
    createResource: builder.mutation<any, FormData>({
      query: (resourceData) => ({
        url: "/resource",
        method: "POST",
        body: resourceData,
      }),
      invalidatesTags: [{ type: "Resource", id: "LIST" }],
    }),
    updateResource: builder.mutation<any, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/resource/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Resource", id }, { type: "Resource", id: "LIST" }],
    }),
    deleteResource: builder.mutation<any, string>({
      query: (id) => ({
        url: `/resource/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Resource", id }, { type: "Resource", id: "LIST" }],
    }),
    getAllPressArticles: builder.query<PressArticle[], void>({
      query: () => "press-articles",
      transformResponse: (response: { success: boolean; data: PressArticle[] }) => response.data,
      providesTags: (result) => result ? [...result.map(({ _id }) => ({ type: "PressArticle" as const, id: _id })), { type: "PressArticle", id: "LIST" }] : [{ type: "PressArticle", id: "LIST" }],
    }),
    getPressArticleById: builder.query<PressArticle, string>({
      query: (id) => `press-articles/${id}`,
      transformResponse: (response: { success: boolean; data: PressArticle }) => response.data,
      providesTags: (result, error, id) => [{ type: "PressArticle", id }],
    }),
    createPressArticle: builder.mutation<PressArticle, FormData>({
      query: (formData) => ({
        url: "press-articles",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "PressArticle", id: "LIST" }],
    }),
    updatePressArticle: builder.mutation<PressArticle, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `press-articles/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "PressArticle", id }, { type: "PressArticle", id: "LIST" }],
    }),
    deletePressArticle: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `press-articles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "PressArticle", id }, { type: "PressArticle", id: "LIST" }],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetSystemActivityQuery,
  useGetAdminProfileQuery,
  useUpdateAdminProfileMutation,
  useGetCollegesForAdminQuery,
  useGetPendingApprovalJobsQuery,
  useGetAllJobsForAdminQuery,
  useGetJobDetailsForAdminQuery,
  useCreateJobByAdminMutation,
  useUpdateJobByAdminMutation,
  useDeleteJobByAdminMutation,
  useManageJobStatusMutation,
  useGetUsersByRoleQuery,
  useGetApplicationsForAdminQuery,
  useGetInterviewApplicationsQuery,
  useUpdateApplicationByAdminMutation,
  useGetPendingApplicationsQuery,
  useGetPendingDocumentApplicationsQuery,
  useVerifyDocumentsMutation,
  useForwardInterviewMutation,
  useForwardOfferMutation,
  useGetAllUsersQuery,
  useGetFullUserDetailsQuery,
  useUpdateUserStatusMutation,
  useUpdateCollegeProfileByAdminMutation,
  useUpdateEmployerProfileByAdminMutation,
  useDeleteUserByAdminMutation,
  useGetAllCareerArticlesQuery,
  useGetArticleBySlugQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
  useGetAllSalaryGuidesQuery,
  useGetSalaryGuideByIdQuery,
  useCreateSalaryGuideMutation,
  useUpdateSalaryGuideMutation,
  useDeleteSalaryGuideMutation,
  useGetPublicJobsQuery,
  useGetAllResourcesQuery,
  useGetResourceByIdQuery,
  useCreateResourceMutation,
  useUpdateResourceMutation,
  useDeleteResourceMutation,
  useGetAllPressArticlesQuery,
  useGetPressArticleByIdQuery,
  useCreatePressArticleMutation,
  useUpdatePressArticleMutation,
  useDeletePressArticleMutation,
} = adminApi;