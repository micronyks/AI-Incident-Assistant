// =============================================================================
// APP ROUTER — Centralized routing configuration
// Uses React Router v7 data router pattern for future-proofing
// =============================================================================
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardPage } from '@/pages/Dashboard/DashboardPage';
import { SubmitIncidentPage } from '@/pages/SubmitIncident/SubmitIncidentPage';
import { MyIncidentsPage } from '@/pages/MyIncidents/MyIncidentsPage';
import { PendingApprovalsPage } from '@/pages/PendingApprovals/PendingApprovalsPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'submit',
        element: <SubmitIncidentPage />,
      },
      {
        path: 'incidents',
        element: <MyIncidentsPage />,
      },
      {
        path: 'approvals',
        element: <PendingApprovalsPage />,
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
