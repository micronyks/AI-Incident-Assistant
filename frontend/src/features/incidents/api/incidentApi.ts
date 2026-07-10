// =============================================================================
// INCIDENTS FEATURE — RTK Query API Slice
// Encapsulates all incident-related API operations
// =============================================================================
import { baseApi } from '@/services/api/baseApi';
import type {
  CreateIncidentPayload,
  IncidentRecord,
  IncidentAnalysis,
} from '@/types';

export const incidentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── Create a new request (save to DB before AI analysis)
    createRequest: builder.mutation<IncidentRecord, CreateIncidentPayload>({
      query: (body) => ({
        url: '/requests',
        // Note: /requests is at root, not under /api/v1
        // Override base URL for this endpoint
        baseUrl: '/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Request'],
    }),

    // ── Trigger AI analysis on an incident
    analyzeIncident: builder.mutation<
      IncidentAnalysis,
      { title: string; description: string; reported_category: string }
    >({
      query: (body) => ({
        url: '/incidents/analyze',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Incident'],
    }),

    // ── Resume a paused HITL workflow
    resumeIncident: builder.mutation<
      IncidentAnalysis,
      { thread_id: string; status: string; approved_by: string }
    >({
      query: (body) => ({
        url: '/incidents/resume',
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateRequestMutation,
  useAnalyzeIncidentMutation,
  useResumeIncidentMutation,
} = incidentApi;
