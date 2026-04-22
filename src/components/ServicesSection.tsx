import { Wrench, Hammer, Truck, Shield, Zap, Users } from 'lucide-react';
import { motion } from 'motion/react';

const services = [
  {
    icon: Wrench,
    title: 'Auto Body Repair',
    description: 'Professional auto body repair with expert craftsmanship'
  },
  {
    icon: Hammer,
    title: 'Collision Repair',
    description: 'Complete collision damage assessment and repair'
  },
  {
    icon: Truck,
    title: 'Towing Services',
    description: '24/7 emergency towing available in your area'
  },
  {
    icon: Shield,
    title: 'Insurance Support',
    description: 'Streamlined insurance claim assistance'
  },
  {
    icon: Zap,
    title: 'Quick Turnaround',
    description: 'Fast service without compromising quality'
  },
  {
    icon: Users,
    title: 'Expert Team',
    description: 'Highly trained technicians with 40+ years experience'
  },
];

export default function ServicesSection() {
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
            Our Services
          </h2>
          <div className="w-16 h-1 bg-red-600 mx-auto"></div>
          <p className="text-slate-600 text-lg mt-6 max-w-2xl mx-auto">
            Comprehensive auto repair and towing solutions for all your vehicle needs
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-8 rounded-lg border border-slate-200 hover:border-red-600 hover:shadow-lg transition-all group"
              >
                <div className="mb-4 p-3 rounded-lg bg-red-50 w-fit group-hover:bg-red-100 transition-colors">
                  <Icon className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-slate-600">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
