import { apiService } from './apiService';

export const adminReviewApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    getAllReviews: builder.query<any[], void>({
      query: () => 'admin/reviews',
      providesTags: (result) => result ? [...result.map(({ _id }) => ({ type: 'Review' as const, id: _id })), { type: 'Review', id: 'LIST' }] : [{ type: 'Review', id: 'LIST' }],
    }),
    getCollegesForAdmin: builder.query<any[], void>({
        query: () => 'admin/colleges',
        providesTags: ['CollegeProfile']
    }),
    createReview: builder.mutation<any, any>({
        query: (reviewData) => ({
            url: 'admin/reviews',
            method: 'POST',
            body: reviewData,
        }),
        invalidatesTags: [{ type: 'Review', id: 'LIST' }],
    }),
    updateReview: builder.mutation<any, { reviewId: string; data: any }>({
      query: ({ reviewId, data }) => ({
        url: `admin/reviews/${reviewId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { reviewId }) => [{ type: 'Review', id: reviewId }],
    }),
    deleteReview: builder.mutation<{ success: boolean; message: string }, string>({
      query: (reviewId) => ({
        url: `admin/reviews/${reviewId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Review', id: 'LIST' }],
    }),
  }),
});

export const { 
    useGetAllReviewsQuery, 
    useGetCollegesForAdminQuery,
    useCreateReviewMutation, 
    useUpdateReviewMutation, 
    useDeleteReviewMutation 
} = adminReviewApi;