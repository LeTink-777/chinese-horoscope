'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Sparkles, Hash, Palette } from 'lucide-react';
import { BambooBackground, TopBar, Footer } from '@/components/Decor';
import RedEnvelopes from '@/components/RedEnvelopes';
import { calculateChinese, firstSentence, restSentences } from '@/lib/chineseZodiac';
import { readUserData, type ChineseUserData } from '@/lib/storage';

const RING_RADIUS = 92;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

const LOCKED_CARDS = [
  {
    title: 'Любовь и отношения 2026',
    teaser:
      'Год открывает тему, которую ты откладывал: разговор, статус, решение о совместном будущем. Есть период, когда партнёр особенно восприимчив, и период, когда лучше промолчать.',
  },
  {
    title: 'Карьера и деньги 2026',
    teaser:
      'Тебе предложат участок ответственности выше текущего уровня, и от того, как ты договоришься об условиях, зависит доход следующих трёх лет. Есть точный месяц для переговоров.',
  },
  {
    title: 'Здоровье и энергия 2026',
    teaser:
      'Твой знак в год Змеи расходует ресурс неравномерно: два месяца подъёма, затем провал. Разбор показывает, где именно поставить паузу, чтобы не потерять весь год.',
  },
  {
    title: 'Главный совет года и талисманы',
    teaser:
      'Одно решение, которое определяет твой 2026 год, плюс личные талисманы, цвета и числа для твоей стихии рождения по традиции фэн-шуй.',
  },
];

export default function ResultPage() {
  const router = useRouter();
  const [user, setUser] = useState<ChineseUserData | null>(null);
  const [ready, setReady] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const data = readUserData();
    if (!data) {
      router.replace('/');
      return;
    }
    setUser(data);
    setReady(true);
  }, [router]);

  const result = useMemo(
    () => (user ? calculateChinese(user.name, user.birthYear) : null),
    [user],
  );

  useEffect(() => {
    if (!result) return;
    const target = result.year2026data.overall;
    const started = performance.now();
    const duration = 1400;
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - started) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setScore(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [result]);

  if (!ready || !result || !user) {
    return (
      <>
        <BambooBackground />
        <div className="page">
          <TopBar />
          <div className="loader-overlay" style={{ position: 'static', minHeight: '60vh' }}>
            <p className="loader-text">Открываем твой прогноз</p>
            <p className="loader-sub">Секунду</p>
          </div>
        </div>
      </>
    );
  }

  const data = result.year2026data;
  const toneClass =
    result.compatibility.tone === 'jade'
      ? 'badge badge-jade'
      : result.compatibility.tone === 'red'
        ? 'badge badge-red'
        : 'badge badge-gold';

  return (
    <>
      <BambooBackground />
      <div className="page">
        <TopBar />

        <header className="result-header">
          <div className="shell">
            <div className="result-char cjk">{result.chineseChar}</div>
            <h1 className="result-animal">{result.animal}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 6 }}>
              {user.name}, год рождения{' '}
              <span className="mono">{user.birthYear}</span>
            </p>

            <div className="badge-row">
              <span className="badge badge-red">
                {result.element.name} · <span className="cjk">{result.element.char}</span>
              </span>
              <span className={toneClass}>{result.compatibility.short}</span>
              <span className="badge badge-gold">
                2026 · <span className="cjk">火蛇</span>
              </span>
            </div>

            <div className="score-wrap">
              <div className="score-ring">
                <svg viewBox="0 0 210 210" aria-hidden="true">
                  <circle
                    cx="105"
                    cy="105"
                    r={RING_RADIUS}
                    fill="none"
                    stroke="#3A1A0A"
                    strokeWidth="8"
                  />
                  <circle
                    cx="105"
                    cy="105"
                    r={RING_RADIUS}
                    fill="none"
                    stroke="#D4A017"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={RING_LENGTH}
                    strokeDashoffset={RING_LENGTH * (1 - score / 100)}
                    style={{ transition: 'stroke-dashoffset 120ms linear' }}
                  />
                </svg>
                <div className="score-value mono">{score}</div>
              </div>
              <p className="score-label">% благоприятности 2026</p>
            </div>
          </div>
        </header>

        <section className="section-tight">
          <div className="shell-narrow">
            <div className="card card-jade">
              <h2 className="card-title">Общий прогноз на 2026</h2>
              <p className="card-text">{data.overallText}</p>
              <p className="card-text" style={{ marginTop: 14 }}>
                {result.compatibility.description}
              </p>
              <div className="badge-row" style={{ justifyContent: 'flex-start', marginTop: 16 }}>
                <span className={toneClass}>
                  {result.animal} в год Змеи: {result.compatibility.label.toLowerCase()}
                </span>
              </div>
            </div>

            <div className="card card-gold" style={{ marginTop: 16 }}>
              <h2 className="card-title">Лучшие и опасные периоды</h2>
              <p className="card-text" style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                Лучшие месяцы — действуй
              </p>
              <div className="month-badges">
                {data.bestMonths.map((month) => (
                  <span className="badge badge-jade" key={month}>
                    {month}
                  </span>
                ))}
              </div>
              <p
                className="card-text"
                style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 18 }}
              >
                Опасные месяцы — не спеши
              </p>
              <div className="month-badges">
                {data.dangerMonths.map((month) => (
                  <span className="badge badge-red" key={month}>
                    {month}
                  </span>
                ))}
              </div>
            </div>

            <div className="card card-red" style={{ marginTop: 16 }}>
              <h2 className="card-title">Финансы 2026</h2>
              <p className="card-text">
                {firstSentence(data.finance)}{' '}
                <span className="blur-text">{restSentences(data.finance)}</span>
              </p>

              <div className="badge-row" style={{ justifyContent: 'flex-start', marginTop: 18 }}>
                <span className="badge badge-gold">
                  <Hash size={12} style={{ verticalAlign: -1 }} /> Число удачи:{' '}
                  <span className="mono">{data.luckyNumber}</span>
                </span>
                <span className="badge badge-gold">
                  <Palette size={12} style={{ verticalAlign: -1 }} /> Цвет года: {data.luckyColor}
                </span>
              </div>
            </div>

            <hr className="gold-rule" />
            <h2
              className="section-title"
              style={{ textAlign: 'center', fontSize: 30, marginBottom: 22 }}
            >
              Полный прогноз на 2026
            </h2>

            <div style={{ display: 'grid', gap: 14 }}>
              {LOCKED_CARDS.map((card) => (
                <div className="locked-card" key={card.title}>
                  <h3 className="card-title">{card.title}</h3>
                  <p className="locked-body">{card.teaser}</p>
                  <div className="locked-veil">
                    <Lock size={20} />
                  </div>
                </div>
              ))}
            </div>

            <div className="lock-cta">
              <Lock size={20} style={{ color: 'var(--accent-gold)' }} />
              <h3 className="card-title" style={{ marginTop: 10 }}>
                Открой полный прогноз на 2026
              </h3>
              <p className="card-text">
                Любовь, карьера, здоровье и персональные советы для твоего знака
              </p>
              <p
                className="card-text"
                style={{ marginTop: 10, color: 'var(--text-muted)', fontSize: 14 }}
              >
                <Sparkles size={13} style={{ verticalAlign: -2, color: 'var(--accent-gold)' }} />{' '}
                Разбор составлен под знак «{result.animal}» и стихию «{result.element.name}»
              </p>
            </div>
          </div>
        </section>

        <RedEnvelopes
          user={user}
          animal={result.animal}
          chineseChar={result.chineseChar}
        />

        <Footer />
      </div>
    </>
  );
}
