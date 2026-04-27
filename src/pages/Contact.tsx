import { motion } from 'motion/react';
import { Phone, MapPin, Mail, Clock, ShieldCheck, ArrowRight, CheckCircle2, Award, Truck, Heart } from 'lucide-react';
import LeadForm from '../components/LeadForm';

export default function Contact() {
  return (
    <div className="pt-24 lg:pt-32 pb-24 bg-white">
      {/* Header Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 px-4">
        <span className="text-primary font-bold uppercase tracking-widest text-xs mb-3 block">Get In Touch</span>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-slate-900 leading-[1.1]">
          Professional Support, <br />
          <span className="text-primary italic">Direct Response.</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl font-medium leading-relaxed">
          Contact us for expert collision estimates, service inquiries, or 24/7 emergency recovery. 
          We are here to help you get back on the road safely.
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Side: Form Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100"
          >
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Send Us a Message</h3>
              <div className="h-1.5 w-16 bg-primary rounded-full mb-6"></div>
              <p className="text-slate-500 font-medium">Have a question or need an estimate? Fill out the form below and our team will get back to you immediately.</p>
            </div>
            
            <LeadForm />
            
            <div className="mt-8 flex items-center justify-center gap-4 text-slate-400 text-[11px] font-bold uppercase tracking-widest border-t border-slate-50 pt-8">
               <div className="flex items-center gap-2">
                 <ShieldCheck className="w-4 h-4 text-green-500" />
                 Your information is secure and will never be shared.
               </div>
            </div>
          </motion.div>

          {/* Right Side: Contact Info Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-5 space-y-8"
          >
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 space-y-8">
              {/* Phone */}
              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Call Us Anytime</h4>
                  <p className="text-2xl font-bold text-primary tracking-tight leading-none mb-2">+1 631-676-4440</p>
                  <p className="text-slate-500 text-sm font-medium">24/7 Emergency Response</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Email Us</h4>
                  <p className="text-lg font-bold text-slate-900 leading-none mb-1">amcollisionandtowing@gmail.com</p>
                  <p className="text-slate-500 text-sm font-medium">We reply as soon as possible</p>
                </div>
              </div>

              {/* Fax */}
              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Fax</h4>
                  <p className="text-2xl font-bold text-primary tracking-tight leading-none mb-2">+1 631-676-4443</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-6 group border-t border-slate-200 pt-8">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Our Location</h4>
<<<<<<< HEAD
                  <p className="text-lg font-bold text-slate-900 leading-none mb-1">830 S 1, Ronkonkoma,</p>
                  <p className="text-slate-500 text-sm font-medium">NY 11779, United States</p>
=======
                  <p className="text-lg font-bold text-slate-900 leading-none mb-1">500 Johnson Ave, Bohemia,</p>
                  <p className="text-slate-500 text-sm font-medium">New York 11716</p>
>>>>>>> c2d716bbeae20dd71e931afb93dbb4a324c1595f
                  <p className="text-slate-400 text-xs font-medium mt-1 uppercase">Conveniently located for you</p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-6 group border-t border-slate-200 pt-8">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Business Hours</h4>
                  <div className="space-y-1 mt-1">
                    <p className="text-slate-700 text-sm font-bold">Mon – Fri: 8:00 AM – 6:00 PM</p>
                    <p className="text-slate-700 text-sm font-bold">Sat: 9:00 AM – 2:00 PM</p>
                    <p className="text-primary text-sm font-bold italic">Sun: 24/7 Emergency</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mini Map */}
            <div className="relative h-[250px] bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 group shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200" 
                alt="Workshop map location" 
                className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping scale-150"></div>
                  <div className="bg-primary p-4 shadow-2xl rounded-2xl relative z-10">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white shadow-sm">
<<<<<<< HEAD
                 <p className="text-[9px] font-bold text-slate-900 uppercase tracking-wider">830 S 1, Ronkonkoma, NY 11779</p>
=======
                 <p className="text-[9px] font-bold text-slate-900 uppercase tracking-wider">500 Johnson Ave, Bohemia, NY 11716</p>
>>>>>>> c2d716bbeae20dd71e931afb93dbb4a324c1595f
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feature/Trust Bar at the bottom */}
        <section className="mt-24 pt-16 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">40+ Years</p>
              <p className="text-xs text-slate-500 font-medium">Experience</p>
            </div>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Fast</p>
              <p className="text-xs text-slate-500 font-medium">Response</p>
            </div>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">24/7 Towing</p>
              <p className="text-xs text-slate-500 font-medium">Service</p>
            </div>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Satisfaction</p>
              <p className="text-xs text-slate-500 font-medium">Guaranteed</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
