// =============================================================================
// INCIDENTS FEATURE — Zod Validation Schema
// =============================================================================
import { z } from 'zod';
import { VALIDATION_MESSAGES } from '@/constants';

export const incidentFormSchema = z.object({
  title: z
    .string()
    .min(10, VALIDATION_MESSAGES.titleMin)
    .max(200, VALIDATION_MESSAGES.titleMax),
  description: z
    .string()
    .min(30, VALIDATION_MESSAGES.descriptionMin)
    .max(5000, VALIDATION_MESSAGES.descriptionMax),
  category: z.enum([
    'BUG',
    'FEATURE',
    'HARDWARE',
    'SOFTWARE',
    'NETWORK',
    'ACCESS',
    'SECURITY',
    'OTHER',
  ]),
  priority: z.enum(['P1', 'P2', 'P3', 'P4']),
});

export type IncidentFormValues = z.infer<typeof incidentFormSchema>;
