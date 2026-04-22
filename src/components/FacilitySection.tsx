import { Building2, MapPin, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export default function FacilitySection() {
  return (
    <section className="py-20 bg-linear-to-r from-slate-900 to-slate-800">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Image/Visualization */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="rounded-lg overflow-hidden h-80 md:h-96 bg-slate-700">
              <img
                src="/AM.webp"
                alt="AM Collision & Towing Facility"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Feature Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="absolute -bottom-6 -right-6 p-6 bg-white rounded-lg shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-red-100">
                  <Building2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">8000</div>
                  <div className="text-sm text-slate-600">Sq Ft Facility</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                State-of-the-Art Facility
              </h2>
              <div className="w-16 h-1 bg-red-600"></div>
            </div>

            <p className="text-slate-300 text-lg leading-relaxed">
              We recently moved into our brand-new 8,000 square foot facility, 
              designed with modern equipment and spacious work areas to serve you better. 
              Our new location offers improved workspace, accessibility, and a growing 
              presence in the community.
            </p>

            {/* Features */}
            <div className="space-y-4 pt-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex gap-4 items-start"
              >
                <div className="p-2 rounded-lg bg-red-600/20 shrink-0">
                  <Zap className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Modern Equipment</h4>
                  <p className="text-slate-400 text-sm">Latest tools and technology for precise repairs</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="flex gap-4 items-start"
              >
                <div className="p-2 rounded-lg bg-red-600/20 shrink-0">
                  <MapPin className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Visible Location</h4>
                  <p className="text-slate-400 text-sm">Easy to find and accessible from main roads</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex gap-4 items-start"
              >
                <div className="p-2 rounded-lg bg-red-600/20 shrink-0">
                  <Building2 className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Growing Presence</h4>
                  <p className="text-slate-400 text-sm">Expanding capacity to serve more customers</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
