'use client';

import * as React from 'react';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Instagram, MessageCircle, Mail, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';
import {
  BRAND_NAME,
  BRAND_TAGLINE,
  SELLER_INSTAGRAM,
  SELLER_WHATSAPP,
  SELLER_EMAIL,
} from '@/lib/constants';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── Inline styles — LUMORA-themed version of the shadcn token palette ──────
const STYLES = `
.cinematic-footer-wrapper {
  font-family: var(--font-body, 'DM Sans', sans-serif);
  -webkit-font-smoothing: antialiased;

  /* LUMORA tokens — gold/obsidian/pearl instead of shadcn primary/foreground */
  --pill-bg-1: rgba(246, 233, 208, 0.06);
  --pill-bg-2: rgba(246, 233, 208, 0.02);
  --pill-shadow: rgba(0, 0, 0, 0.55);
  --pill-highlight: rgba(246, 233, 208, 0.10);
  --pill-inset-shadow: rgba(0, 0, 0, 0.7);
  --pill-border: rgba(233, 197, 118, 0.22);

  --pill-bg-1-hover: rgba(233, 197, 118, 0.16);
  --pill-bg-2-hover: rgba(246, 233, 208, 0.06);
  --pill-border-hover: rgba(233, 197, 118, 0.5);
  --pill-shadow-hover: rgba(183, 137, 58, 0.25);
  --pill-highlight-hover: rgba(246, 233, 208, 0.25);
}

@keyframes lumora-footer-breathe {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
  100% { transform: translate(-50%, -50%) scale(1.12); opacity: 1; }
}
@keyframes lumora-footer-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@keyframes lumora-footer-heartbeat {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 4px rgba(183, 137, 58, 0.5)); }
  15%, 45% { transform: scale(1.2); filter: drop-shadow(0 0 10px rgba(233, 197, 118, 0.9)); }
  30% { transform: scale(1); }
}

.animate-lumora-footer-breathe { animation: lumora-footer-breathe 9s ease-in-out infinite alternate; }
.animate-lumora-footer-marquee { animation: lumora-footer-marquee 45s linear infinite; }
.animate-lumora-footer-heartbeat { animation: lumora-footer-heartbeat 2.4s cubic-bezier(0.25, 1, 0.5, 1) infinite; }

.lumora-footer-bg-grid {
  background-size: 60px 60px;
  background-image:
    linear-gradient(to right, rgba(246, 233, 208, 0.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(246, 233, 208, 0.04) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
}

.lumora-footer-aurora {
  background: radial-gradient(
    circle at 50% 50%,
    rgba(183, 137, 58, 0.22) 0%,
    rgba(246, 233, 208, 0.10) 40%,
    transparent 70%
  );
}

.lumora-footer-glass-pill {
  background: linear-gradient(145deg, var(--pill-bg-1) 0%, var(--pill-bg-2) 100%);
  box-shadow:
    0 10px 30px -10px var(--pill-shadow),
    inset 0 1px 1px var(--pill-highlight),
    inset 0 -1px 2px var(--pill-inset-shadow);
  border: 1px solid var(--pill-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.lumora-footer-glass-pill:hover {
  background: linear-gradient(145deg, var(--pill-bg-1-hover) 0%, var(--pill-bg-2-hover) 100%);
  border-color: var(--pill-border-hover);
  box-shadow:
    0 20px 40px -10px var(--pill-shadow-hover),
    inset 0 1px 1px var(--pill-highlight-hover);
}

.lumora-footer-giant-text {
  font-family: var(--font-display, 'Playfair Display', serif);
  font-size: 26vw;
  line-height: 0.75;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: transparent;
  -webkit-text-stroke: 1px rgba(246, 233, 208, 0.08);
  background: linear-gradient(180deg, rgba(246, 233, 208, 0.18) 0%, transparent 60%);
  -webkit-background-clip: text;
  background-clip: text;
}

.lumora-footer-text-glow {
  background: linear-gradient(180deg, #f6e9d0 0%, rgba(233, 197, 118, 0.55) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 24px rgba(233, 197, 118, 0.28));
}
`;

// ─── Magnetic button — gsap mouse-follow + springy return ────────────────────
type MagneticButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    as?: React.ElementType;
  };

