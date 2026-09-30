import { useEffect, useState, useRef } from "react";
import { Lightbulb } from "lucide-react";

interface EcoFact {
  id: string;
  text: string;
  icon: string;
  category: string;
}

interface EcoFactsCarouselProps {
  facts: EcoFact[];
}

export const EcoFactsCarousel = ({ facts }: EcoFactsCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (facts.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % facts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [facts.length]);

  useEffect(() => {
    if (containerRef.current) {
      const scrollPosition = currentIndex * containerRef.current.offsetWidth;
      containerRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  }, [currentIndex]);

  if (facts.length === 0) return null;

  return (
    <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] animate-fade-up">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <Lightbulb className="w-4 h-4" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">
            Parallax Eco Insights
          </h3>
        </div>
        <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 uppercase">
          Daily Tip
        </span>
      </div>

      <div ref={containerRef} className="overflow-hidden py-1">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {facts.map((fact) => (
            <div key={fact.id} className="w-full flex-shrink-0 px-1">
              <p className="text-xs text-slate-600 leading-relaxed font-medium mb-3">
                "{fact.text}"
              </p>
              <div className="flex items-center justify-between">
                <span className="inline-block text-[10px] font-extrabold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase">
                  {fact.category}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {currentIndex + 1} / {facts.length}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-4">
        {facts.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-blue-600 w-6"
                : "bg-slate-200 w-1.5 hover:bg-slate-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
