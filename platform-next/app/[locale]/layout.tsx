import { notFound } from 'next/navigation';

const supportedLocales = ['es', 'pt', 'de', 'en'] as const;

type Locale = (typeof supportedLocales)[number];

export default async function LocaleLayout({ children, params }: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!supportedLocales.includes(locale as Locale)) notFound();
  return <div className="lp-shell">{children}</div>;
}
