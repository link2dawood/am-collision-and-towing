import { Instagram, Facebook, Phone, MapPin, Clock, Mail, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { Page } from '../types';

interface FooterProps {
  setPage: (page: Page) => void;
}

export default function Footer({ setPage }: FooterProps) {
  return (
    <footer className="bg-slate-900 pt-24 pb-12 relative z-10 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setPage('home')}>
              <div className="bg-primary p-2 rounded-lg">
                <div className="w-5 h-5 flex items-center justify-center font-bold text-white text-[10px]">AM</div>
              </div>
              <span className="text-xl font-bold tracking-tight text-white uppercase">AM Collision</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 font-medium">
              Professional auto body restoration and emergency recovery experts. Serving our community with integrity since 2009.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-8">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest">Our Services</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><button onClick={() => setPage('services')} className="hover:text-primary transition-colors text-left">Collision Repair</button></li>
              <li><button onClick={() => setPage('services')} className="hover:text-primary transition-colors text-left">Frame Realignment</button></li>
              <li><button onClick={() => setPage('services')} className="hover:text-primary transition-colors text-left">Digital Paint Matching</button></li>
              <li><button onClick={() => setPage('towing')} className="hover:text-primary transition-colors text-left">24/7 Towing & Recovery</button></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-8">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><button onClick={() => setPage('about')} className="hover:text-primary transition-colors text-left">About Us</button></li>
              <li><button onClick={() => setPage('gallery')} className="hover:text-primary transition-colors text-left">Restoration Gallery</button></li>
              <li><button onClick={() => setPage('contact')} className="hover:text-primary transition-colors text-left">Request an Estimate</button></li>
              <li><button onClick={() => setPage('home')} className="hover:text-primary transition-colors text-left">Privacy Policy</button></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-8">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest">Contact Dispatch</h4>
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm font-medium">500 Johnson Ave, Bohemia,<br />New York 11716</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <a href="tel:+16316764440" className="text-xl font-bold text-white hover:text-primary transition-colors">+1 631-676-4440</a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-8 text-xs font-bold text-slate-500 uppercase tracking-widest">
            <span>
              <button onClick={() => setPage('login')} className="cursor-default hover:text-primary transition-colors">©</button> {new Date().getFullYear()} AM Collision & Towing
            </span>
            <span className="hidden md:block w-1 h-1 bg-slate-700 rounded-full"></span>
            <span>I-CAR Gold Class Certified</span>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-slate-500 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
          >
            Return to Top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
