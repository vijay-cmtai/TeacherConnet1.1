import { apiService } from './apiService';

export const collegeJobApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    createJob: builder.mutation<any, any>({
      query: (jobData) => ({ 
        url: 'college/jobs', 
        method: 'POST', 
        body: jobData 
      }),
      invalidatesTags: [{ type: 'Job', id: 'LIST' }],
    }),
    updateJob: builder.mutation<any, { jobId: string; data: any }>({
        query: ({ jobId, data }) => ({ 
            url: `college/jobs/${jobId}`, 
            method: 'PUT', 
            body: data 
        }),
        invalidatesTags: (result, error, { jobId }) => [{ type: 'Job', id: jobId }],
    }),
    getMyPostedJobs: builder.query<any[], void>({
      query: () => 'college/jobs',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Job' as const, id: _id })),
              { type: 'Job', id: 'LIST' },
            ]
          : [{ type: 'Job', id: 'LIST' }],
    }),
    getJobById: builder.query<any, string>({
        query: (jobId) => `college/jobs/${jobId}`,
        providesTags: (result, error, id) => [{ type: 'Job', id }],
    }),
    deleteJob: builder.mutation<{ success: boolean; message: string }, string>({
      query: (jobId) => ({ 
        url: `college/jobs/${jobId}`, 
        method: 'DELETE' 
      }),
      invalidatesTags: [{ type: 'Job', id: 'LIST' }],
    }),
  }),
});

export const { 
    useCreateJobMutation, 
    useUpdateJobMutation,
    useGetMyPostedJobsQuery, 
    useGetJobByIdQuery,
    useDeleteJobMutation 
} = collegeJobApi;