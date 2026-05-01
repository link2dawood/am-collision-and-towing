import { motion } from 'motion/react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface GalleryImage {
  id: string;
  name: string;
  url: string;
  alt_text: string | null;
  tags: string[];
}

// Static fallback — shown on homepage when no images uploaded yet
const FALLBACK: GalleryImage[] = [
  { id: 'f1', name: 'Expert Body Restoration',  url: '/bmw.jpg',                                                                                          alt_text: 'Expert Body Restoration',  tags: ['Auto Body Repair'] },
  { id: 'f2', name: 'Emergency Towing Services', url: '/truck01.jpg',                                                                                      alt_text: 'Emergency Towing Services', tags: ['24/7 Towing'] },
  { id: 'f3', name: 'Commercial Towing Ready',   url: '/truck02.jpg',                                                                                      alt_text: 'Commercial Towing Ready',   tags: ['Heavy Duty'] },
  { id: 'f4', name: 'Rapid Response Recovery',   url: '/truck03.jpg',                                                                                      alt_text: 'Rapid Response Recovery',   tags: ['Roadside Assist'] },
  { id: 'f5', name: 'Expert Collision Repair',   url: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=500&h=500&fit=crop', alt_text: 'Expert Collision Repair',   tags: ['Before/After'] },
  { id: 'f6', name: 'Premium Craftsmanship',     url: '/blackcar.webp',                                                                                    alt_text: 'Premium Craftsmanship',     tags: ['Body Work'] },
];

export default function GallerySection() {
  const [images,  setImages]  = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('media_gallery')
        .select('id, name, url, alt_text, tags')
        .order('sort_order')
        .order('created_at', { ascending: false })
        .limit(6);
      setImages(data || []);
      setLoading(false);
    })();
  }, []);

  const displayItems = images.length > 0 ? images : FALLBACK;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Our Work
          </h2>
          <div className="w-16 h-1 bg-red-600 mx-auto" />
          <p className="text-slate-600 text-lg mt-6 max-w-2xl mx-auto">
            See the quality and attention to detail in every project we complete
          </p>
        </motion.div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {displayItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="relative group overflow-hidden rounded-lg h-64 cursor-pointer"
              >
                <img
                  src={item.url}
                  alt={item.alt_text || item.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    {item.tags && item.tags.length > 0 && (
                      <span className="inline-block px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded mb-2">
                        {item.tags[0]}
                      </span>
                    )}
                    <h3 className="text-white font-bold text-lg">
                      {item.alt_text || item.name}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* View More Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <a
            href="/gallery"
            className="inline-flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 active:scale-95"
          >
            View More Work
            <ArrowRight size={18} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
