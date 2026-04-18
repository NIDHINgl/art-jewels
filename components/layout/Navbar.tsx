'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Search } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { BRAND_NAME } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import MobileMenu from './MobileMenu';
import SearchOverlay from './SearchOverlay';

const ICON_SPRING = { type: 'spring' as const, stiffness: 380, damping: 18 };

// Dock-style icon wrapper: spring-scale + rotate on hover, with a fading
// glow ring. Preserves children's own a11y attributes and click handlers.
interface DockIconProps {
  children: React.ReactNode;
  hoverTint?: 'gold' | 'rose-gold' | 'velvet';
  lightBgNav: boolean;
}
function DockIcon({ children, hoverTint = 'gold', lightBgNav }: DockIconProps) {
  const [hovered, setHovered] = useState(false);
  const ringColor: Record<string, string> = {
    gold: 'border-gold/40',
    'rose-gold': 'border-rose-gold/40',
    velvet: 'border-velvet/40',
  };
  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      animate={{ scale: hovered ? 1.18 : 1, rotate: hovered ? -5 : 0 }}
      transition={ICON_SPRING}
      className="relative"
    >
      {children}
      <AnimatePresence>
        {hovered && (
          <motion.span
            className={cn(
              'absolute inset-0 rounded-sm border pointer-events-none',
              ringColor[hoverTint],
              lightBgNav ? 'shadow-[0_0_14px_-2px_rgba(183,137,58,0.45)]' : 'shadow-[0_0_16px_-2px_rgba(246,233,208,0.5)]',
            )}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  // `revealed` gates the navbar's visibility on the home page — it only
  // appears after the user scrolls past the hero section.
  const [revealed, setRevealed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);

  const pathname = usePathname();
  const isHome = pathname === '/';
  const lightBgNav = scrolled || !isHome;

  const cartTotal = useCartStore((s) => s.totalItems());
  const wishlistTotal = useWishlistStore((s) => s.totalItems());
  const toggleCartDrawer = useCartStore((s) => s.toggleDrawer);

  // Scroll state — update `scrolled` + `revealed` (hero = 100vh on home)
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      if (isHome) {
        // Reveal once the user has scrolled past ~85% of the hero
        setRevealed(y > window.innerHeight * 0.85);
      } else {
        setRevealed(true);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  // Hide the navbar when the footer (curtain-reveal wrapper) enters the viewport
  const [onFooter, setOnFooter] = useState(false);
  useEffect(() => {
    const el = document.querySelector('[data-footer-wrapper]');
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setOnFooter(entry.isIntersecting),
      // Fire as soon as a few px of the footer wrapper cross into the viewport
      { threshold: 0, rootMargin: '-72px 0px 0px 0px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (cartTotal === 0) return;
    setCartBounce(true);
    const timer = setTimeout(() => setCartBounce(false), 300);
    return () => clearTimeout(timer);
  }, [cartTotal]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/collections', label: 'Collections' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <AnimatePresence>
        {revealed && !onFooter && (
          <motion.header
            key="navbar"
            className={cn(
              'fixed z-50 inset-x-0 mx-auto',
              'transition-[top,max-width,background-color,border-color,box-shadow,border-radius] duration-500 ease-out',
              scrolled &&
                'top-0 md:top-4 max-w-site md:max-w-5xl shadow-nav border-platinum/60 border-b md:border md:rounded-sm',
              !scrolled && 'top-0 max-w-site border border-transparent',
              lightBgNav ? 'bg-ivory/95 backdrop-blur-md' : 'bg-transparent',
            )}
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 26 }}
          >
            <nav
              className={cn(
                'flex items-center justify-between',
                'transition-[height,padding] duration-500 ease-out',
                scrolled
                  ? 'h-14 md:h-14 px-4 sm:px-5'
                  : 'h-16 sm:h-20 px-4 sm:px-6 lg:px-8',
              )}
              aria-label="Main navigation"
            >
              <Link
                href="/"
                className={cn(
                  'font-display font-bold tracking-[0.2em] hover:text-gold transition-colors',
                  lightBgNav
                    ? scrolled
                      ? 'text-lg text-obsidian'
                      : 'text-xl sm:text-2xl text-obsidian'
                    : 'text-xl sm:text-2xl text-pearl',
                )}
                aria-label={`${BRAND_NAME} — Home`}
              >
                {BRAND_NAME}
              </Link>

              <ul className="hidden md:flex items-center gap-8" role="list">
                {navLinks.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className={cn(
                        'font-accent text-sm tracking-wider hover:text-gold transition-colors relative group',
                        lightBgNav ? 'text-obsidian/80' : 'text-white/85',
                      )}
                    >
                      {label}
                      <span
                        className="absolute -bottom-0.5 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-300"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Icon actions — each wrapped in DockIcon for dock-style springy hover */}
              <div className="flex items-center gap-1 sm:gap-2">
                <DockIcon hoverTint="gold" lightBgNav={lightBgNav}>
                  <button
                    onClick={() => setSearchOpen(true)}
                    aria-label="Open search"
                    className={cn(
                      'w-11 h-11 flex items-center justify-center rounded-sm hover:text-gold transition-colors',
                      lightBgNav ? 'text-obsidian/80' : 'text-white/85',
                    )}
                  >
                    <Search size={20} aria-hidden="true" />
                  </button>
                </DockIcon>

                <DockIcon hoverTint="rose-gold" lightBgNav={lightBgNav}>
                  <Link
                    href="/wishlist"
                    aria-label={`Wishlist — ${wishlistTotal} items`}
                    className={cn(
                      'relative w-11 h-11 flex items-center justify-center rounded-sm hover:text-rose-gold transition-colors',
                      lightBgNav ? 'text-obsidian/80' : 'text-white/85',
                    )}
                  >
                    <Heart size={20} aria-hidden="true" />
                    {wishlistTotal > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-gold text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                        {wishlistTotal > 9 ? '9+' : wishlistTotal}
                      </span>
                    )}
                  </Link>
                </DockIcon>

                <DockIcon hoverTint="velvet" lightBgNav={lightBgNav}>
                  <button
                    onClick={toggleCartDrawer}
                    aria-label={`Cart — ${cartTotal} items`}
                    className={cn(
                      'relative w-11 h-11 flex items-center justify-center rounded-sm hover:text-velvet transition-colors',
                      lightBgNav ? 'text-obsidian/80' : 'text-white/85',
                    )}
                  >
                    <ShoppingBag size={20} aria-hidden="true" />
                    {cartTotal > 0 && (
                      <span
                        aria-live="polite"
                        className={cn(
                          'absolute top-1.5 right-1.5 w-4 h-4 bg-velvet text-white text-[10px] font-semibold rounded-full flex items-center justify-center',
                          cartBounce && 'animate-bounce-scale',
                        )}
                      >
                        {cartTotal > 9 ? '9+' : cartTotal}
                      </span>
                    )}
                  </button>
                </DockIcon>

                <DockIcon hoverTint="gold" lightBgNav={lightBgNav}>
                  <button
                    onClick={() => setMobileMenuOpen((v) => !v)}
                    aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={mobileMenuOpen}
                    className={cn(
                      'md:hidden w-11 h-11 flex items-center justify-center rounded-sm hover:text-gold transition-colors',
                      lightBgNav ? 'text-obsidian/80' : 'text-white/85',
                    )}
                  >
                    <MenuToggleIcon open={mobileMenuOpen} className="w-5 h-5" duration={350} />
                  </button>
                </DockIcon>
              </div>
            </nav>
          </motion.header>
        )}
      </AnimatePresence>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        links={navLinks}
      />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
