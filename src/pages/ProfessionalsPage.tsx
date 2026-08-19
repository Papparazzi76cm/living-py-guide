import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Info, MapPin } from 'lucide-react';
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
    return ALL_PARTNER_CATEGORIES.filter((c) => {
      const tier = getMembershipTier(c);
      const tierConfig = MEMBERSHIP_TIERS[tier];
      const matchesQuery = !q
        || c.name.toLowerCase().includes(q)
        || c.description.toLowerCase().includes(q)
        || tierConfig.ticketProfile.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || getRegionalCategoryStatus(c, zoneSlug) === statusFilter;
      const matchesTier = tierFilter === 'all' || tier === tierFilter;
      return matchesQuery && matchesStatus && matchesTier;
    });
  }, [query, statusFilter, tierFilter, zoneSlug]);

  return (
    <Layout title="Directorio de profesionales verificados" description="Categorías profesionales del Living Paraguay Business Club por zona y nivel de membresía A, B, C y D." noHeaderPadding>
      <section className="bg-ink pb-14 pt-28 sm:pb-20 sm:pt-40">
        <div className="container mx-auto px-4 sm:px-6">
          <p className="club-eyebrow text-primary">Directorio del Club</p>
          <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-5xl" style={{ color: 'hsl(var(--py-white))' }}>Profesionales verificados, zona por zona.</h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
            Gran Asunción admite hasta 5 miembros por rubro en A, B y C. Itapúa (Encarnación) y Ciudad del Este admiten hasta 3. La categoría D mantiene un modelo abierto y sin exclusividad.
          </p>

          <div className="mt-8 rounded-2xl border border-white/15 bg-white/5 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
              <MapPin className="h-4 w-4 text-primary" /> Zona del directorio
            </div>
            <div className="-mx-2 flex gap-2 overflow-x-auto px-2 pb-1">
              {PARTNER_ZONE_ORDER.map((slug) => {
                const item = PARTNER_ZONES[slug];
                return (
                  <button
                    key={slug}
                    type="button"
                    onClick={() => setZoneSlug(slug)}
                    className={`shrink-0 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${zoneSlug === slug ? 'border-primary bg-primary text-primary-foreground' : 'border-white/20 text-white/80 hover:bg-white/10'}`}
                  >
                    {item.shortName}
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-white/55">{zone.coverage} · {zone.maxSeats} plazas máximas por rubro A-C.</p>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
              <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar categoría: contadores, escribanía, seguros…" aria-label="Buscar categoría profesional" className="w-full rounded-xl border border-white/20 bg-white/10 py-3.5 pl-12 pr-4 text-sm text-white outline-none backdrop-blur placeholder:text-white/40 focus:ring-2 focus:ring-primary" />
            </div>

            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:px-0">
              {TIER_FILTERS.map((f) => (
                <button key={f.key} onClick={() => setTierFilter(f.key)} className={`shrink-0 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${tierFilter === f.key ? 'border-primary bg-primary text-primary-foreground' : 'border-white/20 text-white/80 hover:bg-white/10'}`}>{f.label}</button>
              ))}
            </div>

            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:px-0">
              {STATUS_FILTERS.map((f) => (
                <button key={f.key} onClick={() => setStatusFilter(f.key)} className={`shrink-0 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${statusFilter === f.key ? 'border-white bg-white text-ink' : 'border-white/20 text-white/80 hover:bg-white/10'}`}>{f.label}</button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-sand py-14 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-8 flex items-start gap-3 rounded-2xl border border-border bg-card p-4 text-xs leading-relaxed text-muted-foreground sm:text-sm">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p>MVP en validación: plazas, estados y perfiles de ejemplo no representan membresías confirmadas. La disponibilidad se gestiona de forma independiente en cada zona.</p>
          </div>

          {results.length === 0 ? <p className="py-16 text-center text-muted-foreground">No encontramos categorías con ese criterio.</p> : (
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {results.map((c) => <div key={c.slug} id={c.slug} className="scroll-mt-28"><CategoryCard category={c} zoneSlug={zoneSlug} /></div>)}
            </div>
          )}

          <div className="mt-14 rounded-3xl border border-border bg-card p-7 text-center sm:p-10">
            <h2 className="text-xl font-bold text-ink sm:text-2xl">¿No ves tu categoría?</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">Abrimos nuevas categorías cuando detectamos demanda real en la comunidad. Cuéntanos qué haces y lo evaluamos para {zone.shortName}.</p>
            <Link to={`/ser-partner?zona=${zoneSlug}`} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-ink px-6 py-3.5 font-semibold text-sand transition-colors hover:bg-ink-soft">Postular al Club <ArrowRight className="h-5 w-5" /></Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProfessionalsPage;
