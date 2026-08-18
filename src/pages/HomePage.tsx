import { Helmet } from 'react-helmet-async';
import { Layout } from '../components/Layout';
import {
  ClubHero,
  NeedsSection,
  HowItWorksSection,
  PartnerPitchSection,
  ScarcitySection,
  GuaranteeSection,
  CommunitySection,
  ResourcesSection,
  FinalCtaSection,
} from '../components/club/HomeSections';

const HomePage = () => (
  <Layout
    title="Living Paraguay Business Club"
    description="La comunidad que conecta a expatriados que llegan a Paraguay con recursos prácticos, eventos y una red limitada de profesionales verificados."
    canonical="https://livingparaguay.com/"
    noHeaderPadding
  >
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Living Paraguay',
          url: 'https://livingparaguay.com',
          description: 'Comunidad y red profesional para expatriados que viven, se instalan o emprenden en Paraguay.',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'PY',
            addressLocality: 'Asunción',
          },
        })}
      </script>
    </Helmet>
    <ClubHero />
    <NeedsSection />
    <HowItWorksSection />
    <PartnerPitchSection />
    <ScarcitySection />
    <GuaranteeSection />
    <CommunitySection />
    <ResourcesSection />
    <FinalCtaSection />
  </Layout>
);

export default HomePage;
