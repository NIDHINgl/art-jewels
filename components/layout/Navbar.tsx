'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Heart, Search, Menu } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { BRAND_NAME } from '@/lib/constants';
import MobileMenu from './MobileMenu';
import SearchOverlay from './SearchOverlay';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);

  const cartTotal = useCartStore((s) => s.totalItems());
  const wishlistTotal = useWishlistStore((s) => s.totalItems());
  const toggleCartDrawer = useCartStore((s) => s.toggleDrawer);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Bounce animation when cart count changes
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
      <header
        className={[
          'fixed top-0 left-0 right-0 z-50',
          'transition-all duration-300',
          scrolled
            ? 'bg-ivory/95 backdrop-blur-md shadow-nav border-b border-platinum/60'
            : 'bg-transparent',
        ].join(' ')}
      >
        <nav
          className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            href="/"
            className="font-display font-bold text-xl sm:text-2xl tracking-[0.2em] text-obsidian hover:text-gold transition-colors"
            aria-label={`${BRAND_NAME} — Home`}
          >
            {BRAND_NAME}
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex items-center gap-8" role="list">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="font-accent text-sm tracking-wider text-obsidian/80 hover:text-gold transition-colors relative group"
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

          {/* Icon Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
              className="w-11 h-11 flex items-center justify-center rounded-sm text-obsidian/80 hover:text-gold hover:bg-platinum/40 transition-all"
            >
              <Search size={20} aria-hidden="true" />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              aria-label={`Wishlist — ${wishlistTotal} items`}
              className="relative w-11 h-11 flex items-center justify-center rounded-sm text-obsidian/80 hover:text-rose-gold hover:bg-platinum/40 transition-all"
            >
              <Heart size={20} aria-hidden="true" />
              {wishlistTotal > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-gold text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                  {wishlistTotal > 9 ? '9+' : wishlistTotal}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={toggleCartDrawer}
              aria-label={`Cart — ${cartTotal} items`}
              className="relative w-11 h-11 flex items-center justify-center rounded-sm text-obsidian/80 hover:text-velvet hover:bg-platinum/40 transition-all"
            >
              <ShoppingBag size={20} aria-hidden="true" />
              {cartTotal > 0 && (
                <span
                  aria-live="polite"
                  className={[
                    'absolute top-1.5 right-1.5 w-4 h-4',
                    'bg-velvet text-white text-[10px] font-semibold',
                    'rounded-full flex items-center justify-center',
                    cartBounce ? 'animate-bounce-scale' : '',
                  ].join(' ')}
                >
                  {cartTotal > 9 ? '9+' : cartTotal}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
              className="md:hidden w-11 h-11 flex items-center justify-center rounded-sm text-obsidian/80 hover:text-gold hover:bg-platinum/40 transition-all"
            >
              <Menu size={22} aria-hidden="true" />
            </button>
          </div>
        </nav>
      </header>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        links={navLinks}
      />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
