import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';
import AuthPage from '../pages/AuthPage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import UploadPage from '../pages/UploadPage.jsx';
import JobsPage from '../pages/JobsPage.jsx';
import MatchingPage from '../pages/MatchingPage.jsx';
import CandidateProfilePage from '../pages/CandidateProfilePage.jsx';
import AppLayout from '../layouts/AppLayout.jsx';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/auth" replace />;
};

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/auth" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/matching" element={<MatchingPage />} />
        <Route path="/candidates/:candidateId" element={<CandidateProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/auth'} replace />} />
    </Routes>
  );
}
