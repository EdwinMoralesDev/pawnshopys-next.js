import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="space-y-4 md:space-y-0 md:flex md:gap-4">
      {/* Main Image - Smaller size on desktop */}
      <div className="md:w-[400px]">
        <div className="aspect-square rounded-lg overflow-hidden border bg-white">
          <img
            src={images[selectedImage]}
            alt={productName}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Thumbnails - Row on mobile, Column on desktop */}
      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={cn(
              "flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border transition-all",
              selectedImage === index 
                ? "ring-2 ring-primary border-primary" 
                : "hover:border-primary/50"
            )}
          >
            <img
              src={image}
              alt={`${productName} - Preview ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}