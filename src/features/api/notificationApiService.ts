import { apiService } from './apiService';

export const notificationApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    getMyNotifications: builder.query<any[], void>({
      query: () => 'notifications',
      providesTags: (result) => result ? [ ...result.map(({ _id }) => ({ type: 'Notification' as const, id: _id })), { type: 'Notification', id: 'LIST' } ] : [{ type: 'Notification', id: 'LIST' }],
    }),
    markAllAsRead: builder.mutation<void, void>({
      query: () => ({ url: 'notifications/read', method: 'PUT' }),
      invalidatesTags: [{ type: 'Notification', id: 'LIST' }],
    }),
    markOneAsRead: builder.mutation<void, string>({
      query: (notifId) => ({ url: `notifications/${notifId}/read`, method: 'PUT' }),
      invalidatesTags: (result, error, notifId) => [{ type: 'Notification', id: notifId }],
    }),
  }),
});

export const { useGetMyNotificationsQuery, useMarkAllAsReadMutation, useMarkOneAsReadMutation } = notificationApi;