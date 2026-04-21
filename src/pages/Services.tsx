import { motion } from 'motion/react';
import { Shield, Hammer, Paintbrush, Activity, ClipboardCheck, Wrench } from 'lucide-react';

export default function Services() {
  const services = [
    {
      title: "Collision Repair",
      desc: "Our primary expertise. We handle everything from minor fender benders to major skeletal repairs using manufacturer-approved methodologies.",
      icon: <Hammer className="w-10 h-10" />,
      features: ["Frame Straightening", "Structural Realignment", "Panel Replacement"]
    },
    {
      title: "Custom Paint Matching",
      desc: "Perfect color matching using computerized mixing systems and premium environmentally friendly coatings for a flawless factory finish.",
      icon: <Paintbrush className="w-10 h-10" />,
      features: ["Precision Color Match", "Full Body Spray", "Detailing & Buffing"]
    },
    {
      title: "Insurance Assistance",
      desc: "We take the headache out of insurance claims. We work directly with all major providers to ensure your vehicle is repaired correctly.",
      icon: <ClipboardCheck className="w-10 h-10" />,
      features: ["Direct Billing", "Claim Filing Support", "Rental Car Coordination"]
    },
    {
      title: "Advanced Diagnostics",
      desc: "Modern cars are computers on wheels. We perform full system scans before and after repairs to ensure every sensor and safety system is functional.",
      icon: <Activity className="w-10 h-10" />,
      features: ["Pre-Repair Scanning", "ADAS Calibration", "Post-Repair Validation"]
    },
    {
      title: "Glass Replacement",
      desc: "Certified windshield and window replacement using high-quality glass and proper sealants to maintain structural cabin integrity.",
      icon: <Shield className="w-10 h-10" />,
      features: ["Windshield Replacement", "Sensor Calibration", "Chip Repair"]
    },
    {
      title: "Mechanical Repair",
      desc: "Associated mechanical damage from accidents, such as suspension work, alignments, and radiator replacements, are all handled in-house.",
      icon: <Wrench className="w-10 h-10" />,
      features: ["4-Wheel Alignment", "Suspension Repair", "Cooling System Service"]
    }
  ];

  return (
    <div className="pt-32 pb-24 relative overflow-hidden bg-iron">
      <div className="absolute inset-0 blueprint-grid opacity-10 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-24 border-b border-chrome/10 pb-10">
          <div className="max-w-3xl">
            <span className="micro-label text-primary mb-4 block">System Capabilities / 04</span>
            <h1 className="text-6xl sm:text-[120px] font-display font-black tracking-tighter uppercase leading-[0.75] text-white">Advanced <br /> Restoration.</h1>
          </div>
          <p className="text-chrome/50 max-w-sm text-xs font-nav uppercase tracking-widest leading-loose text-right">
            Every procedure is executed within certified tolerance levels. Zero compromise on structural integrity.
          </p>
        </div>

        <div id="services-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border border-chrome/10">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="tech-card h-[500px] flex flex-col justify-end group border-l-0 first:border-l last:border-r border-chrome/10 overflow-hidden"
            >
              <div className="num text-chrome">0{i+1}</div>
              <div className="relative z-10 font-sans">
                <div className="text-primary mb-10 transition-transform group-hover:scale-110 duration-500 origin-left">
                  {service.icon}
                </div>
                <h3 className="text-4xl font-display font-black mb-6 uppercase tracking-tighter text-white group-hover:text-primary transition-colors leading-none">{service.title}</h3>
                <p className="text-chrome/70 text-xs font-nav mb-8 max-w-[280px] leading-relaxed uppercase tracking-wide">
                  {service.desc}
                </p>
                <div className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-1 h-1 bg-primary"></div>
                      <span className="micro-label text-chrome group-hover:text-white transition-colors">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
