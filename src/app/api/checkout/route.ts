import { NextResponse } from 'next/server';
import { PAYABLE_PLANS } from '@/lib/plans';
import { createPayment } from '@/lib/yukassa';
import { ALLOWED_RETURN_HOSTS, SITE_URL } from '@/lib/seo';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Возвращаем пользователя на тот домен, с которого он пришёл, но только если
 * этот домен в белом списке — иначе подменённый Origin увёл бы клиента
 * с оплаченным заказом на чужой сайт.
 */
function resolveReturnOrigin(request: Request): string {
  const candidate = request.headers.get('origin') ?? new URL(request.url).origin;

  try {
    const { protocol, hostname, origin } = new URL(candidate);
    const isLocalDev =
      process.env.NODE_ENV !== 'production' &&
      (hostname === 'localhost' || hostname === '127.0.0.1');

    if (isLocalDev || (protocol === 'https:' && ALLOWED_RETURN_HOSTS.includes(hostname))) {
      return origin;
    }
  } catch {
    // Некорректный Origin — молча откатываемся на канонический адрес.
  }

  return SITE_URL;
}

interface CheckoutBody {
  plan?: string;
  userData?: {
    name?: string;
    email?: string;
    birthYear?: number | string;
    animal?: string;
    partnerYear?: number | string;
  };
}

export async function POST(request: Request) {
  let body: CheckoutBody;

  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ error: 'Некорректный запрос' }, { status: 400 });
  }

  const plan = body.plan ? PAYABLE_PLANS[body.plan] : undefined;

  if (!plan) {
    return NextResponse.json({ error: 'Неизвестный тариф' }, { status: 400 });
  }

  const user = body.userData ?? {};
  const email = String(user.email ?? '').trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ error: 'Некорректный email' }, { status: 400 });
  }
  const origin = resolveReturnOrigin(request);

  try {
    const payment = await createPayment({
      amount: plan.price,
      description: plan.description,
      returnUrl: `${origin}/thank-you?plan=${plan.id}`,
      customerEmail: email,
      metadata: {
        plan: plan.id,
        name: String(user.name ?? '').slice(0, 64),
        email,
        birthYear: String(user.birthYear ?? ''),
        animal: String(user.animal ?? ''),
        partnerYear: String(user.partnerYear ?? ''),
        deliveryHours: plan.deliveryHours,
      },
    });

    const confirmationUrl = payment.confirmation?.confirmation_url;

    if (!confirmationUrl) {
      return NextResponse.json(
        { error: 'ЮKassa не вернула ссылку на оплату' },
        { status: 502 },
      );
    }

    return NextResponse.json({ confirmationUrl, paymentId: payment.id });
  } catch (error) {
    console.error('[checkout]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Ошибка создания платежа' },
      { status: 500 },
    );
  }
}
