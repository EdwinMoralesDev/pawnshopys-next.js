import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { X, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export function ImageUpload({ 
  images, 
  onImagesChange, 
  maxImages = 4 
}: ImageUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map(file => URL.createObjectURL(file));
    const combinedImages = [...images, ...newImages].slice(0, maxImages);
    onImagesChange(combinedImages);
  }, [images, maxImages, onImagesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: maxImages - images.length,
    disabled: images.length >= maxImages
  });

  const removeImage = (index: number) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index]);
    newImages.splice(index, 1);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative group aspect-square">
            <img
              src={image}
              alt={`Product ${index + 1}`}
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="h-8 w-8"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        {images.length < maxImages && (
          <div
            {...getRootProps()}
            className={cn(
              "aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors",
              isDragActive 
                ? "border-primary bg-primary/5" 
                : "border-muted hover:border-primary/50 hover:bg-muted/50"
            )}
          >
            <input {...getInputProps()} />
            <Upload className="h-6 w-6 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {isDragActive ? 'Drop image here' : 'Add image'}
            </span>
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        Upload up to {maxImages} images. Supported formats: PNG, JPG, JPEG, WebP
      </p>
    </div>
  );
}