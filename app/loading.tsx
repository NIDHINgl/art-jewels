import KineticDotsLoader from '@/components/ui/kinetic-dots-loader';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ivory/95 backdrop-blur-sm">
      {/* Gold radial wash to match the LUMORA atmosphere */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, hsla(43, 74%, 45%, 0.10), transparent 55%)',
        }}
      />
      <div className="relative flex flex-col items-center gap-8">
        <KineticDotsLoader size="md" label="Curating your selection" />
      </div>
    </div>
  );
}
