import { apiService } from './apiService';

// EXPORT the interface so other files can import it
export interface Job {
  _id: string;
  title: string;
  schoolName: string; // This field is included
  location: string;
  jobType: string;
  category: string;
  description: string;
  experienceLevel: string;
  yearsOfExperience: number;
  requiredSkills: string[];
  status: 'pending' | 'approved' | 'rejected';
}

export const employerJobApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    getMyJobs: builder.query<Job[], void>({
      query: () => 'post-jobs/jobs',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'EmployerJob' as const, id: _id })),
              { type: 'EmployerJob', id: 'LIST' },
            ]
          : [{ type: 'EmployerJob', id: 'LIST' }],
    }),
    createEmployerJob: builder.mutation<Job, Partial<Job>>({
      query: (jobData) => ({
        url: 'post-jobs/jobs',
        method: 'POST',
        body: jobData,
      }),
      invalidatesTags: [{ type: 'EmployerJob', id: 'LIST' }],
    }),
    updateEmployerJob: builder.mutation<Job, { id: string; data: Partial<Job> }>({
      query: ({ id, data }) => ({
        url: `post-jobs/jobs/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'EmployerJob', id }, { type: 'EmployerJob', id: 'LIST' }],
    }),
    deleteEmployerJob: builder.mutation<{ id: string; message: string }, string>({
      query: (jobId) => ({
        url: `post-jobs/jobs/${jobId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, jobId) => [{ type: 'EmployerJob', id: jobId }, { type: 'EmployerJob', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetMyJobsQuery,
  useCreateEmployerJobMutation,
  useUpdateEmployerJobMutation,
  useDeleteEmployerJobMutation,
} = employerJobApi;