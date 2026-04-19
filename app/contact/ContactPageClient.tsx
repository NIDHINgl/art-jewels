'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MessageCircle,
  Mail,
  Instagram,
  MapPin,
  Clock,
  Send,
  ArrowUpRight,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import {
  SELLER_WHATSAPP,
  SELLER_EMAIL,
  SELLER_INSTAGRAM,
  BRAND_NAME,
} from '@/lib/constants';
import { PrestigeButton } from '@/components/ui/prestige-button';
import { Textarea } from '@/components/ui/textarea';

export default function ContactPageClient() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const whatsappUrl = `https://wa.me/${SELLER_WHATSAPP}?text=${encodeURIComponent(
    `Hello ${BRAND_NAME}, I'd like to know more about your jewellery collection.`,
  )}`;

  // Refined "other channels" — keeps WhatsApp as the hero card, these are the b-tier tiles
  const channels = [
    {
      icon: Mail,
      label: 'Email',
      value: SELLER_EMAIL,
      href: `mailto:${SELLER_EMAIL}`,
      response: 'within 1 day',
      accent: 'hover:text-gold',
    },
    {
      icon: Instagram,
      label: 'Instagram',
      value: '@lumorajewels',
      href: SELLER_INSTAGRAM,
      response: 'DMs open',
      accent: 'hover:text-rose-gold',
    },
  ];

  const hours = [
    { day: 'Monday – Friday', time: '10am – 7pm' },
    { day: 'Saturday',          time: '11am – 5pm' },
    { day: 'Sunday',            time: 'By appointment' },
  ];

  return (
    <div className="min-h-screen bg-ivory pt-20 sm:pt-24">
      {/* ─── Editorial header — matches Collections & About ─── */}
      <header className="relative">
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-12 pb-6 sm:pb-10">
          <Link
            href="/"
            aria-label="Back to home"
            className="sm:hidden inline-flex items-center gap-1.5 font-accent text-xs tracking-wider text-obsidian/60 hover:text-gold transition-colors mb-5 -ml-1"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Back to Home
          </Link>

          <p className="font-accent text-[10px] sm:text-xs tracking-[0.45em] uppercase text-obsidian/40 mb-2">
            <Link href="/" className="hover:text-gold transition-colors">
              Home
            </Link>
            <span className="mx-2 text-obsidian/25">/</span>
            <span className="text-gold">Contact</span>
          </p>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h1 className="font-display text-[2.5rem] sm:text-6xl lg:text-7xl text-obsidian leading-[0.98] tracking-tight">
              <span className="italic font-normal text-obsidian/50">let&apos;s</span>{' '}
              talk<span className="text-gold">.</span>
            </h1>
            <p className="font-accent italic text-sm sm:text-base text-obsidian/55 leading-relaxed max-w-md">
              Commissions, sizing, or a quiet conversation about a piece —
              we read every message personally.
            </p>
          </div>

          <div
            className="mt-6 sm:mt-10 h-px w-full bg-gradient-to-r from-transparent via-gold/40 to-transparent"
            aria-hidden="true"
          />
        </div>
      </header>

      {/* ─── Main content ─── */}
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-14">
          {/* ─── Left column — channels + hours (2/5 on lg) ─── */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* WhatsApp hero — obsidian card with gold-corner ornament */}
            <div className="relative bg-obsidian-deep rounded-sm overflow-hidden">
              {/* Subtle radial gold wash */}
              <div
                className="absolute inset-0 opacity-70 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse at 30% 0%, rgba(233,197,118,0.22) 0%, transparent 55%)',
                }}
                aria-hidden="true"
              />
              {/* Gold corner marks */}
              <div className="absolute inset-4 pointer-events-none" aria-hidden="true">
                <span className="absolute top-0 left-0 w-4 h-4 border-l border-t border-gold/60" />
                <span className="absolute top-0 right-0 w-4 h-4 border-r border-t border-gold/60" />
                <span className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-gold/60" />
                <span className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-gold/60" />
              </div>

              <div className="relative p-8 sm:p-10 flex flex-col items-start gap-4">
                <span className="inline-flex items-center gap-2">
                  <span className="w-6 h-px bg-gold/80" aria-hidden="true" />
                  <p className="font-accent text-[10px] tracking-[0.45em] uppercase text-gold">
                    Direct Line
                  </p>
                </span>

                <h2 className="font-display text-2xl sm:text-3xl text-pearl leading-tight">
                  Talk to us on <span className="italic text-gold">WhatsApp</span>
                </h2>

                <p className="font-accent italic text-sm text-white/55 leading-relaxed">
                  The fastest way to reach us. We reply within a few hours
                  during business hours — often sooner.
                </p>

                {/* Live indicator */}
                <div className="flex items-center gap-2 mt-1">
                  <span className="relative flex w-2 h-2">
                    <span className="absolute inline-flex w-full h-full rounded-full bg-green-400 opacity-70 animate-ping" />
                    <span className="relative inline-flex w-2 h-2 rounded-full bg-green-400" />
                  </span>
                  <span className="font-accent text-xs italic text-white/50">
                    Usually online now
                  </span>
                </div>

                <PrestigeButton
                  type="button"
                  onClick={() => window.open(whatsappUrl, '_blank', 'noopener,noreferrer')}
                  icon={<MessageCircle />}
                  title="Open WhatsApp Chat"
                  variant="gold"
                  size="md"
                  className="w-full sm:w-auto mt-2"
                />
              </div>
            </div>

            {/* Other channels — two tiles side by side on sm+ */}
            <div>
              <p className="font-accent text-xs tracking-[0.4em] uppercase text-gold mb-3">
                Or reach us via
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {channels.map(({ icon: Icon, label, value, href, response, accent }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="group relative bg-pearl border border-platinum rounded-sm p-4 flex flex-col gap-2 hover:border-gold/50 hover:shadow-card transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5"
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-9 h-9 rounded-sm border border-gold/40 bg-ivory flex items-center justify-center">
                        <Icon
                          size={15}
                          className={`text-obsidian/60 transition-colors ${accent}`}
                          aria-hidden="true"
                        />
                      </div>
                      <ArrowUpRight
                        size={14}
                        className="text-obsidian/30 group-hover:text-gold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                        aria-hidden="true"
                      />
                    </div>
                    <p className="font-accent text-[10px] tracking-[0.3em] uppercase text-obsidian/40">
                      {label}
                    </p>
                    <p className="font-body text-sm font-medium text-obsidian truncate">
                      {value}
                    </p>
                    <p className="font-accent italic text-[11px] text-obsidian/40 mt-auto">
                      {response}
                    </p>
                  </a>
                ))}
              </div>
            </div>

            {/* Studio hours — structured card */}
            <div className="bg-pearl border border-platinum rounded-sm p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={14} className="text-gold" aria-hidden="true" />
                <p className="font-accent text-[10px] tracking-[0.4em] uppercase text-gold">
                  Studio Hours
                </p>
              </div>
              <ul className="flex flex-col divide-y divide-platinum/80" role="list">
                {hours.map(({ day, time }) => (
                  <li
                    key={day}
                    className="flex items-baseline justify-between gap-4 py-2.5 first:pt-0 last:pb-0"
                  >
                    <span className="font-body text-sm text-obsidian/70">{day}</span>
                    <span className="font-accent italic text-sm text-obsidian tabular-nums">
                      {time}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 pt-4 border-t border-platinum flex items-start gap-2.5">
                <MapPin size={14} className="text-gold shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-body text-sm text-obsidian/80 leading-snug">
                    Thiruvananthapuram
                  </p>
                  <p className="font-accent italic text-xs text-obsidian/45">
                    Kerala, India &middot; by appointment
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Right column — form (3/5 on lg) ─── */}
          <div className="lg:col-span-3">
            <div className="relative">
              {/* Gold corner frame around the form */}
              <div className="absolute inset-0 pointer-events-none hidden sm:block" aria-hidden="true">
                <span className="absolute top-0 left-0 w-6 h-6 border-l border-t border-gold/50" />
                <span className="absolute top-0 right-0 w-6 h-6 border-r border-t border-gold/50" />
                <span className="absolute bottom-0 left-0 w-6 h-6 border-l border-b border-gold/50" />
                <span className="absolute bottom-0 right-0 w-6 h-6 border-r border-b border-gold/50" />
              </div>

              <div className="sm:p-8 md:p-10 sm:bg-pearl/40">
                <p className="font-accent text-xs tracking-[0.4em] uppercase text-gold mb-2">
                  Write to us
                </p>
                <h2 className="font-display text-2xl sm:text-3xl text-obsidian mb-2">
                  Send a message
                </h2>
                <p className="font-accent italic text-sm text-obsidian/55 mb-8 max-w-md">
                  For enquiries about custom pieces, bulk orders, or anything
                  else. We reply personally, never automatically.
                </p>

                {submitted ? (
                  <div className="flex flex-col items-start gap-4 py-8">
                    <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                      <CheckCircle2 size={24} className="text-gold" aria-hidden="true" />
                    </div>
                    <h3 className="font-display text-2xl text-obsidian">
                      Message received
                    </h3>
                    <p className="font-accent italic text-sm text-obsidian/55 max-w-sm">
                      Thanks for writing — we&apos;ll be in touch within one
                      business day. For anything urgent, reach us on WhatsApp.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setForm({ name: '', email: '', subject: '', message: '' });
                      }}
                      className="font-accent italic text-sm text-gold hover:text-gold-light underline underline-offset-4 transition-colors mt-2"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                    {/* Name + Email — 2-col on sm+ for a tighter rhythm */}
                    <div className="grid sm:grid-cols-2 gap-5">
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
                            className="block font-accent text-[10px] tracking-[0.4em] uppercase text-gold/80 mb-2"
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
                            className="w-full h-12 px-4 border border-platinum-dark bg-pearl font-body text-sm text-obsidian placeholder-obsidian/30 outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-[border,box-shadow] duration-300 rounded-sm"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Subject */}
                    <div>
                      <label
                        htmlFor="contact-subject"
                        className="block font-accent text-[10px] tracking-[0.4em] uppercase text-gold/80 mb-2"
                      >
                        Subject{' '}
                        <span className="text-obsidian/30 normal-case tracking-normal font-body italic">
                          (optional)
                        </span>
                      </label>
                      <input
                        id="contact-subject"
                        type="text"
                        value={form.subject}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, subject: e.target.value }))
                        }
                        placeholder="Custom piece · Sizing · Order status"
                        className="w-full h-12 px-4 border border-platinum-dark bg-pearl font-body text-sm text-obsidian placeholder-obsidian/30 outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-[border,box-shadow] duration-300 rounded-sm"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label
                        htmlFor="contact-message"
                        className="block font-accent text-[10px] tracking-[0.4em] uppercase text-gold/80 mb-2"
                      >
                        Message
                      </label>
                      <Textarea
                        id="contact-message"
                        required
                        rows={6}
                        value={form.message}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, message: e.target.value }))
                        }
                        placeholder="Your enquiry — custom piece, sizing question, order status…"
                        variant="lg"
                        className="resize-none"
                      />
                    </div>

                    <PrestigeButton
                      type="submit"
                      icon={<Send />}
                      title="Send Message"
                      variant="obsidian"
                      size="md"
                      className="w-full sm:w-auto sm:self-start mt-2"
                    />
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
