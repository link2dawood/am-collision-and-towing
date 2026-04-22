import { Award, Zap, Building2, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

const trustItems = [
  {
    icon: Award,
    value: '40+',
    label: 'Years Experience',
    description: 'Decades of trusted service to our community'
  },
  {
    icon: Zap,
    value: 'Fast',
    label: 'Turnaround Times',
    description: 'Quick service without quality compromise'
  },
  {
    icon: Building2,
    value: '8000',
    label: 'Sq Ft Facility',
    description: 'State-of-the-art workspace for excellence'
  },
  {
    icon: CheckCircle,
    value: '100%',
    label: 'Quality Backed',
    description: 'Your satisfaction guaranteed'
  },
];

export default function TrustSection() {
  return (
    <section className="py-20 bg-linear-to-r from-slate-900 to-slate-800">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Why Choose Us
          </h2>
          <div className="w-16 h-1 bg-red-600 mx-auto"></div>
          <p className="text-slate-300 text-lg mt-6 max-w-2xl mx-auto">
            Built on decades of trust, expertise, and commitment to excellence
          </p>
        </motion.div>

        {/* Trust Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="mb-4 flex justify-center">
                  <div className="p-4 rounded-full bg-red-600/20 group-hover:bg-red-600/30 transition-colors">
                    <Icon className="w-8 h-8 text-red-500" />
                  </div>
                </div>
                
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {item.value}
                </div>
                
                <div className="text-lg font-semibold text-red-400 mb-2">
                  {item.label}
                </div>
                
                <p className="text-slate-400 text-sm">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Trust Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 p-8 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm"
        >
          <p className="text-slate-300 text-center text-lg leading-relaxed">
            AM Collision & Towing has been a trusted name in the community for over 40 years. 
            Our commitment to quality workmanship, reliable towing service, and customer satisfaction 
            has made us the preferred choice for auto body repair and emergency towing.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
