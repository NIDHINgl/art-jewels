'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Compass, ArrowLeft, Sparkles } from 'lucide-react';
import { BRAND_NAME } from '@/lib/constants';
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from '@/components/ui/empty';
import { PrestigeButton } from '@/components/ui/prestige-button';

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-ivory flex items-center justify-center px-4 py-16 sm:py-24">
      <div className="w-full max-w-2xl">
        <Empty className="bg-pearl/50 backdrop-blur-sm">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Compass className="text-gold" />
            </EmptyMedia>

            <p className="font-accent text-xs tracking-[0.4em] uppercase text-gold mb-1">
              Lost in the Atelier
            </p>

            <EmptyTitle>
              <span className="font-display italic text-gold">404</span>
              <span className="mx-3 text-obsidian/30">·</span>
              Page not found
            </EmptyTitle>

            <EmptyDescription>
              The piece you&apos;re looking for may have been moved, sold, or
              never existed. Let us guide you back.{' '}
              <Link href="/contact">Reach out</Link> if you think something&apos;s
              wrong.
            </EmptyDescription>
          </EmptyHeader>

          <EmptyContent>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <PrestigeButton
                type="button"
                icon={<ArrowLeft />}
                title="Return Home"
                variant="obsidian"
                size="md"
                onClick={() => router.push('/')}
                className="w-full sm:w-auto"
              />
              <PrestigeButton
                type="button"
                icon={<Sparkles />}
                title="Browse Collection"
                variant="obsidian"
                size="md"
                onClick={() => router.push('/collections')}
                className="w-full sm:w-auto"
              />
            </div>

            <p className="font-accent text-[10px] tracking-[0.3em] uppercase text-obsidian/30 mt-4">
              {BRAND_NAME} — Handcrafted Elegance
            </p>
          </EmptyContent>
        </Empty>
      </div>
    </main>
  );
}
