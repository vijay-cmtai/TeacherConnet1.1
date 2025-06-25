import { apiService } from '../api/apiService';
import { User } from '@/types/user';

interface AuthResponse {
  success: boolean;
  user: User;
  message?: string;
}

interface MeResponse {
  success: boolean;
  data: User;
}

export const authApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<MeResponse, void>({
      query: () => 'auth/me',
      providesTags: ['User'],
    }),
    login: builder.mutation<AuthResponse, any>({
      query: (credentials) => ({ url: 'auth/login', method: 'POST', body: credentials }),
    }),
    signup: builder.mutation<AuthResponse, any>({
      query: (userInfo) => ({ url: 'auth/signup', method: 'POST', body: userInfo }),
    }),
    googleLogin: builder.mutation<AuthResponse, { token: string; role?: string }>({
      query: (credentials) => ({
        url: 'auth/google',
        method: 'POST',
        body: credentials,
      }),
    }),
    updatePassword: builder.mutation({
      query: (credentials) => ({ url: 'auth/updatepassword', method: 'PUT', body: credentials }),
    }),
    deleteAccount: builder.mutation({
      query: (credentials) => ({ url: 'auth/deleteaccount', method: 'DELETE', body: credentials }),
    }),
    logout: builder.mutation({
      query: () => ({ url: 'auth/logout', method: 'POST' }),
    }),
  }),
});

export const {
  useGetMeQuery,
  useLoginMutation,
  useSignupMutation,
  useGoogleLoginMutation,
  useUpdatePasswordMutation,
  useDeleteAccountMutation,
  useLogoutMutation,
} = authApi;
