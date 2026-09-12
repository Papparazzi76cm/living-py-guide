import { useEffect } from 'react';
import '@/premium-overrides.css';

const REVEAL_SELECTOR = [
  'main section > .container',
  'main section > div.container',
  'main article',
  '.club-card',
  '[data-premium-reveal]',
].join(',');

const CARD_SELECTOR = '.premium-card, .club-card';

export const PremiumMotion = () => {
  useEffect(() => {
    const root = document.documentElement;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const updatePointer = (event: PointerEvent) => {
      root.style.setProperty('--pointer-x', `${event.clientX}px`);
      root.style.setProperty('--pointer-y', `${event.clientY}px`);
    };

    const updateScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      root.style.setProperty('--scroll-progress', String(progress));
    };

    const revealNodes = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));
    const cards = Array.from(document.querySelectorAll<HTMLElement>(CARD_SELECTOR));
    const cardCleanups: Array<() => void> = [];

    if (prefersReducedMotion) {
      revealNodes.forEach((node) => node.classList.add('premium-reveal', 'is-visible'));
    } else {
      revealNodes.forEach((node, index) => {
        node.classList.add('premium-reveal');
        node.style.setProperty('--reveal-delay', `${Math.min((index % 4) * 70, 210)}ms`);
      });

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              (entry.target as HTMLElement).classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
      );

      revealNodes.forEach((node) => observer.observe(node));

      cards.forEach((card) => {
        const handleCardPointer = (event: PointerEvent) => {
          const rect = card.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width;
          const y = (event.clientY - rect.top) / rect.height;
          card.style.setProperty('--card-x', `${x * 100}%`);
          card.style.setProperty('--card-y', `${y * 100}%`);
          card.style.setProperty('--tilt-y', `${(x - 0.5) * 3.2}deg`);
          card.style.setProperty('--tilt-x', `${(0.5 - y) * 3.2}deg`);
        };

        const resetCard = () => {
          card.style.setProperty('--tilt-x', '0deg');
          card.style.setProperty('--tilt-y', '0deg');
        };

        card.addEventListener('pointermove', handleCardPointer, { passive: true });
        card.addEventListener('pointerleave', resetCard, { passive: true });
        cardCleanups.push(() => {
          card.removeEventListener('pointermove', handleCardPointer);
          card.removeEventListener('pointerleave', resetCard);
        });
      });

      window.addEventListener('pointermove', updatePointer, { passive: true });
      updateScroll();
      window.addEventListener('scroll', updateScroll, { passive: true });

      return () => {
        observer.disconnect();
        cardCleanups.forEach((cleanup) => cleanup());
        window.removeEventListener('pointermove', updatePointer);
        window.removeEventListener('scroll', updateScroll);
      };
    }

    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });

    return () => window.removeEventListener('scroll', updateScroll);
  }, []);

  return (
    <>
      <div className="premium-scroll-progress" aria-hidden />
      <div className="premium-cursor-glow" aria-hidden />
    </>
  );
};
