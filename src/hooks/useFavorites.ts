import { useAuthContext } from '@/contexts/AuthContext';
import { Store, Product, Favorite } from '@/lib/types';
import { toast } from 'sonner';

export function useFavorites() {
  const { user, updateProfile } = useAuthContext();

  const toggleStoreFavorite = async (store: Store) => {
    if (!user) {
      toast.error('Please sign in to add favorites', {
        position: 'top-center',
      });
      return;
    }

    try {
      const favorites = user.favorites || [];
      const isFavorite = favorites.some(f => f.id === store.id && f.type === 'store');

      const updatedFavorites = isFavorite
        ? favorites.filter(f => !(f.id === store.id && f.type === 'store'))
        : [
            ...favorites,
            {
              id: store.id,
              type: 'store',
              name: store.name,
              address: store.location.address,
            } as Favorite,
          ];

      await updateProfile({ favorites: updatedFavorites });
    } catch (error) {
      console.error('Failed to update favorites:', error);
    }
  };

  const toggleProductFavorite = async (product: Product) => {
    if (!user) {
      toast.error('Please sign in to add favorites', {
        position: 'top-center',
      });
      return;
    }

    try {
      const favorites = user.favorites || [];
      const isFavorite = favorites.some(f => f.id === product.id && f.type === 'product');

      const updatedFavorites = isFavorite
        ? favorites.filter(f => !(f.id === product.id && f.type === 'product'))
        : [
            ...favorites,
            {
              id: product.id,
              type: 'product',
              name: product.name,
              image: product.images[0],
              price: product.price,
            } as Favorite,
          ];

      await updateProfile({ favorites: updatedFavorites });
    } catch (error) {
      console.error('Failed to update favorites:', error);
    }
  };

  const removeFavorite = async (id: string, type: 'store' | 'product') => {
    if (!user) return;

    try {
      const favorites = user.favorites || [];
      const updatedFavorites = favorites.filter(f => !(f.id === id && f.type === type));
      await updateProfile({ favorites: updatedFavorites });
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  };

  const isFavorite = (id: string, type: 'store' | 'product') => {
    return user?.favorites?.some(f => f.id === id && f.type === type) || false;
  };

  return {
    toggleStoreFavorite,
    toggleProductFavorite,
    removeFavorite,
    isFavorite,
  };
}