import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Icon } from './Icon';
import { useLanguage } from '../contexts/LanguageContext';
import { NewsletterForm } from './NewsletterForm';
import { BrandLockup } from './brand/BrandLockup';
import { ACTIVE_MARKET, LBC_NETWORK } from '@/config/network';

export const Footer = () => {
  const { t } = useLanguage();

  const navLinks = [
    { path: '/', label: 'Inicio' },
    { path: '/vivir-en-paraguay', label: `Vivir en ${ACTIVE_MARKET.countryName}` },
    { path: '/profesionales', label: 'Profesionales' },
    { path: '/comunidad', label: 'Comunidad' },
    { path: '/recursos', label: 'Recursos' },
    { path: '/lbc', label: `Red ${LBC_NETWORK.initials}` },
  ];

  const socialLinks = {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com',
  };

  return (
    <footer className="premium-footer text-white">
      <div className="container relative z-10 mx-auto px-5 pb-8 pt-20 sm:px-6 sm:pt-28">
        <div className="mb-16 grid gap-10 border-b border-white/10 pb-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="premium-kicker text-primary">Tu nueva vida empieza antes de aterrizar</p>
            <h2 className="premium-display mt-5 max-w-4xl text-4xl text-white sm:text-5xl lg:text-6xl">
              Paraguay se entiende mejor cuando tienes una <span className="premium-serif text-white/90">red de confianza.</span>
            </h2>
          </div>
          <div className="lg:justify-self-end">
            <Link to="/vivir-en-paraguay" className="premium-button">
              Empezar por aquí <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.75fr_0.75fr_1.1fr]">
          <div>
            <BrandLockup market={ACTIVE_MARKET} inverted />
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/58">
              Comunidad, recursos y profesionales verificados para vivir, instalarse y emprender en {ACTIVE_MARKET.countryName} con más contexto y menos fricción.
            </p>
            <Link
              to="/lbc"
              className="mt-7 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 transition-all hover:-translate-y-1 hover:bg-white/[0.08]"
              aria-label={`Conocer ${LBC_NETWORK.name}`}
            >
              <BrandLockup variant="network" inverted compact />
              <ArrowUpRight className="h-4 w-4 text-white/45" />
            </Link>
          </div>

          <div>
            <p className="mb-5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-white/38">Explorar</p>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="group inline-flex items-center gap-2 text-sm font-medium text-white/66 transition-colors hover:text-white">
                    <span>{link.label}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-white/38">Guías clave</p>
            <ul className="space-y-3">
              <li><Link to="/permits" className="text-sm font-medium text-white/66 transition-colors hover:text-white">Residencia y cédula</Link></li>
              <li><Link to="/taxation" className="text-sm font-medium text-white/66 transition-colors hover:text-white">Fiscalidad</Link></li>
              <li><Link to="/schools" className="text-sm font-medium text-white/66 transition-colors hover:text-white">Colegios</Link></li>
              <li><Link to="/blog" className="text-sm font-medium text-white/66 transition-colors hover:text-white">Blog</Link></li>
            </ul>

            <p className="mb-4 mt-8 text-[11px] font-extrabold uppercase tracking-[0.2em] text-white/38">{t.footer.followUs}</p>
            <div className="flex gap-2.5">
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.045] text-white/70 transition-all hover:-translate-y-1 hover:border-primary/50 hover:bg-primary hover:text-white" aria-label="Facebook"><Icon name="facebook" size={17} /></a>
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.045] text-white/70 transition-all hover:-translate-y-1 hover:border-primary/50 hover:bg-primary hover:text-white" aria-label="Instagram"><Icon name="instagram" size={17} /></a>
              <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.045] text-white/70 transition-all hover:-translate-y-1 hover:border-primary/50 hover:bg-primary hover:text-white" aria-label="YouTube"><Icon name="youtube" size={17} /></a>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur-sm sm:p-6">
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-7 text-xs text-white/36 sm:flex-row sm:items-center sm:justify-between">
          <p>{t.footer.copyright}</p>
          <p>{ACTIVE_MARKET.brandName} · Delegación de {LBC_NETWORK.name}</p>
        </div>
      </div>
    </footer>
  );
};
