import { motion } from 'motion/react';
import { Phone, MapPin, ShieldCheck, Clock, Truck, Zap, CheckCircle } from 'lucide-react';

export default function Towing() {
  return (
    <div className="pt-24 lg:pt-32 pb-24 bg-white">
      {/* Hero Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 relative">
        <div className="relative rounded-3xl overflow-hidden min-h-[600px] flex items-center p-8 sm:p-12 md:p-24 shadow-2xl border border-slate-100">
          <div className="absolute inset-0 z-0">
            <img 
              src="/truck02.jpg" 
              alt="Towing Truck" 
              className="w-full h-full object-cover transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div>
          </div>
          
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-widest mb-8 border border-primary/30">
               <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
               24/7 Emergency Dispatch
            </div>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight mb-8 text-white leading-tight">
              Rapid Recovery <br />
              <span className="text-primary italic">When it Matters.</span>
            </h1>
            <p className="text-xl text-slate-200 mb-12 max-w-xl font-medium leading-relaxed">
              Stranded? Our emergency recovery fleet is strategically stationed to reach you within minutes. Professional, safe, and secure transport for any vehicle.
            </p>
            <a 
              href="tel:+16316764440"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-4 bg-primary hover:bg-primary-dark text-white px-12 py-6 rounded-2xl font-bold text-2xl shadow-xl shadow-primary/30 transition-all active:scale-95"
            >
              <Phone className="w-8 h-8" />
              +1 631-676-4440
            </a>
          </div>
        </div>
      </section>

      {/* Towing Stats */}
      <section id="towing-specs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: '30m Response', desc: 'Average arrival time within our primary service hub.', icon: <Clock className="w-8 h-8" /> },
            { title: 'Specialized Fleet', desc: 'Modern flatbeds for high-value and low-clearance vehicles.', icon: <Truck className="w-8 h-8" /> },
            { title: 'Roadside Support', desc: 'Jump starts, tire changes, fuel delivery, and lockouts.', icon: <Zap className="w-8 h-8" /> },
            { title: 'Fully Insured', desc: 'Comprehensive liability coverage for total peace of mind.', icon: <ShieldCheck className="w-8 h-8" /> },
          ].map((item, i) => (
            <div key={i} className="bg-slate-50 p-10 rounded-2xl border border-slate-100 hover:border-primary/20 hover:bg-white hover:shadow-xl transition-all group">
               <div className="w-16 h-16 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                  {item.icon}
               </div>
               <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors">{item.title}</h3>
               <p className="text-slate-600 font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Service Area */}
      <section id="service-area" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center bg-slate-900 rounded-3xl overflow-hidden p-12 lg:p-24 relative">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 rounded-full blur-[120px] translate-x-1/2"></div>
          
          <div className="relative z-10 space-y-12">
            <div>
              <span className="text-primary font-bold uppercase tracking-widest text-xs mb-4 block">Our Reach</span>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
                Complete Service <br />
                <span className="text-primary italic">Area Coverage.</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
              {['Downtown Metro', 'Regional Corridors', 'Industrial Zones', 'Extended Service Grid', 'Airport Recovery'].map((area, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <span className="text-slate-300 font-bold uppercase tracking-widest text-xs">{area}</span>
                </div>
              ))}
            </div>
            
            <p className="text-slate-400 text-lg leading-relaxed font-medium">
              We provide extended recovery services for long-distance fleet transport across the entire state. Call our dispatch center for coordination.
            </p>
          </div>

          <div className="relative h-full min-h-[400px] rounded-2xl overflow-hidden shadow-2xl border border-white/10 hidden lg:block">
            <img 
              src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1200" 
              alt="Service Area Map" 
              className="w-full h-full object-cover opacity-50 grayscale"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
