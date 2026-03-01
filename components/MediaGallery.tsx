'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface MediaItem {
  id: number;
  url: string;
  name: string;
  mediaType: string;
}

interface MediaGalleryProps {
  media: MediaItem[];
  isOwner: boolean;
}

export default function MediaGallery({ media, isOwner }: MediaGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const router = useRouter();

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
    document.body.style.overflow = 'auto';
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % media.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + media.length) % media.length);
    }
  };

  if (media.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-secondary/20 rounded-xl border-2 border-dashed">
        <p className="text-lg font-medium">No media found</p>
        <p className="text-sm">This user hasn't uploaded any media yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {media.map((item, index) => (
          <div
            key={item.id}
            className="group relative aspect-square cursor-pointer overflow-hidden bg-secondary/50 transition-all hover:ring-2 hover:ring-primary/50"
            onClick={() => openLightbox(index)}
          >
            {item.mediaType === 'Image' ? (
              <Image
                src={item.url}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
            ) : (
                <div className="flex h-full w-full items-center justify-center bg-secondary">
                    <span className="text-xs font-mono uppercase opacity-50">{item.mediaType}</span>
                </div>
            )}
            
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
               <p className="truncate text-xs text-white">{item.name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 transition-all animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 z-50 text-white hover:bg-white/10"
            onClick={closeLightbox}
          >
            <X className="h-6 w-6" />
          </Button>

          <div className="relative flex h-full w-full items-center justify-center p-4 md:p-12">
            {media.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 z-50 h-12 w-12 rounded-full text-white hover:bg-white/10"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 z-50 h-12 w-12 rounded-full text-white hover:bg-white/10"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}

            <div 
                className="relative h-full w-full max-w-5xl"
                onClick={(e) => e.stopPropagation()}
            >
              {media[selectedIndex].mediaType === 'Image' ? (
                <Image
                  src={media[selectedIndex].url}
                  alt={media[selectedIndex].name}
                  fill
                  className="object-contain"
                  priority
                />
              ) : (
                   <div className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-2xl bg-secondary/10 text-white">
                        <div className="rounded-full bg-primary/20 p-6">
                            <Download className="h-12 w-12 text-primary" />
                        </div>
                        <p className="text-xl font-medium">{media[selectedIndex].name}</p>
                        <p className="text-muted-foreground uppercase">{media[selectedIndex].mediaType} File</p>
                        <Button 
                            variant="outline" 
                            className="bg-transparent text-white border-white/20 hover:bg-white/10"
                            asChild
                        >
                            <a href={media[selectedIndex].url} download target="_blank" rel="noopener noreferrer">
                                Download File
                            </a>
                        </Button>
                   </div>
              )}
                
              <div className="absolute inset-x-0 -bottom-10 flex items-center justify-between text-white/70">
                <p className="text-sm">{media[selectedIndex].name}</p>
                <p className="text-sm">
                  {selectedIndex + 1} / {media.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
