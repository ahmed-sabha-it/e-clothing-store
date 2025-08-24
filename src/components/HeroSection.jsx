import React, { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

const banners = [
  {
    id: 1,
    title: "Summer Collection 2025",
    subtitle: "Fresh styles for the season",
    description: "Discover our latest summer arrivals with up to 40% off.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop",
    cta: "Shop Summer",
    ctaLink: "#",
  },
  {
    id: 2,
    title: "New Arrivals",
    subtitle: "Just landed",
    description: "Be the first to wear the latest trends from top brands.",
    image: "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?w=1200&h=600&fit=crop",
    cta: "Explore New",
    ctaLink: "#",
  },
  {
    id: 3,
    title: "Family Sale",
    subtitle: "For everyone you love",
    description: "Shop for the whole family and save big with our bundle deals.",
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1200&h=600&fit=crop",
    cta: "Shop Family",
    ctaLink: "#",
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const toggleAutoplay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <div
      {...swipeHandlers}
      className="relative w-full h-[70vh] min-h-[400px] overflow-hidden rounded-lg bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-800 dark:via-gray-900 dark:to-black"
    >
      {/* Slides */}
      <div className="relative w-full h-full">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/30" />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4 animate-fade-in">
              <p className="text-sm font-medium mb-2 animate-fade-in">
                {banner.subtitle}
              </p>
              <h1 className="text-3xl md:text-5xl font-bold mb-4 animate-fade-in">
                {banner.title}
              </h1>
              <p className="text-base md:text-lg mb-6 max-w-md animate-fade-in">
                {banner.description}
              </p>
              <a
                href={banner.ctaLink}
                className="px-6 py-3  bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full text-sm font-bold shadow-lg font-medium hover:scale-105 transition-transform duration-300 animate-fade-in"
              >
                {banner.cta}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-orange-500/80 hover:bg-orange-600/90 text-white rounded-full flex items-center justify-center backdrop-blur-sm"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-orange-500/80 hover:bg-orange-600/90 text-white rounded-full flex items-center justify-center backdrop-blur-sm"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide
                ? "bg-white"
                : "bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>

      {/* Play/Pause Button */}
      <button
        onClick={toggleAutoplay}
        className="absolute top-4 right-4 w-10 h-10 bg-orange-500/80 hover:bg-orange-600/90 text-white rounded-full flex items-center justify-center backdrop-blur-sm"
      >
        {isAutoPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
      </button>
    </div>
  );
};

export default HeroSection;
