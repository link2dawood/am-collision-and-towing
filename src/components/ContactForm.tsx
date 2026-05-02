import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

// Schema for contact_submissions table
const contactSchema = z.object({
  name:    z.string().min(2, 'Name is required'),
  email:   z.string().email('Invalid email address'),
  phone:   z.string().optional(),
  subject: z.string().min(1, 'Please select a subject'),
  message: z.string().min(10, 'Please tell us a little more (min 10 characters)'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage(null);

    try {
      const { error } = await supabase.from('contact_submissions').insert({
        name:    data.name,
        email:   data.email,
        phone:   data.phone || null,
        subject: data.subject,      // service type / topic → stored as subject
        message: data.message,
        status:  'new',
      });

      if (error) throw error;

      setSubmitStatus('success');
      reset();
    } catch (err: any) {
      console.error('Contact form error:', err);
      setErrorMessage(err.message || 'Failed to send message. Please try again.');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls =
    'w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 placeholder:text-slate-400';
  const errCls = 'text-xs text-primary mt-1.5 font-bold';

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {submitStatus === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center py-12"
          >
            <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2 text-slate-900">Message Sent!</h3>
            <p className="text-slate-600 mb-6 font-medium">
              Our team will get back to you within 24 hours.
            </p>
            <button
              onClick={() => setSubmitStatus('idle')}
              className="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all"
            >
              Send Another Message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Error banner */}
            {submitStatus === 'error' && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{errorMessage}</p>
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name *</label>
              <input
                {...register('name')}
                className={inputCls}
                placeholder="Enter your full name"
              />
              {errors.name && <p className={errCls}>{errors.name.message}</p>}
            </div>

            {/* Phone + Email row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                <input
                  {...register('phone')}
                  type="tel"
                  className={inputCls}
                  placeholder="(000) 000-0000"
                />
                {errors.phone && <p className={errCls}>{errors.phone.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address *</label>
                <input
                  {...register('email')}
                  type="email"
                  className={inputCls}
                  placeholder="name@example.com"
                />
                {errors.email && <p className={errCls}>{errors.email.message}</p>}
              </div>
            </div>

            {/* Subject / Service */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Subject *</label>
              <div className="relative">
                <select
                  {...register('subject')}
                  className={`${inputCls} appearance-none`}
                >
                  <option value="">Select a subject…</option>
                  <option value="Collision Repair">Collision Repair</option>
                  <option value="24/7 Towing">24/7 Towing</option>
                  <option value="Paint & Body Work">Paint &amp; Body Work</option>
                  <option value="Insurance Claim">Insurance Claim</option>
                  <option value="Get a Quote">Get a Quote</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Other">Other</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {errors.subject && <p className={errCls}>{errors.subject.message}</p>}
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Message *</label>
              <textarea
                {...register('message')}
                rows={5}
                className={`${inputCls} resize-none`}
                placeholder="How can we help you today?"
              />
              {errors.message && <p className={errCls}>{errors.message.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary-dark text-white disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-xl font-bold uppercase tracking-widest text-sm shadow-xl shadow-primary/25 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Sending…</span>
                </>
              ) : (
                'Send Message'
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
