// =============================================================================
// RTK QUERY — Base API Configuration
// Follows Dependency Inversion Principle: all features use this shared base
// =============================================================================
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@/constants';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      // Future: inject JWT token here
      // const token = (getState() as RootState).auth.token;
      // if (token) headers.set('Authorization', `Bearer ${token}`);
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Incident', 'Request'],
  endpoints: () => ({}),
});
