import Image from 'next/image';
import { Camera } from 'lucide-react';

// Beautiful gallery images showcasing RV resort life
const galleryImages = [
  {
    src: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=2070',
    alt: 'Sunset over the Tennessee River',
    category: 'River Views'
  },
  {
    src: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=2070',
    alt: 'RV camping by the river',
    category: 'RV Sites'
  },
  {
    src: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=2070',
    alt: 'Mountain views at sunrise',
    category: 'Mountain Views'
  },
  {
    src: 'https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?q=80&w=2070',
    alt: 'RV site with sunset views',
    category: 'RV Sites'
  },
  {
    src: 'https://images.unsplash.com/photo-1533873984035-25970ab07461?q=80&w=2053',
    alt: 'Tennessee River landscape',
    category: 'River Views'
  },
  {
    src: 'https://images.unsplash.com/photo-1525811902-f2342640856e?q=80&w=2071',
    alt: 'Luxury RV camping setup',
    category: 'RV Sites'
  },
  {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070',
    alt: 'Mountain landscape near Chattanooga',
    category: 'Mountain Views'
  },
  {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070',
    alt: 'Scenic overlook',
    category: 'Views'
  },
  {
    src: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070',
    alt: 'River at golden hour',
    category: 'River Views'
  },
  {
    src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2071',
    alt: 'Nature and wildlife',
    category: 'Wildlife'
  },
  {
    src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2070',
    alt: 'Peaceful river morning',
    category: 'River Views'
  },
  {
    src: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=2832',
    alt: 'Campfire evening by the river',
    category: 'Activities'
  },
  {
    src: 'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?q=80&w=2831',
    alt: 'Outdoor adventure activities',
    category: 'Activities'
  },
  {
    src: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070',
    alt: 'Waterfall exploration nearby',
    category: 'Attractions'
  },
  {
    src: 'https://images.unsplash.com/photo-1484820986193-93d8e5e6d8c0?q=80&w=2070',
    alt: 'Mountain railway adventure',
    category: 'Attractions'
  },
  {
    src: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070',
    alt: 'Aquarium visit',
    category: 'Attractions'
  },
  {
    src: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?q=80&w=2073',
    alt: 'Starry night sky',
    category: 'Night Views'
  },
  {
    src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2148',
    alt: 'Misty morning on the river',
    category: 'River Views'
  }
];

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-gray-900">
      {/* Hero Header */}
      <section className="relative py-24 bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="container-custom text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Camera className="w-12 h-12 text-accent" />
          </div>
          <h1 className="heading-xl mb-6">
            Photo Gallery
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore the beauty of River Life RV Resort through our collection of stunning images. 
            From breathtaking sunsets over the Tennessee River to the majestic mountain backdrops, 
            see what makes our resort a slice of heaven.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="section-padding">
        <div className="container-custom">
          {/* Category Filters - Future enhancement */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            <button className="px-6 py-2 bg-accent text-gray-900 rounded-full font-semibold">
              All Photos
            </button>
            <button className="px-6 py-2 bg-gray-800 text-gray-300 rounded-full font-semibold hover:bg-gray-700 transition">
              River Views
            </button>
            <button className="px-6 py-2 bg-gray-800 text-gray-300 rounded-full font-semibold hover:bg-gray-700 transition">
              RV Sites
            </button>
            <button className="px-6 py-2 bg-gray-800 text-gray-300 rounded-full font-semibold hover:bg-gray-700 transition">
              Mountain Views
            </button>
            <button className="px-6 py-2 bg-gray-800 text-gray-300 rounded-full font-semibold hover:bg-gray-700 transition">
              Attractions
            </button>
          </div>

          {/* Masonry Grid */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="break-inside-avoid relative group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-lg">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={800}
                    height={600}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/0 to-gray-900/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="text-white font-semibold text-lg mb-1">
                        {image.alt}
                      </p>
                      <p className="text-accent text-sm">
                        {image.category}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16 pt-16 border-t border-gray-800">
            <h2 className="heading-lg mb-6">
              Ready to Create Your Own Memories?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Experience the beauty of River Life RV Resort in person. 
              Book your stay today and start making unforgettable memories!
            </p>
            <a href="/sites" className="btn-primary">
              Book Your Stay
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
