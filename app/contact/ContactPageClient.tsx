'use client';

import React, { useState } from 'react';
import { MessageCircle, Mail, Instagram, MapPin, Clock, Send } from 'lucide-react';
import {
  SELLER_WHATSAPP,
  SELLER_EMAIL,
  SELLER_INSTAGRAM,
  BRAND_NAME,
} from '@/lib/constants';
import Button from '@/components/ui/Button';

export default function ContactPageClient() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder — wire to your email service before deploying
    setSubmitted(true);
  };

  const whatsappUrl = `https://wa.me/${SELLER_WHATSAPP}?text=${encodeURIComponent(
    `Hello ${BRAND_NAME}, I'd like to know more about your jewellery collection.`,
  )}`;

  const contactLinks = [
    {
      icon: Mail,
      label: 'Email',
      value: SELLER_EMAIL,
      href: `mailto:${SELLER_EMAIL}`,
      hoverColor: 'group-hover:text-gold',
    },
    {
      icon: Instagram,
      label: 'Instagram',
      value: '@lumorajewels',
      href: SELLER_INSTAGRAM,
      hoverColor: 'group-hover:text-rose-gold',
    },
  ];

  return (
    <div className="min-h-screen bg-ivory pt-20 sm:pt-24">
      {/* Header */}
      <div className="bg-pearl border-b border-platinum">
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <p className="font-accent text-sm tracking-[0.4em] uppercase text-gold mb-2">
            Get in Touch
          </p>
          <h1 className="font-display text-fluid-h1 text-obsidian">Contact</h1>
        </div>
      </div>

      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20">
          {/* Left — info + WhatsApp CTA */}
          <div className="flex flex-col gap-10">
            {/* WhatsApp primary CTA */}
            <div className="bg-obsidian rounded-sm p-8 text-center">
              <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle
                  size={28}
                  className="text-green-400"
                  aria-hidden="true"
                />
              </div>
              <h2 className="font-display text-xl text-white mb-3">
                Talk to us on WhatsApp
              </h2>
              <p className="font-accent text-sm italic text-white/50 mb-6 leading-relaxed">
                The fastest way to reach us. We reply within a few hours during
                business hours — often sooner.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-body font-medium text-sm hover:bg-green-400 transition-colors"
              >
                <MessageCircle size={16} aria-hidden="true" />
                Open WhatsApp Chat
              </a>
            </div>

            {/* Other contact methods */}
            <div className="flex flex-col gap-5">
              <h2 className="font-display text-xl text-obsidian">
                Other Ways to Reach Us
              </h2>
              {contactLinks.map(({ icon: Icon, label, value, href, hoverColor }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 border border-platinum rounded-sm hover:border-gold transition-all group"
                >
                  <div className="w-10 h-10 bg-pearl border border-platinum rounded-sm flex items-center justify-center shrink-0 group-hover:border-gold group-hover:bg-champagne/20 transition-all">
                    <Icon
                      size={16}
                      className={`text-obsidian/60 transition-colors ${hoverColor}`}
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <p className="font-body text-xs font-semibold tracking-wider uppercase text-obsidian/40">
                      {label}
                    </p>
                    <p className="font-accent text-sm text-obsidian group-hover:text-gold transition-colors">
                      {value}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {/* Business info */}
            <div className="flex flex-col gap-4 p-5 bg-pearl border border-platinum rounded-sm">
              <div className="flex items-start gap-3">
                <MapPin
                  size={16}
                  className="text-gold shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-body text-xs font-semibold tracking-wider uppercase text-obsidian/40 mb-1">
                    Studio Location
                  </p>
                  <p className="font-accent text-sm italic text-obsidian/70">
                    Thiruvananthapuram, Kerala, India
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock
                  size={16}
                  className="text-gold shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-body text-xs font-semibold tracking-wider uppercase text-obsidian/40 mb-1">
                    Response Hours
                  </p>
                  <p className="font-accent text-sm italic text-obsidian/70">
                    Monday – Saturday, 10am – 7pm IST
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — contact form */}
          <div>
            <h2 className="font-display text-2xl text-obsidian mb-2">
              Send a Message
            </h2>
            <p className="font-accent text-sm italic text-obsidian/50 mb-8">
              For enquiries about custom pieces, bulk orders, or anything else.
            </p>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 text-center border border-platinum rounded-sm bg-pearl">
                <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center">
                  <Send size={22} className="text-green-600" aria-hidden="true" />
                </div>
                <h3 className="font-display text-xl text-obsidian">
                  Message received
                </h3>
                <p className="font-accent text-sm italic text-obsidian/50">
                  We&apos;ll be in touch within one business day.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: '', email: '', message: '' });
                  }}
                  className="font-accent text-xs italic text-gold hover:underline underline-offset-2 transition-all mt-2"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                {[
                  {
                    id: 'contact-name',
                    label: 'Name',
                    type: 'text',
                    key: 'name' as const,
                    placeholder: 'Your name',
                    autoComplete: 'name',
                  },
                  {
                    id: 'contact-email',
                    label: 'Email',
                    type: 'email',
                    key: 'email' as const,
                    placeholder: 'your@email.com',
                    autoComplete: 'email',
                  },
                ].map(({ id, label, type, key, placeholder, autoComplete }) => (
                  <div key={id}>
                    <label
                      htmlFor={id}
                      className="block font-body text-xs font-semibold tracking-wider uppercase text-obsidian/60 mb-2"
                    >
                      {label}
                    </label>
                    <input
                      id={id}
                      type={type}
                      required
                      value={form[key]}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, [key]: e.target.value }))
                      }
                      placeholder={placeholder}
                      autoComplete={autoComplete}
                      className="w-full px-4 py-3 border border-platinum-dark bg-ivory font-body text-sm text-obsidian placeholder-obsidian/30 outline-none focus:border-gold transition-colors rounded-sm"
                    />
                  </div>
                ))}

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block font-body text-xs font-semibold tracking-wider uppercase text-obsidian/60 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={6}
                    value={form.message}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, message: e.target.value }))
                    }
                    placeholder="Your enquiry — custom piece, sizing question, order status…"
                    className="w-full px-4 py-3 border border-platinum-dark bg-ivory font-body text-sm text-obsidian placeholder-obsidian/30 outline-none focus:border-gold transition-colors rounded-sm resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  className="gap-2"
                >
                  <Send size={16} aria-hidden="true" />
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
