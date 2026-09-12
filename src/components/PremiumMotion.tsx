import { useEffect } from 'react';

const REVEAL_SELECTOR = [
  'main section > .container',
  'main section > div.container',
  'main article',
  '.club-card',
  '[data-premium-reveal]',
].join(',');

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

      window.addEventListener('pointermove', updatePointer, { passive: true });
      updateScroll();
      window.addEventListener('scroll', updateScroll, { passive: true });

      return () => {
        observer.disconnect();
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
