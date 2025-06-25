import { apiService } from './apiService';

export const publicJobApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    getPublicJobs: builder.query<any[], void>({
      query: () => 'public/jobs',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Job' as const, id: _id })),
              { type: 'Job', id: 'LIST' },
            ]
          : [{ type: 'Job', id: 'LIST' }],
    }),
  }),
});

export const { useGetPublicJobsQuery } = publicJobApi;