// =============================================================================
// TOP BAR COMPONENT
// =============================================================================
import {
  Box,
  Typography,
  IconButton,
  Badge,
  Tooltip,
  TextField,
} from '@mui/material';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import SearchIcon from '@mui/icons-material/Search';
import HelpOutlineIcon from '@mui/icons-material/HelpOutlined';

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export function TopBar({ title, subtitle }: TopBarProps) {
  return (
    <Box
      sx={{
        height: 68,
        display: 'flex',
        alignItems: 'center',
        px: 3,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(10, 10, 15, 0.8)',
        backdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        gap: 2,
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.1 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.disabled">
            {subtitle}
          </Typography>
        )}
      </Box>

      <TextField
        placeholder="Search incidents..."
        size="small"
        sx={{
          width: 220,
          '& .MuiOutlinedInput-root': { borderRadius: '10px', background: 'rgba(255,255,255,0.03)' },
        }}
        slotProps={{
          input: {
            startAdornment: <SearchIcon sx={{ fontSize: 18, color: 'text.disabled', mr: 0.5 }} />,
          },
        }}
      />

      <Tooltip title="Help">
        <IconButton size="small" sx={{ color: 'text.disabled' }}>
          <HelpOutlineIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Notifications">
        <IconButton size="small" sx={{ color: 'text.disabled' }}>
          <Badge badgeContent={2} color="error">
            <NotificationsOutlinedIcon fontSize="small" />
          </Badge>
        </IconButton>
      </Tooltip>
    </Box>
  );
}
