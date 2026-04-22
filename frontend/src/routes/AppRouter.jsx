import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ProtectedRoute } from './ProtectedRoute';
import { Skeleton } from '../components/ui/Skeleton';

const Landing = lazy(() => import('../pages/Landing'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Upload = lazy(() => import('../pages/Upload'));
const Candidates = lazy(() => import('../pages/Candidates'));
const CandidateProfile = lazy(() => import('../pages/CandidateProfile'));
const Jobs = lazy(() => import('../pages/Jobs'));
const MatchResults = lazy(() => import('../pages/MatchResults'));
const Analytics = lazy(() => import('../pages/Analytics'));

function Fallback() {
  return (
    <div className="section-wrap pt-28">
      <Skeleton className="h-40 w-full" />
    </div>
  );
}

export default function AppRouter() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<Fallback />}>
        <main className="pt-20">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <Upload />
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidates"
              element={
                <ProtectedRoute>
                  <Candidates />
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidates/:id"
              element={
                <ProtectedRoute>
                  <CandidateProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/jobs"
              element={
                <ProtectedRoute>
                  <Jobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/jobs/:id/match"
              element={
                <ProtectedRoute>
                  <MatchResults />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </Suspense>
      <Footer />
    </>
  );
}
