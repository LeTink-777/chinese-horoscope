import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Твой знак китайского зодиака и прогноз на 2026',
  description:
    'Персональный прогноз по китайскому гороскопу на 2026 год Огненной Змеи: общий прогноз, лучшие и опасные месяцы, финансы, любовь, карьера и здоровье.',
  robots: { index: false, follow: true },
};

export default function ResultLayout({ children }: { children: React.ReactNode }) {
  return children;
}
