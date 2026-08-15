import {
  Wallet,
  Heart,
  Briefcase,
  Shield,
  Calendar,
  AlertTriangle,
  Flame,
} from 'lucide-react';
import ZodiacWheel from '@/components/ZodiacWheel';
import LandingForm from '@/components/LandingForm';
import { BambooBackground, Lanterns, TopBar, Footer } from '@/components/Decor';
import { ANIMALS, ANIMAL_CHARS, yearsForAnimal } from '@/lib/chineseZodiac';
import { FAQ } from '@/lib/seo';

const FEATURES = [
  { Icon: Wallet, title: 'Финансы 2026', text: 'Денежные возможности и риски года: где придёт доход, а где утечка.' },
  { Icon: Heart, title: 'Любовь и отношения', text: 'Что ждёт в личной жизни: пара, знакомство, разговор, который пора начать.' },
  { Icon: Briefcase, title: 'Карьера', text: 'Профессиональные перспективы: рост, смена места, переговоры об условиях.' },
  { Icon: Shield, title: 'Здоровье', text: 'На что обратить внимание именно твоему знаку в год Огненной Змеи.' },
  { Icon: Calendar, title: 'Лучшие месяцы', text: 'Когда действовать: три периода, где усилие даёт максимальный результат.' },
  { Icon: AlertTriangle, title: 'Опасные периоды', text: 'Когда быть осторожным: месяцы, где решения лучше отложить.' },
];

const QUOTES = [
  { text: 'Прогноз на финансы оказался точным — в марте действительно пришли деньги.', author: 'Наталья, 34 года' },
  { text: 'Предупреждение об августе спасло от плохой сделки.', author: 'Виктор, 41 год' },
  { text: 'Лучшие и худшие месяцы совпали с реальностью на 90%.', author: 'Алёна, 29 лет' },
];

const THEMES = ['Трансформация', 'Мудрость', 'Финансовый рост', 'Осторожность'];

export default function Home() {
  return (
    <>
      <BambooBackground />
      <div className="page">
        <TopBar />

        <section className="hero">
          <Lanterns />
          <div className="shell hero-grid">
            <div className="hero-wheel">
              <ZodiacWheel size={300} />
            </div>

            <div>
              <span className="hero-eyebrow">
                <Flame size={13} /> 2026 · 火蛇
              </span>

              <h1 className="hero-title">
                Что год Огненной
                <br />
                <em>Змеи</em> принесёт
                <br />
                именно тебе?
              </h1>

              <p className="hero-sub">
                Введи год рождения — узнай свой знак китайского зодиака и персональный прогноз
                на 2026
              </p>
              <p className="hero-note">2026 — год Огненной Змеи по китайскому календарю</p>

              <LandingForm />
            </div>
          </div>
        </section>

        <section className="section" id="year">
          <div className="shell">
            <p className="eyebrow">Год-хозяин</p>
            <h2 className="section-title">2026 — Год Огненной Змеи</h2>
            <div className="card card-jade" style={{ marginTop: 22 }}>
              <p className="card-text">
                Змея в китайской традиции — знак не скорости, а точности. Год Огненной Змеи
                убирает случайность: то, что держалось на удаче и обещаниях, в 2026 рассыпается,
                а то, что построено на расчёте и репутации, наоборот, растёт быстрее обычного.
                Огонь как стихия добавляет к холодной логике Змеи амбицию и публичность — это год,
                когда тихие профессионалы вдруг становятся заметными.
              </p>
              <p className="card-text" style={{ marginTop: 14 }}>
                Змея не даёт лёгких денег, но щедро платит за подготовку. Она проверяет договорённости
                на прочность, обнажает недосказанное в отношениях и не прощает спешки в крупных решениях.
                Тем, кто согласен на один такт медленнее, 2026 год открывает двери, которые были
                закрыты последние два года.
              </p>
              <div className="theme-chips">
                {THEMES.map((theme) => (
                  <span className="chip" key={theme}>
                    {theme}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section-tight" id="animals">
          <div className="shell">
            <p className="eyebrow">Круг из двенадцати</p>
            <h2 className="section-title">12 знаков китайского зодиака</h2>
            <p className="section-sub">
              Цикл повторяется каждые 12 лет. Найди свой год рождения — или просто введи его в форме выше.
            </p>
            <div className="animal-scroll">
              {ANIMALS.map((animal, index) => (
                <div className="animal-card" key={animal}>
                  <div className="animal-char">{ANIMAL_CHARS[index]}</div>
                  <div className="animal-name">{animal}</div>
                  <div className="animal-years">
                    {yearsForAnimal(index).join(' · ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="included">
          <div className="shell">
            <p className="eyebrow">Состав прогноза</p>
            <h2 className="section-title">Что входит в прогноз</h2>
            <p className="section-sub">
              Шесть сфер, разобранных под твой знак и твою стихию рождения.
            </p>
            <div className="grid-6">
              {FEATURES.map(({ Icon, title, text }) => (
                <div className="card" key={title}>
                  <div className="feature-icon">
                    <Icon size={20} />
                  </div>
                  <h3 className="card-title">{title}</h3>
                  <p className="card-text">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="reviews">
          <div className="shell">
            <p className="eyebrow">Отзывы</p>
            <h2 className="section-title">Что говорят о прогнозах</h2>
            <div className="grid-6" style={{ marginTop: 24 }}>
              {QUOTES.map((quote) => (
                <blockquote className="quote" key={quote.author}>
                  <p>{quote.text}</p>
                  <span>— {quote.author}</span>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="faq">
          <div className="shell">
            <p className="eyebrow">Вопросы</p>
            <h2 className="section-title">Частые вопросы</h2>
            <div style={{ display: 'grid', gap: 14, marginTop: 24, maxWidth: 780 }}>
              {FAQ.map((item) => (
                <div className="card card-gold" key={item.q}>
                  <h3 className="card-title">{item.q}</h3>
                  <p className="card-text">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
