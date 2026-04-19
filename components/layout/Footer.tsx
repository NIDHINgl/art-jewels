import React from 'react';
import Link from 'next/link';
import { Instagram, MessageCircle, Mail } from 'lucide-react';
import { BRAND_NAME, BRAND_TAGLINE, SELLER_INSTAGRAM, SELLER_WHATSAPP, SELLER_EMAIL } from '@/lib/constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const collections = [
    { href: '/collections?category=rings', label: 'Rings' },
    { href: '/collections?category=necklaces', label: 'Necklaces' },
    { href: '/collections?category=earrings', label: 'Earrings' },
    { href: '/collections?category=bracelets', label: 'Bracelets' },
    { href: '/collections?category=anklets', label: 'Anklets' },
    { href: '/collections?category=custom', label: 'Custom Pieces' },
  ];

  const pages = [
    { href: '/', label: 'Home' },
    { href: '/collections', label: 'Collections' },
    { href: '/about', label: 'Our Story' },
    { href: '/contact', label: 'Contact' },
    { href: '/wishlist', label: 'Wishlist' },
  ];

  return (
    <footer className="bg-obsidian-deep text-white/80">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 py-16 border-b border-white/10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="font-wordmark font-bold text-2xl tracking-[0.25em] text-white hover:text-gold transition-colors"
            >
              {BRAND_NAME}
            </Link>
            <p className="mt-3 font-accent text-sm italic text-white/50 leading-relaxed">
              {BRAND_TAGLINE}
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href={SELLER_INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-gold hover:border-gold transition-all"
              >
                <Instagram size={16} aria-hidden="true" />
              </a>
              <a
                href={`https://wa.me/${SELLER_WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Message us on WhatsApp"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-green-400 hover:border-green-400 transition-all"
              >
                <MessageCircle size={16} aria-hidden="true" />
              </a>
              <a
                href={`mailto:${SELLER_EMAIL}`}
                aria-label="Email us"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-gold hover:border-gold transition-all"
              >
                <Mail size={16} aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h3 className="font-body text-xs font-semibold tracking-widest uppercase text-gold mb-5">
              Collections
            </h3>
            <ul className="flex flex-col gap-2.5" role="list">
              {collections.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-accent text-sm text-white/80 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pages */}
          <div>
            <h3 className="font-body text-xs font-semibold tracking-widest uppercase text-gold mb-5">
              Explore
            </h3>
            <ul className="flex flex-col gap-2.5" role="list">
              {pages.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-accent text-sm text-white/80 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-body text-xs font-semibold tracking-widest uppercase text-gold mb-5">
              Stay Close
            </h3>
            <p className="font-accent text-sm italic text-white/50 mb-4 leading-relaxed">
              New pieces, studio stories, and quiet notes from the workshop.
            </p>
            <div className="flex gap-0">
              <input
                type="email"
                placeholder="your@email.com"
                aria-label="Email address for newsletter"
                className="flex-1 bg-white/5 border border-white/15 px-3 py-2.5 text-sm text-white placeholder-white/30 font-body outline-none focus:border-gold transition-colors rounded-l-sm min-w-0"
              />
              <button
                type="button"
                className="px-4 py-2.5 bg-gold text-white text-sm font-medium hover:bg-gold-light transition-colors rounded-r-sm shrink-0"
              >
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-white/30">
            © {currentYear} {BRAND_NAME}. All rights reserved.
          </p>
          <p className="font-accent text-xs italic text-white/25">
            Handcrafted with love and intention.
          </p>
        </div>
      </div>
    </footer>
  );
}
