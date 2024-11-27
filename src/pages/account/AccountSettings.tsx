import { useRef, useState } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera } from 'lucide-react';

export default function AccountSettings() {
  const { user, updateProfile } = useAuthContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    try {
      await updateProfile({ ...formData, avatar: imageUrl });
    } catch (error) {
      console.error('Failed to update profile picture:', error);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) return;

    const imageUrl = URL.createObjectURL(file);
    try {
      await updateProfile({ ...formData, avatar: imageUrl });
    } catch (error) {
      console.error('Failed to update profile picture:', error);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and profile picture
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div
                onClick={handleUploadClick}
                className="relative group w-[425px] rounded-xl border-2 border-dashed p-8 transition-all cursor-pointer border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24 transition-transform group-hover:scale-105">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback className="text-lg">
                        {user?.name?.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">
                      <span className="text-primary">Upload a photo</span> or drag and drop
                    </p>
                    <Input
                      ref={fileInputRef}
                      id="picture"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      PNG, JPG or GIF (max. 2MB)
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <Button type="submit">Save Changes</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to be notified
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Notification settings coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your security preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Security settings coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}