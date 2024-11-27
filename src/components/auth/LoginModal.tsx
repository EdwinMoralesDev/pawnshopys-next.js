import { useState } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UserRole } from '@/lib/types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab: 'login' | 'register';
  initialRole: UserRole;
}

export function LoginModal({ isOpen, onClose, initialTab, initialRole }: LoginModalProps) {
  const { login, register, loginWithGoogle } = useAuthContext();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    storeName: '',
    role: initialRole,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (initialTab === 'login' && !isLoginFormValid) return;
    if (initialTab === 'register' && !isRegisterFormValid) return;
    
    try {
      if (initialTab === 'login') {
        await login({
          email: formData.email,
          password: formData.password,
        });
      } else {
        await register({
          ...formData,
          role: formData.role,
        });
      }
      onClose();
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
      onClose();
    } catch (error) {
      console.error('Google sign-in failed:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const isLoginFormValid = formData.email && formData.password;
  const isRegisterFormValid = 
    formData.name && 
    formData.email && 
    formData.password && 
    formData.storeName &&
    formData.email.includes('@') && 
    formData.password.length >= 6;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialTab === 'login' ? 'Login to your account' : 'Register your store'}
          </DialogTitle>
          <DialogDescription>
            {initialTab === 'login' 
              ? 'Enter your credentials to access your account' 
              : 'Fill in the details to register your pawnshop'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {initialTab === 'login' ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <Button 
                  className="w-full" 
                  type="submit"
                >
                  Sign in
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    placeholder="My Pawnshop"
                    required
                    value={formData.storeName}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    Password must be at least 6 characters long
                  </p>
                </div>

                <Button className="w-full" type="submit">
                  Create account
                </Button>
              </>
            )}
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}