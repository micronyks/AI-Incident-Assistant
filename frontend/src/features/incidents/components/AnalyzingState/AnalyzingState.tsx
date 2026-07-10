// =============================================================================
// ANALYZING STATE COMPONENT
// Animated loading state while AI agents are processing
// =============================================================================
import { Box, Typography, LinearProgress } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const ANALYSIS_STEPS = [
  { icon: '🧠', label: 'Knowledge Agent', detail: 'Searching knowledge base and historical incidents...' },
  { icon: '🏷️', label: 'Classification Agent', detail: 'Determining incident category...' },
  { icon: '⚡', label: 'Priority Agent', detail: 'Assessing business impact and urgency...' },
  { icon: '🔍', label: 'Reviewer Agent', detail: 'Reviewing all agent outputs and forming consensus...' },
];

export function AnalyzingState() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % ANALYSIS_STEPS.length);
    }, 2200);

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 1, 95));
    }, 120);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        gap: 4,
      }}
    >
      {/* Animated AI Brain */}
      <Box sx={{ position: 'relative' }}>
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Box
            sx={{
              width: 88,
              height: 88,
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(99,102,241,0.3) 0%, rgba(99,102,241,0.05) 70%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid rgba(99,102,241,0.4)',
              boxShadow: '0 0 40px rgba(99,102,241,0.3)',
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          </Box>
        </motion.div>

        {/* Orbiting dots */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 8,
              height: 8,
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 2 + i * 0.5,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 0.3,
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: ['#6366f1', '#06b6d4', '#10b981'][i],
                top: -44 - i * 10,
                left: -4,
                boxShadow: `0 0 8px ${['#6366f1', '#06b6d4', '#10b981'][i]}`,
              }}
            />
          </motion.div>
        ))}
      </Box>

      {/* Title */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          AI Agents Analyzing
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Our multi-agent system is processing your incident
        </Typography>
      </Box>

      {/* Progress Bar */}
      <Box sx={{ width: '100%', maxWidth: 400 }}>
        <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
        <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block', textAlign: 'right' }}>
          {progress}%
        </Typography>
      </Box>

      {/* Current Step */}
      <Box
        sx={{
          width: '100%',
          maxWidth: 440,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        {ANALYSIS_STEPS.map((step, index) => {
          const isActive = index === currentStep;
          const isDone = index < currentStep;

          return (
            <motion.div
              key={step.label}
              animate={{
                opacity: isActive ? 1 : isDone ? 0.5 : 0.25,
                scale: isActive ? 1.02 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 1.5,
                  borderRadius: '10px',
                  background: isActive
                    ? 'rgba(99,102,241,0.1)'
                    : 'transparent',
                  border: isActive
                    ? '1px solid rgba(99,102,241,0.3)'
                    : '1px solid transparent',
                  transition: 'all 0.3s ease',
                }}
              >
                <Typography fontSize="1.2rem">{step.icon}</Typography>
                <Box>
                  <Typography variant="body2" fontWeight={600} sx={{ lineHeight: 1.2 }}>
                    {step.label}
                  </Typography>
                  <AnimatePresence mode="wait">
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <Typography variant="caption" color="text.disabled">
                          {step.detail}
                        </Typography>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Box>
                {isDone && (
                  <Box sx={{ ml: 'auto', color: '#10b981', fontSize: '1rem' }}>
                    ✓
                  </Box>
                )}
                {isActive && (
                  <motion.div
                    style={{ marginLeft: 'auto' }}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: '#6366f1',
                      }}
                    />
                  </motion.div>
                )}
              </Box>
            </motion.div>
          );
        })}
      </Box>
    </Box>
  );
}
