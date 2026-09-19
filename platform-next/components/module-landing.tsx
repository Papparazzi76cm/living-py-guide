import Link from 'next/link';

export type ModuleItem = {
  title: string;
  description: string;
  href: string;
  eyebrow?: string;
};

export function ModuleLanding({ eyebrow, title, intro, items }: { eyebrow: string; title: string; intro: string; items: ModuleItem[] }) {
  return (
    <main className="lp-container py-16 sm:py-24">
      <div className="max-w-3xl">
        <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
        <h1 className="mt-3 text-4xl font-extrabold sm:text-6xl">{title}</h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">{intro}</p>
      </div>
      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="lp-card group">
            {item.eyebrow ? <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-muted-foreground">{item.eyebrow}</span> : null}
            <h2 className="mt-3 text-2xl font-extrabold">{item.title}</h2>
            <p className="mt-3 leading-7 text-muted-foreground">{item.description}</p>
            <span className="mt-8 inline-flex font-bold text-ink group-hover:text-primary">Ver sección →</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
