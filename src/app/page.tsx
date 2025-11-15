import Image from 'next/image';
import Link from 'next/link';
import { Tent, Waves, Mountain, Sparkles, Calendar, Shield, DollarSign, MapPin } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=2070"
            alt="River Life RV Resort at sunset"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/50 to-gray-900" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <h1 className="heading-xl mb-6 text-white drop-shadow-lg">
            River Life RV Resort
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-accent font-serif italic">
            A Slice of Heaven on the Tennessee River
          </p>
          <p className="text-lg md:text-xl mb-12 text-gray-200 max-w-3xl mx-auto">
            Experience luxury RV living with full hookups, breathtaking river views, and majestic mountain backdrops. 
            Your perfect riverside escape awaits in beautiful Chattanooga, Tennessee.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sites" className="btn-primary">
              <Calendar className="w-5 h-5" />
              Book Your Stay
            </Link>
            <Link href="/attractions" className="btn-secondary">
              <MapPin className="w-5 h-5" />
              Explore Chattanooga
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white rounded-full" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-gray-800">
        <div className="container-custom">
          <h2 className="heading-lg text-center mb-16">
            Why Choose River Life?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Waves className="w-12 h-12 text-accent" />}
              title="Riverfront Sites"
              description="All sites overlook the stunning Tennessee River with direct water views and easy access"
            />
            <FeatureCard
              icon={<Mountain className="w-12 h-12 text-accent" />}
              title="Mountain Backdrop"
              description="Wake up to breathtaking mountain views and spectacular sunsets every evening"
            />
            <FeatureCard
              icon={<Sparkles className="w-12 h-12 text-accent" />}
              title="Full Hookups"
              description="Every site features complete RV hookups - water, electric, and sewer connections"
            />
            <FeatureCard
              icon={<Shield className="w-12 h-12 text-accent" />}
              title="Peaceful Privacy"
              description="Enjoy your space with friendly hosts who respect your privacy but are always available"
            />
          </div>
        </div>
      </section>

      {/* Sites Preview */}
      <section className="section-padding bg-gray-900">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-lg mb-4">
              Our RV Sites
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Nine premium sites plus an on-site Airbnb. Each location offers unique views and exceptional amenities.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Site Preview Cards - We'll populate these dynamically */}
            <SitePreviewCard
              number={1}
              image="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=2070"
              title="Riverside Haven"
              description="Premium riverfront location with panoramic water views"
            />
            <SitePreviewCard
              number={2}
              image="https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=2070"
              title="Mountain View Retreat"
              description="Spectacular mountain vistas with morning sunrise views"
            />
            <SitePreviewCard
              number={3}
              image="https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?q=80&w=2070"
              title="Sunset Point"
              description="Perfect for capturing those incredible Tennessee sunsets"
            />
          </div>

          <div className="text-center">
            <Link href="/sites" className="btn-primary">
              <Tent className="w-5 h-5" />
              View All Sites & Availability
            </Link>
          </div>
        </div>
      </section>

      {/* Chattanooga Attractions Teaser */}
      <section className="section-padding bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="heading-lg mb-6">
                Endless Adventures in Chattanooga
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                You're just minutes away from world-class attractions! Explore Ruby Falls' underground waterfall, 
                walk across Rock City's swinging bridge, visit the Tennessee Aquarium, or ride the historic 
                Incline Railway. Downtown Chattanooga offers incredible dining, breweries, and nightlife.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">✓</span>
                  <span>5 minutes to Tennessee Aquarium & downtown attractions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">✓</span>
                  <span>7 minutes to Lookout Mountain (Ruby Falls, Rock City, Incline Railway)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">✓</span>
                  <span>13+ mile Riverwalk perfect for biking and walking</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">✓</span>
                  <span>World-class outdoor recreation and scenic beauty</span>
                </li>
              </ul>
              <Link href="/attractions" className="btn-primary">
                <MapPin className="w-5 h-5" />
                Discover Local Attractions
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[3/4] relative rounded-lg overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070"
                    alt="Ruby Falls"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="aspect-square relative rounded-lg overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1484820986193-93d8e5e6d8c0?q=80&w=2070"
                    alt="Incline Railway"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="aspect-square relative rounded-lg overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070"
                    alt="Rock City"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="aspect-[3/4] relative rounded-lg overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070"
                    alt="Tennessee Aquarium"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="section-padding bg-accent text-gray-900">
        <div className="container-custom text-center">
          <h2 className="heading-lg mb-6">
            Ready to Experience River Life?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Book your riverside retreat today! Just a 50% deposit secures your dates. 
            We'll review and confirm your reservation within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <div className="flex items-center gap-3">
              <DollarSign className="w-6 h-6" />
              <span className="font-semibold">50% Deposit Required</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6" />
              <span className="font-semibold">Easy Online Booking</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6" />
              <span className="font-semibold">Flexible Cancellation</span>
            </div>
          </div>
          <Link href="/sites" className="inline-flex items-center gap-2 px-10 py-4 bg-gray-900 text-white font-bold rounded-full hover:bg-gray-800 transition-all text-lg">
            Book Your Stay Now
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-gray-900">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="heading-lg mb-4">
              Questions? We're Here to Help!
            </h2>
            <p className="text-xl text-gray-300">
              Not quite ready to book? Have questions about our sites or amenities? 
              We'd love to hear from you!
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="card p-8">
              <h3 className="text-2xl font-bold mb-4">Contact Us</h3>
              <div className="space-y-3 text-gray-300">
                <p>📧 info@riverlifervresort.com</p>
                <p>📞 (423) 555-RIVER</p>
                <p>📍 Along the beautiful Tennessee River<br />Chattanooga, TN</p>
              </div>
            </div>
            
            <div className="card p-8">
              <h3 className="text-2xl font-bold mb-4">Resort Hours</h3>
              <div className="space-y-3 text-gray-300">
                <p><strong>Check-In:</strong> 2:00 PM</p>
                <p><strong>Check-Out:</strong> 11:00 AM</p>
                <p><strong>Office:</strong> We're always available!</p>
                <p className="text-sm italic pt-2">Call or text anytime - we're friendly and responsive</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link href="/contact" className="btn-primary">
              Send Us a Message
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

// Feature Card Component
function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="card p-8 text-center hover:scale-105 transition-transform duration-300">
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}

// Site Preview Card Component
function SitePreviewCard({ number, image, title, description }: { number: number; image: string; title: string; description: string }) {
  return (
    <Link href={`/sites/${number}`} className="card group cursor-pointer hover:scale-105 transition-all duration-300">
      <div className="aspect-[4/3] relative overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-accent text-gray-900 px-4 py-2 rounded-full font-bold">
          Site #{number}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-300">{description}</p>
        <div className="mt-4 text-accent font-semibold group-hover:translate-x-2 transition-transform duration-300 inline-block">
          View Details →
        </div>
      </div>
    </Link>
  );
}
