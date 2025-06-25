import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/';

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiService = createApi({
  reducerPath: 'api',
  baseQuery: baseQuery,
  tagTypes: ['User', 'EmployerProfile', 'CollegeProfile', 'AdminProfile', 'Job', 'Application', 'Notification', 'Salary', 'Interview', 'Photo', 'SalaryGuide',
    'CareerArticle', 'Review', 'Resource', 'PressArticle', 'EmployerJob'],
  endpoints: () => ({}),
});