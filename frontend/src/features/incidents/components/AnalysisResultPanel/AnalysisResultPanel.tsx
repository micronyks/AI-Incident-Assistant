// =============================================================================
// ANALYSIS RESULT PANEL — individual icon path imports
// =============================================================================
import {
  Box,
  Typography,
  Chip,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PsychologyIcon from '@mui/icons-material/Psychology';
import BuildIcon from '@mui/icons-material/Build';
import GroupsIcon from '@mui/icons-material/Groups';
import SourceIcon from '@mui/icons-material/Source';
import { motion } from 'framer-motion';
import type { IncidentAnalysis } from '@/types';
import { CATEGORY_OPTIONS, PRIORITY_OPTIONS } from '@/constants';

interface AnalysisResultPanelProps {
  analysis: IncidentAnalysis;
}

function ConfidenceBar({ value, label }: { value: number; label: string }) {
  const pct = Math.round(value * 100);
  return (
    <Box sx={{ mb: 1.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="caption" color="text.secondary">{label}</Typography>
        <Typography variant="caption" fontWeight={700} color="primary.light">{pct}%</Typography>
      </Box>
      <LinearProgress variant="determinate" value={pct} sx={{ height: 6 }} />
    </Box>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function AnalysisResultPanel({ analysis }: AnalysisResultPanelProps) {
  const categoryOption = CATEGORY_OPTIONS.find((c) => c.value === analysis.category);
  const priorityOption = PRIORITY_OPTIONS.find((p) => p.value === analysis.priority);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

        {/* Header */}
        <motion.div variants={itemVariants}>
          <Box
            sx={{
              p: 2.5, borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(6,182,212,0.1) 100%)',
              border: '1px solid rgba(16,185,129,0.2)',
              display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap',
            }}
          >
            <Box
              sx={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'rgba(16,185,129,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}
            >
              <CheckCircleIcon sx={{ color: '#10b981', fontSize: 24 }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight={700} color="#10b981">
                AI Analysis Complete
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Your incident has been analyzed by our multi-agent system
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label={`${categoryOption?.icon ?? ''} ${analysis.category}`}
                size="small"
                sx={{
                  background: `${categoryOption?.color ?? '#6366f1'}20`,
                  color: categoryOption?.color ?? '#6366f1',
                  fontWeight: 700,
                  border: `1px solid ${categoryOption?.color ?? '#6366f1'}40`,
                }}
              />
              <Chip
                label={analysis.priority}
                size="small"
                sx={{
                  background: `${priorityOption?.color ?? '#f59e0b'}20`,
                  color: priorityOption?.color ?? '#f59e0b',
                  fontWeight: 700,
                  border: `1px solid ${priorityOption?.color ?? '#f59e0b'}40`,
                }}
              />
            </Box>
          </Box>
        </motion.div>

        {/* Summary */}
        <motion.div variants={itemVariants}>
          <Card sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <AutoAwesomeIcon sx={{ color: 'primary.main', fontSize: 18 }} />
              <Typography variant="subtitle2" fontWeight={700}>AI Summary</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              {analysis.summary}
            </Typography>
            {analysis.root_cause && (
              <>
                <Divider sx={{ my: 1.5 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <PsychologyIcon sx={{ color: '#f59e0b', fontSize: 18 }} />
                  <Typography variant="subtitle2" fontWeight={700}>Root Cause</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">{analysis.root_cause}</Typography>
              </>
            )}
          </Card>
        </motion.div>

        {/* Resolution Steps */}
        {analysis.resolution_steps.length > 0 && (
          <motion.div variants={itemVariants}>
            <Card sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <BuildIcon sx={{ color: '#06b6d4', fontSize: 18 }} />
                <Typography variant="subtitle2" fontWeight={700}>Suggested Resolution Steps</Typography>
              </Box>
              <List dense disablePadding>
                {analysis.resolution_steps.map((step, i) => (
                  <ListItem key={i} disableGutters sx={{ alignItems: 'flex-start', py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 28, mt: 0.2 }}>
                      <Box
                        sx={{
                          width: 20, height: 20, borderRadius: '50%',
                          background: 'rgba(6,182,212,0.15)',
                          border: '1px solid rgba(6,182,212,0.3)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}
                      >
                        <Typography variant="caption" sx={{ fontSize: '0.65rem', color: '#06b6d4', fontWeight: 700 }}>
                          {i + 1}
                        </Typography>
                      </Box>
                    </ListItemIcon>
                    <ListItemText primary={step} primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }} />
                  </ListItem>
                ))}
              </List>
            </Card>
          </motion.div>
        )}

        {/* Escalation + Confidence */}
        <motion.div variants={itemVariants}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Card sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <GroupsIcon sx={{ color: '#8b5cf6', fontSize: 18 }} />
                <Typography variant="subtitle2" fontWeight={700}>Assigned Team</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {analysis.escalation_team || 'To be determined'}
              </Typography>
            </Card>
            <Card sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <PsychologyIcon sx={{ color: '#f59e0b', fontSize: 18 }} />
                <Typography variant="subtitle2" fontWeight={700}>Confidence</Typography>
              </Box>
              <ConfidenceBar value={analysis.category_confidence} label="Category" />
              <ConfidenceBar value={analysis.priority_confidence} label="Priority" />
              <ConfidenceBar value={analysis.knowledge_confidence} label="Knowledge" />
            </Card>
          </Box>
        </motion.div>

        {/* Sources */}
        {analysis.sources.length > 0 && (
          <motion.div variants={itemVariants}>
            <Card sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <SourceIcon sx={{ color: '#10b981', fontSize: 18 }} />
                <Typography variant="subtitle2" fontWeight={700}>Knowledge Sources</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {analysis.sources.map((src, i) => (
                  <Chip
                    key={i}
                    label={`${src.category}/${src.file}`}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem', borderColor: 'rgba(16,185,129,0.3)', color: '#10b981' }}
                  />
                ))}
              </Box>
            </Card>
          </motion.div>
        )}
      </Box>
    </motion.div>
  );
}
