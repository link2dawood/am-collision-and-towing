import { Phone, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/truck02.jpg" 
          alt="AM Collision and Towing Facility" 
          className="w-full h-full object-cover"
        />
        {/* Dark overlay with navy/charcoal tones for text readability */}
        <div className="absolute inset-0 bg-slate-950/80 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-900/40"></div>
        
        {/* Red accent glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/30 rounded-full mix-blend-screen filter blur-[100px]"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 mt-16 md:mt-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: "easeOut" }}
          className="text-center space-y-8"
        >
          {/* Main Headline */}
          <div className="space-y-6">
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white leading-tight drop-shadow-xl tracking-tight"
            >
              AM Collision & Towing
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto leading-relaxed font-light drop-shadow"
            >
              Trusted Auto Body Repair and Towing with <span className="text-red-500 font-bold drop-shadow-md">40+ Years of Experience</span>
            </motion.p>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-5 justify-center pt-6"
          >
            <a
              href="tel:+16316764440"
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-red-600 text-white font-bold text-lg rounded-xl overflow-hidden transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)]"
            >
               <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
              <Phone size={24} className="animate-pulse" />
              Call Now
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-slate-900/50 hover:bg-slate-800/80 text-white font-bold text-lg rounded-xl border border-slate-500/30 transition-all transform hover:scale-105 active:scale-95 backdrop-blur-md"
            >
              Request Estimate
              <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap justify-center gap-8 pt-12 text-sm md:text-base font-medium text-slate-300"
          >
            <div className="flex items-center gap-3 bg-slate-900/40 px-4 py-2 rounded-full border border-slate-700/50 backdrop-blur-sm">
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse"></div>
              <span>24/7 Emergency Towing</span>
            </div>
            <div className="flex items-center gap-3 bg-slate-900/40 px-4 py-2 rounded-full border border-slate-700/50 backdrop-blur-sm">
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
              <span>Fast Turnaround</span>
            </div>
            <div className="flex items-center gap-3 bg-slate-900/40 px-4 py-2 rounded-full border border-slate-700/50 backdrop-blur-sm">
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
              <span>Insurance Claim Support</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-slate-300 text-xs tracking-widest uppercase font-semibold">Scroll</span>
          <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center backdrop-blur-sm bg-slate-900/20">
            <div className="w-1.5 h-2.5 bg-red-500 rounded-full mt-2"></div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
