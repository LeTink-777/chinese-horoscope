import { NextResponse } from 'next/server';
import { PAYABLE_PLANS } from '@/lib/plans';
import { createPayment } from '@/lib/yukassa';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ??
    request.headers.get('origin') ??
    new URL(request.url).origin;

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
