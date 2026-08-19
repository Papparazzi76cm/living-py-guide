import { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from './Header';
import { Footer } from './Footer';
import { Chatbot } from './Chatbot';
import { Breadcrumbs } from './Breadcrumbs';
import { ACTIVE_MARKET, LBC_NETWORK } from '@/config/network';

interface LayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  canonical?: string;
  noHeaderPadding?: boolean;
}

export const Layout = ({ children, title, description, canonical, noHeaderPadding = false }: LayoutProps) => {
  const fullTitle = `${title} | ${ACTIVE_MARKET.brandName}`;
  const baseUrl = ACTIVE_MARKET.baseUrl ?? 'https://livingparaguay.com';
  const canonicalUrl = canonical || `${baseUrl}${window.location.pathname}`;

  return (
    <>
      <Helmet>
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={`${baseUrl}/og-image.jpg`} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`${baseUrl}/og-image.jpg`} />

        <html lang={ACTIVE_MARKET.locale.split('-')[0]} />

        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ProfessionalService',
            name: ACTIVE_MARKET.brandName,
            description,
            url: baseUrl,
            logo: `${baseUrl}/og-image.jpg`,
            image: `${baseUrl}/og-image.jpg`,
            parentOrganization: {
              '@type': 'Organization',
              name: LBC_NETWORK.name,
            },
            address: {
              '@type': 'PostalAddress',
              addressCountry: ACTIVE_MARKET.countryCode,
            },
            areaServed: {
              '@type': 'Country',
              name: ACTIVE_MARKET.countryName,
            },
            serviceType: [
              'Comunidad de expatriados',
              'Directorio profesional verificado',
              'Business Club',
              'Relocation y soft landing',
            ],
          })}
        </script>
      </Helmet>

      <div className="min-h-screen">
        <Header />
        {!noHeaderPadding && <div className="pt-16 sm:pt-20"><Breadcrumbs /></div>}
        <main>{children}</main>
        <Footer />
        <Chatbot />
      </div>
    </>
  );
};
