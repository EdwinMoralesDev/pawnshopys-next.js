import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapPin, Store, Globe, Phone, Navigation, Heart, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { stores } from '@/data/stores';
import { products } from '@/data/products';
import { StoreMap } from '@/components/map/StoreMap';
import { useFavorites } from '@/hooks/useFavorites';
import { formatAddress } from '@/lib/utils';

export default function Home() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'pawnshops';
  const { toggleStoreFavorite, toggleProductFavorite, isFavorite } = useFavorites();

  const handleStoreFavorite = (e: React.MouseEvent, storeId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const store = stores.find(s => s.id === storeId);
    if (store) {
      toggleStoreFavorite(store);
    }
  };

  const handleProductFavorite = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const product = products.find(p => p.id === productId);
    if (product) {
      toggleProductFavorite(product);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center space-y-4 py-12">
        <h1 className="text-4xl font-bold tracking-tight">Welcome to PawnHub</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover unique items and trusted local pawnshops in your area
        </p>
      </section>

      {/* View Toggle and Content */}
      <div className="flex flex-col items-center">
        <Tabs defaultValue={defaultTab} className="w-full max-w-7xl">
          <div className="flex flex-col items-center">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="pawnshops" className="flex items-center gap-2">
                <Store className="w-4 h-4" />
                Pawnshops
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Products
              </TabsTrigger>
              <TabsTrigger value="map" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Map
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="mt-6">
            <TabsContent value="pawnshops">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {stores.map((store) => (
                  <Card 
                    key={store.id} 
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(`/store/${store.id}`)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg">{store.name}</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => handleStoreFavorite(e, store.id)}
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              isFavorite(store.id, 'store')
                                ? 'fill-current text-red-500'
                                : 'text-gray-500'
                            }`}
                          />
                        </Button>
                      </div>
                      <div className="flex items-start gap-2 text-sm mb-4">
                        <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                        <span>{formatAddress(store.location.address)}</span>
                      </div>
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="w-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(`tel:${store.contact.phone}`, '_self');
                            }}
                          >
                            <Phone className="h-4 w-4 mr-2" />
                            Call
                          </Button>
                          {store.url && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="w-full"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(store.url, '_blank');
                              }}
                            >
                              <Globe className="h-4 w-4 mr-2" />
                              Web
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="w-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(
                                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.location.address)}`,
                                '_blank'
                              );
                            }}
                          >
                            <Navigation className="h-4 w-4 mr-2" />
                            Map
                          </Button>
                        </div>
                        <Button 
                          variant="default" 
                          className="w-full bg-black hover:bg-gray-800"
                        >
                          View Store
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="products">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <Card 
                    key={product.id} 
                    className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <div className="relative">
                      <div className="aspect-[4/3] relative">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white/90"
                        onClick={(e) => handleProductFavorite(e, product.id)}
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            isFavorite(product.id, 'product')
                              ? 'fill-current text-red-500'
                              : 'text-gray-500'
                          }`}
                        />
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold truncate">{product.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {product.description}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="font-bold">${product.price.toLocaleString()}</span>
                        <Button 
                          variant="default" 
                          size="sm"
                          className="bg-black hover:bg-gray-800"
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="map">
              <div className="h-[600px]">
                <StoreMap stores={stores} />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="border-t mt-16 pt-8 pb-4">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="font-semibold mb-4">About PawnHub</h3>
              <p className="text-sm text-muted-foreground">
                Connecting customers with trusted local pawnshops since 2024.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Find Stores</li>
                <li>Browse Products</li>
                <li>How It Works</li>
                <li>Support</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Email: support@pawnhub.com</li>
                <li>Phone: (555) 123-4567</li>
                <li>Address: Miami, FL</li>
              </ul>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground mt-8">
            © 2024 PawnHub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}