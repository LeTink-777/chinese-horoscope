import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface WebhookBody {
  type?: string;
  event?: string;
  object?: {
    id?: string;
    status?: string;
    paid?: boolean;
    amount?: { value?: string; currency?: string };
    metadata?: Record<string, string>;
  };
}

export async function POST(request: Request) {
  let body: WebhookBody;

  try {
    body = (await request.json()) as WebhookBody;
  } catch {
    return NextResponse.json({ error: 'bad request' }, { status: 400 });
  }

  const event = body.event ?? '';
  const payment = body.object ?? {};

  switch (event) {
    case 'payment.succeeded':
      console.log('[webhook] payment.succeeded', {
        id: payment.id,
        amount: payment.amount?.value,
        plan: payment.metadata?.plan,
        email: payment.metadata?.email,
        animal: payment.metadata?.animal,
        birthYear: payment.metadata?.birthYear,
      });
      break;

    case 'payment.canceled':
      console.log('[webhook] payment.canceled', { id: payment.id });
      break;

    case 'refund.succeeded':
      console.log('[webhook] refund.succeeded', { id: payment.id });
      break;

    default:
      console.log('[webhook] unhandled event', { event, id: payment.id });
  }

  // ЮKassa считает уведомление доставленным при любом ответе 200.
  return NextResponse.json({ received: true });
}

export async function GET() {
  return NextResponse.json({ status: 'ok' });
}
