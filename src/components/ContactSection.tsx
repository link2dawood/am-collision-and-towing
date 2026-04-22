import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { motion } from 'motion/react';
export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({
      name: '',
      phone: '',
      email: '',
      service: '',
      message: ''
    });
  };

  return (
    <section id="contact" className="py-20 bg-linear-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Get In Touch
          </h2>
          <div className="w-16 h-1 bg-red-600 mx-auto"></div>
          <p className="text-slate-600 text-lg mt-6 max-w-2xl mx-auto">
            Contact us today for emergency towing, repair quotes, or any questions
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Contact Information</h3>

            {/* Phone */}
            <motion.a
              href="tel:+16316764440"
              whileHover={{ x: 10 }}
              className="flex gap-4 items-start group cursor-pointer"
            >
              <div className="p-3 rounded-lg bg-red-100 group-hover:bg-red-600 transition-colors shrink-0">
                <Phone className="w-6 h-6 text-red-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-lg">Phone</h4>
                <p className="text-slate-600"> +1 631-676-4440</p>
                <p className="text-sm text-slate-500">24/7 Emergency Towing Available</p>
              </div>
            </motion.a>

            {/* Email */}
            <motion.a
              href="mailto:info@amcollisiontowing.com"
              whileHover={{ x: 10 }}
              className="flex gap-4 items-start group cursor-pointer"
            >
              <div className="p-3 rounded-lg bg-red-100 group-hover:bg-red-600 transition-colors shrink-0">
                <Mail className="w-6 h-6 text-red-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-lg">Email</h4>
                <p className="text-slate-600">info@amcollisiontowing.com</p>
                <p className="text-sm text-slate-500">We'll respond within 24 hours</p>
              </div>
            </motion.a>

            {/* Address */}
            <motion.div
              whileHover={{ x: 10 }}
              className="flex gap-4 items-start group"
            >
              <div className="p-3 rounded-lg bg-red-100 group-hover:bg-red-600 transition-colors shrink-0">
                <MapPin className="w-6 h-6 text-red-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-lg">Location</h4>
                <p className="text-slate-600">830 S 1, Ronkonkoma,</p>
                <p className="text-slate-600">NY 11779, United States</p>
                <p className="text-sm text-slate-500">Easily visible from main roads</p>
              </div>
            </motion.div>

            {/* Hours */}
            <motion.div
              whileHover={{ x: 10 }}
              className="flex gap-4 items-start group"
            >
              <div className="p-3 rounded-lg bg-red-100 group-hover:bg-red-600 transition-colors shrink-0">
                <Clock className="w-6 h-6 text-red-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-lg">Hours</h4>
                <p className="text-slate-600">Mon - Fri: 8:00 AM - 6:00 PM</p>
                <p className="text-slate-600">Sat: 9:00 AM - 4:00 PM</p>
                <p className="text-slate-600">Sun: Closed (Emergency Towing Available)</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            onSubmit={handleSubmit}
            className="space-y-4 bg-white p-8 rounded-lg shadow-lg"
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Send us a Message</h3>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-900 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-red-600 focus:outline-none transition-colors"
                placeholder="Your name"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-slate-900 mb-2">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-red-600 focus:outline-none transition-colors"
                placeholder="+1 631-676-4440"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-900 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-red-600 focus:outline-none transition-colors"
                placeholder="your@email.com"
              />
            </div>

            {/* Service */}
            <div>
              <label htmlFor="service" className="block text-sm font-semibold text-slate-900 mb-2">
                Service Needed
              </label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-red-600 focus:outline-none transition-colors"
              >
                <option value="">Select a service</option>
                <option value="collision">Collision Repair</option>
                <option value="body">Auto Body Repair</option>
                <option value="towing">Towing Service</option>
                <option value="insurance">Insurance Support</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-slate-900 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-red-600 focus:outline-none transition-colors resize-none"
                placeholder="Tell us about your vehicle..."
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all"
            >
              Send Message
            </motion.button>

            <p className="text-sm text-slate-500 text-center">
              We'll get back to you within 24 hours
            </p>
          </motion.form>
        </div>

        {/* Map Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 rounded-lg overflow-hidden h-96 bg-slate-300"
        >
          <iframe
            title="AM Collision & Towing Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.1234567890!2d-74.0!3d40.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQyJzAxLjUiTiA3NMOkMDAnNTkuNyJX!5e0!3m2!1sen!2sus!4v1234567890"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>
      </div>
    </section>
  );
}
