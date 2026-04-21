import { motion } from 'motion/react';
import { useState } from 'react';

const galleryItems = [
  { id: 1, type: 'before', url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=800', title: 'Rear End Collision' },
  { id: 2, type: 'after', url: 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&q=80&w=800', title: 'Rear End Restore' },
  { id: 3, type: 'process', url: 'https://images.unsplash.com/photo-1590400541360-3af4b0ef06b0?auto=format&fit=crop&q=80&w=800', title: 'Frame Machine Work' },
  { id: 4, type: 'finish', url: 'https://images.unsplash.com/photo-1594970544557-00a6888c99f8?auto=format&fit=crop&q=80&w=800', title: 'Luxury Paint Finish' },
  { id: 5, type: 'before', url: 'https://images.unsplash.com/photo-1598370162598-be90203f56bc?auto=format&fit=crop&q=80&w=800', title: 'Front End Damage' },
  { id: 6, type: 'after', url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800', title: 'Front End Restore' },
  { id: 7, type: 'process', url: 'https://images.unsplash.com/photo-1503376780353-7e66a876a170?auto=format&fit=crop&q=80&w=800', title: 'Custom Spraying' },
  { id: 8, type: 'finish', url: 'https://images.unsplash.com/photo-1507136566006-2c5e5265b6f3?auto=format&fit=crop&q=80&w=800', title: 'Gloss Perfection' },
];

export default function Gallery() {
  const [filter, setFilter] = useState<'all' | 'before' | 'after' | 'process'>('all');

  const filteredItems = filter === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.type === filter || (filter === 'after' && item.type === 'finish'));

  return (
    <div className="pt-32 pb-24 relative overflow-hidden bg-iron">
      <div className="absolute inset-0 blueprint-grid opacity-10 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20 border-b border-chrome/10 pb-10">
          <div className="max-w-3xl">
            <span className="micro-label text-primary mb-4 block">Visual Evidence / 06</span>
            <h1 className="text-6xl sm:text-[120px] font-display font-black tracking-tighter uppercase leading-[0.75] text-white">The <br /> Operation.</h1>
          </div>
          <p className="text-chrome/50 max-w-sm text-xs font-nav uppercase tracking-widest leading-loose text-right">
            Every pixel represents a verified restoration. Witness the transition from wreckage to precision.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-2 mb-12">
          {['all', 'before', 'after', 'process'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-8 py-3 font-nav font-bold text-2xl uppercase tracking-tighter transition-all rounded-none ${
                filter === f 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'bg-engine text-chrome/60 hover:text-white hover:bg-engine/80 border border-chrome/10'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-chrome/10">
          {filteredItems.map((item, i) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative aspect-square overflow-hidden group cursor-pointer border-r border-b border-chrome/10 last:border-r-0"
            >
              <img 
                src={item.url} 
                alt={item.title} 
                className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-iron/80 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                <span className="micro-label text-primary mb-2">Protocol: {item.type}</span>
                <h4 className="text-3xl font-display font-black uppercase tracking-tighter leading-none text-white">{item.title}</h4>
              </div>
              <div className="absolute top-4 right-4 micro-label text-white/10 font-nav">0{i+1}</div>
            </motion.div>
          ))}
        </div>

        <div className="mt-32 tech-card p-16 text-center max-w-4xl mx-auto border-t-4 border-primary">
          <span className="micro-label text-primary mb-6 block">Real-time Stream</span>
          <h3 className="text-5xl md:text-7xl font-display font-black mb-8 uppercase tracking-tighter leading-none text-white">Access the <br />Full Feed.</h3>
          <p className="text-chrome/60 mb-10 max-w-lg mx-auto text-xs font-nav uppercase tracking-widest leading-loose">
            Follow our high-intensity restorative stream on Instagram for daily operational updates.
          </p>
          <a href="#" className="inline-block bg-primary hover:bg-white text-iron px-12 py-5 font-nav font-bold text-2xl transition-all uppercase tracking-tighter rounded-none">
             Follow @AMCollision
          </a>
        </div>
      </div>
    </div>
  );
}
