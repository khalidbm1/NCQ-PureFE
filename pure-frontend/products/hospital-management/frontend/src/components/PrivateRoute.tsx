import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const PrivateRoute: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  // Check for demo token as well
  const token = localStorage.getItem('token');
  const isDemoMode = token === 'demo-token' || process.env.NODE_ENV === 'development';

  return (isAuthenticated || isDemoMode) ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;