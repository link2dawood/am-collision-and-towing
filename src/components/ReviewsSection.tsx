import { Star } from 'lucide-react';
import { motion } from 'motion/react';

const reviews = [
  {
    name: 'John Mitchell',
    rating: 5,
    text: 'Excellent service! The team was professional and efficient. My car looks brand new. Highly recommend!',
    service: 'Collision Repair'
  },
  {
    name: 'Sarah Johnson',
    rating: 5,
    text: 'Called for emergency towing at 2 AM and they arrived within 30 minutes. Amazing service and fair pricing.',
    service: 'Towing Service'
  },
  {
    name: 'Michael Chen',
    rating: 5,
    text: 'Been with AM Collision for years. Always quality work, reliable, and honest. They treat you like family.',
    service: 'Auto Body Repair'
  },
  {
    name: 'Emily Rodriguez',
    rating: 5,
    text: 'Insurance claim was handled perfectly. They communicated every step of the way. Very impressed!',
    service: 'Insurance Support'
  },
];

export default function ReviewsSection() {
  return (
    <section className="py-20 bg-white">
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
            Customer Reviews
          </h2>
          <div className="w-16 h-1 bg-red-600 mx-auto"></div>
          <p className="text-slate-600 text-lg mt-6 max-w-2xl mx-auto">
            See what our satisfied customers have to say about our service
          </p>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="p-8 rounded-lg border border-slate-200 hover:border-red-600 hover:shadow-lg transition-all bg-slate-50"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-red-600 text-red-600" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-slate-700 mb-6 leading-relaxed italic">
                "{review.text}"
              </p>

              {/* Author Info */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div>
                  <h4 className="font-semibold text-slate-900">
                    {review.name}
                  </h4>
                  <p className="text-sm text-slate-600">
                    {review.service}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-lg font-bold text-red-600">
                    {review.name.charAt(0)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA to Google Reviews */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <p className="text-slate-600 mb-4">
            Join hundreds of satisfied customers
          </p>
          <a
            href="https://www.google.com/search?q=AM+Collision+Towing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold rounded-lg transition-all"
          >
            View on Google
          </a>
        </motion.div>
      </div>
    </section>
  );
}
