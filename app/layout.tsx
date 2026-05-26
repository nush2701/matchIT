import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';
import ClientLayout from '@/components/ClientLayout';

// Display: heavy, vintage-serif substitute for WindsorEF
const display = Fraunces({
  subsets: ['latin'],
  weight: ['700', '900'],
  variable: '--font-windsoref',
  display: 'swap',
});

// Body: Inter (the Ano substitute)
const body = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ano',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'matchIT',
  description: 'StyleSense Outfit Recommender',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
