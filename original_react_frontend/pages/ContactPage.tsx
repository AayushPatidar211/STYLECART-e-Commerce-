import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-in fade-in">
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs uppercase font-mono tracking-widest text-neutral-500 font-semibold">
          Customer Relations
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900">
          Get in Touch
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600">
          Have an inquiry regarding garment sizing, custom corporate orders, or order fulfillment? Our client advisory team responds within 24 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Contact Info */}
        <div className="md:col-span-5 bg-neutral-900 text-white rounded-xl p-8 space-y-8 flex flex-col justify-between">
          <div className="space-y-6">
            <h2 className="font-serif text-xl font-bold">Client Care Atelier</h2>
            <div className="space-y-4 text-xs text-neutral-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                <span>100 Fashion Avenue, Suite 400, New York, NY 10001, United States</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-neutral-400 shrink-0" />
                <span>support@stylecart.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-neutral-400 shrink-0" />
                <span>+1 (800) 555-STYLE</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-800 text-xs text-neutral-400 space-y-1 font-mono">
            <p>Mon - Fri: 9:00 AM – 7:00 PM EST</p>
            <p>Sat - Sun: 10:00 AM – 5:00 PM EST</p>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="md:col-span-7 bg-white border border-neutral-200 rounded-xl p-6 sm:p-8 space-y-4">
          {submitted && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Thank you! Your message has been received. Our advisory team will reach out shortly.</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Your Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sarah Jenkins"
                className="w-full text-xs px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full text-xs px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Subject</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Question about Trench Coat sizing"
              className="w-full text-xs px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Your Message *</label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How may our stylists and support team assist you today?"
              className="w-full text-xs px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900"
            />
          </div>

          <button
            type="submit"
            className="py-2.5 px-6 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-900 hover:bg-neutral-800 rounded transition-colors flex items-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Message</span>
          </button>
        </form>
      </div>
    </div>
  );
};
