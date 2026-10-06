import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert } from 'lucide-react';
import Button from './Button';

export function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, role, switchRole, ROLES } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-500/15 border border-amber-500/40 text-amber-400">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <div className="space-y-1 max-w-md">
          <h2 className="text-xl font-black text-white">Role Access Restricted</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            This module requires <strong className="text-emerald-400 uppercase">{allowedRoles.join(' or ')}</strong> permissions. You are currently logged in as <span className="uppercase text-amber-300 font-bold">{role}</span>.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => window.history.back()}>
            Go Back
          </Button>
          <Button
            variant="primary"
            onClick={() => switchRole(allowedRoles[0])}
          >
            Switch to {allowedRoles[0]} Demo Role
          </Button>
        </div>
      </div>
    );
  }

  return children;
}

export function RoleGuard({ allowedRoles = [], fallback = null, children }) {
  const { role } = useAuth();
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return fallback;
  }
  return children;
}

export default ProtectedRoute;
