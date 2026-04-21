import { motion } from 'motion/react';
import { Award, Shield, Users, Target, History, Trophy } from 'lucide-react';

export default function About() {
  return (
    <div className="pt-24 lg:pt-32 pb-24 relative overflow-hidden bg-iron">
      <div className="absolute inset-0 blueprint-grid opacity-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32 border-b border-chrome/10 pb-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <span className="micro-label text-primary mb-6 block">Legacy Data / 07</span>
            <h1 className="text-6xl sm:text-8xl md:text-[140px] font-display tracking-tighter uppercase mb-12 leading-[0.75] text-white">
              ENGINEERED <br />
              <span className="text-primary italic">INTEGRITY.</span>
            </h1>
            <div className="space-y-8 text-chrome/60 text-lg font-sans font-light leading-relaxed">
              <p>
                Founded on the principles of heavy industrial honesty. AM Collision & Towing was built to restore machinery that other shops deemed beyond recovery.
              </p>
              <p>
                We operate within factory tolerances. Zero deviation. Every weld, every bolt, every micron of paint is calculated for performance.
              </p>
            </div>
          </motion.div>

          <div className="relative">
            <div className="aspect-[4/5] rounded-none overflow-hidden border border-chrome/10 group">
              <img 
                src="https://images.unsplash.com/photo-1530046339160-ce3e545b7a0c?auto=format&fit=crop&q=80&w=1200" 
                alt="Our Facility" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 tech-card bg-primary p-12 text-white transition-all duration-500 hover:rotate-2 shadow-2xl rounded-none">
              <h4 className="text-6xl font-display font-black mb-2 tracking-tighter italic">GOLD CLASS</h4>
              <p className="micro-label text-white/60 font-black">I-CAR Certified Facility</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-chrome/10 mb-32">
          {[
            { title: 'The Standard', desc: 'OEM specifications or nothing. We do not compromise on the blueprint.', icon: <Target className="w-8 h-8" />, num: '01' },
            { title: 'The Grid', desc: 'Locally built, globally trained. We support the infrastructure that drives us.', icon: <Users className="w-8 h-8" />, num: '02' },
            { title: 'The Shield', desc: 'Ironclad lifetime support on all structural alignment and restoration.', icon: <Shield className="w-8 h-8" />, num: '03' },
          ].map((item, i) => (
            <div key={i} className="tech-card h-[380px] flex flex-col justify-end group border-l-0 first:border-l last:border-r border-chrome/10 overflow-hidden">
               <div className="num text-chrome">{item.num}</div>
               <div className="relative z-10 font-sans">
                <div className="w-16 h-16 bg-iron flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-all rounded-none border border-chrome/10">
                  {item.icon}
                </div>
                <h3 className="text-3xl font-display uppercase tracking-tighter text-white group-hover:text-primary transition-colors leading-none">{item.title}</h3>
                <p className="text-chrome/50 text-xs font-sans font-light leading-relaxed mb-8 uppercase tracking-widest">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Core Values */}
        <div id="protocols" className="bg-engine p-12 sm:p-24 border border-chrome/10 relative overflow-hidden">
          <div className="max-w-3xl mx-auto text-center mb-24">
            <span className="micro-label text-primary mb-6 block">System Values / 08</span>
            <h2 className="text-5xl md:text-8xl font-display uppercase mb-4 tracking-tighter leading-none text-white">The Protocols</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
            {[
              { year: 'Zero Tolerance', text: 'Safety is absolute. We never compromise on structural integrity or material quality.' },
              { year: 'Fleet Pulse', text: 'Investing in robotic frame alignment and thermal imaging to repair high-performance aluminum.' },
              { year: 'Output Max', text: 'Every restoration is a return-to-factory event. Excellence is the only metric.' },
              { year: 'Raw Data', text: 'Complete transparency. Direct access to your vehicle diagnostic feed during the repair cycle.' },
            ].map((v, i) => (
              <div key={i} className="flex gap-10 group items-start">
                <div className="shrink-0 w-3 h-3 bg-primary group-hover:scale-150 transition-all mt-2"></div>
                <div>
                  <h4 className="text-3xl font-display font-black mb-4 uppercase text-white tracking-tighter group-hover:text-primary transition-colors leading-none">{v.year}</h4>
                  <p className="text-chrome/60 text-sm font-sans font-light leading-relaxed">{v.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
