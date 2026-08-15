import type { Metadata, Viewport } from 'next';
import { Noto_Serif_SC, Lora, Space_Mono } from 'next/font/google';
import { SITE_URL, jsonLd } from '@/lib/seo';
import './globals.css';

const notoSerifSC = Noto_Serif_SC({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-noto-serif-sc',
});

const lora = Lora({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-lora',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-space-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Китайский гороскоп на 2026 — Прогноз по году рождения',
  description:
    'Персональный прогноз по китайскому гороскопу на 2026 год Огненной Змеи. Узнай что ждёт твой знак в любви, карьере, финансах и здоровье. Бесплатно по году рождения.',
  keywords: [
    'китайский гороскоп',
    'китайский гороскоп 2026',
    'гороскоп по году рождения',
    'китайский гороскоп на 2026 год',
    'год змеи 2026',
    'китайский зодиак',
    'знак китайского зодиака',
    'китайский гороскоп дракон 2026',
    'китайский гороскоп крыса 2026',
    'китайский гороскоп тигр 2026',
    'китайский гороскоп кролик 2026',
    'китайский гороскоп лошадь 2026',
    'китайский гороскоп обезьяна 2026',
    'китайский гороскоп петух 2026',
    'прогноз на 2026 год',
    'год огненной змеи',
    'восточный гороскоп 2026',
    'гороскоп по знаку зодиака 2026',
  ],
  authors: [{ name: 'Евдокимов Даниил Владимирович' }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: SITE_URL,
    siteName: 'Китайский гороскоп 2026',
    title: 'Китайский гороскоп на 2026 — Прогноз по году рождения',
    description:
      'Персональный прогноз по китайскому гороскопу на 2026 год Огненной Змеи. Узнай что ждёт твой знак в любви, карьере, финансах и здоровье.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Китайский гороскоп на 2026 — Прогноз по году рождения',
    description:
      'Персональный прогноз по китайскому гороскопу на 2026 год Огненной Змеи. Бесплатный расчёт по году рождения.',
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: { url: '/favicon.svg' },
  },
};

export const viewport: Viewport = {
  themeColor: '#0A0604',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${notoSerifSC.variable} ${lora.variable} ${spaceMono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
