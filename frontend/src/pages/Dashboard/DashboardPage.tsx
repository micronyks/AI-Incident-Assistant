// =============================================================================
// DASHBOARD PAGE — individual icon path imports
// =============================================================================
import { Box, Card, Typography, Chip, LinearProgress, Button } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TopBar } from '@/components/layout/TopBar/TopBar';

const STATS = [
  { label: 'Total Incidents', value: '142', change: '+12 this week', icon: '📊', color: '#6366f1' },
  { label: 'AI Resolved', value: '98', change: '69% auto-resolved', icon: '🤖', color: '#06b6d4' },
  { label: 'Pending Approval', value: '2', change: 'Needs your review', icon: '⏳', color: '#f59e0b' },
  { label: 'Avg Resolution', value: '2.3h', change: '↓ 15% vs last week', icon: '⚡', color: '#10b981' },
];

const RECENT_INCIDENTS = [
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
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

export function DashboardPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TopBar title="Dashboard" subtitle="Welcome back, Nikhil" />

      <Box sx={{ flex: 1, overflowY: 'auto', p: { xs: 2, md: 3 } }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
          <motion.div variants={containerVariants} initial="hidden" animate="visible">

            {/* CTA Banner */}
            <motion.div variants={itemVariants}>
              <Card
                sx={{
                  mb: 3, p: 3,
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(6,182,212,0.08) 100%)',
                  border: '1px solid rgba(99,102,241,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  flexWrap: 'wrap', gap: 2,
                }}
              >
                <Box>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    🚀 Report an Issue or Request
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Our AI agents will analyze, categorize, and prioritize your incident automatically.
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={() => navigate('/submit')}
                  size="large"
                >
                  Submit Incident
                </Button>
              </Card>
            </motion.div>

            {/* Stats Grid */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 2, mb: 3 }}>
              {STATS.map((stat) => (
                <motion.div key={stat.label} variants={itemVariants}>
                  <Card
                    sx={{
                      p: 2.5, position: 'relative', overflow: 'hidden',
                      '&::before': {
                        content: '""', position: 'absolute',
                        top: 0, left: 0, right: 0, height: 3,
                        background: stat.color, borderRadius: '16px 16px 0 0',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="caption" color="text.disabled" fontWeight={500}>
                          {stat.label}
                        </Typography>
                        <Typography variant="h4" fontWeight={800} sx={{ color: stat.color, lineHeight: 1.2, my: 0.5 }}>
                          {stat.value}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <TrendingUpIcon sx={{ fontSize: 14, color: '#10b981' }} />
                          <Typography variant="caption" color="text.disabled">{stat.change}</Typography>
                        </Box>
                      </Box>
                      <Typography fontSize="1.8rem">{stat.icon}</Typography>
                    </Box>
                  </Card>
                </motion.div>
              ))}
            </Box>

            {/* Recent Incidents */}
            <motion.div variants={itemVariants}>
              <Card>
                <Box sx={{ px: 3, py: 2, borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1" fontWeight={700}>Recent Incidents</Typography>
                  <Button variant="text" size="small" onClick={() => navigate('/incidents')} sx={{ color: 'primary.light' }}>
                    View All →
                  </Button>
                </Box>
                <Box>
                  {RECENT_INCIDENTS.map((incident, index) => (
                    <motion.div key={incident.id} whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                      <Box
                        sx={{
                          px: 3, py: 1.75, display: 'flex', alignItems: 'center', gap: 2,
                          borderBottom: index < RECENT_INCIDENTS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                          cursor: 'pointer', flexWrap: 'wrap',
                        }}
                      >
                        <Box
                          sx={{
                            width: 10, height: 10, borderRadius: '50%',
                            background: PRIORITY_COLORS[incident.priority],
                            flexShrink: 0,
                            boxShadow: `0 0 6px ${PRIORITY_COLORS[incident.priority]}`,
                          }}
                        />
                        <Box sx={{ flex: 1, minWidth: 200 }}>
                          <Typography variant="body2" fontWeight={500} noWrap>{incident.title}</Typography>
                          <Typography variant="caption" color="text.disabled">#{incident.id} · {incident.time}</Typography>
                        </Box>
                        <Chip label={incident.category} size="small" sx={{ fontSize: '0.7rem', height: 22 }} />
                        <Chip
                          label={incident.priority}
                          size="small"
                          sx={{ fontSize: '0.7rem', height: 22, background: `${PRIORITY_COLORS[incident.priority]}20`, color: PRIORITY_COLORS[incident.priority], fontWeight: 700 }}
                        />
                        <Chip
                          label={incident.status.replace(/_/g, ' ')}
                          size="small"
                          sx={{ fontSize: '0.7rem', height: 22, background: `${STATUS_COLORS[incident.status]}20`, color: STATUS_COLORS[incident.status], fontWeight: 600 }}
                        />
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              </Card>
            </motion.div>

            {/* AI Performance */}
            <motion.div variants={itemVariants}>
              <Card sx={{ mt: 2, p: 3 }}>
                <Typography variant="subtitle1" fontWeight={700} mb={2}>🤖 AI Agent Performance</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {[
                    { label: 'Classification Accuracy', value: 94 },
                    { label: 'Priority Accuracy', value: 88 },
                    { label: 'Knowledge Base Hit Rate', value: 76 },
                    { label: 'Auto-Resolution Rate', value: 69 },
                  ].map((metric) => (
                    <Box key={metric.label}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">{metric.label}</Typography>
                        <Typography variant="body2" fontWeight={700} color="primary.light">{metric.value}%</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={metric.value} sx={{ height: 6 }} />
                    </Box>
                  ))}
                </Box>
              </Card>
            </motion.div>

          </motion.div>
        </Box>
      </Box>
    </Box>
  );
}
