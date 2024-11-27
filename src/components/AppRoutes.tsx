import { Routes, Route } from 'react-router-dom';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { UserRole } from '@/lib/types';
import Navbar from './layout/Navbar';
import Home from '@/pages/Home';
import StoreLocator from '@/pages/StoreLocator';
import ProductList from '@/pages/ProductList';
import ProductDetails from '@/pages/product/ProductDetails';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import StoreProfile from '@/pages/store/StoreProfile';
import StoreManagement from '@/pages/store/StoreManagement';
import AccountSettings from '@/pages/account/AccountSettings';

export function AppRoutes() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 md:px-6 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<StoreLocator />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/store/:id" element={<StoreProfile />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route
            path="/store/manage"
            element={
              <AuthGuard allowedRoles={[UserRole.STORE_OWNER]}>
                <StoreManagement />
              </AuthGuard>
            }
          />
          <Route
            path="/account/settings"
            element={
              <AuthGuard>
                <AccountSettings />
              </AuthGuard>
            }
          />
        </Routes>
      </main>
    </div>
  );
}