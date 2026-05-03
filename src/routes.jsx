import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Passengers from './pages/Passengers';
import Tickets from './pages/Tickets';
import RoutesPage from './pages/Routes';
import Buses from './pages/Buses';
import BusPasses from './pages/BusPasses';
import { useState, useEffect } from 'react';
import { authService } from './services/api';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  if (isAuthenticated === null) return <div>Loading...</div>;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="passengers" element={<Passengers />} />
        <Route path="tickets" element={<Tickets />} />
        <Route path="routes" element={<RoutesPage />} />
        <Route path="buses" element={<Buses />} />
        <Route path="passes" element={<BusPasses />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
