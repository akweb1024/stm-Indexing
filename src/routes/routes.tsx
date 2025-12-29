import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AppShell from '../layout/AppShell';
import LoginPage from '../modules/auth/LoginPage';
import MfaSetupPage from '../modules/auth/MfaSetupPage';
import DashboardPage from '../modules/dashboard/DashboardPage';
import JournalsListPage from '../modules/journals/JournalsListPage';
import JournalDetailPage from '../modules/journals/JournalDetailPage';
import PapersListPage from '../modules/papers/PapersListPage';
import PaperDetailPage from '../modules/papers/PaperDetailPage';
import DatabasesHomePage from '../modules/databases/DatabasesHomePage';
import DatabaseDashboardPage from '../modules/databases/DatabaseDashboardPage';
import DatabaseApplicationPage from '../modules/databases/DatabaseApplicationPage';
import AuditLogsPage from '../modules/audit/AuditLogsPage';

const AppRoutes = () => {
  return (
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
  );
};

export default AppRoutes;
