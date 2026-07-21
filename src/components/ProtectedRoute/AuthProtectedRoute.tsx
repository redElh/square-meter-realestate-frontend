import React from 'react';
import { Navigate } from 'react-router-dom';

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

const AuthProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = getCookie('accessToken');
  if (!token) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

export default AuthProtectedRoute;
