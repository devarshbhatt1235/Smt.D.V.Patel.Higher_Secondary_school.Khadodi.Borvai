import { useState } from "react";
import { useGetGallery } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Image as ImageIcon, X } from "lucide-react";

export default function Gallery() {
  const { data: photos, isLoading } = useGetGallery();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div>
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">ફોટો ગૅલેરી</h1>
          <p className="text-xl text-primary-foreground/80">Photo Gallery</p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => <Skeleton key={i} className="aspect-square rounded-xl" />)}
            </div>
          ) : !photos || photos.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <ImageIcon size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg">કોઈ ફોટો ઉપલબ્ધ નથી</p>
            </div>
          ) : (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {photos.map(photo => (
                <div
                  key={photo.id}
                  className="break-inside-avoid cursor-pointer rounded-xl overflow-hidden hover:opacity-90 transition-opacity shadow-sm hover:shadow-md"
                  onClick={() => setSelected(photo.imageUrl)}
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.caption || "School photo"}
                    className="w-full object-cover"
                  />
                  {photo.caption && (
                    <div className="p-2 bg-gray-50 text-sm text-gray-600 text-center">{photo.caption}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <button
            className="absolute top-4 right-4 text-white bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
            onClick={() => setSelected(null)}
          >
            <X size={24} />
          </button>
          <img
            src={selected}
            alt="Gallery"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
