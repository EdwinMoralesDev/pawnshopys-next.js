import { useState } from 'react';
import { Store, UpdateStoreData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useStores } from '@/hooks/useStores';

interface EditStoreFormProps {
  store: Store;
  isOpen: boolean;
  onClose: () => void;
}

export function EditStoreForm({ store, isOpen, onClose }: EditStoreFormProps) {
  const { updateStore } = useStores();
  const [formData, setFormData] = useState<UpdateStoreData>({
    name: store.name,
    description: store.description,
    location: {
      address: store.location.address,
      lat: store.location.lat,
      lng: store.location.lng,
    },
    contact: {
      phone: store.contact.phone,
      email: store.contact.email,
      website: store.contact.website,
    },
    url: store.url,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateStore(store.id, formData);
      onClose();
    } catch (error) {
      console.error('Failed to update store:', error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section?: 'location' | 'contact'
  ) => {
    const { name, value } = e.target;
    
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Edit Store</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Store Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.location?.address}
                  onChange={(e) => handleChange(e, 'location')}
                  required
                />
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.contact?.phone}
                  onChange={(e) => handleChange(e, 'contact')}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.contact?.email}
                  onChange={(e) => handleChange(e, 'contact')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.contact?.website}
                  onChange={(e) => handleChange(e, 'contact')}
                />
              </div>
            </TabsContent>

            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}