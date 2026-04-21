import { motion } from 'motion/react';
import { Phone, MapPin, ShieldCheck, Clock, Truck, Zap, AlertTriangle } from 'lucide-react';

export default function Towing() {
  return (
    <div className="pt-24 lg:pt-32 pb-24 relative overflow-hidden bg-iron">
      <div className="absolute inset-0 blueprint-grid opacity-10 pointer-events-none"></div>

      {/* Hero Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 lg:mb-24 relative z-10">
        <div className="relative rounded-none overflow-hidden min-h-[500px] lg:min-h-[700px] flex items-center p-8 sm:p-12 md:p-24 border border-chrome/10">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1578134492170-4f33d1337583?auto=format&fit=crop&q=80&w=2000" 
              alt="Towing Truck" 
              className="w-full h-full object-cover grayscale opacity-40 scale-110 group-hover:scale-100 transition-transform duration-1000"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-iron via-iron/80 to-transparent"></div>
          </div>
          
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-3 micro-label text-primary mb-8">
              <span className="w-12 h-[1px] bg-primary"></span>
              Emergency Dispatch / 24.7.365
            </div>
            <h1 className="text-6xl sm:text-8xl md:text-[160px] font-display tracking-tighter uppercase leading-[0.75] mb-12 text-white">
              RAPID <br />
              <span className="text-primary italic">RECOVERY.</span> <br />
              NOW.
            </h1>
            <p className="text-xl text-chrome/60 mb-12 max-w-xl font-sans font-light leading-relaxed">
              Stuck? Abandoned? Wrecked? Our extreme recovery fleet is moving within 60 seconds of your transmission.
            </p>
            <a 
              href="tel:+15551234567"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-6 bg-primary hover:bg-white p-8 font-nav font-bold text-4xl text-iron transition-all shadow-2xl shadow-primary/40 uppercase tracking-tighter rounded-none"
            >
              <Phone className="w-8 h-8" />
              (555) 123-4567
            </a>
          </div>
        </div>
      </section>

      {/* Why Our Towing? */}
      <section id="towing-specs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-chrome/10">
          {[
            { title: '30m Arrival', desc: 'Average response time within Cityville logistics hub.', icon: <Clock className="w-8 h-8" /> },
            { title: 'Extreme Haul', desc: 'Specialized flatbeds for high-value and low-clearance machinery.', icon: <Truck className="w-8 h-8" /> },
            { title: 'Field Support', desc: 'Jump starts, extraction, and secure storage solutions.', icon: <Zap className="w-8 h-8" /> },
            { title: 'Iron Bond', desc: 'Total liability coverage. Your asset is secure in our custody.', icon: <ShieldCheck className="w-8 h-8" /> },
          ].map((item, i) => (
            <div key={i} className="tech-card h-[320px] flex flex-col justify-end group border-l-0 first:border-l last:border-r border-chrome/10 overflow-hidden">
               <div className="num text-chrome">0{i+1}</div>
               <div className="relative z-10">
                <div className="text-primary mb-6 transition-transform group-hover:scale-110 duration-500 origin-left">
                  {item.icon}
                </div>
                <h3 className="text-3xl font-display uppercase tracking-tighter text-white group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-chrome/50 text-sm font-sans font-light leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Service Area */}
      <section id="service-area" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center bg-engine border border-chrome/10 overflow-hidden">
          <div className="p-12 sm:p-20 lg:p-24 space-y-12 border-r border-chrome/10">
            <div className="space-y-4">
              <span className="micro-label text-primary">Logistics Range / 05</span>
              <h2 className="text-6xl md:text-8xl font-display tracking-tighter uppercase leading-[0.8] text-white">GRID <br /><span className="text-primary italic">COVERAGE.</span></h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {['Downtown Hub', 'Regional Logistics', 'Metro Grid', 'Interstate Corridors', 'Regional Airports'].map((area, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-1 h-1 bg-primary"></div>
                  <span className="micro-label text-chrome tracking-widest transition-colors">{area}</span>
                </div>
              ))}
            </div>
            <p className="text-chrome/50 text-sm font-sans font-light leading-relaxed">
              Extended range recovery available for long-distance transport. Contact dispatch for coordination.
            </p>
          </div>

          <div className="relative h-full min-h-[400px] overflow-hidden grayscale contrast-125 opacity-40">
            <img 
              src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1200" 
              alt="Map Background" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-primary/5"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
