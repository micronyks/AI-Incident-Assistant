// =============================================================================
// INCIDENT FORM — Main Form Component
// MUI v6+ compliant: uses slotProps instead of deprecated InputProps
// =============================================================================
import {
  Box,
  TextField,
  Button,
  Typography,
  Divider,
  CircularProgress,
} from '@mui/material';
import TitleIcon from '@mui/icons-material/Title';
import DescriptionIcon from '@mui/icons-material/Description';
import SendIcon from '@mui/icons-material/Send';
import { Controller } from 'react-hook-form';
import { motion } from 'framer-motion';

import { CategorySelector } from '../CategorySelector/CategorySelector';
import { PrioritySelector } from '../PrioritySelector/PrioritySelector';
import { FileDropzone } from '../FileDropzone/FileDropzone';
import type { IncidentFormValues } from '../../schemas/incidentSchema';
import type { UseFormReturn } from 'react-hook-form';
import type { IncidentCategory, IncidentPriority } from '@/types';

interface IncidentFormProps {
  form: UseFormReturn<IncidentFormValues>;
  onSubmit: (values: IncidentFormValues) => void;
  isLoading: boolean;
}

export function IncidentForm({ form, onSubmit, isLoading }: IncidentFormProps) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = form;

  const descriptionValue = watch('description') ?? '';
  const titleValue = watch('title') ?? '';

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
    >
      {/* ── Title ──────────────────────────────────────────────────────────── */}
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Incident Title"
            placeholder="Brief summary of the issue or request..."
            fullWidth
            required
            error={!!errors.title}
            helperText={errors.title?.message ?? `${titleValue.length}/200 characters`}
            slotProps={{
              input: {
                startAdornment: (
                  <TitleIcon sx={{ color: 'text.disabled', fontSize: 20, mr: 1 }} />
                ),
              },
            }}
          />
        )}
      />

      {/* ── Category ───────────────────────────────────────────────────────── */}
      <Controller
        name="category"
        control={control}
        render={({ field }) => (
          <CategorySelector
            value={field.value as IncidentCategory}
            onChange={field.onChange}
            error={errors.category?.message}
          />
        )}
      />

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />

      {/* ── Priority ───────────────────────────────────────────────────────── */}
      <Controller
        name="priority"
        control={control}
        render={({ field }) => (
          <PrioritySelector
            value={field.value as IncidentPriority}
            onChange={field.onChange}
            error={errors.priority?.message}
          />
        )}
      />

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />

      {/* ── Description ────────────────────────────────────────────────────── */}
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Detailed Description"
            placeholder="Describe the issue in detail. Include steps to reproduce, expected vs actual behavior, environment, error messages..."
            fullWidth
            required
            multiline
            rows={6}
            error={!!errors.description}
            helperText={errors.description?.message ?? `${descriptionValue.length}/5000 characters`}
            slotProps={{
              input: {
                startAdornment: (
                  <DescriptionIcon
                    sx={{
                      color: 'text.disabled',
                      fontSize: 20,
                      mr: 1,
                      alignSelf: 'flex-start',
                      mt: 0.5,
                    }}
                  />
                ),
              },
            }}
          />
        )}
      />

      {/* ── File Attachments ───────────────────────────────────────────────── */}
      <FileDropzone />

      {/* ── Pro Tip ────────────────────────────────────────────────────────── */}
      <Box
        sx={{
          p: 2,
          borderRadius: '10px',
          background: 'rgba(99,102,241,0.06)',
          border: '1px solid rgba(99,102,241,0.15)',
        }}
      >
        <Typography variant="caption" color="text.secondary">
          💡{' '}
          <strong style={{ color: '#818cf8' }}>Pro tip:</strong> The more
          detail you provide, the better our AI agents can analyze and
          prioritize your incident. Include error messages, affected systems,
          and business impact.
        </Typography>
      </Box>

      {/* ── Submit Button ──────────────────────────────────────────────────── */}
      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={isLoading || !isValid}
          endIcon={
            isLoading ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <SendIcon sx={{ fontSize: 18 }} />
            )
          }
          sx={{ py: 1.5, fontSize: '1rem' }}
        >
          {isLoading ? 'Processing...' : 'Submit Incident'}
        </Button>
      </motion.div>

      <Typography variant="caption" color="text.disabled" textAlign="center">
        By submitting, AI agents will automatically analyze and categorize your
        incident.
      </Typography>
    </Box>
  );
}
