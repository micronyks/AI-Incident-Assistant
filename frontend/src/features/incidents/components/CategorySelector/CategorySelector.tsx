// =============================================================================
// CATEGORY SELECTOR COMPONENT
// =============================================================================
import { Box, Typography, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import { CATEGORY_OPTIONS } from '@/constants';
import type { IncidentCategory } from '@/types';

interface CategorySelectorProps {
  value: IncidentCategory;
  onChange: (category: IncidentCategory) => void;
  error?: string;
}

export function CategorySelector({
  value,
  onChange,
  error,
}: CategorySelectorProps) {
  return (
    <Box>
      <Typography
        variant="body2"
        sx={{ mb: 1.5, color: 'text.secondary', fontWeight: 500 }}
      >
        Incident Category <span style={{ color: '#ef4444' }}>*</span>
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: 1.5,
        }}
      >
        {CATEGORY_OPTIONS.map((option) => {
          const isSelected = value === option.value;

          return (
            <Tooltip
              key={option.value}
              title={option.description ?? ''}
              placement="top"
              arrow
            >
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onChange(option.value)}
                style={{ cursor: 'pointer' }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: '12px',
                    border: isSelected
                      ? `2px solid ${option.color}`
                      : '2px solid rgba(255,255,255,0.07)',
                    background: isSelected
                      ? `${option.color}15`
                      : 'rgba(255,255,255,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 0.5,
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected
                      ? `0 0 20px ${option.color}25`
                      : 'none',
                    '&:hover': {
                      borderColor: option.color,
                      background: `${option.color}10`,
                    },
                  }}
                >
                  <Typography sx={{ fontSize: '1.5rem', lineHeight: 1 }}>
                    {option.icon}
                  </Typography>
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    sx={{
                      color: isSelected ? option.color : 'text.secondary',
                      fontSize: '0.72rem',
                      lineHeight: 1.2,
                      textAlign: 'center',
                    }}
                  >
                    {option.label}
                  </Typography>
                </Box>
              </motion.div>
            </Tooltip>
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
