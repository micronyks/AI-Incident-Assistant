// =============================================================================
// PRIORITY SELECTOR COMPONENT
// Segmented control-style priority picker with urgency indicators
// =============================================================================
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { PRIORITY_OPTIONS } from '@/constants';
import type { IncidentPriority } from '@/types';

interface PrioritySelectorProps {
  value: IncidentPriority;
  onChange: (priority: IncidentPriority) => void;
  error?: string;
}

export function PrioritySelector({
  value,
  onChange,
  error,
}: PrioritySelectorProps) {
  return (
    <Box>
      <Typography
        variant="body2"
        sx={{ mb: 1.5, color: 'text.secondary', fontWeight: 500 }}
      >
        Priority Level <span style={{ color: '#ef4444' }}>*</span>
      </Typography>

      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        {PRIORITY_OPTIONS.map((option) => {
          const isSelected = value === option.value;

          return (
            <motion.div
              key={option.value}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onChange(option.value)}
              style={{ flex: 1, minWidth: '120px', cursor: 'pointer' }}
            >
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: '12px',
                  border: isSelected
                    ? `2px solid ${option.color}`
                    : '2px solid rgba(255,255,255,0.07)',
                  background: isSelected
                    ? `${option.color}18`
                    : 'rgba(255,255,255,0.02)',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? `0 0 20px ${option.color}25` : 'none',
                  '&:hover': {
                    borderColor: option.color,
                    background: `${option.color}10`,
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {/* Color dot indicator */}
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: option.color,
                      flexShrink: 0,
                      boxShadow: isSelected
                        ? `0 0 8px ${option.color}`
                        : 'none',
                    }}
                  />
                  <Box>
                    <Typography
                      variant="caption"
                      fontWeight={700}
                      sx={{
                        color: isSelected ? option.color : 'text.primary',
                        display: 'block',
                        fontSize: '0.8rem',
                      }}
                    >
                      {option.label}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.disabled',
                        fontSize: '0.68rem',
                        lineHeight: 1.3,
                        display: 'block',
                      }}
                    >
                      {option.description}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </motion.div>
          );
        })}
      </Box>

      {error && (
        <Typography
          variant="caption"
          color="error"
          sx={{ mt: 0.75, display: 'block' }}
        >
          {error}
        </Typography>
      )}
    </Box>
  );
}
