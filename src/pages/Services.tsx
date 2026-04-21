import { motion } from 'motion/react';
import { Shield, Hammer, Paintbrush, Activity, ClipboardCheck, Wrench } from 'lucide-react';

export default function Services() {
  const services = [
    {
      title: "Collision & Structural Repair",
      desc: "Our core expertise. We restore your vehicle to exact factory specifications using computerized 3D measuring and structural alignment technology.",
      icon: <Hammer className="w-8 h-8" />,
      features: ["3D Frame Realignment", "Subframe Repair", "Major Structural Restoration"]
    },
    {
      title: "Precision Painting",
      desc: "Perfect color matching using advanced computerized systems and premium, eco-friendly coatings for a factory-perfect, mirror finish.",
      icon: <Paintbrush className="w-8 h-8" />,
      features: ["Computerized Color Matching", "Dust-Free Climate Controls", "Multi-Stage Finishing"]
    },
    {
      title: "Direct Insurance Claims",
      desc: "We manage the entire claim process for you. Our direct relationships with major providers ensure seamless communication and rapid approvals.",
      icon: <ClipboardCheck className="w-8 h-8" />,
      features: ["Direct Provider Billing", "Comprehensive Documentation", "Rental Coordination"]
    },
    {
      title: "Electronic Diagnostics",
      desc: "Detailed system scanning and ADAS calibration to ensure all safety sensors and automotive computers are fully functional after a repair.",
      icon: <Activity className="w-8 h-8" />,
      features: ["Pre-Repair System Scans", "ADAS Sensor Calibration", "Post-Repair Verification"]
    },
    {
      title: "Certified Glass Services",
      desc: "High-quality glass replacement and calibration for all vehicle types, ensuring optical clarity and structural cabin integrity.",
      icon: <Shield className="w-8 h-8" />,
      features: ["Windshield Replacement", "Rain Sensor Calibration", "Chip & Crack Repair"]
    },
    {
      title: "Internal Systems Repair",
      desc: "Mechanical restoration related to accident damage, including suspension tuning, alignment, and cooling system certification.",
      icon: <Wrench className="w-8 h-8" />,
      features: ["Precision Wheel Alignment", "Suspension Component Repair", "Cooling System Service"]
    }
  ];

  return (
    <div className="pt-24 lg:pt-32 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-20">
          <div className="max-w-3xl">
            <span className="text-primary font-bold uppercase tracking-widest text-xs mb-4 block">Our Services</span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]">
              Restored to <br />
              <span className="text-primary">Perfection.</span>
            </h1>
          </div>
          <p className="text-slate-600 max-w-sm text-lg leading-relaxed font-medium">
            Every procedure is executed within certified manufacturer tolerances. We provide zero-compromise structural safety.
          </p>
        </div>

        <div id="services-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-50 p-10 rounded-2xl border border-slate-100 hover:border-primary/20 hover:bg-white hover:shadow-xl transition-all group flex flex-col h-full"
            >
              <div className="w-16 h-16 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform duration-500">
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 leading-tight group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-slate-600 mb-8 leading-relaxed font-medium">
                {service.desc}
              </p>
              <div className="space-y-4 mt-auto">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                       <ClipboardCheck className="w-3 h-3" />
                    </div>
                    <span className="text-sm font-bold text-slate-600">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
