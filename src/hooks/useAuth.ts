import { useState, useEffect } from 'react';
import { NavigateFunction, Location } from 'react-router-dom';
import { authService, type LoginCredentials, type RegisterCredentials, type AuthUser, type UpdateProfileData } from '@/lib/auth';

interface UseAuthProps {
  navigate: NavigateFunction;
  location: Location;
}

export function useAuth({ navigate, location }: UseAuthProps) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      const user = await authService.login(credentials);
      setUser(user);
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      const user = await authService.register(credentials);
      setUser(user);
      navigate('/');
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const user = await authService.loginWithGoogle();
      setUser(user);
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Google login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const updateProfile = async (data: UpdateProfileData) => {
    try {
      const updatedUser = await authService.updateProfile(data);
      setUser(updatedUser);
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  };

  return {
    user,
    login,
    register,
    logout,
    loginWithGoogle,
    updateProfile,
  };
}