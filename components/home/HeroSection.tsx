'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { BRAND_NAME, BRAND_TAGLINE } from '@/lib/constants';
import { SparklesCore } from '@/components/ui/sparkles';
import { AnimatedText } from '@/components/ui/animated-text';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Landing hero — full-screen particle field with the LUMORA wordmark layered
 * on top. Particles cover the entire viewport; twin gold light beams sit just
 * under the wordmark as a design anchor; radial mask fades the edges so
 * particles blend into the obsidian background at the borders.
 */
export default function HeroSection() {
  return (
    <section
      className="relative w-full min-h-screen bg-obsidian-deep flex flex-col items-center justify-center overflow-hidden"
      aria-label="Hero"
    >
      {/* ─── Full-screen particle background ────────────────────────────────── */}
      <div className="absolute inset-0 w-full h-full" aria-hidden="true">
        <SparklesCore
          id="hero-sparkles-full"
          background="transparent"
          minSize={0.5}
          maxSize={1.4}
          particleDensity={90}
          speed={1.1}
          particleColor="#f6e9d0"
          className="w-full h-full"
        />
      </div>

      {/* Radial vignette — darkens outer edges so particles feel concentrated
          around the wordmark rather than floating randomly across the screen */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_35%,rgba(10,10,10,0.85)_100%)] pointer-events-none"
        aria-hidden="true"
      />

      {/* Soft radial gold glow behind wordmark */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] rounded-full bg-gold/[0.07] blur-[140px] pointer-events-none"
        aria-hidden="true"
        animate={{ scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ─── Content layer ──────────────────────────────────────────────────── */}
      <div className="relative z-20 flex flex-col items-center w-full px-4 sm:px-8">
        {/* Eyebrow */}
        <motion.p
          className="font-accent text-xs sm:text-sm tracking-[0.4em] uppercase text-gold/70 mb-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
        >
          Art Jewellery Atelier
        </motion.p>

        {/* Giant wordmark — per-letter spring stagger, existing gold gradient preserved */}
        <h1 className="sr-only">{BRAND_NAME}</h1>
        <AnimatedText
          text={BRAND_NAME}
          aria-hidden="true"
          duration={0.09}
          delay={0.35}
          showUnderline={false}
          className="gap-0"
          textClassName="text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-display font-bold tracking-[0.12em] leading-[1] bg-clip-text text-transparent bg-gradient-to-b from-pearl via-champagne to-gold"
        />

        {/* Twin light beams — anchor under the wordmark */}
        <div className="w-full max-w-[40rem] h-6 relative mt-4" aria-hidden="true">
          <motion.div
            className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-gold to-transparent h-[2px] w-3/4 blur-sm"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.6 }}
            style={{ transformOrigin: 'center' }}
          />
          <motion.div
            className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-gold-light to-transparent h-px w-3/4"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.6 }}
            style={{ transformOrigin: 'center' }}
          />
          <motion.div
            className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-champagne to-transparent h-[5px] w-1/4 blur-sm"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.8 }}
            style={{ transformOrigin: 'center' }}
          />
          <motion.div
            className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-champagne to-transparent h-px w-1/4"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.8 }}
            style={{ transformOrigin: 'center' }}
          />
        </div>

        {/* Tagline */}
        <motion.p
          className="font-accent italic text-white/75 text-base sm:text-xl mt-8 text-center max-w-2xl leading-relaxed"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 1.0 }}
        >
          {BRAND_TAGLINE}
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 1.2 }}
        >
          <motion.div
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <Link
              href="/collections"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gold text-white font-body font-medium tracking-wide hover:bg-gold-light transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-gold min-h-[52px] rounded-sm"
            >
              Explore Collection
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/25 text-white/80 font-body font-medium tracking-wide hover:border-gold/60 hover:text-white transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] min-h-[52px] rounded-sm"
            >
              Our Story
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE, delay: 1.6 }}
      >
        <p className="font-accent text-[0.65rem] sm:text-xs tracking-[0.35em] uppercase text-white/30">
          Scroll
        </p>
        <div className="w-px h-10 bg-gradient-to-b from-white/50 to-transparent relative overflow-hidden">
          <motion.span
            className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-gold to-transparent"
            animate={{ y: ['-100%', '400%'] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>

      {/* Soft fade into next section */}
      <div
        className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-obsidian-deep to-transparent pointer-events-none z-10"
        aria-hidden="true"
      />
    </section>
  );
}
