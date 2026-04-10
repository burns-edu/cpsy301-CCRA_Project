// Carousel.tsx
import { useState } from "react";

interface CarouselProps<T> {
  items: T[];
  renderSlide: (item: T) => React.ReactNode;
  visibleCount?: number;
}

export default function Carousel<T>({
  items,
  renderSlide,
  visibleCount = 1,
}: CarouselProps<T>) {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((i) => (i === 0 ? items.length - 1 : i - 1));
  const next = () => setCurrent((i) => (i === items.length - 1 ? 0 : i + 1));

  return (
    <div className="relative w-full overflow-hidden">
      {/* Slides */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${(current * 100) / visibleCount}%)` }}
      >
        {items.map((item, i) => (
          <div key={i} style={{ minWidth: `${100 / visibleCount}%` }}>
            {renderSlide(item)}
          </div>
        ))}
      </div>

      {/* Prev button — hidden when at the start */}
      {current > 0 && (
        <button
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/75"
        >
          ‹
        </button>
      )}

      {/* Next button — hidden when at the end */}
      {current < items.length - visibleCount && (
        <button
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/75"
        >
          ›
        </button>
      )}

      {/* Dot indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {Array.from({ length: items.length - visibleCount + 1 }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === current ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
