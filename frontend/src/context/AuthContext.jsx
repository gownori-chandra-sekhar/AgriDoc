import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const ROLES = {
  FARMER: 'farmer',
  OPERATOR: 'operator',
  ADMIN: 'admin',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('agridoc_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved user:', e);
      }
    }
    // Default demo user if none saved
    return {
      id: 'demo_farmer_001',
      name: 'Ramesh Patel',
      phone: '+91 98765 43210',
      role: ROLES.FARMER,
      farmLocation: 'Guntur, Andhra Pradesh',
      preferredLang: 'en',
    };
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('agridoc_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('agridoc_user');
    }
  }, [user]);

  const login = (userData) => {
    const enrichedUser = {
      id: userData.id || `user_${Date.now()}`,
      name: userData.name || (userData.phone ? `Farmer (${userData.phone.slice(-4)})` : 'Demo User'),
      phone: userData.phone || '+91 98765 43210',
      role: userData.role || ROLES.FARMER,
      farmLocation: userData.farmLocation || 'Guntur, Andhra Pradesh',
      preferredLang: userData.preferredLang || 'en',
    };
    setUser(enrichedUser);
    return enrichedUser;
  };

  const switchRole = (newRole) => {
    if (Object.values(ROLES).includes(newRole)) {
      setUser((prev) => (prev ? { ...prev, role: newRole } : null));
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
        role: user?.role || ROLES.FARMER,
        isAuthenticated: Boolean(user),
        login,
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
