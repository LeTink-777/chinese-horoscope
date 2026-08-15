'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Clock, Users } from 'lucide-react';
import ZodiacWheel from '@/components/ZodiacWheel';
import { animalIndexFromYear, animalFromYear, ANIMAL_CHARS } from '@/lib/chineseZodiac';
import { STORAGE_KEY, TIMER_KEY, SPOTS_KEY } from '@/lib/storage';

const MIN_YEAR = 1924;
const MAX_YEAR = 2006;

export default function LandingForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [phase, setPhase] = useState<'idle' | 'fast' | 'settle' | 'flash'>('idle');
  const [settleIndex, setSettleIndex] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach(clearTimeout);
  }, []);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();
    const year = Number.parseInt(birthYear, 10);

    if (trimmedName.length < 2) {
      setError('Введи имя — так прогноз будет персональным.');
      return;
    }
    if (!Number.isFinite(year) || year < MIN_YEAR || year > MAX_YEAR) {
      setError(`Укажи год рождения от ${MIN_YEAR} до ${MAX_YEAR}.`);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError('Проверь адрес почты — на него придёт прогноз.');
      return;
    }

    setError('');

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ name: trimmedName, birthYear: year, email: email.trim() }),
      );
      if (!window.localStorage.getItem(TIMER_KEY)) {
        window.localStorage.setItem(TIMER_KEY, String(Date.now()));
      }
      if (!window.localStorage.getItem(SPOTS_KEY)) {
        window.localStorage.setItem(
          SPOTS_KEY,
          JSON.stringify({ spots: 4, updatedAt: Date.now() }),
        );
      }
    } catch {
      /* приватный режим браузера — расчёт всё равно продолжится */
    }

    setSettleIndex(animalIndexFromYear(year));
    setPhase('fast');
    timers.current.push(setTimeout(() => setPhase('settle'), 1100));
    timers.current.push(setTimeout(() => setPhase('flash'), 2150));
    timers.current.push(setTimeout(() => router.push('/result'), 2500));
  }

  const busy = phase !== 'idle';
  const year = Number.parseInt(birthYear, 10);
  const settledAnimal =
    Number.isFinite(year) && year >= MIN_YEAR && year <= MAX_YEAR ? animalFromYear(year) : '';

  return (
    <>
      <form className="form-card" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="name">Имя</label>
          <input
            id="name"
            className="input"
            type="text"
            autoComplete="given-name"
            placeholder="Как к тебе обращаться"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="birthYear">Год рождения</label>
          <input
            id="birthYear"
            className="input input-year"
            type="number"
            inputMode="numeric"
            min={MIN_YEAR}
            max={MAX_YEAR}
            placeholder="Например: 1990"
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            className="input"
            type="email"
            autoComplete="email"
            placeholder="ты@почта.ру"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {error ? <p className="form-error">{error}</p> : null}

        <button className="btn-primary" type="submit" disabled={busy}>
          {busy ? 'Считаем твой знак...' : 'Узнать прогноз на 2026 →'}
        </button>

        <div className="trust-row">
          <span className="trust-item">
            <Star size={14} /> Бесплатный расчёт
          </span>
          <span className="trust-item">
            <Clock size={14} /> Результат мгновенно
          </span>
          <span className="trust-item">
            <Users size={14} /> 44 620 прогнозов составлено
          </span>
        </div>
      </form>

      {busy ? (
        <div className="loader-overlay" role="status" aria-live="polite">
          <ZodiacWheel
            size={280}
            spin={phase === 'fast' ? 'fast' : 'settle'}
            settleIndex={settleIndex}
            centerChar={phase === 'fast' ? '蛇' : ANIMAL_CHARS[settleIndex]}
            centerLabel={phase === 'fast' ? '2026' : String(year)}
          />
          <div>
            <p className="loader-text">
              {phase === 'fast'
                ? 'Круг зодиака ищет твой знак'
                : `Твой знак — ${settledAnimal}`}
            </p>
            <p className="loader-sub">Считаем прогноз на 2026 год Огненной Змеи</p>
          </div>
          {phase === 'flash' ? <div className="loader-flash" /> : null}
        </div>
      ) : null}
    </>
  );
}