const MagneticButton = React.forwardRef<HTMLElement, MagneticButtonProps>(
  ({ className, children, as: Component = 'button', ...props }, forwardedRef) => {
    const localRef = useRef<HTMLElement>(null);

    useEffect(() => {
      if (typeof window === 'undefined') return;
      const el = localRef.current;
      if (!el) return;

      const ctx = gsap.context(() => {
        const onMove = (e: MouseEvent) => {
          const rect = el.getBoundingClientRect();
          const cx = rect.width / 2;
          const cy = rect.height / 2;
          const x = e.clientX - rect.left - cx;
          const y = e.clientY - rect.top - cy;
          gsap.to(el, {
            x: x * 0.35,
            y: y * 0.35,
            rotationX: -y * 0.12,
            rotationY: x * 0.12,
            scale: 1.04,
            ease: 'power2.out',
            duration: 0.4,
          });
        };
        const onLeave = () => {
          gsap.to(el, {
            x: 0,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            ease: 'elastic.out(1, 0.3)',
            duration: 1.1,
          });
        };
        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
        return () => {
          el.removeEventListener('mousemove', onMove);
          el.removeEventListener('mouseleave', onLeave);
        };
      }, el);

      return () => ctx.revert();
    }, []);

    return (
      <Component
        ref={(node: HTMLElement) => {
          (localRef as React.MutableRefObject<HTMLElement | null>).current = node;
          if (typeof forwardedRef === 'function') forwardedRef(node);
          else if (forwardedRef)
            (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = node;
        }}
        className={cn('cursor-pointer', className)}
        {...props}
      >
        {children}
      </Component>
    );
  },
);
MagneticButton.displayName = 'MagneticButton';

// ─── Luxe marquee strip ──────────────────────────────────────────────────────
const MarqueeItem = () => (
  <div className="flex items-center space-x-10 px-5 text-white/60">
    <span>Handcrafted in Kerala</span>
    <span className="text-gold/70">✦</span>
    <span>Ethically Sourced</span>
    <span className="text-champagne/70">✦</span>
    <span>Hand-Forged</span>
    <span className="text-gold/70">✦</span>
    <span>Heirloom Quality</span>
    <span className="text-champagne/70">✦</span>
    <span>One of a Kind</span>
    <span className="text-gold/70">✦</span>
    <span>Bespoke on Request</span>
    <span className="text-champagne/70">✦</span>
  </div>
);

// ─── Main footer ─────────────────────────────────────────────────────────────
export function CinematicFooter() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const giantTextRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!wrapperRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        giantTextRef.current,
        { y: '8vh', scale: 0.85, opacity: 0 },
        {
          y: '0vh',
          scale: 1,
          opacity: 1,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: 'top 80%',
            end: 'bottom bottom',
            scrub: 1,
          },
        },
      );

      gsap.fromTo(
        [headingRef.current, linksRef.current],
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: 'top 50%',
            end: 'bottom bottom',
            scrub: 1,
          },
        },
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* Curtain reveal — wrapper holds space, footer is fixed underneath.
          data-footer-wrapper is watched by the Navbar so it can hide itself. */}
      <div
        ref={wrapperRef}
        data-footer-wrapper
        className="relative w-full md:h-screen md:[clip-path:polygon(0%_0,100%_0%,100%_100%,0_100%)]"
      >
        <footer className="relative flex w-full flex-col overflow-hidden bg-obsidian-deep text-white cinematic-footer-wrapper md:fixed md:bottom-0 md:left-0 md:h-screen md:justify-between">
          {/* Aurora + grid background */}
          <div
            className="lumora-footer-aurora absolute left-1/2 top-1/2 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 animate-lumora-footer-breathe rounded-[50%] blur-[80px] pointer-events-none z-0"
            aria-hidden="true"
          />
          <div className="lumora-footer-bg-grid absolute inset-0 z-0 pointer-events-none" aria-hidden="true" />

          {/* Giant LUMORA brand text in the background */}
          <div
            ref={giantTextRef}
            className="lumora-footer-giant-text hidden md:block absolute -bottom-[4vh] left-1/2 -translate-x-1/2 whitespace-nowrap z-0 pointer-events-none select-none"
            aria-hidden="true"
          >
            {BRAND_NAME}
          </div>

          {/* Top marquee — in flow on mobile, floating on desktop */}
          <div className="relative md:absolute md:top-10 md:left-0 w-full overflow-hidden border-y border-white/10 bg-obsidian/70 backdrop-blur-md py-2.5 md:py-3 z-10 -rotate-[1deg] md:-rotate-[1.5deg] scale-[1.03] md:scale-110 shadow-xl">
            <div className="flex w-max animate-lumora-footer-marquee font-accent text-[9px] sm:text-[10px] md:text-xs tracking-[0.3em] md:tracking-[0.35em] uppercase">
              <MarqueeItem />
              <MarqueeItem />
            </div>
          </div>

          {/* Center content */}
          <div className="relative z-10 flex md:flex-1 flex-col items-center md:justify-center px-5 sm:px-6 pt-12 pb-8 md:mt-20 md:py-0 w-full max-w-6xl mx-auto">
            {/* Eyebrow */}
            <p className="font-accent text-[10px] sm:text-xs tracking-[0.4em] sm:tracking-[0.5em] uppercase text-gold/80 mb-3 sm:mb-4">
              The Atelier
            </p>

            <h2
              ref={headingRef}
              className="font-display text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black lumora-footer-text-glow tracking-tight mb-3 md:mb-4 text-center leading-[1.05] md:leading-[0.95] px-2"
            >
              Worn with Intent
            </h2>

            <p className="font-accent italic text-sm md:text-base text-white/55 text-center mb-8 md:mb-10 max-w-xl leading-relaxed px-2">
              {BRAND_TAGLINE}
            </p>

            {/* Primary magnetic CTAs — stack on mobile, inline on sm+ */}
            <div ref={linksRef} className="flex flex-col items-center gap-5 md:gap-6 w-full">
              <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-3 sm:gap-4 w-full sm:w-auto">
                <MagneticButton
                  as={Link}
                  href="/collections"
                  className="lumora-footer-glass-pill px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-body font-semibold text-sm md:text-base flex items-center justify-center gap-3 text-pearl w-full sm:w-auto"
                >
                  Explore the Collection
                  <ArrowRight className="w-4 h-4 text-gold shrink-0" />
                </MagneticButton>

                <MagneticButton
                  as={Link}
                  href="/contact"
                  className="lumora-footer-glass-pill px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-body font-semibold text-sm md:text-base flex items-center justify-center gap-3 text-pearl w-full sm:w-auto"
                >
                  Commission Bespoke
                  <ArrowRight className="w-4 h-4 text-gold shrink-0" />
                </MagneticButton>
              </div>

              {/* Nav grid — 2 cols on mobile (Shop | Explore), Connect below full-width; 3 cols on sm+ */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 sm:gap-10 w-full max-w-3xl mt-4 md:mt-6">
                <div>
                  <h3 className="font-accent text-[10px] tracking-[0.3em] sm:tracking-[0.35em] uppercase text-gold mb-3">
                    Shop
                  </h3>
                  <ul className="flex flex-col gap-1.5" role="list">
                    {collections.map((c) => (
                      <li key={c.href}>
                        <Link
                          href={c.href}
                          className="font-accent text-xs text-white/55 hover:text-pearl transition-colors"
                        >
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-accent text-[10px] tracking-[0.3em] sm:tracking-[0.35em] uppercase text-gold mb-3">
                    Explore
                  </h3>
                  <ul className="flex flex-col gap-1.5" role="list">
                    {pages.map((p) => (
                      <li key={p.href}>
                        <Link
                          href={p.href}
                          className="font-accent text-xs text-white/55 hover:text-pearl transition-colors"
                        >
                          {p.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <h3 className="font-accent text-[10px] tracking-[0.3em] sm:tracking-[0.35em] uppercase text-gold mb-3">
                    Connect
                  </h3>
                  <div className="flex gap-2">
                    <a
                      href={SELLER_INSTAGRAM}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Follow us on Instagram"
                      className="lumora-footer-glass-pill w-11 h-11 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white/60 hover:text-gold"
                    >
                      <Instagram size={15} aria-hidden="true" />
                    </a>
                    <a
                      href={`https://wa.me/${SELLER_WHATSAPP}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Message us on WhatsApp"
                      className="lumora-footer-glass-pill w-11 h-11 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white/60 hover:text-green-400"
                    >
                      <MessageCircle size={15} aria-hidden="true" />
                    </a>
                    <a
                      href={`mailto:${SELLER_EMAIL}`}
                      aria-label="Email us"
                      className="lumora-footer-glass-pill w-11 h-11 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white/60 hover:text-gold"
                    >
                      <Mail size={15} aria-hidden="true" />
                    </a>
                  </div>
                  <p className="mt-3 sm:mt-4 font-accent italic text-xs text-white/45 leading-relaxed">
                    Reach us on WhatsApp for commissions, sizing, or a quiet
                    conversation about a piece.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="relative z-20 w-full pt-6 pb-5 md:pt-0 md:pb-6 px-4 md:px-10 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4 border-t border-white/5 md:border-0">
            <div className="font-body text-[10px] md:text-xs text-white/30 tracking-[0.2em] md:tracking-widest uppercase order-2 md:order-1 text-center">
              © {currentYear} {BRAND_NAME}. All rights reserved.
            </div>

            <div className="lumora-footer-glass-pill px-4 sm:px-5 py-2 sm:py-2.5 rounded-full flex items-center gap-2 order-1 md:order-2 cursor-default">
              <span className="font-accent text-[10px] md:text-xs text-white/60 uppercase tracking-[0.2em] sm:tracking-[0.25em]">
                Crafted with
              </span>
              <span
                className="animate-lumora-footer-heartbeat text-sm"
                style={{ color: '#c67a95' }}
                aria-hidden="true"
              >
                ❤
              </span>
              <span className="font-accent text-[10px] md:text-xs text-white/60 uppercase tracking-[0.2em] sm:tracking-[0.25em]">
                in Kerala
              </span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
