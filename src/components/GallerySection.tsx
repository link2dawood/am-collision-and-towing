import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

const galleryItems = [
  {
    id: 1,
    category: 'Auto Body Repair',
    title: 'Expert Body Restoration',
    image: '/bmw.jpg'
  },
  {
    id: 2,
    category: '24/7 Towing',
    title: 'Emergency Towing Services',
    image: '/truck01.jpg'
  },
  {
    id: 3,
    category: 'Heavy Duty',
    title: 'Commercial Towing Ready',
    image: '/truck02.jpg'
  },
  {
    id: 4,
    category: 'Roadside Assist',
    title: 'Rapid Response Recovery',
    image: '/truck03.jpg'
  },
  {
    id: 5,
    category: 'Before/After',
    title: 'Expert Collision Repair',
    image: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=500&h=500&fit=crop'
  },
  {
    id: 6,
    category: 'Body Work',
    title: 'Premium Craftsmanship',
    image: '/blackcar.webp'
  }
];

export default function GallerySection() {
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
          <div className="w-16 h-1 bg-red-600 mx-auto"></div>
          <p className="text-slate-600 text-lg mt-6 max-w-2xl mx-auto">
            See the quality and attention to detail in every project we complete
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {galleryItems.map((item, index) => (
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
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="inline-block px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded mb-2">
                    {item.category}
                  </span>
                  <h3 className="text-white font-bold text-lg">
                    {item.title}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

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
