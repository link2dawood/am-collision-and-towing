import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck, Clock, Award, Hammer, Car, PhoneCall, Truck, Droplets, ChevronRight } from 'lucide-react';
import LeadForm from '../components/LeadForm';
import { Page } from '../types';

interface HomeProps {
  setPage: (page: Page) => void;
}

export default function Home({ setPage }: HomeProps) {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0 bg-iron">
          <div className="absolute inset-0 blueprint-grid opacity-20"></div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            className="absolute right-0 top-0 w-1/2 h-full bg-primary blur-[120px] rounded-full translate-x-1/2 -translate-y-1/4"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[80vh]">
          {/* Left Side: Headline */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center border-r border-chrome/10 lg:pr-12"
          >
            <div className="flex items-center gap-3 mb-8">
              <span className="w-12 h-[1px] bg-primary"></span>
              <span className="micro-label text-primary">Est. 2009 / Cityville</span>
            </div>
            
            <h1 className="text-7xl sm:text-8xl md:text-[140px] font-display leading-[0.8] tracking-[-0.02em] mb-8 text-white">
              WE FIX <br />
              EVERYTHING. <br />
              <span className="text-primary italic">WE TOW.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-chrome mb-10 max-w-md leading-relaxed font-sans font-light">
              Certified auto body repair and state-of-the-art recovery for modern machinery.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => setPage('contact')}
                className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white px-10 py-5 font-nav text-2xl uppercase tracking-tighter transition-all shadow-xl shadow-primary/20 rounded-none"
              >
                Request Estimate
              </button>
            </div>
          </motion.div>

          {/* Right Side: Stats & Interaction */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-center lg:pl-20 py-12 lg:py-0 space-y-12"
          >
            {[
              { label: 'Authorized Repair Facility', val: 'I-CAR GOLD CLASS', sub: 'Highest collision repair industry standard' },
              { label: 'Response Fleet', val: '30 MIN ARRIVAL', sub: 'Available 24 hours a day, 7 days a week' },
              { label: 'Market Trust', val: '15,000+ VEHICLES', sub: 'Precision restoration since day one' },
            ].map((stat, i) => (
              <div key={i} className="border-l-4 border-primary pl-8 group cursor-default">
                <div className="micro-label mb-2 group-hover:text-primary transition-colors">{stat.label}</div>
                <div className="text-4xl md:text-5xl font-display tracking-tight mb-1">{stat.val}</div>
                <div className="micro-label opacity-50 lowercase tracking-normal italic font-nav">{stat.sub}</div>
              </div>
            ))}
            
            <div id="hero-contact" className="pt-8">
               <LeadForm />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Services Preview */}
      <section id="services-preview" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-chrome/10">
        <div className="flex items-center gap-6 mb-20 overflow-hidden">
          <div className="flex flex-col">
            <span className="micro-label text-primary">Operating Specs / 01</span>
            <h2 className="text-5xl md:text-8xl font-display uppercase tracking-tighter text-white">Full Service <br /> Restoration</h2>
          </div>
          <div className="flex-grow h-[1px] bg-chrome/10 hidden md:block"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-chrome/10">
          {[
            { 
              title: "Collision Recovery", 
              desc: "Complete structural restoration and frame realignment to original factory blueprint specifications.", 
              icon: <Car className="w-8 h-8" />, 
              link: 'services' 
            },
            { 
              title: "Emergency Tow", 
              desc: "Rapid deployment 24/7 recovery fleet. Secure transport for light and medium duty machinery.", 
              icon: <Truck className="w-8 h-8" />, 
              link: 'towing' 
            },
            { 
              title: "Paint & Surface", 
              desc: "Precision digital color matching and climate-controlled finishing for a seamless factory mirror exit.", 
              icon: <Droplets className="w-8 h-8" />, 
              link: 'services' 
            }
          ].map((service, i) => (
            <motion.div
              key={i}
              onClick={() => setPage(service.link as Page)}
              className="tech-card h-[450px] flex flex-col justify-end group cursor-pointer border-l-0 first:border-l last:border-r border-chrome/10 overflow-hidden"
            >
              <div className="num text-chrome">0{i+1}</div>
              <div className="relative z-10 font-sans">
                <div className="text-primary mb-8 group-hover:scale-110 transition-transform duration-500 origin-left">
                  {service.icon}
                </div>
                  <h3 className="text-4xl font-display uppercase tracking-tighter text-white group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                <p className="text-chrome/70 text-sm font-sans font-light leading-relaxed mb-8 max-w-[260px]">
                  {service.desc}
                </p>
                <div className="flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300">
                  <span className="micro-label text-primary group-hover:text-white transition-colors">Initialize Recovery</span>
                  <ChevronRight className="w-4 h-4 text-primary group-hover:text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="authority" className="bg-bone py-24 border-y border-chrome/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-16">
            <div className="space-y-4">
              <span className="micro-label text-primary">Authority Check / 02</span>
              <h2 className="text-6xl md:text-[90px] font-display uppercase tracking-tighter leading-[0.8] text-iron">
                PRECISION IS <br />THE <span className="text-primary italic">STANDRD.</span>
              </h2>
            </div>
            
            <div className="space-y-10">
              {[
                { title: 'I-CAR Gold Class', desc: 'The elite automotive training benchmark.', icon: <Award className="w-8 h-8" /> },
                { title: 'Iron-Clad Warranty', desc: 'Lifetime support on structural engineering.', icon: <ShieldCheck className="w-8 h-8" /> },
                { title: 'Total Claim Sync', desc: 'Direct data-stream with all major insurance.', icon: <Clock className="w-8 h-8" /> },
              ].map((item, i) => (
                <div key={i} className="flex gap-8 group">
                  <div className="shrink-0 w-16 h-16 bg-white flex items-center justify-center text-primary border border-chrome/20 group-hover:border-primary transition-all rounded-none shadow-sm">
                    {item.icon}
                  </div>
                  <div className="flex flex-col justify-center">
            <h4 className="text-2xl font-display uppercase tracking-tight text-iron group-hover:text-primary transition-colors">{item.title}</h4>
                    <p className="micro-label text-chrome font-light">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-none overflow-hidden border border-chrome/20 aspect-video lg:aspect-square group transition-all duration-700 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1590400541360-3af4b0ef06b0?auto=format&fit=crop&q=80&w=1200" 
                alt="Repair Shop" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-primary p-12 text-white cursor-default transition-all duration-300 hover:rotate-1 shadow-2xl rounded-none">
              <div className="flex items-center gap-6">
                <div className="text-8xl font-display font-black leading-none text-glow">4.9</div>
                <div>
                  <div className="flex text-amber gap-1 mb-2">
                    {'★'.repeat(5)}
                  </div>
                  <div className="micro-label text-white font-black">800+ Verified Reviews</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Before/After Promo */}
      <section id="evidence" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center border-t border-chrome/10">
        <div className="flex flex-col items-center mb-16">
          <span className="micro-label text-primary">Evidence / 03</span>
          <h2 className="text-5xl md:text-7xl font-display mb-12 uppercase tracking-tighter text-white">Visual Proof</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-chrome/10">
          <div className="relative overflow-hidden group border-r border-chrome/10">
            <img src="https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=800" className="w-full aspect-video object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Before" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center group-hover:bg-black/20 transition-all">
              <span className="micro-label text-white border border-chrome/20 px-6 py-2 bg-black/40 backdrop-blur-sm rounded-none">Phase: Damage</span>
            </div>
          </div>
          <div className="relative overflow-hidden group">
            <img src="https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&q=80&w=800" className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-1000" alt="After" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
              <span className="micro-label text-white bg-primary px-6 py-2 font-black rounded-none">Phase: Restored</span>
            </div>
          </div>
        </div>
        
        <div className="mt-12">
          <button 
            onClick={() => setPage('gallery')}
            className="group flex items-center gap-4 mx-auto"
          >
            <span className="micro-label text-chrome/50 group-hover:text-primary transition-colors">Access Full Dossier</span>
            <div className="w-12 h-[1px] bg-chrome/10 group-hover:bg-primary group-hover:w-20 transition-all"></div>
          </button>
        </div>
      </section>

      {/* Final CTA */}
      <section id="cta" className="py-32 relative overflow-hidden bg-engine border-t border-chrome/10">
        <div className="absolute inset-0 blueprint-grid opacity-20"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-6xl md:text-[140px] font-display mb-12 uppercase tracking-tighter leading-[0.75] text-white">
            WE FIX <br />
            <span className="text-primary italic">STILL.</span>
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <button 
                onClick={() => setPage('contact')}
                className="w-full sm:w-auto bg-primary hover:bg-white text-iron px-12 py-6 font-nav text-3xl uppercase tracking-tighter transition-all rounded-none"
              >
                Request Estimate
              </button>
              <a 
                href="tel:+15551234567"
                className="w-full sm:w-auto border border-chrome/20 hover:border-primary hover:text-primary px-12 py-6 font-nav text-3xl flex items-center justify-center gap-3 transition-all uppercase tracking-tighter text-white rounded-none"
              >
                <PhoneCall className="w-6 h-6" />
                (555) 123-4567
              </a>
          </div>
        </div>
      </section>
    </div>
  );
}
