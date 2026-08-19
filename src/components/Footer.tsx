import { Link } from 'react-router-dom';
import { Icon } from './Icon';
import { useLanguage } from '../contexts/LanguageContext';
import { NewsletterForm } from './NewsletterForm';
import { BrandLockup } from './brand/BrandLockup';
import logo from '@/assets/logo.png';
import { ACTIVE_MARKET, LBC_NETWORK } from '@/config/network';

export const Footer = () => {
  const { t } = useLanguage();

  const navLinks = [
    { path: '/', label: 'Inicio' },
    { path: '/vivir-en-paraguay', label: `Vivir en ${ACTIVE_MARKET.countryName}` },
    { path: '/profesionales', label: 'Profesionales' },
    { path: '/comunidad', label: 'Comunidad' },
    { path: '/recursos', label: 'Recursos' },
    { path: '/ser-partner', label: 'Ser Partner' },
    { path: '/lbc', label: `Red ${LBC_NETWORK.initials}` },
  ];

  const socialLinks = {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com',
  };

  return (
    <footer className="bg-py-blue-dark text-white">
      <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <div>
            <img src={logo} alt="Living Paraguay" className="mb-4 h-24 w-auto brightness-0 invert" />
            <p className="text-sm leading-relaxed text-gray-300">Comunidad, recursos y una red profesional para vivir, instalarse y emprender en {ACTIVE_MARKET.countryName}.</p>

            <Link
              to="/lbc"
              className="mt-6 inline-flex transition-opacity hover:opacity-85"
              aria-label={`Conocer ${LBC_NETWORK.name}`}
            >
              <BrandLockup variant="network" inverted />
            </Link>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-bold text-white">Explorar</h4>
            <ul className="space-y-2">
              {navLinks.map((link) => <li key={link.path}><Link to={link.path} className="text-gray-300 transition-colors hover:text-white">{link.label}</Link></li>)}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-bold text-white">Guías útiles</h4>
            <ul className="space-y-2">
              <li><Link to="/permits" className="text-gray-300 transition-colors hover:text-white">Residencia y cédula</Link></li>
              <li><Link to="/taxation" className="text-gray-300 transition-colors hover:text-white">Fiscalidad</Link></li>
              <li><Link to="/schools" className="text-gray-300 transition-colors hover:text-white">Colegios</Link></li>
              <li><Link to="/blog" className="text-gray-300 transition-colors hover:text-white">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-bold text-white">{t.footer.followUs}</h4>
            <div className="flex space-x-4">
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-primary" aria-label="Facebook"><Icon name="facebook" size={20} /></a>
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-primary" aria-label="Instagram"><Icon name="instagram" size={20} /></a>
              <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-primary" aria-label="YouTube"><Icon name="youtube" size={20} /></a>
            </div>
          </div>

          <div><NewsletterForm /></div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-sm text-gray-400">{t.footer.copyright}</p>
          <p className="mt-2 text-xs text-gray-500">{ACTIVE_MARKET.brandName} · Delegación de {LBC_NETWORK.name}</p>
        </div>
      </div>
    </footer>
  );
};
