import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Store } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserRole } from '@/lib/types';

export default function Register() {
  const { register } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [accountType, setAccountType] = useState<UserRole>(UserRole.CUSTOMER);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    storeName: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register({
        ...formData,
        role: accountType,
      });
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <div className="container mx-auto flex h-[calc(100vh-4rem)] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <Store className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            Choose your account type and enter your details
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <Tabs
              value={accountType}
              onValueChange={(value) => setAccountType(value as UserRole)}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value={UserRole.CUSTOMER}>Customer</TabsTrigger>
                <TabsTrigger value={UserRole.STORE_OWNER}>Store Owner</TabsTrigger>
              </TabsList>
            </Tabs>
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
            {accountType === UserRole.STORE_OWNER && (
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input
                  id="storeName"
                  placeholder="My Pawn Shop"
                  value={formData.storeName}
                  onChange={handleChange}
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              Already have an account?{' '}
              <Link to="/auth/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}