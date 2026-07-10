// =============================================================================
// MY INCIDENTS PAGE — Coming in Sprint 2
// Shows the user's submitted incidents with filtering and status tracking
// =============================================================================
import { Box, Card, Typography, Button, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import { TopBar } from '@/components/layout/TopBar/TopBar';

const PLACEHOLDER_INCIDENTS = [
  { id: '001', title: 'VPN disconnection on macOS Sequoia', category: 'NETWORK', priority: 'P2', status: 'IN_PROGRESS', time: '2h ago' },
  { id: '002', title: 'Dashboard loading slow for enterprise users', category: 'BUG', priority: 'P1', status: 'AI_ANALYZING', time: '4h ago' },
  { id: '003', title: 'Request access to AWS production console', category: 'ACCESS', priority: 'P3', status: 'WAITING_FOR_APPROVAL', time: '6h ago' },
  { id: '004', title: 'Add dark mode to mobile app', category: 'FEATURE', priority: 'P4', status: 'OPEN', time: '1d ago' },
  { id: '005', title: 'Laptop keyboard malfunction', category: 'HARDWARE', priority: 'P2', status: 'RESOLVED', time: '2d ago' },
];

const STATUS_COLORS: Record<string, string> = {
  SUBMITTED: '#6b7280', AI_ANALYZING: '#8b5cf6', OPEN: '#3b82f6',
  IN_PROGRESS: '#f59e0b', WAITING_FOR_APPROVAL: '#ec4899',
  RESOLVED: '#10b981', CLOSED: '#6b7280', APPROVED: '#10b981', REJECTED: '#ef4444',
};
const PRIORITY_COLORS: Record<string, string> = {
  P1: '#ef4444', P2: '#f97316', P3: '#eab308', P4: '#22c55e',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };

export function MyIncidentsPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TopBar title="My Incidents" subtitle="Track all your submitted incidents and requests" />

      <Box sx={{ flex: 1, overflowY: 'auto', p: { xs: 2, md: 3 } }}>
        <Box sx={{ maxWidth: 960, mx: 'auto' }}>
          <motion.div variants={containerVariants} initial="hidden" animate="visible">

            {/* Header Row */}
            <motion.div variants={itemVariants}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Typography variant="h6" fontWeight={700}>All Incidents</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Showing {PLACEHOLDER_INCIDENTS.length} incidents
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<AddCircleOutlinedIcon />}
                  onClick={() => navigate('/submit')}
                >
                  Submit New Incident
                </Button>
              </Box>
            </motion.div>

            {/* Incidents List */}
            <motion.div variants={itemVariants}>
              <Card>
                {PLACEHOLDER_INCIDENTS.map((incident, index) => (
                  <motion.div
                    key={incident.id}
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                    style={{ cursor: 'pointer' }}
                  >
                    <Box
                      sx={{
                        px: 3, py: 2.5,
                        display: 'flex', alignItems: 'center', gap: 2,
                        borderBottom: index < PLACEHOLDER_INCIDENTS.length - 1
                          ? '1px solid rgba(255,255,255,0.05)'
                          : 'none',
                        flexWrap: 'wrap',
                      }}
                    >
                      {/* Priority indicator */}
                      <Box
                        sx={{
                          width: 12, height: 12, borderRadius: '50%',
                          background: PRIORITY_COLORS[incident.priority],
                          flexShrink: 0,
                          boxShadow: `0 0 8px ${PRIORITY_COLORS[incident.priority]}`,
                        }}
                      />

                      {/* Title and ID */}
                      <Box sx={{ flex: 1, minWidth: 200 }}>
                        <Typography variant="body2" fontWeight={600} gutterBottom>
                          {incident.title}
                        </Typography>
                        <Typography variant="caption" color="text.disabled">
                          Incident #{incident.id} &nbsp;·&nbsp; {incident.time}
                        </Typography>
                      </Box>

                      {/* Tags */}
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                          label={incident.category}
                          size="small"
                          sx={{ fontSize: '0.7rem', height: 22 }}
                        />
                        <Chip
                          label={incident.priority}
                          size="small"
                          sx={{
                            fontSize: '0.7rem', height: 22, fontWeight: 700,
                            background: `${PRIORITY_COLORS[incident.priority]}20`,
                            color: PRIORITY_COLORS[incident.priority],
                          }}
                        />
                        <Chip
                          label={incident.status.replace(/_/g, ' ')}
                          size="small"
                          sx={{
                            fontSize: '0.7rem', height: 22, fontWeight: 600,
                            background: `${STATUS_COLORS[incident.status]}20`,
                            color: STATUS_COLORS[incident.status],
                          }}
                        />
                      </Box>
                    </Box>
                  </motion.div>
                ))}
              </Card>
            </motion.div>

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
                  🚀 <strong style={{ color: '#818cf8' }}>Sprint 2:</strong> Full incident detail view, real-time status updates,
                  and RTK Query integration coming next.
                </Typography>
              </Box>
            </motion.div>

          </motion.div>
        </Box>
      </Box>
    </Box>
  );
}
