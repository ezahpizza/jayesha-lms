import { useEffect, useRef, useState } from 'react';
import imageList from './ImageList';

export function ImageCarousel() {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const delay = 3500; // ms

  const nextSlide = () => setCurrent((prev) => (prev + 1) % imageList.length);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(nextSlide, delay);
    return () => timeoutRef.current && clearTimeout(timeoutRef.current);
  }, [current]);

  return (
    <div className="relative w-full max-w-5xl mx-auto mt-12 rounded-xl overflow-hidden shadow-lg aspect-[5/4]">
        <div
            className="flex transition-transform duration-700 ease-in-out h-full"
            style={{ transform: `translateX(-${current * 100}%)` }}
        >
            {imageList.map((src, idx) => (
            <img
                key={idx}
                src={src}
                alt={`carousel-img-${idx}`}
                className="w-full h-full object-cover flex-shrink-0"
                style={{ minWidth: '100%' }}
            />
            ))}
        </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {imageList.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full transition-all duration-300 border border-white ${current === idx ? 'bg-white' : 'bg-gray-400 opacity-60'}`}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
