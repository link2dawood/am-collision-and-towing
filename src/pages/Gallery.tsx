import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { Instagram, ArrowRight, Loader2, ImageIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface GalleryImage {
  id: string;
  name: string;
  url: string;
  alt_text: string | null;
  tags: string[];
  created_at: string;
  mime_type?: string;
}

// Static fallback images shown when no images have been uploaded yet
const FALLBACK_ITEMS = [
  { id: 'f1', name: 'Rear End Impact',        url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=800', alt_text: 'Rear End Impact',        tags: ['before'], created_at: '' },
  { id: 'f2', name: 'Structural Restoration', url: 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&q=80&w=800', alt_text: 'Structural Restoration', tags: ['after'],  created_at: '' },
  { id: 'f3', name: 'Frame Precision Work',   url: '/bikeframe.webp',                                                                               alt_text: 'Frame Precision Work',   tags: ['process'], created_at: '' },
  { id: 'f4', name: 'Luxury Refinishing',     url: '/luxery.jpg',                                                                                   alt_text: 'Luxury Refinishing',     tags: ['after'],  created_at: '' },
  { id: 'f5', name: 'Front Collision Damage', url: '/front.jpg',                                                                                    alt_text: 'Front Collision Damage', tags: ['before'], created_at: '' },
  { id: 'f6', name: 'Factory-Grade Restore',  url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800',    alt_text: 'Factory-Grade Restore',  tags: ['after'],  created_at: '' },
  { id: 'f7', name: 'Certified Painting',     url: '/paint.jpg',                                                                                    alt_text: 'Certified Painting',     tags: ['process'], created_at: '' },
  { id: 'f8', name: 'Gloss Verification',     url: '/gloss.jpg',                                                                                    alt_text: 'Gloss Verification',     tags: ['after'],  created_at: '' },
];

export default function Gallery() {
  const [images,  setImages]  = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState<string>('all');

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('media_gallery')
        .select('id, name, url, alt_text, tags, created_at, mime_type')
        .order('sort_order')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Gallery fetch error:', error);
        setImages([]);
      } else {
        setImages(data || []);
      }
      setLoading(false);
    })();
  }, []);

  // If no images uploaded yet, fall back to static examples
  const displayImages = images.length > 0 ? images : FALLBACK_ITEMS;
  const usingFallback = images.length === 0 && !loading;

  // Collect all unique tags from images for dynamic filter buttons
  const allTags = Array.from(
    new Set(displayImages.flatMap(img => img.tags ?? []))
  ).sort();

  // Filter by tags (tags is an array on each image)
  const filtered = filter === 'all'
    ? displayImages
    : displayImages.filter(img =>
        img.tags && img.tags.some(t => t === filter)
      );

  // When using fallback and no tag matches, just show all
  const visibleItems = filtered.length === 0 && usingFallback ? displayImages : filtered;

  return (
    <div className="pt-24 lg:pt-32 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-20">
          <div className="max-w-3xl">
            <span className="text-primary font-bold uppercase tracking-widest text-xs mb-4 block">Visual Proof</span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]">
              Excellence in <br />
              <span className="text-primary">Restoration.</span>
            </h1>
          </div>
          <p className="text-slate-600 max-w-sm text-lg leading-relaxed font-medium">
            Explore our portfolio of certified restoration projects, documenting the journey from wreckage to factory-perfect results.
          </p>
        </div>

        {/* Filter Controls — dynamic from tag data */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-4 mb-16">
            {(['all', ...allTags] as string[]).map((f) => (
              <button
                key={f}
                onClick={() => { setFilter(f); }}
                className={`px-6 py-2.5 rounded-full font-bold text-sm tracking-widest uppercase transition-all border duration-300 ${
                  filter === f
                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30'
                    : 'bg-white text-slate-500 hover:text-slate-900 border-slate-200 hover:border-slate-400'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        )}

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-slate-500 font-medium">Loading gallery…</p>
          </div>
        ) : visibleItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4 border-2 border-dashed border-slate-200 rounded-3xl">
            <ImageIcon className="w-12 h-12 text-slate-300" />
            <p className="text-slate-500 font-medium">No images in this category yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {visibleItems.map((item, i) => (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: i * 0.04 }}
                  className="relative aspect-square overflow-hidden group rounded-2xl shadow-sm border border-slate-100"
                >
                  {item.mime_type?.startsWith('video/') || item.url.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                    <video
                      src={item.url}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                      muted
                      loop
                      playsInline
                      onMouseOver={e => (e.target as HTMLVideoElement).play()}
                      onMouseOut={e => { const v = e.target as HTMLVideoElement; v.pause(); v.currentTime = 0; }}
                    />
                  ) : (
                    <img
                      src={item.url}
                      alt={item.alt_text || item.name}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6 backdrop-blur-[2px]">
                    {item.tags && item.tags.length > 0 && (
                      <span className="text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block">
                        {item.tags[0]}
                      </span>
                    )}
                    <h4 className="text-lg font-bold leading-tight text-white">{item.alt_text || item.name}</h4>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Social Feed Banner */}
        <div className="mt-32 bg-slate-900 rounded-3xl p-12 lg:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 rounded-full blur-[120px] translate-x-1/2" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-primary mb-8 mx-auto">
              <Instagram className="w-8 h-8" />
            </div>
            <h3 className="text-3xl md:text-5xl font-bold mb-8 text-white leading-tight">
              Follow Our Daily <br />Restoration Journey.
            </h3>
            <p className="text-slate-400 mb-12 text-lg font-medium leading-relaxed">
              Stay connected with our workshop. We post daily behind-the-scenes content and recently finished projects on our official social channels.
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-3 bg-white hover:bg-slate-100 text-slate-900 px-10 py-5 rounded-2xl font-bold text-lg transition-all shadow-xl"
            >
              <span>@AMCollision</span>
              <ArrowRight className="w-5 h-5 text-primary" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
