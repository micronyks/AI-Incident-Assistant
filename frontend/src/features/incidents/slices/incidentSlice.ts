// =============================================================================
// INCIDENTS FEATURE — Redux Slice
// UI state for the incidents feature (form state, submission flow, etc.)
// =============================================================================
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IncidentAnalysis, IncidentRecord } from '@/types';

type SubmissionStep = 'form' | 'submitting' | 'analyzing' | 'success' | 'error';

interface IncidentState {
  submissionStep: SubmissionStep;
  submittedRecord: IncidentRecord | null;
  analysisResult: IncidentAnalysis | null;
  errorMessage: string | null;
}

const initialState: IncidentState = {
  submissionStep: 'form',
  submittedRecord: null,
  analysisResult: null,
  errorMessage: null,
};

const incidentSlice = createSlice({
  name: 'incidents',
  initialState,
  reducers: {
    setSubmissionStep(state, action: PayloadAction<SubmissionStep>) {
      state.submissionStep = action.payload;
    },
    setSubmittedRecord(state, action: PayloadAction<IncidentRecord>) {
      state.submittedRecord = action.payload;
    },
    setAnalysisResult(state, action: PayloadAction<IncidentAnalysis>) {
      state.analysisResult = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.errorMessage = action.payload;
      state.submissionStep = 'error';
    },
    resetSubmission(state) {
      state.submissionStep = 'form';
      state.submittedRecord = null;
      state.analysisResult = null;
      state.errorMessage = null;
    },
  },
});

export const {
  setSubmissionStep,
  setSubmittedRecord,
  setAnalysisResult,
  setError,
  resetSubmission,
} = incidentSlice.actions;

export default incidentSlice.reducer;
