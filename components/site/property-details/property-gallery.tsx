import Image from "next/image";
import { ImageIcon, Images } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatPropertyType } from "@/lib/format";
import { getPropertyGallery } from "@/lib/property";
import type { IProperty } from "@/lib/types";

interface PropertyGalleryProps {
  property: IProperty;
}

export default function PropertyGallery({ property }: PropertyGalleryProps) {
  const gallery = getPropertyGallery(property);
  const mainImage = gallery[0];
  const sideImages = gallery.slice(1, 5);

  return (
    <section className="bg-zinc-950 px-4 py-4 md:py-6">
      <div className="container mx-auto max-w-7xl">
        {mainImage ? (
          <div className="relative grid h-[360px] gap-2 overflow-hidden rounded-lg md:h-[560px] md:grid-cols-4 md:grid-rows-2">
            <div className="group relative overflow-hidden bg-zinc-800 md:col-span-2 md:row-span-2">
              <Image
                src={mainImage.url}
                alt={mainImage.name || property.title}
                fill
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                <Badge className="rounded-md bg-white text-zinc-950 hover:bg-white">
                  {formatPropertyType(property.property_type)}
                </Badge>
                <Badge className="rounded-md bg-zinc-950/70 text-white backdrop-blur hover:bg-zinc-950/70">
                  <Images className="h-3.5 w-3.5" />
                  {gallery.length} photos
                </Badge>
              </div>
            </div>

            {sideImages.map((image) => (
              <div
                key={image.id}
                className="group relative hidden overflow-hidden bg-zinc-800 md:block"
              >
                <Image
                  src={image.url}
                  alt={image.name || property.title}
                  fill
                  sizes="25vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
            ))}

            {sideImages.length < 4 &&
              Array.from({ length: 4 - sideImages.length }).map((_, index) => (
                <div
                  key={`placeholder-${index}`}
                  className="hidden items-center justify-center bg-zinc-900 text-zinc-600 md:flex"
                >
                  <ImageIcon className="h-8 w-8" />
                </div>
              ))}
          </div>
        ) : (
          <div className="flex h-[360px] flex-col items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-500 md:h-[520px]">
            <ImageIcon className="mb-3 h-12 w-12" />
            <p>No images available for this property</p>
          </div>
        )}
      </div>
    </section>
  );
}
