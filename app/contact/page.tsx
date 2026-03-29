import type { Metadata } from 'next';
import { PAGE_META } from '@/lib/constants';
import ContactPageClient from './ContactPageClient';

export const metadata: Metadata = {
  title: PAGE_META.contact.title,
  description: PAGE_META.contact.description,
};

export default function ContactPage() {
  return <ContactPageClient />;
}
