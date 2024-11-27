import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Product, ProductCategory } from '@/lib/types';

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: '1',
    storeId: '1',
    name: 'Vintage Rolex Datejust',
    description: 'Authentic 1985 Rolex Datejust in excellent condition',
    category: ProductCategory.WATCHES,
    condition: 'GOOD',
    price: 4999.99,
    images: ['https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?auto=format&fit=crop&w=600&q=80'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export default function ProductList() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Browse Products</h1>
          <p className="text-muted-foreground">
            Discover unique items from trusted local pawnshops
          </p>
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <Input
          placeholder="Search products..."
          className="md:max-w-sm"
          icon={<Search className="h-4 w-4" />}
        />
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full md:w-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="jewelry">Jewelry</TabsTrigger>
            <TabsTrigger value="electronics">Electronics</TabsTrigger>
            <TabsTrigger value="watches">Watches</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {SAMPLE_PRODUCTS.map((product) => (
          <Card key={product.id} className="overflow-hidden">
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
            </CardContent>
            <CardFooter className="p-4 pt-0 flex items-center justify-between">
              <span className="font-bold">${product.price.toLocaleString()}</span>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}