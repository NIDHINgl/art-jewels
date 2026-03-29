'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BRAND_NAME, BRAND_TAGLINE } from '@/lib/constants';

// ─── Canvas Sparkle Effect ────────────────────────────────────────────────────
function SparkleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    interface Particle {
      x: number;
      y: number;
      size: number;
      opacity: number;
      speed: number;
      drift: number;
      phase: number;
    }

    const particles: Particle[] = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random(),
      speed: Math.random() * 0.4 + 0.1,
      drift: (Math.random() - 0.5) * 0.3,
      phase: Math.random() * Math.PI * 2,
    }));

    let animId: number;
    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.y -= p.speed;
        p.x += p.drift;
        p.phase += 0.02;
        const alpha = ((Math.sin(p.phase) + 1) / 2) * 0.7;

        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -10 || p.x > canvas.width + 10) {
          p.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(43, 74%, 62%, ${alpha})`;
        ctx.fill();

        // Cross sparkle
        if (p.size > 1.5) {
          ctx.strokeStyle = `hsla(43, 74%, 72%, ${alpha * 0.6})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(p.x - p.size * 2, p.y);
          ctx.lineTo(p.x + p.size * 2, p.y);
          ctx.moveTo(p.x, p.y - p.size * 2);
          ctx.lineTo(p.x, p.y + p.size * 2);
          ctx.stroke();
        }
      });

      t++;
      animId = requestAnimationFrame(draw);
    };

    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      animId = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}

// ─── Decorative Gem Shapes ────────────────────────────────────────────────────
function GemShapes() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Large diamond outline top-right */}
      <div
        className="absolute -top-20 -right-20 w-80 h-80 border border-gold/10 rotate-45 animate-float"
        style={{ animationDuration: '8s', animationDelay: '0s' }}
      />
      {/* Medium diamond bottom-left */}
      <div
        className="absolute bottom-20 -left-16 w-48 h-48 border border-champagne/15 rotate-45 animate-float"
        style={{ animationDuration: '10s', animationDelay: '2s' }}
      />
      {/* Small gem center-left */}
      <div
        className="absolute top-1/3 left-12 w-16 h-16 border border-gold/20 rotate-45 animate-float"
        style={{ animationDuration: '6s', animationDelay: '1s' }}
      />
      {/* Inner filled diamond */}
      <div
        className="absolute top-1/2 right-24 w-6 h-6 bg-gold/15 rotate-45 animate-float"
        style={{ animationDuration: '7s', animationDelay: '3s' }}
      />
    </div>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
export default function HeroSection() {
  return (
    <section
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-obsidian-deep"
      aria-label="Hero"
    >
      {/* Background gradient layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-obsidian-deep via-obsidian to-[hsl(20,10%,12%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian-deep/80 via-transparent to-transparent" />

      {/* Radial gold glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full bg-gold/5 blur-[120px]" aria-hidden="true" />

      {/* Gem shapes */}
      <GemShapes />

      {/* Sparkle canvas */}
      <SparkleCanvas />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-8 max-w-4xl mx-auto">
        {/* Eyebrow */}
        <p
          className="font-accent text-sm tracking-[0.4em] uppercase text-gold/80 mb-6 animate-fade-up"
          style={{ animationFillMode: 'both', animationDelay: '100ms' }}
        >
          Art Jewellery Atelier
        </p>

        {/* Brand name */}
        <h1
          className="font-display font-bold text-fluid-hero text-white tracking-[0.15em] mb-6 animate-fade-up"
          style={{ animationFillMode: 'both', animationDelay: '250ms' }}
        >
          {BRAND_NAME}
        </h1>

        {/* Divider */}
        <div
          className="flex items-center justify-center gap-4 mb-8 animate-fade-up"
          style={{ animationFillMode: 'both', animationDelay: '400ms' }}
          aria-hidden="true"
        >
          <div className="w-16 h-px bg-gold/40" />
          <div className="w-2 h-2 rotate-45 bg-gold/60" />
          <div className="w-16 h-px bg-gold/40" />
        </div>

        {/* Tagline */}
        <p
          className="font-accent text-xl sm:text-2xl italic text-white/70 mb-12 leading-relaxed animate-fade-up"
          style={{ animationFillMode: 'both', animationDelay: '500ms' }}
        >
          {BRAND_TAGLINE}
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up"
          style={{ animationFillMode: 'both', animationDelay: '650ms' }}
        >
          <Link
            href="/collections"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gold text-white font-body font-medium tracking-wide hover:bg-gold-light active:scale-[0.98] transition-all duration-200 shadow-gold min-h-[52px]"
          >
            Explore Collection
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 px-8 py-4 border border-white/25 text-white/80 font-body font-medium tracking-wide hover:border-gold/60 hover:text-white active:scale-[0.98] transition-all duration-200 min-h-[52px]"
          >
            Our Story
          </Link>
        </div>

        {/* Scroll hint */}
        <div
          className="mt-20 flex flex-col items-center gap-2 animate-fade-up"
          style={{ animationFillMode: 'both', animationDelay: '900ms' }}
          aria-hidden="true"
        >
          <p className="font-accent text-xs tracking-widest uppercase text-white/25">
            Scroll
          </p>
          <div className="w-px h-10 bg-gradient-to-b from-white/25 to-transparent" />
        </div>
      </div>
    </section>
  );
}
