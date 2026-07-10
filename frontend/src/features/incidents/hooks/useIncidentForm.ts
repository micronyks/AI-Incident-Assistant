// =============================================================================
// INCIDENTS FEATURE — useIncidentForm Custom Hook
// Encapsulates ALL form logic — Single Responsibility Principle
// =============================================================================
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';

import {
  incidentFormSchema,
  type IncidentFormValues,
} from '../schemas/incidentSchema';
import {
  setSubmissionStep,
  setSubmittedRecord,
  setAnalysisResult,
  setError,
} from '../slices/incidentSlice';
import {
  useCreateRequestMutation,
  useAnalyzeIncidentMutation,
} from '../api/incidentApi';
import type { RootState } from '@/store';

export function useIncidentForm() {
  const dispatch = useDispatch();
  const { submissionStep, analysisResult, errorMessage } = useSelector(
    (state: RootState) => state.incidents,
  );

  const [createRequest, { isLoading: isCreating }] = useCreateRequestMutation();
  const [analyzeIncident, { isLoading: isAnalyzing }] =
    useAnalyzeIncidentMutation();

  const form = useForm<IncidentFormValues>({
    resolver: zodResolver(incidentFormSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'BUG',
      priority: 'P3',
    },
    mode: 'onChange',
  });

  const onSubmit = useCallback(
    async (values: IncidentFormValues) => {
      try {
        // Step 1: Save to database
        dispatch(setSubmissionStep('submitting'));
        toast.loading('Saving incident...', { id: 'incident-submit' });

        const record = await createRequest(values).unwrap();
        dispatch(setSubmittedRecord(record));

        // Step 2: Trigger AI analysis
        dispatch(setSubmissionStep('analyzing'));
        toast.loading('AI agents are analyzing your incident...', {
          id: 'incident-submit',
        });

        const analysis = await analyzeIncident({
          title: values.title,
          description: values.description,
          reported_category: values.category,
        }).unwrap();

        dispatch(setAnalysisResult(analysis));
        dispatch(setSubmissionStep('success'));
        toast.success('Incident submitted and analyzed!', {
          id: 'incident-submit',
        });
      } catch (err: unknown) {
        const message =
          err && typeof err === 'object' && 'data' in err
            ? String((err as { data: unknown }).data)
            : 'Failed to submit incident. Please try again.';
        dispatch(setError(message));
        toast.error(message, { id: 'incident-submit' });
      }
    },
    [createRequest, analyzeIncident, dispatch],
  );

  return {
    form,
    onSubmit,
    isLoading: isCreating || isAnalyzing,
    submissionStep,
    analysisResult,
    errorMessage,
  };
}
