'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Star, Mail } from 'lucide-react';
import { BambooBackground, TopBar, Footer } from '@/components/Decor';
import { calculateChinese, animalFromYear, ANIMAL_CHARS, animalIndexFromYear } from '@/lib/chineseZodiac';
import { readUserData, type ChineseUserData } from '@/lib/storage';
import { PLANS, COMPAT_PLAN } from '@/lib/plans';

const COINS = [
  { dx: '-146px', dy: '250px', rot: '220deg', delay: '0s', size: 16 },
  { dx: '-84px', dy: '296px', rot: '-180deg', delay: '0.18s', size: 13 },
  { dx: '4px', dy: '318px', rot: '300deg', delay: '0.36s', size: 18 },
  { dx: '92px', dy: '288px', rot: '-260deg', delay: '0.52s', size: 14 },
  { dx: '154px', dy: '242px', rot: '190deg', delay: '0.7s', size: 12 },
];

const SPARKS = [
  { dx: '-186px', dy: '186px', delay: '0.1s' },
  { dx: '-118px', dy: '246px', delay: '0.44s' },
  { dx: '48px', dy: '262px', delay: '0.62s' },
  { dx: '140px', dy: '212px', delay: '0.28s' },
  { dx: '198px', dy: '152px', delay: '0.8s' },
];

const MIN_YEAR = 1924;
const MAX_YEAR = 2006;

export default function ThankYouPage() {
  const [user, setUser] = useState<ChineseUserData | null>(null);
  const [hours, setHours] = useState(12);
  const [partnerYear, setPartnerYear] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setUser(readUserData());

    const planId = new URLSearchParams(window.location.search).get('plan');
    if (planId === 'basic' || planId === 'full' || planId === 'premium') {
      setHours(PLANS[planId].deliveryHours);
    } else if (planId === 'compat') {
      setHours(COMPAT_PLAN.deliveryHours);
    }
  }, []);

  const result = user ? calculateChinese(user.name, user.birthYear) : null;

  async function buyCompatibility() {
    const year = Number.parseInt(partnerYear, 10);

    if (!Number.isFinite(year) || year < MIN_YEAR || year > MAX_YEAR) {
      setError(`Укажи год рождения партнёра от ${MIN_YEAR} до ${MAX_YEAR}.`);
      return;
    }
    if (!user) {
      setError('Данные расчёта не найдены — вернись на главную и заполни форму.');
      return;
    }

    setError('');
    setPending(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: 'compat',
          userData: {
            name: user.name,
            email: user.email,
            birthYear: user.birthYear,
            animal: result?.animal ?? '',
            partnerYear: year,
          },
        }),
      });

      const payload = (await response.json()) as { confirmationUrl?: string; error?: string };
      if (!response.ok || !payload.confirmationUrl) {
        throw new Error(payload.error ?? 'Не удалось создать платёж');
      }
      window.location.href = payload.confirmationUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка оплаты');
      setPending(false);
    }
  }

  const partnerAnimal = (() => {
    const year = Number.parseInt(partnerYear, 10);
    if (!Number.isFinite(year) || year < MIN_YEAR || year > MAX_YEAR) return null;
    return { name: animalFromYear(year), char: ANIMAL_CHARS[animalIndexFromYear(year)] };
  })();

  return (
    <>
      <BambooBackground />
      <div className="page">
        <TopBar />

        <section className="section">
          <div className="shell-narrow" style={{ textAlign: 'center' }}>
            <div className="envelope-burst" aria-hidden="true">
              <div className="burst-envelope" />
              <div className="burst-flap" />
              {COINS.map((coin, i) => (
                <span
                  key={`coin-${i}`}
                  className="coin"
                  style={
                    {
                      width: coin.size,
                      height: coin.size,
                      animationDelay: coin.delay,
                      '--dx': coin.dx,
                      '--dy': coin.dy,
                      '--rot': coin.rot,
                    } as React.CSSProperties
                  }
                />
              ))}
              {SPARKS.map((spark, i) => (
                <span
                  key={`spark-${i}`}
                  className="spark"
                  style={
                    {
                      animationDelay: spark.delay,
                      '--dx': spark.dx,
                      '--dy': spark.dy,
                      '--rot': '0deg',
                    } as React.CSSProperties
                  }
                />
              ))}
            </div>

            <CheckCircle size={56} style={{ color: 'var(--accent-gold)' }} />

            <h1 style={{ fontSize: 28, color: 'var(--accent-cream)', marginTop: 16 }}>
              {user ? `${user.name}, твой прогноз на 2026 готовится` : 'Твой прогноз на 2026 готовится'}
            </h1>

            {result ? (
              <div className="badge-row">
                <span className="badge badge-gold">
                  {result.animal} · <span className="cjk">{result.chineseChar}</span> · 2026
                </span>
                <span className="badge badge-red">
                  {result.element.name} · <span className="cjk">{result.element.char}</span>
                </span>
              </div>
            ) : null}

            <p style={{ color: 'var(--text-secondary)', marginTop: 20 }}>
              <Mail size={15} style={{ verticalAlign: -2, color: 'var(--accent-gold)' }} />{' '}
              Пришлём на <span className="mono">{user?.email ?? 'твою почту'}</span> через{' '}
              <span className="mono">{hours}</span>{' '}
              {hours === 1 ? 'час' : hours < 5 ? 'часа' : 'часов'}
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 8 }}>
              Если письма нет — проверь папку «Спам» или напиши в Telegram @dvdkmv
            </p>

            <div className="card card-gold" style={{ marginTop: 40, textAlign: 'left' }}>
              <Star size={20} style={{ color: 'var(--accent-gold)' }} />
              <h2 className="card-title" style={{ marginTop: 10 }}>
                Хочешь узнать совместимость с партнёром по китайскому гороскопу?
              </h2>
              <p className="card-text">
                Введи год рождения партнёра — разберём вашу пару.{' '}
                <span className="mono" style={{ color: 'var(--accent-gold-light)' }}>
                  {COMPAT_PLAN.price} ₽
                </span>
              </p>

              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  marginTop: 18,
                  flexWrap: 'wrap',
                  alignItems: 'center',
                }}
              >
                <input
                  className="input input-year"
                  style={{ maxWidth: 200 }}
                  type="number"
                  inputMode="numeric"
                  min={MIN_YEAR}
                  max={MAX_YEAR}
                  placeholder="Например: 1988"
                  value={partnerYear}
                  onChange={(e) => setPartnerYear(e.target.value)}
                  aria-label="Год рождения партнёра"
                />
                <button
                  type="button"
                  className="btn-ghost"
                  style={{ flex: '1 1 220px' }}
                  onClick={buyCompatibility}
                  disabled={pending}
                >
                  {pending ? 'Открываем оплату...' : 'Проверить совместимость'}
                </button>
              </div>

              {partnerAnimal ? (
                <p style={{ marginTop: 14, color: 'var(--text-muted)', fontSize: 14 }}>
                  Знак партнёра: {partnerAnimal.name}{' '}
                  <span className="cjk" style={{ color: 'var(--accent-gold)' }}>
                    {partnerAnimal.char}
                  </span>
                </p>
              ) : null}

              {error ? <p className="form-error" style={{ marginTop: 14 }}>{error}</p> : null}
            </div>

            <p style={{ marginTop: 32 }}>
              <Link href="/" style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                Вернуться на главную
              </Link>
            </p>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
