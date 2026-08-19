import { Link } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';
import {
  PartnerCategory,
  CATEGORY_STATUS_LABEL,
} from '@/data/clubData';
import {
  DEFAULT_PARTNER_ZONE,
  getMembershipTierConfig,
  getPartnerZoneConfig,
  getRegionalCategoryStatus,
  getSeatsTakenForZone,
  isOpenCategory,
  type PartnerZoneSlug,
} from '@/data/membershipCatalog';

const statusStyles: Record<string, string> = {
  available: 'bg-secondary/10 text-secondary border-secondary/20',
  'last-seats': 'bg-clay-soft text-clay border-clay/30',
  exclusive: 'bg-ink text-sand border-ink',
};

interface Props {
  category: PartnerCategory;
  compact?: boolean;
  zoneSlug?: PartnerZoneSlug;
}

export const CategoryCard = ({ category, compact = false, zoneSlug = DEFAULT_PARTNER_ZONE }: Props) => {
  const status = getRegionalCategoryStatus(category, zoneSlug);
  const tier = getMembershipTierConfig(category);
  const zone = getPartnerZoneConfig(zoneSlug);
  const open = isOpenCategory(category);
  const seatsTaken = getSeatsTakenForZone(category, zoneSlug);
  const free = Math.max(zone.maxSeats - seatsTaken, 0);
  const showDemoPartners = zoneSlug === DEFAULT_PARTNER_ZONE && Boolean(category.demoPartners?.length);

  return (
    <article className="club-card group flex h-full flex-col rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-base sm:text-lg font-semibold leading-snug text-ink">{category.name}</h3>
        <span
          className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusStyles[status]}`}
        >
          {status === 'exclusive' && <Lock className="mr-1 inline h-3 w-3" aria-hidden />}
          {open ? 'Categoría abierta' : CATEGORY_STATUS_LABEL[status]}
        </span>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2 text-[11px] font-semibold">
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-primary">Categoría {tier.tier}</span>
        <span className="rounded-full bg-muted px-2.5 py-1 text-muted-foreground">{zone.shortName}</span>
      </div>

      <p className="mb-5 text-sm leading-relaxed text-muted-foreground">{category.description}</p>

      <div className="mt-auto space-y-3">
        {open ? (
          <p className="rounded-xl bg-muted/60 px-3 py-2 text-xs font-medium text-muted-foreground">
            Modelo abierto · sin bloqueo por exclusividad
          </p>
        ) : (
          <>
            <div className="flex items-center gap-1.5" aria-hidden>
              {Array.from({ length: zone.maxSeats }).map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 flex-1 rounded-full ${
                    i < seatsTaken
                      ? status === 'exclusive'
                        ? 'bg-ink'
                        : 'bg-primary'
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs font-medium text-muted-foreground">
              {status === 'exclusive'
                ? 'Categoría bloqueada en exclusividad'
                : `${free} de ${zone.maxSeats} plazas disponibles en ${zone.shortName}`}
            </p>
          </>
        )}

        {!compact && (
          <div className="flex flex-wrap gap-2 pt-1">
            {showDemoPartners ? (
              <Link
                to={`/profesionales#${category.slug}`}
                className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-muted"
              >
                Ver profesionales
              </Link>
            ) : null}
            {status !== 'exclusive' && (
              <Link
                to={`/ser-partner?categoria=${category.slug}&zona=${zoneSlug}`}
                className="inline-flex items-center gap-1 rounded-lg bg-ink px-3 py-2 text-sm font-semibold text-sand transition-colors hover:bg-ink-soft"
              >
                Postular
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>
        )}
      </div>
    </article>
  );
};
