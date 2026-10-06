import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const ROLES = {
  FARMER: 'farmer',
  OPERATOR: 'operator',
  ADMIN: 'admin',
};

export function generateSessionId(role = 'user') {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `sess_${role}_${random}${timestamp}`;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('agridoc_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && !parsed.sessionId) {
          parsed.sessionId = generateSessionId(parsed.role || 'farmer');
        }
        return parsed;
      } catch (e) {
        console.error('Failed to parse saved user:', e);
      }
    }
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('agridoc_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('agridoc_user');
    }
  }, [user]);

  const login = (userData) => {
    const role = userData.role || ROLES.FARMER;
    const enrichedUser = {
      id: userData.id || `user_${Date.now()}`,
      sessionId: userData.sessionId || generateSessionId(role),
      name: userData.name || (userData.phone ? `Farmer (${userData.phone.slice(-4)})` : 'Demo User'),
      phone: userData.phone || '+91 98765 43210',
      role: role,
      farmLocation: userData.farmLocation || 'Guntur, Andhra Pradesh',
      preferredLang: userData.preferredLang || 'en',
    };
    setUser(enrichedUser);
    return enrichedUser;
  };

  const loginWithDemo = (demoRole = ROLES.FARMER) => {
    const demoUser = {
      id: demoRole === ROLES.ADMIN ? 'demo_admin_001' : (demoRole === ROLES.OPERATOR ? 'demo_operator_001' : 'demo_farmer_001'),
      sessionId: generateSessionId(demoRole),
      name: demoRole === ROLES.ADMIN ? 'Dr. Sarah Rao' : (demoRole === ROLES.OPERATOR ? 'Alex Kumar' : 'Ramesh Patel'),
      phone: '+91 98765 43210',
      role: demoRole,
      farmLocation: 'Guntur, Andhra Pradesh',
      preferredLang: 'en',
    };
    setUser(demoUser);
    localStorage.setItem('agridoc_user', JSON.stringify(demoUser));
    return demoUser;
  };

  const switchRole = (newRole) => {
    if (Object.values(ROLES).includes(newRole)) {
      setUser((prev) => (prev ? { ...prev, role: newRole, sessionId: generateSessionId(newRole) } : null));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('agridoc_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        sessionId: user?.sessionId || null,
        role: user?.role || ROLES.FARMER,
        isAuthenticated: Boolean(user),
        login,
        loginWithDemo,
        logout,
        switchRole,
        ROLES,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

