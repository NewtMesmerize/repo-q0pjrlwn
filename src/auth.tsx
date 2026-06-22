import { createContext, useContext, useState, type ReactNode } from 'react';

interface AuthState {
  loggedIn: boolean;
  phone: string;
  login: (phone: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

const KEY = 'zf_logged_in_phone';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [phone, setPhone] = useState<string>(() => localStorage.getItem(KEY) || '');

  const login = (p: string) => {
    localStorage.setItem(KEY, p);
    setPhone(p);
  };
  const logout = () => {
    localStorage.removeItem(KEY);
    setPhone('');
  };

  return (
    <AuthContext.Provider value={{ loggedIn: !!phone, phone, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
