import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProductProvider } from '@/contexts/ProductContext';
import { StoreProvider } from '@/contexts/StoreContext';
import { AppRoutes } from '@/components/AppRoutes';
import { ScrollToTop } from '@/components/ScrollToTop';
import { Toaster } from 'sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <StoreProvider>
            <ProductProvider>
              <ScrollToTop />
              <AppRoutes />
              <Toaster position="top-right" richColors />
            </ProductProvider>
          </StoreProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;