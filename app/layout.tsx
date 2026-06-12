import type { Metadata } from 'next';
import './globals.css';
import { siteConfig } from '@/config/site';
import { fontMono, fontSans, fontSerif } from '@/lib/fonts';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
