export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.kitayskiy-goroskop.ru';

/** Канонический хост: апекс редиректится на www (см. next.config.ts). */
export const SITE_HOST = 'www.kitayskiy-goroskop.ru';

/**
 * Хосты, на которые разрешено возвращать пользователя после оплаты.
 * Всё остальное (в том числе подменённый заголовок Origin) откатывается на SITE_URL.
 */
export const ALLOWED_RETURN_HOSTS = [
  'kitayskiy-goroskop.ru',
  'www.kitayskiy-goroskop.ru',
  'chinese-horoscope.vercel.app',
];

export const FAQ = [
  {
    q: 'Какой год по китайскому календарю 2026?',
    a: '2026 год — год Огненной Змеи по китайскому календарю. Змея символизирует мудрость, трансформацию и интуицию. Огонь как стихия усиливает страсть, амбиции и творческую энергию.',
  },
  {
    q: 'Как определить свой знак китайского зодиака?',
    a: 'Знак определяется по году рождения. Цикл из 12 животных повторяется каждые 12 лет. Введи год рождения — система автоматически определит твой знак и элемент.',
  },
  {
    q: 'Что такое элемент в китайском гороскопе?',
    a: 'Каждый год управляется одним из 5 элементов: Дерево, Огонь, Земля, Металл, Вода. Элемент года рождения влияет на характер и взаимодействие с энергией текущего года.',
  },
  {
    q: 'Как год Змеи влияет на разные знаки?',
    a: 'Год своего знака (Змеи) считается сложным — нужна осторожность. Крыса, Бык и Петух получают поддержку Змеи. Дракон и Обезьяна ожидают активный рост.',
  },
  {
    q: 'Что входит в полный прогноз?',
    a: 'Полный прогноз включает детальный анализ всех сфер жизни: финансы, карьера, любовь и отношения, здоровье, лучшие и опасные периоды года, персональные талисманы и советы.',
  },
];

export const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'Китайский гороскоп 2026',
      description:
        'Персональный прогноз по китайскому гороскопу на 2026 год Огненной Змеи по году рождения.',
      inLanguage: 'ru-RU',
      publisher: { '@type': 'Person', name: 'Евдокимов Даниил Владимирович' },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${SITE_URL}/#app`,
      name: 'Китайский гороскоп на 2026 год',
      applicationCategory: 'LifestyleApplication',
      operatingSystem: 'Web',
      url: SITE_URL,
      inLanguage: 'ru-RU',
      description:
        'Онлайн-расчёт знака китайского зодиака по году рождения и персональный прогноз на 2026 год Огненной Змеи: финансы, любовь, карьера, здоровье.',
      offers: {
        '@type': 'Offer',
        price: '290',
        priceCurrency: 'RUB',
        availability: 'https://schema.org/InStock',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '44620',
        bestRating: '5',
        worstRating: '1',
      },
    },
    {
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/#faq`,
      mainEntity: FAQ.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    },
  ],
};
