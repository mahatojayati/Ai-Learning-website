import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserSession, LearnerLevel } from '../types';

interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  login: (email: string, name?: string, level?: LearnerLevel, language?: string) => void;
  loginAsGuest: () => void;
  logout: () => void;
  updateUserProfile: (updates: Partial<UserSession>) => void;
  isAuthModalOpen: boolean;
  openAuthModal: (redirectRoute?: string) => void;
  closeAuthModal: () => void;
  pendingRedirect: string | null;
  clearPendingRedirect: () => void;
}

const STORAGE_KEY = 'kollektiva_user_session_v1';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingRedirect, setPendingRedirect] = useState<string | null>(null);

  // Initialize session from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (err) {
      console.warn('Could not read user session from storage', err);
    }
  }, []);

  const login = (
    email: string,
    name: string = 'Learner',
    level: LearnerLevel = 'intermediate',
    language: string = 'English'
  ) => {
    const session: UserSession = {
      id: `usr_${Date.now()}`,
      name: name.trim() || 'Alex Mercer',
      email: email.trim(),
      level,
      primarySubject: 'STEM & Computer Science',
      preferredLanguage: language,
      preferredTeacherId: 'elena-baranova',
      isGuest: false,
      createdAt: new Date().toISOString(),
    };
    setUser(session);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch (err) {
      console.error(err);
    }
    setIsAuthModalOpen(false);
  };

  const loginAsGuest = () => {
    const session: UserSession = {
      id: `guest_${Date.now()}`,
      name: 'Guest Scholar',
      email: 'scholar@kollektiva.ai',
      level: 'intermediate',
      primarySubject: 'Physics & Applied Mathematics',
      preferredLanguage: 'English',
      preferredTeacherId: 'elena-baranova',
      isGuest: true,
      createdAt: new Date().toISOString(),
    };
    setUser(session);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch (err) {
      console.error(err);
    }
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error(err);
    }
  };

  const updateUserProfile = (updates: Partial<UserSession>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  const openAuthModal = (redirectRoute?: string) => {
    if (redirectRoute) {
      setPendingRedirect(redirectRoute);
    }
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const clearPendingRedirect = () => {
    setPendingRedirect(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        loginAsGuest,
        logout,
        updateUserProfile,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        pendingRedirect,
        clearPendingRedirect,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
