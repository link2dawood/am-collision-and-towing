import { Instagram, Facebook, Phone, MapPin, Clock, Mail, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { Page } from '../types';

interface FooterProps {
  setPage: (page: Page) => void;
}

export default function Footer({ setPage }: FooterProps) {
  return (
    <footer className="bg-iron border-t border-chrome/10 pt-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="bg-primary p-1 rounded-none">
                <div className="w-5 h-5 flex items-center justify-center font-black text-iron italic text-[10px]">AM</div>
              </div>
              <span className="text-2xl font-display tracking-tighter uppercase whitespace-nowrap text-white">AM COLLISION</span>
            </div>
            <p className="micro-label leading-relaxed text-chrome/60">
              TECHNICAL RESTORATION & EMERGENCY RECOVERY SYSTEMS.<br />ESTABLISHED 2009.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 rounded-none border border-chrome/10 flex items-center justify-center hover:bg-primary hover:text-iron transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-none border border-chrome/10 flex items-center justify-center hover:bg-primary hover:text-iron transition-all">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-8">
            <h4 className="micro-label text-primary">Capabilities</h4>
            <ul className="space-y-4 micro-label text-chrome/60 tracking-[0.2em]">
              <li><button onClick={() => setPage('services')} className="hover:text-primary transition-colors text-left uppercase">Collision Repair</button></li>
              <li><button onClick={() => setPage('services')} className="hover:text-primary transition-colors text-left uppercase">Structural Alignment</button></li>
              <li><button onClick={() => setPage('services')} className="hover:text-primary transition-colors text-left uppercase">Digital Paint Match</button></li>
              <li><button onClick={() => setPage('towing')} className="hover:text-primary transition-colors text-left uppercase">24/7 Recovery</button></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <h4 className="micro-label text-primary">Network Hub</h4>
            <div className="space-y-6 micro-label text-chrome/60">
              <div className="flex items-start gap-3 leading-relaxed">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>123 Auto Row,<br />Cityville, ST 12345</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <a href="tel:+15551234567" className="hover:text-primary text-sm font-bold text-white tracking-normal font-sans leading-none">(555) 123-4567</a>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-8">
            <h4 className="micro-label text-primary">Fleet Status</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-primary bg-primary/5 p-4 border border-primary/20 rounded-none">
                <Activity className="w-4 h-4" />
                <span className="micro-label text-primary">System Online 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Solid Red Trust Bar */}
      <div className="bg-primary py-4 overflow-hidden relative border-y border-black/10">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
          className="flex whitespace-nowrap gap-12"
        >
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 text-white font-display text-4xl font-black uppercase italic tracking-tighter">
              <span>I-CAR Gold Class Certified</span>
              <span>•</span>
              <span>24/7 Rapid Towing</span>
              <span>•</span>
              <span>Lifetime Repair Guarantee</span>
              <span>•</span>
              <span>Family Owned & Operated</span>
              <span>•</span>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="bg-iron py-8 border-t border-chrome/10 relative">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="micro-label opacity-30">
            © {new Date().getFullYear()} AM COLLISION & TOWING. BUILT FOR SPEED AND PRECISION.
          </p>
        </div>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="absolute right-8 top-1/2 -translate-y-1/2 micro-label text-primary hover:text-white transition-colors cursor-pointer"
        >
          Return to Top ↑
        </button>
      </div>
    </footer>
  );
}
