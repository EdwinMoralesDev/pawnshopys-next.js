import { useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { stores } from '@/data/stores';

export default function StoreLocator() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.location.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Find Stores Near You</h1>
        <p className="text-muted-foreground">
          Discover trusted pawnshops in Miami and browse their inventory.
        </p>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Search by name or location..."
          className="max-w-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button>
          <MapPin className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredStores.map((store) => (
          <Card key={store.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="truncate">{store.name}</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {store.rating} ★ ({store.reviews})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">{store.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <span>{store.location.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{store.contact.phone}</span>
                  </div>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full" variant="outline">
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{store.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium flex items-center gap-2">
                          <Clock className="h-4 w-4" /> Hours
                        </h4>
                        <div className="text-sm grid grid-cols-2 gap-2">
                          {Object.entries(store.hours).map(([day, hours]) => (
                            <div key={day} className="flex justify-between">
                              <span className="capitalize">{day}:</span>
                              <span>
                                {hours.open === 'closed' ? 'Closed' : `${hours.open} - ${hours.close}`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Contact</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{store.contact.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{store.contact.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}