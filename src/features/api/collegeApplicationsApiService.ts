import { apiService } from './apiService';

export const collegeApplicationsApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    getCollegeApplications: builder.query<any[], void>({
      query: () => 'college/applications',
      providesTags: (result) => result ? [ ...result.map(({ _id }) => ({ type: 'Application' as const, id: _id })), { type: 'Application', id: 'LIST' } ] : [{ type: 'Application', id: 'LIST' }],
    }),
    getShortlistedApplications: builder.query<any[], void>({
        query: () => 'college/applications/shortlisted',
        providesTags: (result) => result ? [ ...result.map(({ _id }) => ({ type: 'Application'as const, id: _id })), { type: 'Application', id: 'LIST' } ] : [{ type: 'Application', id: 'LIST' }],
    }),
    getOfferStageApplications: builder.query<any[], void>({
        query: () => 'college/applications/offers',
        providesTags: (result) => result ? [ ...result.map(({ _id }) => ({ type: 'Application' as const, id: _id })), { type: 'Application', id: 'LIST' } ] : [{ type: 'Application', id: 'LIST' }],
    }),
    updateApplicationStatus: builder.mutation<any, { appId: string; status: string }>({
      query: ({ appId, status }) => ({ url: `college/applications/${appId}/status`, method: 'PUT', body: { status } }),
      invalidatesTags: (result, error, { appId }) => [{ type: 'Application', id: appId }],
    }),
    scheduleInterview: builder.mutation<any, { appId: string; details: any }>({
        query: ({ appId, details }) => ({ url: `college/applications/${appId}/schedule-interview`, method: 'PUT', body: details }),
        invalidatesTags: (result, error, { appId }) => [{ type: 'Application', id: appId }],
    }),
    uploadOfferLetter: builder.mutation<any, { appId: string; formData: FormData }>({
        query: ({ appId, formData }) => ({
            url: `/college/applications/${appId}/update-status`,
            method: 'PUT',
            body: formData,
        }),
        invalidatesTags: (result, error, { appId }) => [{ type: 'Application', id: appId }],
    }),
    finalizeHiring: builder.mutation<any, { appId: string; status: 'hired' | 'rejected' }>({
        query: ({ appId, status }) => ({
            url: `college/applications/${appId}/finalize-hiring`,
            method: 'PUT',
            body: { status },
        }),
        invalidatesTags: (result, error, { appId }) => [{ type: 'Application', id: appId }],
    }),
  }),
});

export const { useGetCollegeApplicationsQuery, useGetShortlistedApplicationsQuery, useGetOfferStageApplicationsQuery, useUpdateApplicationStatusMutation, useScheduleInterviewMutation, useUploadOfferLetterMutation, useFinalizeHiringMutation } = collegeApplicationsApi;