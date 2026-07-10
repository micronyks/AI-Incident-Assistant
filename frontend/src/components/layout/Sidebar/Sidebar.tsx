// =============================================================================
// SIDEBAR NAVIGATION COMPONENT
// =============================================================================
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Avatar,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

// Use individual path imports for MUI icons (works with Vite ESM)
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import BoltIcon from '@mui/icons-material/Bolt';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: <DashboardOutlinedIcon fontSize="small" />, path: '/' },
  { label: 'Submit Incident', icon: <AddCircleOutlinedIcon fontSize="small" />, path: '/submit', highlight: true },
  { label: 'My Incidents', icon: <FormatListBulletedIcon fontSize="small" />, path: '/incidents' },
  { label: 'Pending Approvals', icon: <HourglassEmptyIcon fontSize="small" />, path: '/approvals', badge: '2' },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box
      component="nav"
      sx={{
        width: 260,
        flexShrink: 0,
        height: '100vh',
        position: 'sticky',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(10, 10, 15, 0.95)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
        p: 2,
        overflowY: 'auto',
      }}
    >
      {/* Logo */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1, py: 1.5, mb: 2 }}>
        <Box
          sx={{
            width: 36, height: 36, borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(99,102,241,0.4)',
          }}
        >
          <BoltIcon sx={{ fontSize: 20, color: 'white' }} />
        </Box>
        <Box>
          <Typography variant="subtitle1" fontWeight={800} sx={{ lineHeight: 1.1 }}>
            IncidentAI
          </Typography>
          <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.65rem' }}>
            Enterprise Platform
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mb: 2 }} />

      {/* Navigation */}
      <List dense disablePadding sx={{ flexGrow: 1 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <motion.div key={item.path} whileHover={{ x: 3 }} transition={{ type: 'spring', stiffness: 400 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={isActive}
                sx={{
                  borderRadius: '10px', mb: 0.5, py: 1, px: 1.5,
                  '&.Mui-selected': {
                    background: item.highlight
                      ? 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(6,182,212,0.1))'
                      : 'rgba(99,102,241,0.12)',
                    border: '1px solid rgba(99,102,241,0.25)',
                    '& .MuiListItemIcon-root': { color: 'primary.main' },
                    '& .MuiListItemText-primary': { color: 'primary.light', fontWeight: 600 },
                  },
                  '&:hover': { background: 'rgba(255,255,255,0.04)' },
                }}
              >
                <ListItemIcon sx={{ minWidth: 32, color: isActive ? 'primary.main' : 'text.disabled' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  slotProps={{ primary: { variant: 'body2', fontWeight: isActive ? 600 : 400 } }}
                />
                {item.badge && (
                  <Chip
                    label={item.badge}
                    size="small"
                    sx={{ height: 18, fontSize: '0.65rem', background: '#ef4444', color: 'white', fontWeight: 700 }}
                  />
                )}
              </ListItemButton>
            </motion.div>
          );
        })}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', my: 2 }} />

      {/* Settings */}
      <motion.div whileHover={{ x: 3 }}>
        <ListItemButton sx={{ borderRadius: '10px', py: 1, px: 1.5 }} onClick={() => navigate('/settings')}>
          <ListItemIcon sx={{ minWidth: 32, color: 'text.disabled' }}>
            <SettingsOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Settings" slotProps={{ primary: { variant: 'body2' } }} />
        </ListItemButton>
      </motion.div>

      {/* User Profile */}
      <Box
        sx={{
          mt: 2, p: 1.5, borderRadius: '12px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', gap: 1.5,
        }}
      >
        <Avatar
          sx={{
            width: 32, height: 32,
            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
            fontSize: '0.8rem', fontWeight: 700,
          }}
        >
          NK
        </Avatar>
        <Box sx={{ overflow: 'hidden' }}>
          <Typography variant="body2" fontWeight={600} noWrap>Nikhil Kumar</Typography>
          <Typography variant="caption" color="text.disabled" noWrap>nikhil@company.com</Typography>
        </Box>
      </Box>
    </Box>
  );
}
