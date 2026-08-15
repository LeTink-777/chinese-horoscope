export type PlanId = 'basic' | 'full' | 'premium';

export interface Plan {
  id: PlanId;
  name: string;
  price: number;
  oldPrice: number;
  description: string;
  deliveryHours: number;
  features: string[];
  ribbon?: string;
}

export const PLANS: Record<PlanId, Plan> = {
  basic: {
    id: 'basic',
    name: 'Базовый прогноз',
    price: 290,
    oldPrice: 990,
    description: 'Базовый прогноз китайского гороскопа на 2026',
    deliveryHours: 24,
    features: [
      'Общий прогноз 2026',
      'Финансовый прогноз',
      'PDF 7 страниц',
      'Email за 24 часа',
    ],
  },
  full: {
    id: 'full',
    name: 'Полный прогноз',
    price: 590,
    oldPrice: 2990,
    description: 'Полный прогноз китайского гороскопа на 2026',
    deliveryHours: 12,
    features: [
      'Все сферы: любовь, карьера, здоровье',
      'Лучшие и опасные периоды детально',
      'Талисманы и советы года',
      'PDF 22 страницы',
      'Email за 12 часов',
    ],
    ribbon: 'Выбор 82%',
  },
  premium: {
    id: 'premium',
    name: 'Прогноз + Разбор',
    price: 1290,
    oldPrice: 5500,
    description: 'Прогноз китайского гороскопа 2026 + аудио разбор',
    deliveryHours: 6,
    features: [
      'Всё из полного прогноза',
      'Аудио разбор 15 минут',
      'Разбор совместимости с партнёром',
      'PDF + аудио',
      'Приоритет: 6 часов',
    ],
  },
};

/** Апселл на /thank-you: разбор совместимости с партнёром. */
export const COMPAT_PLAN: Plan = {
  id: 'compat' as PlanId,
  name: 'Совместимость с партнёром',
  price: 390,
  oldPrice: 1290,
  description: 'Разбор совместимости по китайскому гороскопу',
  deliveryHours: 24,
  features: [
    'Знаки и стихии обоих партнёров',
    'Сильные и слабые стороны пары',
    'Прогноз для пары на 2026 год',
  ],
};

export const COMPATIBILITY_UPSELL_PRICE = COMPAT_PLAN.price;

/** Тарифы, доступные для оплаты (включая апселл). */
export const PAYABLE_PLANS: Record<string, Plan> = {
  ...PLANS,
  compat: COMPAT_PLAN,
};
