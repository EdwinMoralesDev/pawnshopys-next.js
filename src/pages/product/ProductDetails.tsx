import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Store, MapPin, Phone, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useProductContext } from '@/contexts/ProductContext';
import { stores } from '@/data/stores';
import { Product, ProductCategory } from '@/lib/types';
import { ImageGallery } from '@/components/product/ImageGallery';
import { ImageUpload } from '@/components/product/ImageUpload';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, updateProduct } = useProductContext();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Product>>({});

  const product = products.find(p => p.id === id);
  const store = product ? stores.find(s => s.id === product.storeId) : null;
  const relatedProducts = products
    .filter(p => p.id !== id && p.category === product?.category)
    .slice(0, 4);

  if (!product || !store) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">Product not found</p>
      </div>
    );
  }

  const handleBackClick = () => {
    navigate('/?tab=products');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    const updatedProduct = {
      ...product,
      ...editForm,
      updatedAt: new Date().toISOString()
    };

    updateProduct(updatedProduct);
    setIsEditDialogOpen(false);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value
    }));
  };

  const handleImagesChange = (newImages: string[]) => {
    setEditForm(prev => ({
      ...prev,
      images: newImages
    }));
  };

  return (
    <div className="space-y-6">
      {/* Navigation and Actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          className="-ml-2 text-muted-foreground hover:text-foreground"
          onClick={handleBackClick}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setEditForm(product);
            setIsEditDialogOpen(true);
          }}
        >
          <Pencil className="h-4 w-4 mr-2" />
          Edit Product
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Product Images */}
        <div>
          <ImageGallery images={product.images} productName={product.name} />
        </div>

        {/* Product Info */}
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{product.name}</h1>
            <p className="mt-2 text-2xl font-bold">
              ${product.price.toLocaleString()}
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-semibold">Description</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Store Info Card */}
          <Card className="mt-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Store className="h-4 w-4" />
                Available at {store.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span>{store.location.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>{store.contact.phone}</span>
                </div>
              </div>
              <div className="space-y-2">
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
                  onClick={() => navigate(`/store/${store.id}`)}
                >
                  <Store className="h-4 w-4 mr-2" />
                  View Store
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Separator */}
      {relatedProducts.length > 0 && (
        <div className="my-12">
          <Separator />
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Related Products</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((relatedProduct) => (
              <Card 
                key={relatedProduct.id} 
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/product/${relatedProduct.id}`)}
              >
                <div className="aspect-[4/3] relative">
                  <img
                    src={relatedProduct.images[0]}
                    alt={relatedProduct.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardContent className="p-3">
                  <h3 className="font-medium text-sm truncate">{relatedProduct.name}</h3>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {relatedProduct.description}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-semibold text-sm">
                      ${relatedProduct.price.toLocaleString()}
                    </span>
                    <Button 
                      variant="default" 
                      size="sm"
                      className="h-7 text-xs bg-black hover:bg-gray-800"
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
            </TabsList>
            <TabsContent value="details">
              <form onSubmit={handleEditSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={editForm.name || ''}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={editForm.description || ''}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={editForm.price || ''}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    name="category"
                    value={editForm.category}
                    onValueChange={(value) => handleEditChange({
                      target: { name: 'category', value }
                    } as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ProductCategory).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="pt-4 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="photos" className="mt-4">
              <ImageUpload
                images={editForm.images || []}
                onImagesChange={handleImagesChange}
                maxImages={4}
              />
              <div className="mt-4 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleEditSubmit}>Save Changes</Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}