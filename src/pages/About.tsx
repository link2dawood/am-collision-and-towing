import { motion } from 'motion/react';
import { Award, Shield, Users, Target, CheckCircle, Award as Trophy } from 'lucide-react';

export default function About() {
  return (
    <div className="pt-24 lg:pt-32 pb-24 bg-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary font-bold uppercase tracking-widest text-xs mb-4 block">Our Story</span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-slate-900 leading-[1.1]">
              Restoring Performance, <br />
              <span className="text-primary">Defining Quality.</span>
            </h1>
            <div className="space-y-6 text-slate-600 text-lg leading-relaxed max-w-xl font-medium">
              <p>
                Founded in 2009, AM Collision was built on the principle that every vehicle deserves factory-specification restoration. We combine decades of technical expertise with modern equipment to return your car to its peak condition.
              </p>
              <p>
                From meticulous structural realignment to precision paint matching, our certified master technicians ensure your safety and satisfaction are the primary metrics of our success.
              </p>
            </div>
          </motion.div>

          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-slate-100 group">
              <img 
                src="/fff.webp" 
                alt="Our Professional Facility" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-white p-8 shadow-2xl rounded-2xl border border-slate-100 max-w-[240px]">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                 <Shield className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2 leading-tight">I-CAR GOLD CLASS</h4>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Certified Facility</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Pillars */}
      <section className="bg-slate-50 py-24 mb-32 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'The Standard', desc: 'OEM specifications are our baseline. We never compromise on structural integrity or safety blueprints.', icon: <Target className="w-8 h-8" /> },
            { title: 'The Community', desc: 'Locally owned and operated. We are proud to support the communities that drive our business forward.', icon: <Users className="w-8 h-8" /> },
            { title: 'The Promise', desc: 'We provide a comprehensive lifetime warranty on all structural alignment and refinishing.', icon: <CheckCircle className="w-8 h-8" /> },
          ].map((item, i) => (
            <div key={i} className="bg-white p-10 rounded-2xl shadow-sm border border-slate-100 hover:border-primary/20 transition-all flex flex-col gap-6">
              <div className="w-16 h-16 rounded-xl bg-slate-50 flex items-center justify-center text-primary shadow-inner">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 leading-tight">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Protocols Section */}
      <section id="protocols" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <div className="text-center mb-24 max-w-2xl mx-auto">
          <span className="text-primary font-bold uppercase tracking-widest text-xs mb-4 block">Our Methodology</span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Repair Excellence Protocols</h2>
          <p className="text-lg text-slate-600">A systematic, transparent journey from initial damage assessment to verified safety clearance.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {[
            { title: 'Safety Integrity', text: 'Safety is absolute. We never compromise on factory-spec structural repairs or material quality.' },
            { title: 'Advanced Technology', text: 'Continuous investment in 3D frame alignment and thermal imaging for high-performance precision.' },
            { title: 'Restored Excellence', text: 'Every restoration is a return-to-factory event. Near-perfect finishing is our only standard.' },
            { title: 'Full Transparency', text: 'Stay informed with clear communication and direct documentation throughout the entire cycle.' },
          ].map((v, i) => (
            <div key={i} className="flex gap-8 group items-start p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white transition-colors duration-300">
              <div className="shrink-0 w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary font-bold text-xl">
                 {i + 1}
              </div>
              <div>
                <h4 className="text-2xl font-bold mb-3 text-slate-900 group-hover:text-primary transition-colors leading-tight">{v.title}</h4>
                <p className="text-slate-600 leading-relaxed font-medium text-sm">{v.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
