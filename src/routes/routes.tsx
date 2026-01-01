import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AppShell from '../layout/AppShell';
import Loading from '../components/Loading';

const LoginPage = lazy(() => import('../modules/auth/LoginPage'));
const MfaSetupPage = lazy(() => import('../modules/auth/MfaSetupPage'));
const DashboardPage = lazy(() => import('../modules/dashboard/DashboardPage'));
const JournalsListPage = lazy(() => import('../modules/journals/JournalsListPage'));
const JournalDetailPage = lazy(() => import('../modules/journals/JournalDetailPage'));
const PapersListPage = lazy(() => import('../modules/papers/PapersListPage'));
const PaperDetailPage = lazy(() => import('../modules/papers/PaperDetailPage'));
const DatabasesHomePage = lazy(() => import('../modules/databases/DatabasesHomePage'));
const DatabaseDashboardPage = lazy(() => import('../modules/databases/DatabaseDashboardPage'));
const DatabaseApplicationPage = lazy(() => import('../modules/databases/DatabaseApplicationPage'));
const AuditLogsPage = lazy(() => import('../modules/audit/AuditLogsPage'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/mfa-setup" element={<MfaSetupPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<AppShell />}>
            <Route index element={<DashboardPage />} />
            <Route path="journals" element={<JournalsListPage />} />
            <Route path="journals/:id" element={<JournalDetailPage />} />
            <Route path="papers" element={<PapersListPage />} />
            <Route path="papers/:id" element={<PaperDetailPage />} />
            <Route path="databases" element={<DatabasesHomePage />} />
            <Route path="databases/:id" element={<DatabaseDashboardPage />} />
            <Route path="databases/:id/apply" element={<DatabaseApplicationPage />} />
            <Route path="audit-logs" element={<AuditLogsPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
