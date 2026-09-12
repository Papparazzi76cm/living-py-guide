import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
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
    { path: '/profesionales', label: 'Profesionales' },
    { path: '/comunidad', label: 'Comunidad' },
    { path: '/recursos', label: 'Recursos' },
    { path: '/lbc', label: `Red ${LBC_NETWORK.initials}` },
  ];

  const isActivePath = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
        <div className="premium-nav-shell pointer-events-auto mx-auto flex max-w-[1380px] items-center justify-between rounded-[1.35rem] px-3 py-1.5 sm:px-4">
          <Link
            to="/"
            className="relative z-10 flex shrink-0 items-center transition-transform duration-300 hover:scale-[1.02]"
            aria-label={`${ACTIVE_MARKET.brandName} - Inicio`}
          >
            <BrandLockup market={ACTIVE_MARKET} compact className="!h-12 sm:!h-14" />
          </Link>

          <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Navegación principal">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                data-active={isActivePath(link.path)}
                className="premium-nav-link"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 xl:flex">
            <div className="rounded-full border border-ink/5 bg-white/50 px-1 py-0.5">
              <LanguageSelector />
            </div>
            <Link to="/comunidad#unirme" className="premium-button min-h-0 !px-4 !py-2.5 !text-xs">
              Entrar al Club
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-white/65 text-ink shadow-sm transition-all hover:bg-white xl:hidden"
            aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isMobileMenuOpen}
          >
            <Icon name={isMobileMenuOpen ? 'close' : 'menu'} size={23} />
          </button>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 xl:hidden">
          <button
            className="fixed inset-0 bg-ink/55 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Cerrar menú"
          />
          <nav className="premium-nav-shell fixed inset-x-3 top-[5.45rem] max-h-[calc(100svh-6.5rem)] overflow-y-auto rounded-[1.75rem] p-5 shadow-2xl sm:inset-x-auto sm:right-5 sm:top-[6.25rem] sm:w-[380px]">
            <div className="mb-5 flex items-center justify-between border-b border-ink/10 pb-5">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-ink/45">Explorar Living Paraguay</p>
              <LanguageSelector />
            </div>
            <div className="flex flex-col gap-1.5">
              {navLinks.map((link, index) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`group flex items-center justify-between rounded-2xl px-4 py-3.5 font-semibold transition-all ${
                    isActivePath(link.path)
                      ? 'bg-ink text-white shadow-lg'
                      : 'text-ink hover:bg-white hover:shadow-sm'
                  }`}
                >
                  <span>{link.label}</span>
                  <span className={`text-[10px] font-bold ${isActivePath(link.path) ? 'text-white/45' : 'text-ink/30'}`}>
                    0{index + 1}
                  </span>
                </Link>
              ))}
              <Link
                to="/comunidad#unirme"
                onClick={() => setIsMobileMenuOpen(false)}
                className="premium-button mt-4 w-full"
              >
                Entrar a la comunidad <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};
