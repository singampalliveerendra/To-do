import { cn } from '@/lib/cn'

/** Small floating shapes: position, size, colour, motion. */
const SHAPES = [
  { className: 'top-[12%] left-[38%] size-3 rounded-full bg-pop-pink/60', animation: 'animate-float' },
  { className: 'top-[22%] right-[8%] size-5 rotate-12 rounded-md border-2 border-brand-400/50', animation: 'animate-float-slow' },
  { className: 'top-[58%] left-[30%] size-4 rounded-full border-2 border-pop-orange/60', animation: 'animate-float-slow' },
  { className: 'bottom-[14%] right-[22%] size-3 rotate-45 bg-pop-cyan/60', animation: 'animate-float' },
  { className: 'bottom-[30%] left-[70%] size-2 rounded-full bg-pop-yellow/80', animation: 'animate-float' },
  { className: 'top-[40%] right-[40%] size-2.5 rounded-full bg-brand-400/60', animation: 'animate-float-slow' },
]

/**
 * Decorative, slowly drifting colour blobs and floating shapes behind the app.
 * Purely visual: hidden from screen readers and never catches clicks.
 * Motion stops automatically when the user prefers reduced motion (see index.css).
 */
export function BackgroundDecor() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
      data-testid="background-decor"
    >
      <div className="absolute -top-32 -left-24 size-[30rem] animate-blob rounded-full bg-brand-300/40 blur-3xl" />
      <div className="absolute top-1/3 -right-32 size-[26rem] animate-blob rounded-full bg-pop-pink/25 blur-3xl [animation-delay:-6s]" />
      <div className="absolute -bottom-40 left-1/3 size-[28rem] animate-blob rounded-full bg-pop-orange/25 blur-3xl [animation-delay:-12s]" />
      <div className="absolute top-2/3 -left-20 size-72 animate-blob rounded-full bg-pop-cyan/20 blur-3xl [animation-delay:-3s]" />

      {SHAPES.map((shape, i) => (
        <span
          key={i}
          className={cn('absolute', shape.className, shape.animation)}
          style={{ animationDelay: `${i * -1.3}s` }}
        />
      ))}
    </div>
  )
}
