import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from './Icon';
import { LanguageSelector } from './LanguageSelector';
import { BrandLockup } from './brand/BrandLockup';
import { ACTIVE_MARKET, LBC_NETWORK } from '@/config/network';

export const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Inicio' },
    { path: '/vivir-en-paraguay', label: `Vivir en ${ACTIVE_MARKET.countryName}` },
    { path: '/servicios', label: 'Servicios' },
    { path: '/comunidad', label: 'Comunidad' },
    { path: '/recursos', label: 'Recursos' },
    { path: '/ser-partner', label: 'Alta gratuita' },
    { path: '/mi-cuenta', label: 'Mi cuenta' },
    { path: '/lbc', label: `Red ${LBC_NETWORK.initials}` },
  ];

  const isActivePath = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-border/70 bg-white/95 shadow-sm backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between sm:h-20">
            <Link to="/" className="flex items-center transition-opacity hover:opacity-80" aria-label={`${ACTIVE_MARKET.brandName} - Inicio`}>
              <BrandLockup market={ACTIVE_MARKET} compact />
            </Link>

            <nav className="hidden items-center gap-4 xl:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative text-sm font-semibold transition-colors ${
                    isActivePath(link.path) ? 'text-primary' : 'text-ink hover:text-primary'
                  }`}
                >
                  {link.label}
                  {isActivePath(link.path) && <span className="absolute -bottom-2 left-0 right-0 h-0.5 rounded-full bg-primary" />}
                </Link>
              ))}
            </nav>

            <div className="hidden items-center gap-3 xl:flex">
              <LanguageSelector />
              <Link
                to="/servicios"
                className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover"
              >
                Buscar servicios
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className="rounded-lg p-2 text-ink transition-colors hover:bg-muted hover:text-primary xl:hidden"
              aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={isMobileMenuOpen}
            >
              <Icon name={isMobileMenuOpen ? 'close' : 'menu'} size={28} />
            </button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 xl:hidden">
          <button className="fixed inset-0 bg-black/40" onClick={() => setIsMobileMenuOpen(false)} aria-label="Cerrar menú" />
          <nav className="fixed bottom-0 right-0 top-16 w-[min(86vw,340px)] overflow-y-auto bg-white p-6 shadow-2xl sm:top-20">
            <div className="mb-5 border-b border-border pb-5"><LanguageSelector /></div>
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`rounded-xl px-4 py-3 text-left font-semibold transition-colors ${
                    isActivePath(link.path) ? 'bg-primary text-primary-foreground' : 'text-ink hover:bg-muted'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/servicios"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-4 rounded-xl bg-primary px-4 py-3 text-center font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                Buscar servicios
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};
