// =============================================================================
// SUBMIT INCIDENT PAGE — individual icon path imports
// =============================================================================
import { Box, Button, Typography, Card } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { TopBar } from '@/components/layout/TopBar/TopBar';
import { IncidentForm } from '@/features/incidents/components/IncidentForm/IncidentForm';
import { AnalyzingState } from '@/features/incidents/components/AnalyzingState/AnalyzingState';
import { AnalysisResultPanel } from '@/features/incidents/components/AnalysisResultPanel/AnalysisResultPanel';
import { useIncidentForm } from '@/features/incidents/hooks/useIncidentForm';
import { resetSubmission } from '@/features/incidents/slices/incidentSlice';

const pageVariants = {
  initial: { opacity: 0, y: 24 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -24, transition: { duration: 0.25 } },
};

export function SubmitIncidentPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { form, onSubmit, isLoading, submissionStep, analysisResult } = useIncidentForm();

  const handleReset = () => {
    dispatch(resetSubmission());
    form.reset();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TopBar
        title="Submit Incident"
        subtitle="Report a bug, request a feature, or raise a support ticket"
      />

      <Box sx={{ flex: 1, overflowY: 'auto', p: { xs: 2, md: 4 } }}>
        <Box
          sx={{
            maxWidth: 1100, mx: 'auto',
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
            gap: 3, alignItems: 'start',
          }}
        >
          {/* ── LEFT ── */}
          <Box>
            <AnimatePresence mode="wait">
              {(submissionStep === 'form' || submissionStep === 'submitting' || submissionStep === 'error') && (
                <motion.div key="form" variants={pageVariants} initial="initial" animate="enter" exit="exit">
                  <Card sx={{ p: { xs: 2.5, md: 3.5 } }}>
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background:
                              'linear-gradient(135deg, #6366f1, #06b6d4)',
                          }}
                        />
                        <Typography variant="h6" fontWeight={700}>
                          Incident Details
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Fill in the details below. AI agents will automatically
                        analyze and prioritize your incident.
                      </Typography>
                    </Box>
                    <IncidentForm
                      form={form}
                      onSubmit={onSubmit}
                      isLoading={isLoading}
                    />
                  </Card>
                </motion.div>
              )}

              {submissionStep === 'analyzing' && (
                <motion.div key="analyzing" variants={pageVariants} initial="initial" animate="enter" exit="exit">
                  <Card sx={{ p: 3 }}>
                    <AnalyzingState />
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>

          {/* ── RIGHT ── */}
          <Box>
            <AnimatePresence mode="wait">
              {submissionStep === 'success' && analysisResult ? (
                <motion.div key="results" variants={pageVariants} initial="initial" animate="enter" exit="exit">
                  <Box sx={{ display: 'flex', gap: 2, mb: 2.5, flexWrap: 'wrap' }}>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={handleReset} sx={{ flex: 1 }}>
                      Submit Another
                    </Button>
                    <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate('/incidents')} sx={{ flex: 1 }}>
                      View All Incidents
                    </Button>
                  </Box>
                  <AnalysisResultPanel analysis={analysisResult} />
                </motion.div>
              ) : (
                <motion.div key="info" variants={pageVariants} initial="initial" animate="enter" exit="exit">
                  <InfoPanel />
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

// ── Info Panel ───────────────────────────────────────────────────────────────
function InfoPanel() {
  const AGENT_FEATURES = [
    { icon: '🧠', title: 'Knowledge Agent', desc: 'Searches the knowledge base and historical incidents for similar cases', color: '#8b5cf6' },
    { icon: '🏷️', title: 'Classification Agent', desc: 'Determines the correct category with confidence scoring', color: '#06b6d4' },
    { icon: '⚡', title: 'Priority Agent', desc: 'Assesses business impact and assigns P1–P4 priority', color: '#f59e0b' },
    { icon: '🔍', title: 'Reviewer Agent', desc: 'Reviews all outputs and decides if human approval is needed', color: '#10b981' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Card sx={{ p: 2.5 }}>
        <Typography variant="subtitle2" fontWeight={700} mb={2} color="primary.light">
          ✨ How AI Analysis Works
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {AGENT_FEATURES.map((agent) => (
            <motion.div key={agent.title} whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 400 }}>
              <Box
                sx={{
                  display: 'flex', gap: 1.5, p: 1.5, borderRadius: '10px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  '&:hover': { background: 'rgba(255,255,255,0.04)', borderColor: `${agent.color}30` },
                  transition: 'all 0.2s ease',
                }}
              >
                <Typography sx={{ fontSize: '1.3rem', lineHeight: 1 }}>{agent.icon}</Typography>
                <Box>
                  <Typography variant="body2" fontWeight={600} sx={{ color: agent.color }}>
                    {agent.title}
                  </Typography>
                  <Typography variant="caption" color="text.disabled">{agent.desc}</Typography>
                </Box>
              </Box>
            </motion.div>
          ))}
        </Box>
      </Card>

      <Card sx={{ p: 2.5 }}>
        <Typography variant="subtitle2" fontWeight={700} mb={1.5} color="primary.light">
          ⏱️ Response SLAs
        </Typography>
        {[
          { priority: 'P1 — Critical', time: '< 1 hour', color: '#ef4444' },
          { priority: 'P2 — High', time: '< 4 hours', color: '#f97316' },
          { priority: 'P3 — Medium', time: '< 1 business day', color: '#eab308' },
          { priority: 'P4 — Low', time: '< 3 business days', color: '#22c55e' },
        ].map((sla) => (
          <Box
            key={sla.priority}
            sx={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              py: 0.75, borderBottom: '1px solid rgba(255,255,255,0.04)',
              '&:last-child': { borderBottom: 'none' },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: sla.color, flexShrink: 0 }} />
              <Typography variant="body2" color="text.secondary" fontSize="0.8rem">{sla.priority}</Typography>
            </Box>
            <Typography variant="caption" fontWeight={600} sx={{ color: sla.color }}>{sla.time}</Typography>
          </Box>
        ))}
      </Card>
    </Box>
  );
}
