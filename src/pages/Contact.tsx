import { motion } from 'motion/react';
import { Phone, MapPin, Mail, Clock, MessageSquare, Car, Share2 } from 'lucide-react';
import LeadForm from '../components/LeadForm';

export default function Contact() {
  return (
    <div className="pt-24 lg:pt-32 pb-24 relative overflow-hidden bg-iron">
      <div className="absolute inset-0 blueprint-grid opacity-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="micro-label text-primary mb-6 block">Communication Hub / 09</span>
            <h1 className="text-6xl sm:text-8xl md:text-[140px] font-display font-black tracking-tighter uppercase mb-12 leading-[0.75] text-white">
              DIRECT <br />
              <span className="text-primary italic">COMMAND.</span>
            </h1>
            <p className="text-lg text-chrome/50 mb-16 max-w-xl font-nav uppercase tracking-widest leading-loose">
              Initiate contact for emergency recovery, technical estimates, or operational status updates. Our dispatch is live.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border border-chrome/10 mb-16">
              <div className="tech-card space-y-6 border-r border-chrome/10 p-12 hover:bg-white/5 transition-colors group">
                <div className="text-primary group-hover:scale-110 transition-transform">
                  <Phone className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <p className="text-white font-display text-4xl tracking-tighter leading-none">(555) 123-4567</p>
                  <span className="micro-label text-chrome/50">Dispatch / 24.7</span>
                </div>
              </div>

              <div className="tech-card space-y-6 p-12 hover:bg-white/5 transition-colors group">
                <div className="text-primary group-hover:scale-110 transition-transform">
                  <Mail className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <p className="text-white font-display text-4xl tracking-tighter leading-none whitespace-nowrap">HQ@AMSYSTEM.COM</p>
                  <span className="micro-label text-chrome/50">Data Transmission</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
              <div className="flex gap-8 group">
                <div className="shrink-0 w-16 h-16 bg-engine flex items-center justify-center text-primary border border-chrome/10 group-hover:border-primary transition-all rounded-none">
                  <MapPin className="w-8 h-8" />
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="text-2xl font-display font-black uppercase tracking-tight text-white group-hover:text-primary transition-colors">Tactical Base</h4>
                  <p className="micro-label text-chrome/50 leading-relaxed uppercase">123 Auto Row, Cityville, ST 12345</p>
                  <a href="#" className="micro-label text-primary mt-2 block hover:text-white transition-colors">Launch Navigator →</a>
                </div>
              </div>

              <div className="flex gap-8 group">
                <div className="shrink-0 w-16 h-16 bg-engine flex items-center justify-center text-primary border border-chrome/10 group-hover:border-primary transition-all rounded-none">
                  <Clock className="w-8 h-8" />
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="text-2xl font-display font-black uppercase tracking-tight text-white group-hover:text-primary transition-colors">Operational Phase</h4>
                  <p className="micro-label text-chrome/50 leading-relaxed uppercase">M-F: 0800 - 1800 | SAT: 0900 - 1300</p>
                  <p className="micro-label text-primary mt-2">Emergency Recovery: Continuous</p>
                </div>
              </div>
            </div>

            {/* Google Map Mockup */}
            <div className="relative h-[300px] border border-chrome/10 grayscale contrast-125 opacity-30 group overflow-hidden rounded-none">
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200" 
                alt="Map Area" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-primary/5 flex items-center justify-center">
                <div className="bg-primary p-6 shadow-[0_0_50px_rgba(232,48,10,0.5)] rounded-none">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:sticky lg:top-32"
          >
            <div className="bg-engine p-10 sm:p-16 border-t-4 border-primary rounded-none">
              <div className="mb-12">
                 <span className="micro-label text-primary mb-4 block">Form-X / Assessment</span>
                 <h3 className="text-5xl font-display font-black mb-4 uppercase tracking-tighter text-white">Secure Intake</h3>
                 <p className="text-chrome/50 text-xs font-nav uppercase tracking-widest leading-loose">Transmit your vehicle data for immediate technical assessment by our estimators.</p>
              </div>
              <LeadForm />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
