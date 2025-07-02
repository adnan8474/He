import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const email = localStorage.getItem('poctify_email');
  if (!email) {
    return <Navigate to="/" replace />;
  }
  return children;
}
