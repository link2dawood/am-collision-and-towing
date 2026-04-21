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
      <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-20 bg-bone">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 blueprint-grid opacity-30"></div>
          <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-100/50 skew-x-12 translate-x-1/2"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 py-12">
          {/* Left Side: Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-[1px] bg-primary"></span>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Certified Auto Body & Recovery</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold leading-[1.05] tracking-tight mb-8 text-slate-900">
              Professional Collision Repair <br />
              <span className="text-primary text-glow">You Can Trust.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-lg leading-relaxed">
              Serving our community since 2009 with precision automotive restoration and 24/7 emergency roadside assistance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => setPage('contact')}
                className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white px-10 py-4 font-bold rounded-lg transition-all shadow-lg shadow-primary/25"
              >
                Get Free Estimate
              </button>
              <a 
                href="tel:+15551234567"
                className="w-full sm:w-auto border border-slate-200 bg-white hover:border-primary px-10 py-4 font-bold rounded-lg transition-all text-slate-700 flex items-center justify-center gap-2 shadow-sm"
              >
                <PhoneCall className="w-5 h-5 text-primary" />
                (555) 123-4567
              </a>
            </div>

            <div className="mt-12 flex items-center gap-8 border-t border-slate-200 pt-8 grayscale opacity-70">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Facility Rating</span>
                <div className="flex gap-1 text-primary text-sm">★★★★★</div>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Certified By</span>
                <span className="text-sm font-bold text-slate-800">I-CAR GOLD CLASS</span>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Visual Context */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:flex items-center justify-center p-8"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/5 rounded-3xl translate-x-4 translate-y-4 -rotate-3 transition-transform group-hover:rotate-0 group-hover:translate-x-0 group-hover:translate-y-0 duration-500"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-square w-[500px]">
                <img 
                  src="https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&q=80&w=1000" 
                  alt="Modern Auto Shop" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 shadow-xl rounded-2xl border border-slate-100 max-w-[200px]">
                <div className="flex items-center gap-3 mb-2">
                   <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Truck className="w-5 h-5" />
                   </div>
                   <span className="text-xs font-bold text-slate-900">24/7 Dispatch</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal font-medium italic">"Average response time is under 30 minutes in our service area."</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Services Preview */}
      <section id="services-preview" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 max-w-2xl mx-auto">
            <span className="text-primary font-bold uppercase tracking-widest text-xs mb-4 block">Our Expertise</span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Complete Auto Care Solutions</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              From minor dents to major structural repairs, we provide certified services with a focus on safety and factory-grade quality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "Collision Repair", 
                desc: "Certified structural restoration and frame realignment to original factory blueprint specifications.", 
                icon: <Car className="w-8 h-8" />, 
                link: 'services' 
              },
              { 
                title: "24/7 Roadside Assistance", 
                desc: "Rapid deployment emergency recovery fleet. Secure transport for all vehicle types and sizes.", 
                icon: <Truck className="w-8 h-8" />, 
                link: 'towing' 
              },
              { 
                title: "Premium Refinishing", 
                desc: "Digital color matching and climate-controlled finishing for a seamless, factory-perfect restoration.", 
                icon: <Droplets className="w-8 h-8" />, 
                link: 'services' 
              }
            ].map((service, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                onClick={() => setPage(service.link as Page)}
                className="bg-slate-50 p-10 rounded-2xl border border-slate-100 hover:border-primary/20 transition-all cursor-pointer group shadow-sm"
              >
                <div className="w-16 h-16 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  {service.desc}
                </p>
                <div className="flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300">
                  <span className="text-sm font-bold text-primary group-hover:text-slate-900 transition-colors">Learn More</span>
                  <ArrowRight className="w-4 h-4 text-primary group-hover:text-slate-900" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators / Why Choose Us */}
      <section id="authority" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl border-8 border-white aspect-square">
              <img 
                src="https://images.unsplash.com/photo-1590400541360-3af4b0ef06b0?auto=format&fit=crop&q=80&w=1200" 
                alt="Expert Mechanic" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 bg-white p-8 shadow-2xl rounded-2xl border border-slate-100 hidden md:block">
               <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">4.9/5</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Customer Satisfaction</div>
                  </div>
               </div>
               <div className="text-xs font-medium text-slate-600 uppercase tracking-wide">Based on 800+ Verified Reviews</div>
            </div>
          </div>

          <div className="space-y-12">
            <div>
              <span className="text-primary font-bold uppercase tracking-widest text-xs mb-4 block">The Gold Standard</span>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight">
                Built on Quality, <br />
                Defined by Integrity.
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
                We understand that your vehicle is a significant investment. Our factory-certified technicians use state-of-the-art equipment to ensure every repair meets or exceeds safety standards.
              </p>
            </div>
            
            <div className="space-y-8">
              {[
                { title: 'I-CAR Gold Class Certified', desc: 'The collision industry’s highest standard for training and equipment.', icon: <Award className="w-6 h-6" /> },
                { title: 'Lifetime Structural Warranty', desc: 'We stand behind the integrity of our repairs for as long as you own your car.', icon: <Hammer className="w-6 h-6" /> },
                { title: 'Streamlined Insurance Claims', desc: 'Direct coordination with all major insurance providers for a stress-free process.', icon: <Clock className="w-6 h-6" /> },
              ].map((item, i) => (
                <div key={i} className="flex gap-6 items-start group">
                  <div className="shrink-0 w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-1">{item.title}</h4>
                    <p className="text-slate-600 leading-relaxed text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Visual Evidence / Gallery Promo */}
      <section id="evidence" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center mb-16 text-center">
            <span className="text-primary font-bold uppercase tracking-widest text-xs mb-4 block">Our Work</span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Restoration Excellence</h2>
            <p className="text-lg text-slate-600 max-w-2xl">See the precision results of our certified restoration process across a wide range of vehicle types.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative group overflow-hidden rounded-2xl shadow-lg aspect-video">
              <img src="https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" alt="Collision damage" referrerPolicy="no-referrer" />
              <div className="absolute top-6 left-6">
                <span className="bg-slate-900/80 backdrop-blur-md text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Repair Stage: Arrival</span>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-2xl shadow-lg aspect-video">
              <img src="https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" alt="Restored vehicle" referrerPolicy="no-referrer" />
              <div className="absolute top-6 left-6">
                <span className="bg-primary text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest leading-none">Repair Stage: Restored</span>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <button 
              onClick={() => setPage('gallery')}
              className="inline-flex items-center gap-3 text-slate-900 font-bold hover:text-primary transition-colors group"
            >
              <span>View Full Restoration Gallery</span>
              <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-primary transition-colors">
                <ArrowRight className="w-5 h-5" />
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section id="cta" className="py-32 relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 blueprint-grid opacity-10"></div>
          <div className="absolute top-0 right-0 w-1/4 h-full bg-primary/10 rounded-full blur-[100px] translate-x-1/2"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
            Ready to get your vehicle <br />
            <span className="text-primary italic">Back on the Road?</span>
          </h2>
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Contact our expert estimators for a free, no-obligation assessment or call our 24/7 dispatch for emergency roadside assistance.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
             <button 
                onClick={() => setPage('contact')}
                className="bg-primary hover:bg-primary-dark text-white px-12 py-5 font-bold text-lg rounded-xl transition-all shadow-xl shadow-primary/30"
              >
                Request Free Estimate
              </button>
              <a 
                href="tel:+15551234567"
                className="bg-white hover:bg-slate-100 text-slate-900 px-12 py-5 font-bold text-lg rounded-xl flex items-center justify-center gap-3 transition-all transition-shadow shadow-lg hover:shadow-xl"
              >
                <PhoneCall className="w-6 h-6 text-primary" />
                (555) 123-4567
              </a>
          </div>
          <div className="mt-12 text-slate-400 text-sm font-medium flex items-center justify-center gap-4">
             <span className="flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
               Emergency Recovery Live
             </span>
             <span className="w-1 h-1 rounded-full bg-slate-700"></span>
             <span>I-CAR Gold Class Certified</span>
          </div>
        </div>
      </section>
    </div>
  );
}
