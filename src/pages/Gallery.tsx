import { motion } from 'motion/react';
import { useState } from 'react';
import { Instagram, ArrowRight } from 'lucide-react';

const galleryItems = [
  { id: 1, type: 'before', url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=800', title: 'Rear End Impact' },
  { id: 2, type: 'after', url: 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&q=80&w=800', title: 'Structural Restoration' },
  { id: 3, type: 'process', url: '/bikeframe.webp', title: 'Frame Precision Work' },
  { id: 4, type: 'finish', url: '/luxery.jpg', title: 'Luxury Refinishing' },
  { id: 5, type: 'before', url: '/front.jpg', title: 'Front Collision Damage' },
  { id: 6, type: 'after', url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800', title: 'Factory-Grade Restore' },
  { id: 7, type: 'process', url: '/paint.jpg', title: 'Certified Painting' },
  { id: 8, type: 'finish', url: '/gloss.jpg', title: 'Gloss Verification' },
];

export default function Gallery() {
  const [filter, setFilter] = useState<'all' | 'before' | 'after' | 'process'>('all');

  const filteredItems = filter === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.type === filter || (filter === 'after' && item.type === 'finish'));

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

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-4 mb-16">
          {['all', 'before', 'after', 'process'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-6 py-2.5 rounded-full font-bold text-sm tracking-widest uppercase transition-all border duration-300 ${filter === f
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30'
                : 'bg-white text-slate-500 hover:text-slate-900 border-slate-200 hover:border-slate-400'
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item, i) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="relative aspect-square overflow-hidden group rounded-2xl shadow-sm border border-slate-100"
            >
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8 backdrop-blur-[2px]">
                <span className="text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block">Stage: {item.type}</span>
                <h4 className="text-xl font-bold leading-tight text-white">{item.title}</h4>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Social Feed Banner */}
        <div className="mt-32 bg-slate-900 rounded-3xl p-12 lg:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 rounded-full blur-[120px] translate-x-1/2"></div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-primary mb-8 mx-auto">
              <Instagram className="w-8 h-8" />
            </div>
            <h3 className="text-3xl md:text-5xl font-bold mb-8 text-white leading-tight">Follow Our Daily <br />Restoration Journey.</h3>
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
