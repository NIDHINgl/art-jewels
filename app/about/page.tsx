import type { Metadata } from 'next';
import { Gem, Hammer, Leaf, Clock, ArrowRight } from 'lucide-react';
import { PAGE_META, BRAND_NAME } from '@/lib/constants';
import { GlowingCard } from '@/components/ui/glowing-card';
import { PrestigeButton } from '@/components/ui/prestige-button';

export const metadata: Metadata = {
  title: PAGE_META.about.title,
  description: PAGE_META.about.description,
};

const pillars = [
  {
    icon: Hammer,
    title: 'Hand-Forged',
    text: 'No batch casting. No shortcuts. Every piece is worked by hand through each stage of fabrication, from raw metal to finished form.',
  },
  {
    icon: Gem,
    title: 'Ethically Sourced',
    text: 'Our stones are selected in person for quality and provenance. Our metals come from certified recycled or responsibly mined sources.',
  },
  {
    icon: Leaf,
    title: 'Considered Materials',
    text: 'Packaging is minimal and recyclable. Offcuts from the studio are melted down and reused. Nothing is wasted if it can be renewed.',
  },
  {
    icon: Clock,
    title: 'Made to Last',
    text: 'We refuse the idea of fast jewellery. LUMORA pieces are designed to be worn for decades and passed down — heirlooms from the moment they are made.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ivory pt-20 sm:pt-24">
      {/* Hero */}
      <div className="relative bg-obsidian-deep overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-obsidian-deep via-obsidian to-[hsl(20,8%,10%)]" aria-hidden="true" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] rounded-full bg-gold/5 blur-[100px]" aria-hidden="true" />

        {/* Decorative gems — scale + reposition on small screens so they don't collide */}
        <div className="absolute top-4 right-4 sm:top-8 sm:right-12 w-16 h-16 sm:w-24 sm:h-24 border border-gold/10 rotate-45 pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 w-8 h-8 sm:w-12 sm:h-12 border border-gold/15 rotate-45 pointer-events-none" aria-hidden="true" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <p className="font-body font-semibold text-sm tracking-[0.4em] uppercase text-gold mb-4">
            Our Story
          </p>
          <h1 className="font-display text-fluid-h1 text-white leading-tight mb-6">
            A Studio, A Maker,<br />
            <span className="italic text-champagne">An Intention</span>
          </h1>
          <div className="w-12 h-px bg-gold/40 mx-auto mb-6" aria-hidden="true" />
          <p className="font-accent text-lg italic text-white/80 leading-relaxed">
            {BRAND_NAME} was not born from a business plan. It was born from the inability to stop making things.
          </p>
        </div>
      </div>

      {/* Brand story */}
      <section
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24"
        aria-labelledby="story-heading"
      >
        <div className="prose-like space-y-6">
          <h2
            id="story-heading"
            className="font-display text-fluid-h2 text-obsidian"
          >
            The Beginning
          </h2>
          <p className="font-accent text-lg italic text-obsidian/80 leading-relaxed border-l-2 border-gold/30 pl-5">
            It started with a pair of earrings made for a friend&apos;s wedding. Then a ring for a sister&apos;s anniversary. Then a bracelet commissioned by a stranger who had seen the ring.
          </p>
          <p className="font-body text-base text-obsidian/80 leading-relaxed">
            {BRAND_NAME} grew the way good things grow — slowly, organically, without a campaign. The atelier is small by design. We make a limited number of pieces each season, and we know every piece we sell.
          </p>
          <p className="font-body text-base text-obsidian/80 leading-relaxed">
            Our jewellery is made in Thiruvananthapuram, Kerala, in a studio that smells of flux and silver polish. The tools are old. The craft is older. What we add to it is contemporary sensibility — clean lines, considered proportions, materials chosen for meaning as much as beauty.
          </p>
        </div>
      </section>

      {/* Artisan split section */}
      <section
        className="bg-pearl"
        aria-labelledby="artisan-heading"
      >
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image with glowing stat card centered as its focal point.
                Background is light (champagne → pearl) so the dark GlowingCard
                reads as a bold focal element, not dark-on-dark. */}
            <div className="relative aspect-[4/5] bg-pearl rounded-sm overflow-hidden border border-gold/20">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(135deg, hsl(34, 60%, 90%) 0%, hsl(45, 45%, 95%) 55%, hsl(30, 30%, 88%) 100%)',
                }}
                aria-hidden="true"
              />
              {/* Faint noise + radial gold warm wash */}
              <div
                className="absolute inset-0 opacity-60 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse at 30% 20%, rgba(233,197,118,0.25) 0%, transparent 55%)',
                }}
                aria-hidden="true"
              />
              <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse at 70% 80%, rgba(183,137,58,0.3) 0%, transparent 60%)',
                }}
                aria-hidden="true"
              />
              {/* Gold corner ornaments — tie it to the product card ornament language */}
              <div
                className="absolute inset-4 pointer-events-none"
                aria-hidden="true"
              >
                <span className="absolute top-0 left-0 w-4 h-4 border-l border-t border-gold/50" />
                <span className="absolute top-0 right-0 w-4 h-4 border-r border-t border-gold/50" />
                <span className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-gold/50" />
                <span className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-gold/50" />
              </div>
              {/* Glowing stat card — dark, reads beautifully against the champagne light */}
              <div className="absolute inset-0 flex items-center justify-center">
                <GlowingCard value="750k" label="Orders" />
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <p className="font-accent text-sm italic text-obsidian/50">
                  The atelier, Thiruvananthapuram
                </p>
              </div>
            </div>

            {/* Content */}
            <div>
              <p className="font-body font-semibold text-sm tracking-[0.4em] uppercase text-gold mb-4">
                The Maker
              </p>
              <h2
                id="artisan-heading"
                className="font-display text-fluid-h2 text-obsidian mb-6 leading-tight"
              >
                Made by One Pair of Hands
              </h2>
              <p className="font-accent text-lg italic text-obsidian/80 leading-relaxed mb-5">
                There is no factory. There is no team of makers. There is one artisan who trained for five years before making a single piece that was worth selling.
              </p>
              <p className="font-body text-sm text-obsidian/60 leading-relaxed mb-5">
                That training matters. The understanding of metal — how it moves when heated, how it holds tension, when it wants to be coaxed and when it needs to be forced — comes only from years of repetition and failure.
              </p>
              <p className="font-body text-sm text-obsidian/60 leading-relaxed">
                The pieces we make reflect that understanding. They are not perfect — they are precise. There is a difference. Perfection is mechanical. Precision is the result of a trained eye making a thousand small decisions that a machine would never know to make.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section
        className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-obsidian"
        aria-labelledby="values-heading"
      >
        <div className="max-w-site mx-auto">
          <div className="text-center mb-14">
            <p className="font-body font-semibold text-sm tracking-[0.4em] uppercase text-gold mb-3">
              What We Stand For
            </p>
            <h2
              id="values-heading"
              className="font-display text-fluid-h2 text-white"
            >
              Our Commitments
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {pillars.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex flex-col gap-4">
                <div className="w-12 h-12 border border-gold/30 flex items-center justify-center rounded-sm">
                  <Icon size={20} className="text-gold" aria-hidden="true" />
                </div>
                <h3 className="font-body text-base font-semibold text-white">
                  {title}
                </h3>
                <p className="font-accent text-sm italic text-white/50 leading-relaxed">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-champagne/20 text-center">
        <p className="font-body font-semibold text-sm tracking-[0.4em] uppercase text-gold mb-4">
          Find Your Piece
        </p>
        <h2 className="font-display text-fluid-h2 text-obsidian mb-6">
          Ready to Explore?
        </h2>
        <PrestigeButton
          href="/collections"
          icon={<ArrowRight />}
          title="Browse the Collection"
          variant="obsidian"
          size="md"
          className="mx-auto w-full sm:w-auto"
        />
      </section>
    </div>
  );
}
