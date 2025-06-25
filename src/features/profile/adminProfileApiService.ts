import { apiService } from '../api/apiService';

export const adminProfileApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    getAdminProfile: builder.query<any, void>({
      query: () => 'admin/profile',
      providesTags: ['AdminProfile'],
    }),
  }),
});

export const { useGetAdminProfileQuery } = adminProfileApi;