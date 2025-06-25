import { apiService } from '../api/apiService';
import { EmployerProfile, WorkExperience, Education, Skill, NotificationSettings, Application } from '@/types/employer';

interface UpdateApplicationPayload extends Partial<Application> {
    action?: 'accept_offer' | 'decline_offer';
}

export const employerProfileApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    getEmployerProfile: builder.query<EmployerProfile, void>({ query: () => 'employer/profile', providesTags: ['EmployerProfile'], }),
    updateEmployerProfileDetails: builder.mutation<EmployerProfile, Partial<EmployerProfile>>({ query: (details) => ({ url: 'employer/profile', method: 'PUT', body: details }), invalidatesTags: ['EmployerProfile'], }),
    updateProfileVisibility: builder.mutation<EmployerProfile, { isVisible: boolean }>({ query: (payload) => ({ url: 'employer/profile/visibility', method: 'PUT', body: payload }), invalidatesTags: ['EmployerProfile'], }),
    addExperience: builder.mutation<WorkExperience, Omit<WorkExperience, '_id'>>({ query: (experience) => ({ url: 'employer/experience', method: 'POST', body: experience }), invalidatesTags: ['EmployerProfile'], }),
    updateExperience: builder.mutation<WorkExperience, WorkExperience>({ query: ({ _id, ...experience }) => ({ url: `employer/experience/${_id}`, method: 'PUT', body: experience }), invalidatesTags: ['EmployerProfile'], }),
    deleteExperience: builder.mutation<{ message: string }, string>({ query: (expId) => ({ url: `employer/experience/${expId}`, method: 'DELETE' }), invalidatesTags: ['EmployerProfile'], }),
    addEducation: builder.mutation<Education, Omit<Education, '_id'>>({ query: (education) => ({ url: 'employer/education', method: 'POST', body: education }), invalidatesTags: ['EmployerProfile'], }),
    updateEducation: builder.mutation<Education, Education>({ query: ({ _id, ...education }) => ({ url: `employer/education/${_id}`, method: 'PUT', body: education }), invalidatesTags: ['EmployerProfile'], }),
    deleteEducation: builder.mutation<{ message: string }, string>({ query: (eduId) => ({ url: `employer/education/${eduId}`, method: 'DELETE' }), invalidatesTags: ['EmployerProfile'], }),
    updateSkills: builder.mutation<Skill[], { skills: string[] }>({ query: (skills) => ({ url: 'employer/skills', method: 'PUT', body: skills }), invalidatesTags: ['EmployerProfile'], }),
    updateEmployerNotificationSettings: builder.mutation<NotificationSettings, Partial<NotificationSettings>>({ query: (settings) => ({ url: 'employer/settings/notifications', method: 'PUT', body: settings }), invalidatesTags: ['EmployerProfile'], }),
    getMyApplications: builder.query<Application[], string | void>({ query: (category = 'applied') => `employer/applications?category=${category}`, providesTags: (result) => result ? [ ...result.map(({ _id }) => ({ type: 'Application' as const, id: _id })), { type: 'Application', id: 'LIST' } ] : [{ type: 'Application', id: 'LIST' }], }),
    updateApplication: builder.mutation<Application, { appId: string; body: UpdateApplicationPayload }>({ query: ({ appId, body }) => ({ url: `employer/applications/${appId}`, method: 'PUT', body }), invalidatesTags: (result, error, { appId }) => [{ type: 'Application', id: appId }, { type: 'Application', id: 'LIST' }], }),
    applyToJob: builder.mutation<Application, string>({ query: (jobId) => ({ url: `employer/applications/apply/${jobId}`, method: 'POST' }), invalidatesTags: [{ type: 'Application', id: 'LIST' }], }),
    saveJob: builder.mutation<Application, string>({ query: (jobId) => ({ url: `employer/applications/save/${jobId}`, method: 'POST' }), invalidatesTags: [{ type: 'Application', id: 'LIST' }], }),
    unsaveJob: builder.mutation<{ message: string }, string>({ query: (appId) => ({ url: `employer/applications/save/${appId}`, method: 'DELETE' }), invalidatesTags: [{ type: 'Application', id: 'LIST' }], }),
    withdrawApplication: builder.mutation<{ message: string }, string>({ query: (appId) => ({ url: `employer/applications/${appId}`, method: 'DELETE' }), invalidatesTags: [{ type: 'Application', id: 'LIST' }], }),
    uploadProfilePicture: builder.mutation<{ url: string }, File>({ query: (file) => { const formData = new FormData(); formData.append('profilePicture', file); return { url: 'employer/upload/picture', method: 'POST', body: formData }; }, invalidatesTags: ['EmployerProfile'], }),
    uploadDemoVideo: builder.mutation<{ url: string }, File>({ query: (file) => { const formData = new FormData(); formData.append('demoVideo', file); return { url: 'employer/upload/video', method: 'POST', body: formData }; }, invalidatesTags: ['EmployerProfile'], }),
    uploadDocument: builder.mutation<{ url: string }, File>({ query: (file) => { const formData = new FormData(); formData.append('document', file); return { url: 'employer/upload/document', method: 'POST', body: formData }; }, invalidatesTags: ['EmployerProfile'], }),
    submitAcceptance: builder.mutation<Application, { appId: string; data: FormData }>({
        query: ({ appId, data }) => ({
            url: `employer/applications/${appId}/submit-acceptance`,
            method: 'POST',
            body: data,
        }),
        invalidatesTags: (result, error, { appId }) => [{ type: 'Application', id: appId }, { type: 'Application', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetEmployerProfileQuery, useUpdateEmployerProfileDetailsMutation, useUpdateProfileVisibilityMutation,
  useAddExperienceMutation, useUpdateExperienceMutation, useDeleteExperienceMutation,
  useAddEducationMutation, useUpdateEducationMutation, useDeleteEducationMutation,
  useUpdateSkillsMutation, useUpdateEmployerNotificationSettingsMutation,
  useGetMyApplicationsQuery, useUpdateApplicationMutation, useApplyToJobMutation, useSaveJobMutation, useUnsaveJobMutation,
  useWithdrawApplicationMutation, useUploadProfilePictureMutation, useUploadDemoVideoMutation, useUploadDocumentMutation,
  useSubmitAcceptanceMutation,
} = employerProfileApi;