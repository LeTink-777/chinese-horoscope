'use client';

import { useEffect, useState } from 'react';
import { Shield, RotateCcw, Star, Check, Timer } from 'lucide-react';
import { readSpots, readTimerStart, TIMER_DURATION_MS, type ChineseUserData } from '@/lib/storage';
import type { PlanId } from '@/lib/plans';
import { PLANS } from '@/lib/plans';

interface Props {
  user: ChineseUserData;
  animal: string;
  chineseChar: string;
}

const SEALS: Record<PlanId, { char: string; meaning: string; size: 'sm' | 'lg' | 'md' }> = {
  basic: { char: '福', meaning: 'удача', size: 'sm' },
  full: { char: '禄', meaning: 'процветание', size: 'lg' },
  premium: { char: '寿', meaning: 'долголетие', size: 'md' },
};

function formatLeft(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = String(Math.floor(total / 3600)).padStart(2, '0');
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
  const s = String(total % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

export default function RedEnvelopes({ user, animal, chineseChar }: Props) {
  const [open, setOpen] = useState<Record<PlanId, boolean>>({
    basic: false,
    full: true,
    premium: false,
  });
  const [spots, setSpots] = useState(4);
  const [left, setLeft] = useState<number | null>(null);
  const [pending, setPending] = useState<PlanId | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setSpots(readSpots());
    const start = readTimerStart();

    const update = () => {
      const remaining = start + TIMER_DURATION_MS - Date.now();
      setLeft(remaining > 0 ? remaining : 0);
    };

    update();
    const tick = setInterval(update, 1000);
    const spotsTick = setInterval(() => setSpots(readSpots()), 60_000);
    return () => {
      clearInterval(tick);
      clearInterval(spotsTick);
    };
  }, []);

  async function checkout(plan: PlanId) {
    setPending(plan);
    setError('');
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          userData: {
            name: user.name,
            email: user.email,
            birthYear: user.birthYear,
            animal,
          },
        }),
      });

      const payload = (await response.json()) as { confirmationUrl?: string; error?: string };
      if (!response.ok || !payload.confirmationUrl) {
        throw new Error(payload.error ?? 'Не удалось создать платёж');
      }
      window.location.href = payload.confirmationUrl;
    } catch (err) {
      setError(
        err instanceof Error
          ? `${err.message}. Попробуй ещё раз или напиши нам в Telegram @dvdkmv`
          : 'Ошибка оплаты',
      );
      setPending(null);
    }
  }

  return (
    <section className="section" id="pricing">
      <div className="shell">
        <h2 className="section-title" style={{ textAlign: 'center' }}>
          Выбери свой хунбао
        </h2>
        <p className="section-sub" style={{ textAlign: 'center', margin: '0 auto 8px' }}>
          Красный конверт с прогнозом — традиция приносить удачу
        </p>
        <p
          style={{
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: 13,
          }}
        >
          Прогноз для знака «{animal} <span className="cjk">{chineseChar}</span>» на 2026 год
        </p>

        <div className="envelope-row">
          {(Object.keys(PLANS) as PlanId[]).map((planId) => {
            const plan = PLANS[planId];
            const seal = SEALS[planId];
            const isOpen = open[planId];
            const featured = planId === 'full';

            return (
              <div className="envelope-col" key={planId}>
                <button
                  type="button"
                  className={`envelope envelope-${seal.size} ${isOpen ? 'is-open' : ''}`}
                  onClick={() => setOpen((prev) => ({ ...prev, [planId]: !prev[planId] }))}
                  aria-expanded={isOpen}
                  aria-label={`${isOpen ? 'Закрыть' : 'Открыть'} конверт: ${plan.name}`}
                >
                  {plan.ribbon ? <span className="envelope-ribbon">{plan.ribbon}</span> : null}
                  <div className="envelope-body">
                    <div className="envelope-flap" />
                    <div className="envelope-seal cjk">{seal.char}</div>
                    <div className="envelope-lines">
                      <div className="envelope-plan">{plan.name}</div>
                      <div className="envelope-price mono">{plan.price} ₽</div>
                    </div>
                  </div>
                </button>

                <p className="envelope-hint">
                  <span className="cjk">红包</span> «{seal.char}» — {seal.meaning}
                </p>

                {isOpen ? (
                  <div className={`plan-details ${featured ? 'plan-details-featured' : ''}`}>
                    <h3 className="card-title">{plan.name}</h3>
                    <div className="plan-price-row">
                      <span className="price-old">{plan.oldPrice} ₽</span>
                      <span className="price-new">{plan.price} ₽</span>
                    </div>

                    {featured && left !== null ? (
                      <p className="timer">
                        <Timer size={15} /> {formatLeft(left)}
                      </p>
                    ) : null}

                    <ul className="plan-list">
                      {plan.features.map((feature) => (
                        <li key={feature}>
                          <Check size={14} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <p className="spots">
                      {planId === 'basic'
                        ? 'Осталось 8 мест'
                        : `Осталось ${spots} ${spots === 1 ? 'место' : spots < 5 ? 'места' : 'мест'}`}
                    </p>

                    <button
                      type="button"
                      className={`btn-primary ${featured ? 'pulse-glow' : ''}`}
                      onClick={() => checkout(planId)}
                      disabled={pending !== null}
                    >
                      {pending === planId ? 'Открываем конверт...' : `Открыть за ${plan.price} ₽`}
                    </button>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        {error ? (
          <p className="form-error" style={{ textAlign: 'center', marginTop: 20 }}>
            {error}
          </p>
        ) : null}

        <div className="trust-row" style={{ justifyContent: 'center', marginTop: 30 }}>
          <span className="trust-item">
            <Shield size={16} /> Оплата ЮKassa — все методы
          </span>
          <span className="trust-item">
            <RotateCcw size={16} /> Возврат за 3 дня
          </span>
          <span className="trust-item">
            <Star size={16} /> 44 620 прогнозов составлено
          </span>
        </div>
      </div>
    </section>
  );
}
