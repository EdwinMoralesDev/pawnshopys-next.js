import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Store, Menu, Heart, Trash2, Package, Settings, LogOut, User } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LoginModal } from '@/components/auth/LoginModal';
import { UserRole } from '@/lib/types';
import { useFavorites } from '@/hooks/useFavorites';
import { toast } from 'sonner';

export default function Navbar() {
  const { user, logout } = useAuthContext();
  const { removeFavorite } = useFavorites();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginModalConfig, setLoginModalConfig] = useState({
    initialTab: 'login' as 'login' | 'register',
    initialRole: UserRole.CUSTOMER,
  });

  const handleOpenLoginModal = (tab: 'login' | 'register', role: UserRole = UserRole.CUSTOMER) => {
    setLoginModalConfig({ initialTab: tab, initialRole: role });
    setShowLoginModal(true);
  };

  const handleRemoveFavorite = async (e: React.MouseEvent, id: string, type: 'store' | 'product') => {
    e.preventDefault();
    e.stopPropagation();
    await removeFavorite(id, type);
    toast.success(`Removed from favorites`);
  };

  const favoriteStores = user?.favorites?.filter(f => f.type === 'store') || [];
  const favoriteProducts = user?.favorites?.filter(f => f.type === 'product') || [];
  const favoritesCount = (favoriteStores.length + favoriteProducts.length) || 0;

  const FavoritesContent = () => (
    <div className="py-2">
      <div className="mb-4">
        <h4 className="px-2 mb-2 text-sm font-semibold flex items-center gap-2">
          <Store className="h-4 w-4" />
          Favorite Stores ({favoriteStores.length})
        </h4>
        {favoriteStores.length > 0 ? (
          <div className="space-y-1">
            {favoriteStores.map((favorite) => (
              <Link
                key={favorite.id}
                to={`/store/${favorite.id}`}
                className="flex items-center justify-between px-2 py-1.5 hover:bg-accent rounded-sm"
              >
                <div className="flex items-center space-x-2">
                  <Store className="h-8 w-8 p-1.5 bg-muted rounded" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{favorite.name}</span>
                    {favorite.address && (
                      <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                        {favorite.address}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => handleRemoveFavorite(e, favorite.id, 'store')}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </Link>
            ))}
          </div>
        ) : (
          <p className="px-2 text-sm text-muted-foreground">No favorite stores yet</p>
        )}
      </div>

      <DropdownMenuSeparator />

      <div className="mt-4">
        <h4 className="px-2 mb-2 text-sm font-semibold flex items-center gap-2">
          <Package className="h-4 w-4" />
          Favorite Products ({favoriteProducts.length})
        </h4>
        {favoriteProducts.length > 0 ? (
          <div className="space-y-1">
            {favoriteProducts.map((favorite) => (
              <Link
                key={favorite.id}
                to={`/product/${favorite.id}`}
                className="flex items-center justify-between px-2 py-1.5 hover:bg-accent rounded-sm"
              >
                <div className="flex items-center space-x-2">
                  {favorite.image ? (
                    <img
                      src={favorite.image}
                      alt={favorite.name}
                      className="h-8 w-8 rounded object-cover"
                    />
                  ) : (
                    <Package className="h-8 w-8 p-1.5 bg-muted rounded" />
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{favorite.name}</span>
                    {favorite.price && (
                      <span className="text-xs font-medium">
                        ${favorite.price.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => handleRemoveFavorite(e, favorite.id, 'product')}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </Link>
            ))}
          </div>
        ) : (
          <p className="px-2 text-sm text-muted-foreground">No favorite products yet</p>
        )}
      </div>
    </div>
  );

  return (
    <>
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Store className="h-6 w-6" />
                <span className="font-bold">PawnHub</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-2">
              {!user ? (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => handleOpenLoginModal('login')}
                    className="hidden sm:flex"
                  >
                    Log in
                  </Button>
                  <Button 
                    onClick={() => handleOpenLoginModal('register', UserRole.STORE_OWNER)}
                    className="hidden sm:flex"
                  >
                    Register Store
                  </Button>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="sm:hidden">
                        <Menu className="h-6 w-6" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                      <SheetHeader>
                        <SheetTitle>Menu</SheetTitle>
                      </SheetHeader>
                      <div className="mt-8 flex flex-col space-y-4">
                        <SheetClose asChild>
                          <Button 
                            variant="outline" 
                            onClick={() => handleOpenLoginModal('login')}
                            className="w-full"
                          >
                            Log in
                          </Button>
                        </SheetClose>
                        <SheetClose asChild>
                          <Button 
                            onClick={() => handleOpenLoginModal('register', UserRole.STORE_OWNER)}
                            className="w-full"
                          >
                            Register Store
                          </Button>
                        </SheetClose>
                      </div>
                    </SheetContent>
                  </Sheet>
                </>
              ) : (
                <>
                  {/* Desktop Navigation */}
                  <div className="hidden sm:flex items-center space-x-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative">
                          <Heart className={`h-5 w-5 ${favoritesCount > 0 ? 'text-red-500' : ''}`} />
                          {favoritesCount > 0 && (
                            <Badge 
                              variant="destructive" 
                              className="absolute -top-1 -right-1 h-4 min-w-4 p-0 flex items-center justify-center text-[10px]"
                            >
                              {favoritesCount}
                            </Badge>
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-80">
                        <FavoritesContent />
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full">
                          <Avatar>
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>
                              {user.name?.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        {user.role === UserRole.STORE_OWNER && (
                          <DropdownMenuItem asChild>
                            <Link to="/store/manage" className="flex items-center">
                              <Store className="mr-2 h-4 w-4" />
                              <span>Manage Store</span>
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem asChild>
                          <Link to="/account/settings" className="flex items-center">
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/account/settings" className="flex items-center">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout} className="flex items-center">
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Sign out</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Mobile Navigation */}
                  <div className="sm:hidden flex items-center space-x-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative">
                          <Heart className={`h-5 w-5 ${favoritesCount > 0 ? 'text-red-500' : ''}`} />
                          {favoritesCount > 0 && (
                            <Badge 
                              variant="destructive" 
                              className="absolute -top-1 -right-1 h-4 min-w-4 p-0 flex items-center justify-center text-[10px]"
                            >
                              {favoritesCount}
                            </Badge>
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-80">
                        <FavoritesContent />
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full">
                          <Avatar>
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>
                              {user.name?.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        {user.role === UserRole.STORE_OWNER && (
                          <DropdownMenuItem asChild>
                            <Link to="/store/manage" className="flex items-center">
                              <Store className="mr-2 h-4 w-4" />
                              <span>Manage Store</span>
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem asChild>
                          <Link to="/account/settings" className="flex items-center">
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/account/settings" className="flex items-center">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout} className="flex items-center">
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Sign out</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Menu className="h-6 w-6" />
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="right">
                        <SheetHeader>
                          <SheetTitle>Menu</SheetTitle>
                        </SheetHeader>
                        <div className="space-y-4 mt-8">
                          {user.role === UserRole.STORE_OWNER && (
                            <SheetClose asChild>
                              <Button variant="outline" asChild className="w-full">
                                <Link to="/store/manage" className="flex items-center">
                                  <Store className="mr-2 h-4 w-4" />
                                  <span>Manage Store</span>
                                </Link>
                              </Button>
                            </SheetClose>
                          )}
                          <SheetClose asChild>
                            <Button variant="outline" asChild className="w-full">
                              <Link to="/account/settings" className="flex items-center">
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                              </Link>
                            </Button>
                          </SheetClose>
                          <SheetClose asChild>
                            <Button 
                              variant="outline" 
                              onClick={logout}
                              className="w-full flex items-center"
                            >
                              <LogOut className="mr-2 h-4 w-4" />
                              <span>Sign Out</span>
                            </Button>
                          </SheetClose>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        initialTab={loginModalConfig.initialTab}
        initialRole={loginModalConfig.initialRole}
      />
    </>
  );
}