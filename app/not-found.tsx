import Link from 'next/link';
import { BRAND_NAME } from '@/lib/constants';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ivory flex flex-col items-center justify-center px-4 text-center">
      {/* Decorative gem */}
      <div className="relative w-24 h-24 mb-8" aria-hidden="true">
        <div className="absolute inset-0 border-2 border-gold/20 rotate-45" />
        <div className="absolute inset-4 border border-gold/10 rotate-45" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-2xl font-bold text-gold/30">4</span>
        </div>
      </div>

      <p className="font-accent text-sm tracking-[0.4em] uppercase text-gold mb-4">
        Lost in the Atelier
      </p>
      <h1 className="font-display text-fluid-h1 text-obsidian mb-4">
        Page Not Found
      </h1>
      <p className="font-accent text-base italic text-obsidian/50 mb-10 max-w-sm leading-relaxed">
        The piece you&apos;re looking for may have been moved, sold, or never existed. Let us guide you back.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="px-6 py-3 bg-velvet text-white font-body text-sm font-medium hover:bg-velvet/85 transition-colors"
        >
          Return Home
        </Link>
        <Link
          href="/collections"
          className="px-6 py-3 border border-gold text-gold font-body text-sm font-medium hover:bg-gold hover:text-white transition-colors"
        >
          Browse Collections
        </Link>
      </div>

      <p className="mt-10 font-accent text-xs italic text-obsidian/30">
        {BRAND_NAME} — Handcrafted Elegance
      </p>
    </div>
  );
}
