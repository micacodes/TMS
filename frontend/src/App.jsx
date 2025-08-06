import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// FIX: Added .jsx extension to ALL local file imports
import { AuthProvider, useAuth } from './context/AuthContext.jsx'; 
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import Spinner from './components/Spinner.jsx';


const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  
  // This handles the initial loading state while the token is being verified
  if (user === null && localStorage.getItem('token')) {
    return <div className="h-screen w-full flex items-center justify-center"><Spinner /></div>;
  }

  // Once checked, redirect if not authenticated
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          {/* Default route redirects based on whether a token exists */}
          <Route 
            path="*" 
            element={localStorage.getItem('token') ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;