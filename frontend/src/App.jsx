import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/auth/ProtectedRoute';
import Navbar from './components/shared/Navbar';
import CreateElection from './components/admin/CreateElection';

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminDashboard from './pages/AdminDashboard';
import VoterDashboard from './pages/VoterDashboard';
import ElectionPage from './pages/ElectionPage';
import ResultsPage from './pages/ResultsPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/signup"   element={<SignupPage />} />
            <Route path="/voter"    element={<ProtectedRoute><VoterDashboard /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><VoterDashboard /></ProtectedRoute>} />
            <Route path="/elections/:id" element={<ProtectedRoute><ElectionPage /></ProtectedRoute>} />
            <Route path="/results/:id"   element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
            <Route path="/admin"    element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/elections/create" element={<AdminRoute><CreateElection /></AdminRoute>} />
            <Route path="/"         element={<Navigate to="/login" replace />} />
            <Route path="*"         element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
        <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155' } }} />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;