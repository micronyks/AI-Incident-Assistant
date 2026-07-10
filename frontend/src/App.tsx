// =============================================================================
// APP ROOT COMPONENT
// =============================================================================
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';

import { store } from '@/store';
import { muiTheme } from '@/theme/muiTheme';
import { AppRouter } from '@/router/AppRouter';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <AppRouter />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a2e',
              color: '#f1f5f9',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '12px',
              fontSize: '0.875rem',
              fontFamily: 'Inter, sans-serif',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#0a0a0f' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#0a0a0f' },
            },
            loading: {
              iconTheme: { primary: '#6366f1', secondary: '#0a0a0f' },
            },
          }}
        />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
