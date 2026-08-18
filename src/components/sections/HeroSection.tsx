import { useState, useEffect } from 'react';
import { Page } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { PlayCircle, Loader2 } from 'lucide-react';
import heroAsuncion from '@/assets/hero-asuncion.webp';
import heroFamily from '@/assets/hero-family.webp';
import heroHomes from '@/assets/hero-homes.webp';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';

const HERO_SLIDE_COUNT = 3;

interface HeroSectionProps {
  onNavigate: (page: Page) => void;
}

export const HeroSection = ({ onNavigate }: HeroSectionProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const { t } = useLanguage();

  const handleOpenVideo = () => {
    setIsVideoLoading(true);
    setIsVideoOpen(true);
  };

  const HERO_SLIDES = [
    {
      image: heroAsuncion,
      title: t.hero.slide1Title,
      subtitle: t.hero.slide1Subtitle,
    },
    {
      image: heroFamily,
      title: t.hero.slide2Title,
      subtitle: t.hero.slide2Subtitle,
    },
    {
      image: heroHomes,
      title: t.hero.slide3Title,
      subtitle: t.hero.slide3Subtitle,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDE_COUNT);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[calc(100vh-4rem)] sm:h-screen w-full overflow-hidden">
      {/* Background Images with Transitions */}
      {HERO_SLIDES.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.image}
            alt={`Vista de ${index === 0 ? 'Asunción' : index === 1 ? 'familia en Paraguay' : 'propiedades en Paraguay'}`}
            className="w-full h-full object-cover"
            loading={index === 0 ? 'eager' : 'lazy'}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-py-blue-dark/70 via-py-blue-dark/50 to-py-blue-dark/70"></div>
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl">
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 animate-fade-in leading-tight">
              {HERO_SLIDES[currentSlide].title}
            </h1>
            <p className="text-white/90 text-base sm:text-lg md:text-xl lg:text-2xl mb-8 sm:mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {HERO_SLIDES[currentSlide].subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <button
                onClick={() => onNavigate('permits')}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground rounded-lg font-bold text-base sm:text-lg hover:bg-primary-hover transition-all hover:shadow-glow-red hover:-translate-y-1"
              >
                {t.hero.exploreCTA}
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white/10 text-white border-2 border-white rounded-lg font-bold text-base sm:text-lg hover:bg-white hover:text-py-blue-dark transition-all hover:-translate-y-1 backdrop-blur-sm"
              >
                {t.hero.contactCTA}
              </button>
            </div>

            {/* Video Play Button - Mobile */}
            <div className="flex justify-center mt-6 sm:hidden animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <button
                onClick={handleOpenVideo}
                className="group flex items-center justify-center"
                aria-label="Reproducir video"
              >
                <div className="relative">
                  <PlayCircle 
                    className="w-16 h-16 text-white transition-all duration-300 group-hover:text-py-red group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(230,0,0,0.8)] cursor-pointer" 
                    strokeWidth={1.5}
                  />
                  <div className="absolute inset-0 bg-white/0 rounded-full group-hover:bg-white/10 transition-all duration-300 group-hover:scale-125"></div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Video Play Button - Desktop */}
        <div className="hidden sm:block absolute right-8 sm:right-12 md:right-16 top-1/2 transform -translate-y-1/2">
          <button
            onClick={handleOpenVideo}
            className="group flex items-center justify-center"
            aria-label="Reproducir video"
          >
            <div className="relative">
              <PlayCircle 
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-white transition-all duration-300 group-hover:text-py-red group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(230,0,0,0.8)] cursor-pointer" 
                strokeWidth={1.5}
              />
              <div className="absolute inset-0 bg-white/0 rounded-full group-hover:bg-white/10 transition-all duration-300 group-hover:scale-125"></div>
            </div>
          </button>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {HERO_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>

      {/* Video Modal */}
      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="max-w-4xl w-[95vw] p-0 bg-black border-0 rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(230,0,0,0.3)]">
          <DialogTitle className="sr-only">Video de YouTube</DialogTitle>
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            {/* Loading Spinner */}
            {isVideoLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black z-10 animate-fade-in">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-12 h-12 text-primary animate-spin" />
                  <p className="text-white/70 text-sm animate-pulse">Cargando video...</p>
                </div>
              </div>
            )}
            <iframe
              className={`absolute top-0 left-0 w-full h-full rounded-2xl transition-opacity duration-500 ${isVideoLoading ? 'opacity-0' : 'opacity-100'}`}
              src={isVideoOpen ? "https://www.youtube.com/embed/eHWdZeIsDzo?autoplay=1" : ""}
              title="YouTube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={() => setIsVideoLoading(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};
