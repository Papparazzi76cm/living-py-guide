import { useEffect } from 'react';
import { ACTIVE_MARKET } from '@/config/network';

export const BrandThemeSync = () => {
  useEffect(() => {
    const root = document.documentElement;
    const { theme, slug, countryCode } = ACTIVE_MARKET;

    root.dataset.market = slug;
    root.dataset.country = countryCode.toLowerCase();

    const vars: Record<string, string> = {
      '--primary': theme.primary,
      '--primary-hover': theme.primaryHover,
      '--secondary': theme.secondary,
      '--secondary-hover': theme.secondaryHover,
      '--foreground': theme.foreground,
      '--ring': theme.ring,
      '--py-red': theme.primary,
      '--py-blue': theme.secondary,
      '--py-blue-dark': theme.deep,
    };

    Object.entries(vars).forEach(([name, value]) => root.style.setProperty(name, value));

    return () => {
      delete root.dataset.market;
      delete root.dataset.country;
      Object.keys(vars).forEach((name) => root.style.removeProperty(name));
    };
  }, []);

  return null;
};
