import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const leadSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().min(7, 'Phone number is required'),
  serviceType: z.string().min(1, 'Please select a service'),
  message: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

export default function LeadForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      serviceType: 'Collision Repair',
    }
  });

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    try {
      await addDoc(collection(db, 'leads'), {
        ...data,
        createdAt: serverTimestamp(),
      });
      setSubmitStatus('success');
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto glass p-6 sm:p-8 rounded-none relative overflow-hidden ring-1 ring-chrome/10">
      <AnimatePresence mode="wait">
        {submitStatus === 'success' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center py-12"
          >
            <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-display font-bold mb-2 text-white">Request Received</h3>
            <p className="text-chrome/60 mb-6 font-nav uppercase tracking-widest text-xs">Our dispatch team will contact you shortly.</p>
            <button
              onClick={() => setSubmitStatus('idle')}
              className="px-6 py-2 bg-primary hover:bg-white text-iron font-nav font-bold rounded-none transition-colors uppercase text-xs tracking-widest"
            >
              Send Another
            </button>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-chrome/50 mb-1 font-nav">Full Name</label>
              <input
                {...register('name')}
                className="w-full bg-iron border border-chrome/10 rounded-none px-4 py-2 focus:outline-none focus:border-primary transition-colors text-sm text-white font-sans"
                placeholder="Required"
              />
              {errors.name && <p className="text-[10px] text-primary mt-1 uppercase font-bold tracking-tighter font-nav">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-chrome/50 mb-1 font-nav">Phone</label>
                <input
                  {...register('phone')}
                  className="w-full bg-iron border border-chrome/10 rounded-none px-4 py-2 focus:outline-none focus:border-primary transition-colors text-sm text-white font-sans"
                  placeholder="(000) 000-0000"
                />
                {errors.phone && <p className="text-[10px] text-primary mt-1 uppercase font-bold tracking-tighter font-nav">{errors.phone.message}</p>}
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-chrome/50 mb-1 font-nav">Email</label>
                <input
                  {...register('email')}
                  className="w-full bg-iron border border-chrome/10 rounded-none px-4 py-2 focus:outline-none focus:border-primary transition-colors text-sm text-white font-sans"
                  placeholder="Optional"
                />
                {errors.email && <p className="text-[10px] text-primary mt-1 uppercase font-bold tracking-tighter font-nav">{errors.email.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-chrome/50 mb-1 font-nav">Service</label>
              <select
                {...register('serviceType')}
                className="w-full bg-iron border border-chrome/10 rounded-none px-4 py-2 focus:outline-none focus:border-primary transition-colors appearance-none text-sm text-white font-sans"
              >
                <option value="Collision Repair">Collision Repair</option>
                <option value="24/7 Towing">24/7 Towing</option>
                <option value="Paint & Body Work">Paint & Body Work</option>
                <option value="Insurance Claim">Insurance Claim</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-chrome/50 mb-1 font-nav">Details</label>
              <textarea
                {...register('message')}
                rows={3}
                className="w-full bg-iron border border-chrome/10 rounded-none px-4 py-2 focus:outline-none focus:border-primary transition-colors resize-none text-sm text-white font-sans"
                placeholder="Brief description..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-white text-iron disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-none font-nav font-bold uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'TRANSMIT DATA'}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
