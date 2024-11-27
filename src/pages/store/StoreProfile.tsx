import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Globe, ArrowLeft, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useStoreContext } from '@/contexts/StoreContext';
import { products } from '@/data/products';
import { StoreMap } from '@/components/map/StoreMap';
import { EditStoreForm } from '@/components/store/EditStoreForm';
import { stores as initialStores } from '@/data/stores';

export default function StoreProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { stores } = useStoreContext();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Use stores from context, fallback to initial stores if context is not ready
  const store = stores.length > 0 
    ? stores.find(s => s.id === id) 
    : initialStores.find(s => s.id === id);

  const storeProducts = products.filter(p => p.storeId === id);

  const handleBackClick = () => {
    navigate('/?tab=pawnshops');
  };

  if (!store) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">Store not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Navigation and Actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          className="-ml-2 text-muted-foreground hover:text-foreground"
          onClick={handleBackClick}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Pawnshops
        </Button>
        <Button 
          variant="outline"
          onClick={() => setIsEditDialogOpen(true)}
        >
          <Pencil className="h-4 w-4 mr-2" />
          Edit Store
        </Button>
      </div>

      {/* Store Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{store.name}</h1>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{store.location.address}</span>
        </div>
      </div>

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {storeProducts.map((product) => (
              <Card 
                key={product.id} 
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className="aspect-square relative">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
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
            {storeProducts.length === 0 && (
              <p className="text-muted-foreground col-span-full text-center py-8">
                No products available at this time
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="about">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{store.contact.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={store.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Visit Website
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full"
                  onClick={() => window.open(`tel:${store.contact.phone}`, '_self')}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Store
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open(
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.location.address)}`,
                    '_blank'
                  )}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="location">
          <Card>
            <CardContent className="p-0">
              <div className="h-[400px]">
                <StoreMap 
                  stores={[store]} 
                  initialCenter={[store.location.lng, store.location.lat]}
                  initialZoom={15}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <EditStoreForm
        store={store}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
      />
    </div>
  );
}