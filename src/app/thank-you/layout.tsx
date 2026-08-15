import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Прогноз на 2026 готовится — Китайский гороскоп',
  description: 'Оплата принята. Персональный прогноз по китайскому гороскопу на 2026 год готовится.',
  robots: { index: false, follow: false },
};

export default function ThankYouLayout({ children }: { children: React.ReactNode }) {
  return children;
}
