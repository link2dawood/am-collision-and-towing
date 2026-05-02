import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Loader2, Car } from 'lucide-react';

const quoteSchema = z.object({
  // Customer
  name:               z.string().min(2, 'Name is required'),
  email:              z.string().email('Invalid email address'),
  phone:              z.string().min(7, 'Phone number is required'),
  // Vehicle
  vehicle_year:       z.string().optional(),
  vehicle_make:       z.string().optional(),
  vehicle_model:      z.string().optional(),
  vehicle_color:      z.string().optional(),
  // Job
  service_needed:     z.string().min(1, 'Please select a service'),
  damage_description: z.string().min(10, 'Please describe the damage (min 10 chars)'),
  estimated_budget:   z.string().optional(),
});

type QuoteFormData = z.infer<typeof quoteSchema>;

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 30 }, (_, i) => String(CURRENT_YEAR - i));

const MAKES = [
  'Acura','Audi','BMW','Buick','Cadillac','Chevrolet','Chrysler','Dodge',
  'Ford','GMC','Honda','Hyundai','Infiniti','Jeep','Kia','Lexus','Lincoln',
  'Mazda','Mercedes-Benz','Nissan','Ram','Subaru','Tesla','Toyota','Volkswagen',
  'Volvo','Other',
];

const BUDGETS = ['Under $500','$500–$1,500','$1,500–$3,000','$3,000–$5,000','Over $5,000','Not sure yet'];

export default function QuoteForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuoteFormData>({ resolver: zodResolver(quoteSchema) });

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage(null);

    try {
      const { error } = await supabase.from('quote_requests').insert({
        name:               data.name,
        email:              data.email,
        phone:              data.phone,
        vehicle_year:       data.vehicle_year   || null,
        vehicle_make:       data.vehicle_make   || null,
        vehicle_model:      data.vehicle_model  || null,
        vehicle_color:      data.vehicle_color  || null,
        service_needed:     data.service_needed,
        damage_description: data.damage_description,
        estimated_budget:   data.estimated_budget || null,
        status:             'new',
      });

      if (error) throw error;
      setSubmitStatus('success');
      reset();
    } catch (err: any) {
      console.error('Quote form error:', err);
      setErrorMessage(err.message || 'Failed to submit. Please try again.');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls =
    'w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 placeholder:text-slate-400 text-sm';
  const selectCls = `${inputCls} appearance-none`;
  const errCls = 'text-xs text-primary mt-1.5 font-bold';
  const labelCls = 'block text-sm font-semibold text-slate-700 mb-2';
  const sectionCls = 'border-t border-slate-100 pt-6';

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
            <h3 className="text-2xl font-bold mb-2 text-slate-900">Quote Request Received!</h3>
            <p className="text-slate-600 mb-2 font-medium">We'll review your vehicle details and send you a detailed estimate.</p>
            <p className="text-slate-400 text-sm mb-8">Typical response time: within 2–4 business hours.</p>
            <button
              onClick={() => setSubmitStatus('idle')}
              className="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all"
            >
              Submit Another Quote
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
            {submitStatus === 'error' && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{errorMessage}</p>
              </div>
            )}

            {/* ── Customer Info ───────────────────────── */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Your Information</p>
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Full Name *</label>
                  <input {...register('name')} className={inputCls} placeholder="John Smith" />
                  {errors.name && <p className={errCls}>{errors.name.message}</p>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Phone *</label>
                    <input {...register('phone')} type="tel" className={inputCls} placeholder="(000) 000-0000" />
                    {errors.phone && <p className={errCls}>{errors.phone.message}</p>}
                  </div>
                  <div>
                    <label className={labelCls}>Email *</label>
                    <input {...register('email')} type="email" className={inputCls} placeholder="name@example.com" />
                    {errors.email && <p className={errCls}>{errors.email.message}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Vehicle Info ────────────────────────── */}
            <div className={sectionCls}>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                <Car className="w-4 h-4" /> Vehicle Details
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className={labelCls}>Year</label>
                  <div className="relative">
                    <select {...register('vehicle_year')} className={selectCls}>
                      <option value="">Year</option>
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Make</label>
                  <div className="relative">
                    <select {...register('vehicle_make')} className={selectCls}>
                      <option value="">Make</option>
                      {MAKES.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Model</label>
                  <input {...register('vehicle_model')} className={inputCls} placeholder="Camry, F-150…" />
                </div>
                <div>
                  <label className={labelCls}>Color</label>
                  <input {...register('vehicle_color')} className={inputCls} placeholder="Silver" />
                </div>
              </div>
            </div>

            {/* ── Repair Info ─────────────────────────── */}
            <div className={sectionCls}>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Repair Details</p>
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Service Needed *</label>
                  <div className="relative">
                    <select {...register('service_needed')} className={selectCls}>
                      <option value="">Select a service…</option>
                      <option value="Collision Repair">Collision Repair</option>
                      <option value="Frame Realignment">Frame Realignment</option>
                      <option value="Paint & Body Work">Paint &amp; Body Work</option>
                      <option value="Windshield / Glass">Windshield / Glass</option>
                      <option value="Insurance Claim">Insurance Claim</option>
                      <option value="Full Restoration">Full Restoration</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {errors.service_needed && <p className={errCls}>{errors.service_needed.message}</p>}
                </div>

                <div>
                  <label className={labelCls}>Describe the Damage *</label>
                  <textarea
                    {...register('damage_description')}
                    rows={4}
                    className={`${inputCls} resize-none`}
                    placeholder="e.g. Front bumper cracked, hood dented, passenger door needs repainting…"
                  />
                  {errors.damage_description && <p className={errCls}>{errors.damage_description.message}</p>}
                </div>

                <div>
                  <label className={labelCls}>Estimated Budget</label>
                  <div className="relative">
                    <select {...register('estimated_budget')} className={selectCls}>
                      <option value="">Select a range (optional)</option>
                      {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary-dark text-white disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-xl font-bold uppercase tracking-widest text-sm shadow-xl shadow-primary/25 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              {isSubmitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /><span>Submitting…</span></>
              ) : (
                'Request My Free Quote'
              )}
            </button>
            <p className="text-center text-xs text-slate-400 font-medium">No obligation · Typical response within 2–4 hours</p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
