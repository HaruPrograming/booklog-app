import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api';

type User = {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);

    fetch(`${API_BASE}/auth/me`, { credentials: 'include', signal: controller.signal, headers: { Accept: 'application/json' } })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data) setUser(data);
      })
      .catch(() => {})
      .finally(() => {
        clearTimeout(timer);
        setLoading(false);
      });
  }, []);

  const logout = async () => {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    }).catch(() => {});
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
