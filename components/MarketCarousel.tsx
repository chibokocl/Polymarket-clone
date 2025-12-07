import React, { useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import { MarketCard } from "./MarketCard";
import { MarketProps } from "../pages";

interface Props {
  title: string;
  markets: MarketProps[];
}

export const MarketCarousel: React.FC<Props> = ({ title, markets }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320; // Approx card width
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (markets.length === 0) return null;

  return (
    <div className="w-full flex flex-col my-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => scroll("left")}
            className="p-1.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition shadow-sm"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-1.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition shadow-sm"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto space-x-4 pb-4 px-1 scrollbar-hide snap-x"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {markets.map((market) => (
          <div key={market.id} className="min-w-[320px] w-[320px] snap-start">
            <MarketCard {...market} />
          </div>
        ))}
      </div>
    </div>
  );
};
