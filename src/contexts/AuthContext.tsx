import { createContext, useContext, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthUser, LoginCredentials, RegisterCredentials } from '@/lib/auth';
import { useAuth } from '@/hooks/useAuth';

interface AuthContextType {
  user: AuthUser | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth({ navigate, location });

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}