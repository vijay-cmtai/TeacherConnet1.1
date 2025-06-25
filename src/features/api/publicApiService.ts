import { apiService } from './apiService';

export const publicApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    getPublicJobs: builder.query<any[], void>({
      query: () => 'public/jobs',
      providesTags: (result) => result ? [ ...result.map(({ _id }) => ({ type: 'Job' as const, id: _id })), { type: 'Job', id: 'LIST' } ] : [{ type: 'Job', id: 'LIST' }],
    }),
    getPublicColleges: builder.query<any[], void>({
        query: () => '/colleges',
        providesTags: (result) => result ? [ ...result.map(({ _id }) => ({ type: 'CollegeProfile' as const, id: _id })), { type: 'CollegeProfile', id: 'LIST' } ] : [{ type: 'CollegeProfile', id: 'LIST' }],
    }),
    getReviewsByCollege: builder.query<any, string>({
        query: (collegeId) => `review/reviews/${collegeId}`,
        providesTags: (result, error, collegeId) => [{ type: 'Review', id: collegeId }],
    }),
  }),
});

export const { useGetPublicJobsQuery, useGetPublicCollegesQuery, useGetReviewsByCollegeQuery } = publicApi;