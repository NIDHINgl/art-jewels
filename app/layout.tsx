import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import ToastContainer from '@/components/ui/Toast';
import ScrollToTop from '@/components/ui/ScrollToTop';
import { BRAND_NAME, BRAND_DESCRIPTION, SITE_URL, SITE_OG_IMAGE } from '@/lib/constants';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND_NAME} — Handcrafted Art Jewellery`,
    template: `%s — ${BRAND_NAME}`,
  },
  description: BRAND_DESCRIPTION,
  openGraph: {
    type: 'website',
    siteName: BRAND_NAME,
    images: [{ url: SITE_OG_IMAGE, width: 1200, height: 630, alt: BRAND_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [SITE_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-ivory">
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>

        <Navbar />

        <main id="main-content" tabIndex={-1}>
          {children}
        </main>

        <Footer />

        {/* Global overlays */}
        <CartDrawer />
        <ToastContainer />
        <ScrollToTop />
      </body>
    </html>
  );
}
