import { motion } from 'motion/react';
import { Phone, Menu, X, Car } from 'lucide-react';
import { useState } from 'react';
import { Page } from '../types';

interface NavbarProps {
  currentPage: Page;
  setPage: (page: Page) => void;
}

export default function Navbar({ currentPage, setPage }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems: { label: string; value: Page }[] = [
    { label: 'Home', value: 'home' },
    { label: 'Services', value: 'services' },
    { label: 'Towing', value: 'towing' },
    { label: 'Gallery', value: 'gallery' },
    { label: 'About', value: 'about' },
    { label: 'Contact', value: 'contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-chrome/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setPage('home')}
          >
            <div className="bg-primary p-2 rounded-lg group-hover:scale-105 transition-transform">
              <div className="w-6 h-6 flex items-center justify-center font-bold text-white text-xs">AM</div>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight block leading-tight text-slate-900 group-hover:text-primary transition-colors">AM Collision</span>
              <span className="text-[10px] font-bold text-primary block tracking-widest uppercase">& Towing</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => setPage(item.value)}
                className={`text-sm font-semibold transition-all hover:text-primary ${
                  currentPage === item.value ? 'text-primary' : 'text-slate-600'
                }`}
              >
                {item.label}
              </button>
            ))}
            <a 
              href="tel:+16316764440"
              className="flex items-center gap-2 bg-primary hover:bg-primary-dark px-5 py-2.5 rounded-lg font-bold text-sm text-white transition-all shadow-md shadow-primary/20"
            >
              +1 631-676-4440
            </a>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 focus:outline-none">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        className="md:hidden overflow-hidden bg-iron border-b border-chrome/10"
      >
        <div className="px-4 pt-2 pb-6 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.value}
              onClick={() => {
                setPage(item.value);
                setIsOpen(false);
              }}
              className={`block w-full text-left px-3 py-4 micro-label border-l-2 transition-all ${
                currentPage === item.value 
                  ? 'border-primary bg-primary/5 text-primary' 
                  : 'border-transparent text-chrome/40'
              }`}
            >
              {item.label}
            </button>
          ))}
          <a 
            href="tel:+16316764440"
            className="flex items-center justify-center gap-3 w-full bg-primary px-4 py-4 rounded-none font-nav font-bold text-iron text-xs uppercase tracking-[0.2em] mt-4 shadow-lg shadow-primary/20"
          >
            <Phone className="w-4 h-4" />
            24/7 EMERGENCY DISPATCH
          </a>
        </div>
      </motion.div>
    </nav>
  );
}
