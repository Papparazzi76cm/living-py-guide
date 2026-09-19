import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://livingparaguay.com'),
  title: {
    default: 'Living Paraguay',
    template: '%s | Living Paraguay'
  },
  description: 'Información práctica y verificada para vivir, estudiar, invertir y hacer negocios en Paraguay.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
