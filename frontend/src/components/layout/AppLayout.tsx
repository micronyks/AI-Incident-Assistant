// =============================================================================
// APP LAYOUT COMPONENT
// Main shell: sidebar + content area with top bar
// =============================================================================
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar/Sidebar';

export function AppLayout() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          background: 'transparent',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
