import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Rising Home — Find Your Perfect Place',
  description:
    'Browse Chicago neighborhoods, compare properties, and get instant guidance from Starry — your AI home-finding guide.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-slate-50 antialiased">{children}</body>
    </html>
  );
}
