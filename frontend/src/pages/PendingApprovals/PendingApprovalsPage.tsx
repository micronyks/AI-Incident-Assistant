// =============================================================================
// PENDING APPROVALS PAGE — Coming in Sprint 3
// HITL (Human-in-the-Loop) workflow: review and approve/reject AI decisions
// =============================================================================
import { Box, Card, Typography, Button, Chip, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { TopBar } from '@/components/layout/TopBar/TopBar';

const PENDING_ITEMS = [
  {
    id: '003',
    title: 'Request access to AWS production console',
    category: 'ACCESS',
    priority: 'P3',
    aiDecision: 'ESCALATE_TO_HUMAN',
    aiReason: 'Access request requires security team approval per policy SEC-042.',
    suggestedTeam: 'Security & Compliance Team',
    submittedAt: '6h ago',
    requiredBy: 'Nikhil Kumar',
  },
  {
    id: '007',
    title: 'Install unlicensed software on dev machine',
    category: 'SOFTWARE',
    priority: 'P3',
    aiDecision: 'ESCALATE_TO_HUMAN',
    aiReason: 'Software license compliance check required before installation.',
    suggestedTeam: 'IT Governance Team',
    submittedAt: '1d ago',
    requiredBy: 'Priya Sharma',
  },
];

const PRIORITY_COLORS: Record<string, string> = {
  P1: '#ef4444', P2: '#f97316', P3: '#eab308', P4: '#22c55e',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

export function PendingApprovalsPage() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TopBar
        title="Pending Approvals"
        subtitle="Human-in-the-Loop decisions awaiting your review"
      />

      <Box sx={{ flex: 1, overflowY: 'auto', p: { xs: 2, md: 3 } }}>
        <Box sx={{ maxWidth: 900, mx: 'auto' }}>
          <motion.div variants={containerVariants} initial="hidden" animate="visible">

            {/* Header */}
            <motion.div variants={itemVariants}>
              <Box
                sx={{
                  mb: 3, p: 2.5, borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(236,72,153,0.1), rgba(99,102,241,0.08))',
                  border: '1px solid rgba(236,72,153,0.2)',
                  display: 'flex', alignItems: 'center', gap: 2,
                }}
              >
                <AccessTimeIcon sx={{ color: '#ec4899', fontSize: 28, flexShrink: 0 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {PENDING_ITEMS.length} items need your review
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    The AI reviewer flagged these incidents as requiring human judgment before proceeding.
                  </Typography>
                </Box>
              </Box>
            </motion.div>

            {/* Pending Items */}
            <Stack spacing={2}>
              {PENDING_ITEMS.map((item) => (
                <motion.div key={item.id} variants={itemVariants}>
                  <Card sx={{ p: 3 }}>
                    {/* Title Row */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                          {item.title}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          <Chip label={item.category} size="small" sx={{ fontSize: '0.7rem', height: 22 }} />
                          <Chip
                            label={item.priority}
                            size="small"
                            sx={{
                              fontSize: '0.7rem', height: 22, fontWeight: 700,
                              background: `${PRIORITY_COLORS[item.priority]}20`,
                              color: PRIORITY_COLORS[item.priority],
                            }}
                          />
                          <Typography variant="caption" color="text.disabled" sx={{ alignSelf: 'center' }}>
                            #{item.id} · {item.submittedAt}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* AI Reasoning */}
                    <Box
                      sx={{
                        p: 2, mb: 2, borderRadius: '10px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.07)',
                      }}
                    >
                      <Typography variant="caption" color="primary.light" fontWeight={600} display="block" gutterBottom>
                        🤖 AI Reviewer Decision
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.aiReason}
                      </Typography>
                      <Typography variant="caption" color="text.disabled" sx={{ mt: 1, display: 'block' }}>
                        Suggested team: <strong style={{ color: '#94a3b8' }}>{item.suggestedTeam}</strong>
                      </Typography>
                    </Box>

                    {/* Submitter */}
                    <Typography variant="caption" color="text.disabled" sx={{ mb: 2, display: 'block' }}>
                      Submitted by: <strong style={{ color: '#94a3b8' }}>{item.requiredBy}</strong>
                    </Typography>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircleIcon />}
                        sx={{ flex: 1, minWidth: 140 }}
                        onClick={() => alert(`Approving incident #${item.id} — backend HITL integration coming in Sprint 3`)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<CancelIcon />}
                        sx={{ flex: 1, minWidth: 140 }}
                        onClick={() => alert(`Rejecting incident #${item.id} — backend HITL integration coming in Sprint 3`)}
                      >
                        Reject
                      </Button>
                    </Box>
                  </Card>
                </motion.div>
              ))}
            </Stack>

            {/* Sprint Notice */}
            <motion.div variants={itemVariants}>
              <Box
                sx={{
                  mt: 3, p: 2.5, borderRadius: '12px',
                  background: 'rgba(99,102,241,0.05)',
                  border: '1px solid rgba(99,102,241,0.15)',
                  textAlign: 'center',
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  🚀 <strong style={{ color: '#818cf8' }}>Sprint 3:</strong> Full HITL integration with backend
                  LangGraph resume endpoint, approval audit trail, and notification system.
                </Typography>
              </Box>
            </motion.div>

          </motion.div>
        </Box>
      </Box>
    </Box>
  );
}
