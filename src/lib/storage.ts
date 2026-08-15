export const STORAGE_KEY = 'chinese_data';
export const TIMER_KEY = 'chinese_timer_start';
export const SPOTS_KEY = 'chinese_spots';

/** Длительность акции — 24 часа. */
export const TIMER_DURATION_MS = 24 * 60 * 60 * 1000;

export interface ChineseUserData {
  name: string;
  birthYear: number;
  email: string;
}

export function readUserData(): ChineseUserData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ChineseUserData>;
    const year = Number(parsed.birthYear);
    if (!parsed.name || !parsed.email || !Number.isFinite(year)) return null;
    return { name: String(parsed.name), email: String(parsed.email), birthYear: year };
  } catch {
    return null;
  }
}

/** Старт 24-часового таймера, общий для /result и /thank-you. */
export function readTimerStart(): number {
  if (typeof window === 'undefined') return Date.now();
  try {
    const raw = window.localStorage.getItem(TIMER_KEY);
    const parsed = raw ? Number(raw) : NaN;
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
    const now = Date.now();
    window.localStorage.setItem(TIMER_KEY, String(now));
    return now;
  } catch {
    return Date.now();
  }
}

interface SpotsState {
  spots: number;
  updatedAt: number;
}

/**
 * Счётчик мест: стартует с 4 и убывает раз в 8–12 минут, но не ниже 2.
 * Интервал детерминирован от updatedAt, чтобы не расходиться между вкладками.
 */
export function readSpots(): number {
  if (typeof window === 'undefined') return 4;
  try {
    const raw = window.localStorage.getItem(SPOTS_KEY);
    const now = Date.now();
    let state: SpotsState = raw ? (JSON.parse(raw) as SpotsState) : { spots: 4, updatedAt: now };
    if (!Number.isFinite(state.spots) || !Number.isFinite(state.updatedAt)) {
      state = { spots: 4, updatedAt: now };
    }

    const stepMs = (8 + (state.updatedAt % 5)) * 60 * 1000;
    if (state.spots > 2 && now - state.updatedAt >= stepMs) {
      state = { spots: Math.max(2, state.spots - 1), updatedAt: now };
      window.localStorage.setItem(SPOTS_KEY, JSON.stringify(state));
    } else if (!raw) {
      window.localStorage.setItem(SPOTS_KEY, JSON.stringify(state));
    }

    return Math.max(2, Math.min(4, state.spots));
  } catch {
    return 4;
  }
}

const PENDING_ORDER_KEY = 'chinese_pending_order';

export interface PendingOrder {
  plan: string;
  /** Нужен /api/generate-pdf, чтобы подтвердить оплату перед выдачей PDF. */
  paymentId: string | null;
}

/** Переживает переход на страницу оплаты ЮKassa и обратно. */
export function savePendingOrder(order: PendingOrder): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(PENDING_ORDER_KEY, JSON.stringify(order));
  } catch {
    // Прогноз всё равно уходит письмом, даже если браузер ничего не сохранил.
  }
}

export function readPendingOrder(): PendingOrder | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(PENDING_ORDER_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<PendingOrder>;
    if (typeof parsed?.plan !== 'string') return null;

    return {
      plan: parsed.plan,
      paymentId: typeof parsed.paymentId === 'string' ? parsed.paymentId : null,
    };
  } catch {
    return null;
  }
}
