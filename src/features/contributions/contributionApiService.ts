import { apiService } from '../api/apiService';

export const contributionApi = apiService.injectEndpoints({
    endpoints: (builder) => ({
        // Salary Endpoints
        getMySalaries: builder.query<any[], void>({
            query: () => 'contributions/salaries',
            providesTags: ['Salary'],
        }),
        addSalary: builder.mutation<any, any>({
            query: (data) => ({ url: 'contributions/salaries', method: 'POST', body: data }),
            invalidatesTags: ['Salary'],
        }),
        updateSalary: builder.mutation<any, { id: string; data: any }>({
            query: ({ id, data }) => ({ url: `contributions/salaries/${id}`, method: 'PUT', body: data }),
            invalidatesTags: ['Salary'],
        }),
        deleteSalary: builder.mutation<any, string>({
            query: (id) => ({ url: `contributions/salaries/${id}`, method: 'DELETE' }),
            invalidatesTags: ['Salary'],
        }),

        // Interview Endpoints
        getMyInterviews: builder.query<any[], void>({
            query: () => 'contributions/interviews',
            providesTags: ['Interview'],
        }),
        addInterview: builder.mutation<any, any>({
            query: (data) => ({ url: 'contributions/interviews', method: 'POST', body: data }),
            invalidatesTags: ['Interview'],
        }),
        updateInterview: builder.mutation<any, { id: string; data: any }>({
            query: ({ id, data }) => ({ url: `contributions/interviews/${id}`, method: 'PUT', body: data }),
            invalidatesTags: ['Interview'],
        }),
        deleteInterview: builder.mutation<any, string>({
            query: (id) => ({ url: `contributions/interviews/${id}`, method: 'DELETE' }),
            invalidatesTags: ['Interview'],
        }),

        // Photo Endpoints
        getMyPhotos: builder.query<any[], void>({
            query: () => 'contributions/photos',
            providesTags: ['Photo'],
        }),
        addPhoto: builder.mutation<any, FormData>({
            query: (formData) => ({ url: 'contributions/photos', method: 'POST', body: formData }),
            invalidatesTags: ['Photo'],
        }),
        deletePhoto: builder.mutation<any, string>({
            query: (id) => ({ url: `contributions/photos/${id}`, method: 'DELETE' }),
            invalidatesTags: ['Photo'],
        }),
    }),
});

export const {
    useGetMySalariesQuery, useAddSalaryMutation, useUpdateSalaryMutation, useDeleteSalaryMutation,
    useGetMyInterviewsQuery, useAddInterviewMutation, useUpdateInterviewMutation, useDeleteInterviewMutation,
    useGetMyPhotosQuery, useAddPhotoMutation, useDeletePhotoMutation
} = contributionApi;