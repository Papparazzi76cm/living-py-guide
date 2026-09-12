import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Info, MapPin, Search, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import { Layout } from '../components/Layout';
import { CategoryCard } from '../components/club/CategoryCard';
import { CategoryStatus } from '../data/clubData';
import {
  ALL_PARTNER_CATEGORIES,
  DEFAULT_PARTNER_ZONE,
  getMembershipTier,
  getPartnerZoneConfig,
  getRegionalCategoryStatus,
  MEMBERSHIP_TIERS,
  PARTNER_ZONE_ORDER,
  PARTNER_ZONES,
  type MembershipTier,
  type PartnerZoneSlug,
} from '../data/membershipCatalog';

const STATUS_FILTERS: { key: CategoryStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'Todas' },
  { key: 'available', label: 'Disponible' },
  { key: 'last-seats', label: 'Últimas plazas' },
  { key: 'exclusive', label: 'Exclusivas' },
];

const TIER_FILTERS: { key: MembershipTier | 'all'; label: string }[] = [
  { key: 'all', label: 'A–D' },
  { key: 'A', label: 'Categoría A' },
  { key: 'B', label: 'Categoría B' },
  { key: 'C', label: 'Categoría C' },
  { key: 'D', label: 'Categoría D · abierta' },
];

const ProfessionalsPage = () => {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CategoryStatus | 'all'>('all');
  const [tierFilter, setTierFilter] = useState<MembershipTier | 'all'>('all');
  const [zoneSlug, setZoneSlug] = useState<PartnerZoneSlug>(DEFAULT_PARTNER_ZONE);
  const zone = getPartnerZoneConfig(zoneSlug);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_PARTNER_CATEGORIES.filter((category) => {
      const tier = getMembershipTier(category);
      const tierConfig = MEMBERSHIP_TIERS[tier];
      const matchesQuery = !q
        || category.name.toLowerCase().includes(q)
        || category.description.toLowerCase().includes(q)
        || tierConfig.ticketProfile.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || getRegionalCategoryStatus(category, zoneSlug) === statusFilter;
      const matchesTier = tierFilter === 'all' || tier === tierFilter;
      return matchesQuery && matchesStatus && matchesTier;
    });
  }, [query, statusFilter, tierFilter, zoneSlug]);

  return (
    <Layout title="Directorio de profesionales verificados" description="Categorías profesionales del Living Paraguay Business Club por zona y nivel de membresía A, B, C y D." noHeaderPadding>
      <section className="bg-ink pb-16 pt-36 sm:pb-24 sm:pt-44">
        <div className="container mx-auto px-5 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="premium-kicker text-primary">Directorio del Club</p>
              <h1 className="premium-display mt-5 !text-white">
                Profesionales verificados, <span className="premium-serif text-white/[0.9]">zona por zona.</span>
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-8 text-white/60">
                Explora categorías por territorio y tipo de servicio. La idea no es darte una lista infinita: es ayudarte a filtrar mejor antes de contactar.
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                <span className="premium-chip"><ShieldCheck className="h-4 w-4 text-primary" /> Red verificada</span>
                <span className="premium-chip"><MapPin className="h-4 w-4 text-primary" /> Tres zonas activas</span>
              </div>
            </div>

            <div className="premium-glass rounded-[2rem] p-5 sm:p-6">
              <div className="mb-5 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/[0.38]">
                <SlidersHorizontal className="h-4 w-4 text-primary" /> Ajusta tu búsqueda
              </div>

              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Contadores, escribanía, seguros…"
                  aria-label="Buscar categoría profesional"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.07] py-3.5 pl-12 pr-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div className="mt-4">
                <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/30">Zona</p>
                <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
                  {PARTNER_ZONE_ORDER.map((slug) => {
                    const item = PARTNER_ZONES[slug];
                    return (
                      <button
                        key={slug}
                        type="button"
                        onClick={() => setZoneSlug(slug)}
                        className={`shrink-0 rounded-full border px-4 py-2.5 text-xs font-bold transition-all ${zoneSlug === slug ? 'border-primary bg-primary text-white shadow-lg' : 'border-white/10 bg-white/[0.04] text-white/60 hover:bg-white/[0.08] hover:text-white'}`}
                      >
                        {item.shortName}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/30">Nivel</p>
                  <div className="flex flex-wrap gap-2">
                    {TIER_FILTERS.map((filter) => (
                      <button
                        key={filter.key}
                        type="button"
                        onClick={() => setTierFilter(filter.key)}
                        className={`rounded-full border px-3 py-2 text-[11px] font-bold transition-all ${tierFilter === filter.key ? 'border-white bg-white text-ink' : 'border-white/10 text-white/50 hover:bg-white/[0.06] hover:text-white'}`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/30">Estado</p>
                  <div className="flex flex-wrap gap-2">
                    {STATUS_FILTERS.map((filter) => (
                      <button
                        key={filter.key}
                        type="button"
                        onClick={() => setStatusFilter(filter.key)}
                        className={`rounded-full border px-3 py-2 text-[11px] font-bold transition-all ${statusFilter === filter.key ? 'border-white bg-white text-ink' : 'border-white/10 text-white/50 hover:bg-white/[0.06] hover:text-white'}`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs text-white/40">
                <span>{zone.coverage}</span>
                <strong className="font-bold text-white/70">{results.length} categorías</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="premium-section bg-gradient-sand">
        <div className="container mx-auto px-5 sm:px-6">
          <div className="mb-8 flex items-start gap-3 rounded-2xl border border-ink/[0.07] bg-white/60 p-4 text-xs leading-6 text-muted-foreground backdrop-blur-sm sm:text-sm">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p>MVP en validación: plazas, estados y perfiles de ejemplo no representan membresías confirmadas. La disponibilidad se gestiona de forma independiente en cada zona.</p>
          </div>

          {results.length === 0 ? (
            <div className="premium-panel py-16 text-center">
              <p className="text-sm font-semibold text-muted-foreground">No encontramos categorías con ese criterio.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {results.map((category) => (
                <div key={category.slug} id={category.slug} className="scroll-mt-32">
                  <CategoryCard category={category} zoneSlug={zoneSlug} />
                </div>
              ))}
            </div>
          )}

          <div className="mt-14 overflow-hidden rounded-[2rem] bg-ink p-7 text-left shadow-[0_35px_90px_-45px_rgba(8,16,29,.8)] sm:p-10 lg:flex lg:items-end lg:justify-between lg:gap-10">
            <div>
              <p className="premium-kicker text-primary">¿No encuentras lo que necesitas?</p>
              <h2 className="premium-display mt-4 max-w-3xl text-3xl !text-white sm:text-4xl">Cuéntanos el problema, no el nombre del profesional.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55">Te orientaremos sobre el tipo de servicio que puede encajar mejor en {zone.shortName}.</p>
            </div>
            <Link to="/contact" className="premium-button mt-7 shrink-0 lg:mt-0">
              Contactar <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProfessionalsPage;
