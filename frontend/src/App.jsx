import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import Spinner from './components/Spinner';


const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  if (user === undefined) { 
    return <div className="h-screen w-full flex items-center justify-center"><Spinner /></div>;
  }
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