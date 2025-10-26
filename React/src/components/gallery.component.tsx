import { useState } from "react";

const sampleImages = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1579546929662-711aa81148cf',
    date: 'Purple Gradient',
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1542736667-069246bdbc6d',
    date: 'Lavender Fields',
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031',
    date: 'Purple Flowers',
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    date: 'Mountain Sunset'
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a',
    date: 'Abstract Purple'
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b',
    date: 'Night Sky'
  },
  {
    id: 7,
    url: 'https://images.unsplash.com/photo-1491897554428-130a60dd4757',
    date: 'Purple Texture'
  },
  {
    id: 8,
    url: 'https://images.unsplash.com/photo-1518623489648-a173ef7824f3',
    date: 'Purple Landscape'
  }
];

interface GalleryProps {
    sources: img[];
}

interface img {
    id: number,
    filename: string,
    date: Date,
    user: string
}

export const Gallery: React.FC<GalleryProps> = ({ sources }) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const images = sources.map((pic) => {
        const source = "http://localhost:8081/images/" + pic.filename;
        
        return {
            id: pic.id,
            url: source,
            date: pic.date.toUTCString().slice(5,16),
        };
    });

    return (
        <>
            <div className="max-h-[60vh] overflow-y-auto rounded-2xl bg-purple-800/30 backdrop-blur-sm border border-purple-500/50 p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {images.map((image) => (
                        <div
                            key={image.id}
                            className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
                            onClick={() => setSelectedImage(image.url)}
                        >
                            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl p-1 shadow-2xl">
                                <div className="relative overflow-hidden rounded-lg aspect-square">
                                    <img
                                        src={image.url}
                                        alt={image.date}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                            <h3 className="text-white font-semibold text-sm mb-1">
                                                {image.date}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {images.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-24 h-24 mx-auto mb-4 text-purple-300">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl text-white font-semibold mb-2">
                            No images found
                        </h3>
                        <p className="text-purple-200">
                            No images available in this gallery
                        </p>
                    </div>
                )}
            </div>

            {selectedImage && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="max-w-4xl max-h-full bg-gradient-to-br from-purple-800 to-indigo-900 rounded-2xl overflow-hidden border border-purple-500">
                        <div className="relative">
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-4 right-4 z-10 w-8 h-8 bg-purple-700/80 hover:bg-purple-600 rounded-full flex items-center justify-center text-white transition-colors duration-200 backdrop-blur-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <img
                                src={selectedImage}
                                alt="Enlarged view"
                                className="w-full max-h-[70vh] object-contain"
                            />
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    {images.find(img => img.url === selectedImage)?.date || 'Image'}
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
